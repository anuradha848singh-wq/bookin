import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { TeamService } from "@/services/team.service";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

export const POST = withTenantAuth(async (request, { tenant, publicDb }) => {
  const body = await request.json();
  const parsed = inviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
  }

  const teamService = new TeamService(publicDb, tenant.id);
  const invitedUser = await teamService.inviteUser(parsed.data.email, parsed.data.role);

  return NextResponse.json({ success: true, data: invitedUser });
}, "manage_team"); // RBAC Check
