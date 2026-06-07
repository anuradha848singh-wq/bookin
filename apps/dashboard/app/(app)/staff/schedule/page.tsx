import { getDashboardAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffScheduleClient from "./StaffScheduleClient";

export const dynamic = "force-dynamic";

export default async function StaffSchedulePage() {
  const { user } = await getDashboardAuth();
  if (!user) redirect("/login");

  return (
    <StaffScheduleClient />
  );
}
