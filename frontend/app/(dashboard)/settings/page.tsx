import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";

  if (mockRole !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          System Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage platform configurations and global preferences.
        </p>
      </div>

      <SettingsClient />
    </div>
  );
}
