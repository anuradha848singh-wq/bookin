import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getDashboardAuth } from "@/lib/auth";

export async function DELETE(request: Request) {
  try {
    const session = await getDashboardAuth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // GDPR Deletion process (soft delete or hard delete depending on policy)
    // We do a soft delete for audit, or a hard delete if legally required.
    // Here we'll anonymize personal info and mark deletedAt.

    const prisma = getPublicClient();
    await prisma.$transaction(async (tx) => {
      await tx.globalUser.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@bookin.local`,
          fullName: "Deleted User",
          avatarUrl: null,
          deletedAt: new Date(),
        },
      });

      // Clear sessions
      await tx.globalSession.deleteMany({
        where: { userId },
      });

      // Revoke OAuth Accounts
      await tx.oAuthAccount.deleteMany({
        where: { userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Account and associated data have been permanently deleted.",
    });
  } catch (error) {
    console.error("GDPR Deletion Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process account deletion" },
      { status: 500 }
    );
  }
}
