import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnnouncementsClient } from "./AnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "Admin";

  return <AnnouncementsClient isAdmin={isAdmin} userId={user.id} />;
}
