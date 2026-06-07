import { NextResponse } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { findClinicBySlug } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { slug: string, id: string } }) {
  try {
    const publicDb = getPublicClient();
    const clinic = await findClinicBySlug(publicDb, params.slug);

    if (!clinic) return NextResponse.json({ error: "Clinic not found" }, { status: 404 });

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const form = await tenantDb.form.findFirst({
      where: { id: params.id, deleted_at: null },
      select: {
        id: true,
        name: true,
        fields: true
      }
    });

    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    return NextResponse.json({ success: true, form });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string, id: string } }) {
  try {
    const publicDb = getPublicClient();
    const clinic = await findClinicBySlug(publicDb, params.slug);

    if (!clinic) return NextResponse.json({ error: "Clinic not found" }, { status: 404 });

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const body = await request.json();
    const { formData } = body;

    // Optional: Implement CRM Upsert Logic
    // If the form has an email or phone field, try to find or create a patient
    let patientId = null;

    // Attempt to extract identifying information
    let phone = null;
    let email = null;
    let firstName = "Unknown";
    let lastName = "Patient";

    // Scan form fields for potential patient matches
    // Assuming field labels might contain 'phone', 'email', 'first name', 'last name'
    Object.entries(formData).forEach(([label, value]) => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes("phone")) phone = value as string;
      if (lowerLabel.includes("email")) email = value as string;
      if (lowerLabel.includes("first name")) firstName = value as string;
      if (lowerLabel.includes("last name")) lastName = value as string;
    });

    if (phone) {
      // Upsert patient based on phone
      const existingPatient = await tenantDb.patient.findUnique({
        where: { phone }
      });

      if (existingPatient) {
        patientId = existingPatient.id;
        // Optionally update email if provided and missing
        if (email && !existingPatient.email) {
          await tenantDb.patient.update({
            where: { id: patientId },
            data: { email }
          });
        }
      } else {
        const newPatient = await tenantDb.patient.create({
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            email
          }
        });
        patientId = newPatient.id;
      }
    }

    // Save Form Submission
    const submission = await tenantDb.formSubmission.create({
      data: {
        form_id: params.id,
        patient_id: patientId,
        data: formData
      }
    });

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
