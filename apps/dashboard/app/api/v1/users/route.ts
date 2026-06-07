import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { TeamService } from "@/services/team.service";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenant, publicDb }) => {
  const teamService = new TeamService(publicDb, tenant.id);
  const users = await teamService.listUsers();

  return NextResponse.json({ success: true, data: users });
}, "view");
