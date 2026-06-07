import CRMSegmentsClient from "./CRMSegmentsClient";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CRMSegmentsPage() {
  const { user } = await getDashboardAuth();

  if (!user) {
    redirect("/login");
  }

  const clinic = await getCachedClinic(user.id as string);

  if (!clinic) redirect("/onboarding");

  return <CRMSegmentsClient clinicName={clinic.name} />;
}

