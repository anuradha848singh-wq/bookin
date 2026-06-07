import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  // Sign out user locally on this device
  await supabase.auth.signOut({ scope: "local" });

  return NextResponse.json({ success: true });
}
