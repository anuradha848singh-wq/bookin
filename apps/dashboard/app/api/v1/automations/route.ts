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

    const newAutomation = await tenantDb.$queryRawUnsafe(`
      INSERT INTO automations (name, trigger_event, conditions, actions)
      VALUES ($1, $2, $3::jsonb, $4::jsonb)
      RETURNING *;
    `, 
      name, 
      trigger_event, 
      JSON.stringify(conditions || []), 
      JSON.stringify(actions)
    );

    return NextResponse.json({ success: true, automation: (newAutomation as any)[0] });
  } catch (error: any) {
    console.error("[POST_AUTOMATION_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create automation" }, { status: 500 });
  }
}, ["OWNER", "ADMIN"]);
