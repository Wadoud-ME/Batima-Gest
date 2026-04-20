import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";

  if (mockRole !== "Admin") {
    redirect("/dashboard");
  }

  return <UsersClient />;
}
