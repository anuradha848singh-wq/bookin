import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
  }

  try {
    const hours = await tenantDb.$queryRaw`
      SELECT * FROM staff_working_hours WHERE staff_id = ${id}::uuid ORDER BY day_of_week ASC;
    `;

    return NextResponse.json({ success: true, hours });
  } catch (error: any) {
    console.error("[GET_STAFF_HOURS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch working hours" }, { status: 500 });
  }
});

export const PUT = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const { schedule } = body; // Array of { day_of_week, is_day_off, start_time, end_time, break_start, break_end, location_id }

  if (!schedule || !Array.isArray(schedule)) {
    return NextResponse.json({ error: "Valid schedule array is required" }, { status: 400 });
  }

  try {
    const operations: any[] = [];
    
    operations.push(tenantDb.$executeRaw`DELETE FROM staff_working_hours WHERE staff_id = ${id}::uuid`);

    for (const day of schedule) {
      operations.push(tenantDb.$executeRaw`
        INSERT INTO staff_working_hours (
          staff_id, location_id, day_of_week, is_day_off, 
          start_time, end_time, break_start, break_end
        ) VALUES (
          ${id}::uuid, ${day.location_id ? Prisma.sql`${day.location_id}::uuid` : null}, ${day.day_of_week}, ${day.is_day_off || false},
          ${day.start_time ? Prisma.sql`${day.start_time}::time` : null}, ${day.end_time ? Prisma.sql`${day.end_time}::time` : null}, 
          ${day.break_start ? Prisma.sql`${day.break_start}::time` : null}, ${day.break_end ? Prisma.sql`${day.break_end}::time` : null}
        );
      `);
    }

    await tenantDb.$transaction(operations);

    const updatedHours = await tenantDb.$queryRaw`
      SELECT * FROM staff_working_hours WHERE staff_id = ${id}::uuid ORDER BY day_of_week ASC;
    `;

    return NextResponse.json({ success: true, hours: updatedHours });
  } catch (error: any) {
    console.error("[PUT_STAFF_HOURS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update working hours" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]);
