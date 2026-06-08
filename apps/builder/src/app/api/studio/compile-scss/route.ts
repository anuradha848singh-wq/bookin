import { NextResponse } from "next/server";
import { compileString } from "sass";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scss } = await req.json();

    if (!scss) {
      return NextResponse.json({ css: "" });
    }

    // Compile SCSS to standard CSS
    const result = compileString(scss, {
      style: "compressed", // Minified output for production efficiency
    });

    return NextResponse.json({ css: result.css });

  } catch (err: any) {
    console.error("SCSS Compilation failed:", err);
    return NextResponse.json({ error: err.message || "Compilation failed" }, { status: 400 });
  }
}
