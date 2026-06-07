import { redirect } from "next/navigation";
import { getDashboardAuth } from "@/lib/auth";
import OnboardingClient from "./OnboardingClient";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { user } = await getDashboardAuth();

  if (!user) {
    redirect("/login");
  }

  return <OnboardingClient />;
}
