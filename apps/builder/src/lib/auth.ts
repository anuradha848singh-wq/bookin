import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";

export async function getStudioAuth() {
  const supabase = await createClient();

  if (process.env.DEV_BYPASS_AUTH === "true") {
    try {
      const publicDb = getPublicClient() as any;
      const devUserId = "dev-bypass-user-id";
      
      // Ensure the mock user exists in the database to prevent Prisma foreign key errors
      await publicDb.studioUser.upsert({
        where: { id: devUserId },
        update: {},
        create: {
          id: devUserId,
          email: "dev@bookin.com",
          fullName: "Dev Bypass User"
        }
      });
      
      return {
        supabase,
        user: { id: devUserId, email: "dev@bookin.com", role: "authenticated" },
        error: null,
        isAuthenticated: true,
      };
    } catch (err) {
      console.error("Failed to upsert dev user", err);
    }
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    error,
    isAuthenticated: !!user && !error,
  };
}

export function unauthorizedResponse(message = "Unauthorized. Please sign in to Bookin Studio.") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}
