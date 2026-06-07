import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const POST = withTenantAuth(async (request, { tenantDb, user }, params) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const { content, is_pinned, metadata } = body;

  if (!content) {
    return NextResponse.json({ error: "Note content is required" }, { status: 400 });
  }

  try {
    // We need to resolve the staff_id that corresponds to this global user
    const staffRecs = await tenantDb.$queryRaw`
      SELECT id FROM staff WHERE global_user_id = ${user.id}::text LIMIT 1;
    `;

    const staffId = staffRecs && (staffRecs as any).length > 0 ? (staffRecs as any)[0].id : null;

    const newNote = await tenantDb.$queryRaw`
      INSERT INTO client_notes (client_id, staff_id, content, is_pinned, metadata)
      VALUES (${id}::uuid, ${staffId ? Prisma.sql`${staffId}::uuid` : null}, ${content}, ${is_pinned || false}, ${metadata || {}}::jsonb)
      RETURNING *;
    `;

    // Log the activity automatically
    await tenantDb.$queryRaw`
      INSERT INTO client_activities (client_id, type, title, link_id)
      VALUES (${id}::uuid, 'NOTE_ADDED', 'Staff added a note', ${(newNote as any)[0].id}::uuid);
    `;

    return NextResponse.json({ success: true, note: (newNote as any)[0] });
  } catch (error: any) {
    console.error("[POST_CLIENT_NOTE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to add note" }, { status: 500 });
  }
});
