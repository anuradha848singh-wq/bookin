import { PrismaClient } from "@prisma/client";
import { Role } from "@book-in/lib";

export class TeamService {
  constructor(private publicDb: PrismaClient, private tenantId: string) {}

  async listUsers() {
    const users = await this.publicDb.tenantUser.findMany({
      where: { tenantId: this.tenantId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  }

  async inviteUser(email: string, role: "OWNER" | "ADMIN" | "MANAGER") {
    // Check if user already exists
    let user = await this.publicDb.globalUser.findUnique({ where: { email } });
    
    // In a real flow, this would send an invitation email via Resend or AWS SES
    // For now, if the user doesn't exist, we create a placeholder stub
    if (!user) {
      user = await this.publicDb.globalUser.create({
        data: {
          email,
          fullName: email.split("@")[0] ?? null,
        },
      });
    }

    // Check if already in tenant
    const existing = await this.publicDb.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId: this.tenantId,
          userId: user.id,
        },
      },
    });

    if (existing) throw new Error("User is already part of this workspace.");

    const tenantUser = await this.publicDb.tenantUser.create({
      data: {
        tenantId: this.tenantId,
        userId: user.id,
        role: role,
        isOwner: role === "OWNER",
      },
      include: { user: true }
    });

    return tenantUser;
  }

  async removeUser(userId: string) {
    const userRole = await this.publicDb.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId: this.tenantId, userId } }
    });

    if (!userRole) throw new Error("User not found in tenant");
    if (userRole.isOwner) throw new Error("Cannot remove the owner of the workspace");

    await this.publicDb.tenantUser.delete({
      where: { tenantId_userId: { tenantId: this.tenantId, userId } }
    });

    return { success: true };
  }
}
