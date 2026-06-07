import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { TeamService } from "@/services/team.service";

export const DELETE = withTenantAuth(async (request, { tenant, publicDb, user }, params) => {
  const targetUserId = params?.id;

  if (!targetUserId) {
    return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
  }

  // Prevent user from deleting themselves through this endpoint
  if (targetUserId === user.id) {
    return NextResponse.json({ success: false, error: "Cannot delete yourself" }, { status: 400 });
  }

  const teamService = new TeamService(publicDb, tenant.id);
  await teamService.removeUser(targetUserId);

  return NextResponse.json({ success: true, message: "User removed from workspace" });
}, "manage_team");
