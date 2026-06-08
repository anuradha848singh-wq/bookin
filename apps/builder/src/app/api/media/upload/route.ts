import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { getSupabaseServerClient } from "@book-in/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf"
];

export async function POST(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { owner_id: user.id },
    });

    if (!clinic) {
      return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false, 
        error: `File size exceeds the 5MB limit. (Got ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB)` 
      }, { status: 400 });
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: `File type ${file.type} is not allowed.` 
      }, { status: 400 });
    }

    // 3. Prepare File for Upload
    const fileBuffer = await file.arrayBuffer();
    const extension = file.name.split('.').pop() || 'file';
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueFileName = `${crypto.randomUUID()}-${safeName}`;
    const filePath = `${clinic.slug}/${uniqueFileName}`;

    const supabase = getSupabaseServerClient();

    // 4. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("builder_media")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      logError("[Builder Media Upload API] Supabase upload failed", error);
      return NextResponse.json({ success: false, error: "Failed to upload file to storage bucket." }, { status: 500 });
    }

    // 5. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("builder_media")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      media: {
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        path: data.path
      }
    });

  } catch (err: any) {
    logError("[Builder Media Upload API] Unexpected error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
