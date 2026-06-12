import { NextResponse } from "next/server";
import { getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Internal Event Bus
 * Protected endpoint that processes automation workflows triggered by system events.
 * Events: booking.created, booking.cancelled, booking.reminder_24h, booking.reminder_1h, booking.completed
 * 
 * Security: Should be called internally only (no public access).
 * In production, protect with INTERNAL_API_KEY header verification.
 */
export async function POST(request: Request) {
  try {
    // Basic internal key check (set INTERNAL_API_KEY in env for production)
    const internalKey = process.env.INTERNAL_API_KEY;
    if (internalKey) {
      const providedKey = request.headers.get("x-internal-key");
      if (providedKey !== internalKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { tenant_slug, event, payload } = body;

    if (!tenant_slug || !event || !payload) {
      return NextResponse.json({ error: "Missing required fields: tenant_slug, event, payload" }, { status: 400 });
    }

    const tenantDb = getTenantClient(`tenant_${tenant_slug}`) as any;

    // 1. Find all active automations matching this event
    const automations = (await tenantDb.$queryRaw`
      SELECT * FROM automations 
      WHERE trigger_event = ${event} AND is_active = true
      ORDER BY created_at ASC;
    `) as any[];

    if (automations.length === 0) {
      return NextResponse.json({ success: true, message: "No active automations for this event.", processed: 0 });
    }

    // 2. Process each matching automation
    const executionResults = await Promise.allSettled(
      automations.map(async (automation: any) => {
        let executedActions: string[] = [];

        try {
          // A. Evaluate Conditions
          let conditionsMet = true;
          const conditions = typeof automation.conditions === "string"
            ? JSON.parse(automation.conditions)
            : (automation.conditions || []);

          if (Array.isArray(conditions) && conditions.length > 0) {
            for (const cond of conditions) {
              const payloadValue = payload[cond.field];
              switch (cond.operator) {
                case "eq":
                  if (payloadValue !== cond.value) conditionsMet = false;
                  break;
                case "neq":
                  if (payloadValue === cond.value) conditionsMet = false;
                  break;
                case "contains":
                  if (!String(payloadValue || "").toLowerCase().includes(String(cond.value).toLowerCase())) conditionsMet = false;
                  break;
                case "gt":
                  if (!(Number(payloadValue) > Number(cond.value))) conditionsMet = false;
                  break;
                case "lt":
                  if (!(Number(payloadValue) < Number(cond.value))) conditionsMet = false;
                  break;
              }
              if (!conditionsMet) break;
            }
          }

          if (!conditionsMet) {
            await logAutomationRun(tenantDb, automation.id, event, payload, "SKIPPED_CONDITIONS", null, []);
            return { automationId: automation.id, status: "SKIPPED_CONDITIONS" };
          }

          // B. Execute Actions
          const actions = typeof automation.actions === "string"
            ? JSON.parse(automation.actions)
            : (automation.actions || []);

          for (const action of actions) {
            if (action.type === "email.send") {
              await dispatchEmail({
                to: resolveEmailTarget(action.to, payload),
                subject: interpolate(action.subject || `Booking Update — ${payload.service_name || "Your Appointment"}`, payload),
                html: buildEmailHtml(action, payload),
                templateId: action.template_id,
              });
              executedActions.push(`email.send → ${action.to || "client"}`);

            } else if (action.type === "tag.add") {
              // Add tag to client in CRM
              if (payload.client_id) {
                await tenantDb.$executeRaw`
                  UPDATE clients
                  SET tags = array_append(tags, ${action.tag_name}),
                      updated_at = NOW()
                  WHERE id = ${payload.client_id}::uuid
                    AND NOT (${action.tag_name} = ANY(tags));
                `;
                executedActions.push(`tag.add → ${action.tag_name}`);
              }

            } else if (action.type === "tag.remove") {
              if (payload.client_id) {
                await tenantDb.$executeRaw`
                  UPDATE clients
                  SET tags = array_remove(tags, ${action.tag_name}),
                      updated_at = NOW()
                  WHERE id = ${payload.client_id}::uuid;
                `;
                executedActions.push(`tag.remove → ${action.tag_name}`);
              }

            } else if (action.type === "booking.update_status") {
              if (payload.booking_id) {
                await tenantDb.$executeRaw`
                  UPDATE bookings
                  SET status = ${action.status}, updated_at = NOW()
                  WHERE id = ${payload.booking_id}::uuid;
                `;
                executedActions.push(`booking.update_status → ${action.status}`);
              }

            } else if (action.type === "webhook.call") {
              // Fire external webhook
              try {
                await fetch(action.url, {
                  method: action.method || "POST",
                  headers: { "Content-Type": "application/json", ...(action.headers || {}) },
                  body: JSON.stringify({ event, payload }),
                });
                executedActions.push(`webhook.call → ${action.url}`);
              } catch (webhookErr: any) {
                console.warn(`[EVENT_BUS] Webhook to ${action.url} failed:`, webhookErr.message);
              }
            }
          }

          // C. Update run stats
          await tenantDb.$executeRaw`
            UPDATE automations SET run_count = run_count + 1, last_run_at = NOW(), updated_at = NOW() WHERE id = ${automation.id}::uuid;
          `;

          // D. Log Success
          await logAutomationRun(tenantDb, automation.id, event, payload, "SUCCESS", null, executedActions);

          return { automationId: automation.id, name: automation.name, status: "SUCCESS", actions: executedActions };

        } catch (err: any) {
          console.error(`[EVENT_BUS] Automation ${automation.id} failed:`, err);
          await logAutomationRun(tenantDb, automation.id, event, payload, "FAILED", err.message, executedActions);
          return { automationId: automation.id, status: "FAILED", error: err.message };
        }
      })
    );

    const results = executionResults.map((r) => r.status === "fulfilled" ? r.value : { status: "FAILED", error: (r as any).reason?.message });

    return NextResponse.json({
      success: true,
      processed: automations.length,
      results,
    });

  } catch (error: any) {
    console.error("[EVENT_BUS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Event Bus processing failed" }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────

async function logAutomationRun(
  tenantDb: any,
  automationId: string,
  event: string,
  payload: any,
  status: string,
  errorMessage: string | null,
  executedActions: string[]
) {
  try {
    await tenantDb.$executeRaw`
      INSERT INTO automation_logs (automation_id, triggering_event, status, error_message, executed_actions)
      VALUES (${automationId}::uuid, ${JSON.stringify({ event, payload })}::jsonb, ${status}, ${errorMessage}, ${JSON.stringify(executedActions)}::jsonb);
    `;
  } catch (logErr) {
    console.error("[EVENT_BUS] Failed to write automation log:", logErr);
  }
}

function resolveEmailTarget(toConfig: string, payload: any): string {
  if (toConfig === "client" || toConfig === "customer") {
    return payload.client_email || payload.email || "";
  }
  if (toConfig === "staff") {
    return payload.staff_email || "";
  }
  // Treat as literal email address
  return toConfig || "";
}

function interpolate(template: string, payload: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => payload[key] || `{{${key}}}`);
}

function buildEmailHtml(action: any, payload: any): string {
  // If action has a custom body, interpolate it
  if (action.body) {
    return `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        ${interpolate(action.body, payload)}
      </div>`;
  }

  // Default booking confirmation email
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 40px 32px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">Booking Confirmed ✓</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px;">Your appointment has been successfully scheduled.</p>
      </div>
      
      <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Service</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${payload.service_name || "Your Appointment"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Date</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${payload.date || ""}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Time</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; color: #111827; font-size: 14px; text-align: right;">${payload.time || ""}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Reference</td>
            <td style="padding: 12px 0; font-weight: 800; color: #3b82f6; font-size: 14px; text-align: right; font-family: monospace;">${payload.reference_number || ""}</td>
          </tr>
        </table>
        
        <div style="margin-top: 28px; padding: 16px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
          <p style="margin: 0; color: #166534; font-size: 13px;">
            Need to cancel or reschedule? Contact us at least 24 hours before your appointment.
          </p>
        </div>
        
        <p style="margin-top: 24px; color: #9ca3af; font-size: 12px; text-align: center;">
          Powered by Bookin · Automated scheduling platform
        </p>
      </div>
    </div>`;
}

async function dispatchEmail(opts: { to: string; subject: string; html: string; templateId?: string }) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    // Graceful degradation: log but don't crash
    console.log(`[EVENT_BUS:EMAIL] RESEND_API_KEY not set. Would have sent to: ${opts.to}, Subject: ${opts.subject}`);
    return;
  }

  if (!opts.to || !opts.to.includes("@")) {
    console.warn(`[EVENT_BUS:EMAIL] Invalid or missing recipient email: "${opts.to}"`);
    return;
  }

  const fromAddress = process.env.EMAIL_FROM || "noreply@bookin.app";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error ${response.status}: ${errorBody}`);
  }

  const result = await response.json();
  console.log(`[EVENT_BUS:EMAIL] Sent via Resend. ID: ${result.id}, To: ${opts.to}`);
  return result;
}

