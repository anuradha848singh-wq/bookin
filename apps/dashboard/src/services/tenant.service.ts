import { PrismaClient } from "@prisma/client";

export class TenantService {
  constructor(private publicDb: PrismaClient, private tenantId: string) {}

  async getTenant() {
    const tenant = await this.publicDb.tenant.findUnique({
      where: { id: this.tenantId },
      include: {
        users: {
          select: {
            role: true,
            isOwner: true,
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });
    
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
  }

  async updateTenant(data: { name?: string; slug?: string; settings?: any }) {
    const tenant = await this.publicDb.tenant.update({
      where: { id: this.tenantId },
      data,
    });
    return tenant;
  }
}
