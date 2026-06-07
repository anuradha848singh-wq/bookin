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

  // The client table is generated dynamically, so Prisma handles this via raw or standard client wrapper
  // Note: The global schema doesn't define `client`, but our tenant SQL generated it. 
  // Wait, Prisma doesn't know about `tenantDb.client` because it's not in schema.prisma!
  // We must use $queryRawUnsafe or $executeRawUnsafe to interact with tenant tables because they are created in raw SQL!

  const offset = (page - 1) * limit;

  try {
    const conditions: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`];

    if (search) {
      const searchParam = `%${search}%`;
      conditions.push(Prisma.sql`(first_name ILIKE ${searchParam} OR last_name ILIKE ${searchParam} OR email ILIKE ${searchParam} OR phone ILIKE ${searchParam})`);
    }

    if (tags && tags.length > 0) {
      conditions.push(Prisma.sql`tags @> ${tags}`);
    }

    const whereClause = Prisma.sql`${Prisma.join(conditions, ' AND ')}`;

    const clients = await tenantDb.$queryRaw`
      SELECT * FROM clients 
      WHERE ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    ` as any[];
    
    // Get total count
    const totalCount: any = await tenantDb.$queryRaw`
      SELECT COUNT(*) FROM clients WHERE ${whereClause}
    `;

    return NextResponse.json({ 
      success: true, 
      clients, 
      pagination: {
        total: Number(totalCount[0].count),
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
    const newClient = await tenantDb.$queryRaw`
      INSERT INTO clients (
        first_name, last_name, email, phone, date_of_birth, gender, 
        tags, custom_fields, source, referrer_client_id
      ) VALUES (
        ${first_name}, ${last_name}, ${email || null}, ${phone || null}, 
        ${date_of_birth ? new Date(date_of_birth) : null}, ${gender || null},
        ${tags || []}, ${custom_fields || {}}::jsonb, ${source || null}, ${referrer_client_id ? Prisma.sql`${referrer_client_id}::uuid` : null}
      ) RETURNING *;
    `;

    return NextResponse.json({ success: true, client: (newClient as any)[0] });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation Postgres
      return NextResponse.json({ error: "Client with this email/phone already exists" }, { status: 409 });
    }
    console.error("[POST_CLIENT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create client" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER", "RECEPTIONIST"]); // Staff usually can't create clients without receptionist privileges
