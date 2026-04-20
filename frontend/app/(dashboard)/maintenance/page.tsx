import { cookies } from "next/headers";
import { MaintenanceClient } from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";
  const isAdmin = mockRole === "Admin";
  const currentUser = {
    id: isAdmin ? "admin-1" : "user-1",
    name: isAdmin ? "Sarah Admin" : "Resident John",
  };

  return <MaintenanceClient isAdmin={isAdmin} currentUser={currentUser} />;
}
