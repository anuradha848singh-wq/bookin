import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const tags = url.searchParams.getAll("tags");
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const queryWhere: any = { deleted_at: null };

  if (tags && tags.length > 0) {
    queryWhere.tags = { hasSome: tags };
  }

  // Uses Prisma's Postgres text search or simple contains
  if (search) {
    queryWhere.OR = [
      { first_name: { contains: search, mode: 'insensitive' } },
      { last_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const offset = (page - 1) * limit;

  try {
    const clients = await tenantDb.client.findMany({
      where: queryWhere,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset
    });
    
    // Get total count
    const totalCount = await tenantDb.client.count({
      where: queryWhere
    });

    return NextResponse.json({ 
      success: true, 
      clients, 
      pagination: {
        total: totalCount,
        page,
        limit
      }
    });
  } catch (error: any) {
    console.error("[GET_CLIENTS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch clients" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER", "STAFF", "RECEPTIONIST"]); // Only Viewers can't access by default

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { 
    first_name, last_name, email, phone, date_of_birth, gender, 
    tags, custom_fields, source, referrer_client_id 
  } = body;

  if (!first_name || !last_name) {
    return NextResponse.json({ error: "First name and last name are required" }, { status: 400 });
  }

  try {
    const newClient = await tenantDb.client.create({
      data: {
        first_name,
        last_name,
        email: email || null,
        phone: phone || null,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender: gender || null,
        tags: tags || [],
        custom_fields: custom_fields || {},
        source: source || null,
        referrer_client_id: referrer_client_id || null
      }
    });

    return NextResponse.json({ success: true, client: newClient });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation Postgres
      return NextResponse.json({ error: "Client with this email/phone already exists" }, { status: 409 });
    }
    console.error("[POST_CLIENT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create client" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"]); // Staff usually can't create clients without receptionist privileges
