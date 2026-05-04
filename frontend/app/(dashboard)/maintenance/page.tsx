import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MaintenanceClient } from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "Admin";
  const currentUser = {
    id: user.id,
    name: profile?.name || user.email?.split("@")[0] || "User",
  };

  return <MaintenanceClient isAdmin={isAdmin} currentUser={currentUser} />;
}
