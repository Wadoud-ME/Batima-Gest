import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
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
