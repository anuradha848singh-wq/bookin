import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function getStudioAuth() {
  const supabase = await createClient();

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
