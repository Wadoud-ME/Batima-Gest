import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { LogoutButton } from "@/components/LogoutButton";
import { SidebarClientWrapper } from "@/components/layout/SidebarClientWrapper";
import { SidebarNav } from "@/components/layout/SidebarNav";

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
      <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary">
          Batima-Gest {isAdmin ? "Admin" : "Portal"}
        </h1>
      </div>
      
      <SidebarNav isAdmin={isAdmin} />
      <div className="mt-auto px-4 py-3 flex flex-col gap-2 bg-muted/30 border-t border-border">
        <div className="flex flex-col overflow-hidden mb-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            {isAdmin ? "Administrator" : "Resident"}
          </p>
        </div>
        <LogoutButton />
      </div>
    </SidebarClientWrapper>
  );
}
