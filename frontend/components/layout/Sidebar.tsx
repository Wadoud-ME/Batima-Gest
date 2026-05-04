import { createClient } from "@/lib/supabase/server";
import { SidebarClientWrapper } from "@/components/layout/SidebarClientWrapper";
import { SidebarContent } from "@/components/layout/SidebarContent";

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  let userName = "User";

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, name")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "Admin";
    userName = profile?.name || user.email?.split("@")[0] || "User";
  }

  return (
    <SidebarClientWrapper>
      <SidebarContent isAdmin={isAdmin} userName={userName} />
    </SidebarClientWrapper>
  );
}
