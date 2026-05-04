import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "Admin";

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

      <ProfileClient isAdmin={isAdmin} userId={user.id} initialProfile={profile} />
    </div>
  );
}
