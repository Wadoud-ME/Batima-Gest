import { cookies } from "next/headers";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";
  const isAdmin = mockRole === "Admin";

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences.
        </p>
      </div>

      <ProfileClient isAdmin={isAdmin} />
    </div>
  );
}
