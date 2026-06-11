import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";

export async function POST(request: NextRequest) {
  try {
    const publicDb = getPublicClient() as any;
    
    // Accept FormData from the compiled static HTML form
    const formData = await request.formData();
    
    const websiteId = formData.get("websiteId")?.toString();
    if (!websiteId) {
      return NextResponse.json({ success: false, error: "Missing websiteId" }, { status: 400 });
    }

    const formName = formData.get("formName")?.toString() || "Contact Form";
    
    // Extract actual form fields (ignore internal fields)
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "websiteId" && key !== "formName") {
        data[key] = value.toString();
      }
    });

    // Find or create the BuilderForm
    let form = await publicDb.builderForm.findFirst({
      where: { websiteId, name: formName }
    });

    if (!form) {
      form = await publicDb.builderForm.create({
        data: {
          websiteId,
          name: formName,
          fields: Object.keys(data) // Just store field names as schema for now
        }
      });
    }

    // Save the submission
    await publicDb.builderFormSubmission.create({
      data: {
        formId: form.id,
        data: data
      }
    });

    // Since this is a static HTML form submission without JS, we'd normally redirect back
    // For now, return JSON. A real production system would do a redirect or use client JS.
    const referer = request.headers.get("referer") || "/";
    return NextResponse.redirect(`${referer}?success=true`, 302);
  } catch (err: any) {
    console.error("[Builder Form Submit API] Error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
