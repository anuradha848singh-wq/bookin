import { getPublicClient } from "@book-in/db";
import { NextResponse } from "next/server";

export async function requireOwnership(
  userId: string,
  resourceId: string,
  resourceType: "BuilderWebsite" | "Tenant" | "StudioForm"
) {
  if (!userId) return false;

  const pc = getPublicClient();

  try {
    switch (resourceType) {
      case "BuilderWebsite": {
        const website = await pc.builderWebsite.findUnique({
          where: { id: resourceId },
          select: { ownerId: true },
        });
        return website?.ownerId === userId;
      }
      case "Tenant": {
        const userAccess = await pc.tenantUser.findUnique({
          where: {
            tenantId_userId: {
              tenantId: resourceId,
              userId: userId,
            },
          },
          select: { isOwner: true, role: true },
        });
        return userAccess?.isOwner || userAccess?.role === "OWNER" || userAccess?.role === "ADMIN";
      }
      case "StudioForm": {
        const form = await pc.builderForm.findUnique({
          where: { id: resourceId },
          select: { website: { select: { ownerId: true } } },
        });
        return form?.website.ownerId === userId;
      }
      default:
        return false;
    }
  } catch (error) {
    console.error(`Ownership check failed for ${resourceType} ${resourceId}`, error);
    return false;
  }
}

export function generateUnauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized access or missing ownership" },
    { status: 403 }
  );
}
