import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  try {
    const clients = await tenantDb.$queryRaw`
      SELECT * FROM clients WHERE id = ${id}::uuid AND deleted_at IS NULL LIMIT 1;
    `;

    if (!clients || (clients as any).length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Include recent bookings as an aggregate
    const recentBookings = await tenantDb.$queryRaw`
      SELECT b.*, s.name as service_name 
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.client_id = ${id}::uuid
      ORDER BY b.starts_at DESC
      LIMIT 10;
    `;

    return NextResponse.json({ 
      success: true, 
      client: (clients as any)[0],
      recentBookings
    });
  } catch (error: any) {
    console.error("[GET_CLIENT_ID_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch client" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER", "STAFF", "RECEPTIONIST"]);

export const PUT = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  const body = await request.json();
  // Filter out undefined values to only update what's provided
  const updates: Prisma.Sql[] = [];

  const updatableFields = [
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 
    'gender', 'avatar_url', 'notes', 'tags', 'custom_fields', 
    'gdpr_consent', 'marketing_opt_in'
  ];

  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      if (field === 'custom_fields') {
        updates.push(Prisma.sql`${Prisma.raw(field)} = ${body[field]}::jsonb`);
      } else {
        updates.push(Prisma.sql`${Prisma.raw(field)} = ${body[field]}`);
      }
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  updates.push(Prisma.sql`updated_at = NOW()`);

  const setClause = Prisma.join(updates, ', ');

  try {
    const updatedClient = await tenantDb.$queryRaw`
      UPDATE clients 
      SET ${setClause} 
      WHERE id = ${id}::uuid AND deleted_at IS NULL 
      RETURNING *;
    `;
    
    if (!updatedClient || (updatedClient as any).length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: (updatedClient as any)[0] });
  } catch (error: any) {
    console.error("[PUT_CLIENT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update client" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"]);

export const DELETE = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  try {
    // Soft delete
    const result = await tenantDb.$executeRaw`
      UPDATE clients SET deleted_at = NOW() WHERE id = ${id}::uuid;
    `;

    if (result === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE_CLIENT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to delete client" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]); // Only admins/managers can delete clients
