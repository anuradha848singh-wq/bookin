import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const body = await request.json();
    const { name, trigger_event, conditions, actions } = body;

    if (!name || !trigger_event || !actions || actions.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAutomation = await tenantDb.automation.create({
      data: {
        name,
        trigger_event,
        conditions: conditions || [],
        actions
      }
    });

    return NextResponse.json({ success: true, automation: newAutomation });
  } catch (error: any) {
    console.error("[POST_AUTOMATION_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create automation" }, { status: 500 });
  }
}, "manage_settings");
