import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormBuilderClient from "./FormBuilderClient";

export const dynamic = "force-dynamic";

export default async function FormBuilderPage({ params }: { params: { id: string } }) {
  const { user, session } = await getDashboardAuth();
  const activeTenantId = (session as any)?.tenantId;

  if (!user) {
    redirect("/login");
  }

  const clinic = await getCachedClinic(user.id as string, activeTenantId);

  if (!clinic) redirect("/onboarding");

  return <FormBuilderClient formId={params.id} clinicName={clinic.name} />;
}
