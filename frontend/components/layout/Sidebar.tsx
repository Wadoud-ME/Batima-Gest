import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  Megaphone,
  Wrench,
  FileText,
  CreditCard,
  LayoutDashboard,
  Settings,
  User,
  ShieldAlert,
} from "lucide-react";

import { LogoutButton } from "@/components/LogoutButton";
import { SidebarClientWrapper } from "@/components/layout/SidebarClientWrapper";

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

  const residentNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "My Requests", href: "/maintenance", icon: Wrench },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const adminNav = [
    { name: "Admin Overview", href: "/admin", icon: ShieldAlert },
    { name: "Manage Announcements", href: "/announcements", icon: Megaphone },
    { name: "All Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Manage Documents", href: "/documents", icon: FileText },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "System Settings", href: "/settings", icon: Settings },
  ];

  const navigation = isAdmin ? adminNav : residentNav;

  return (
    <SidebarClientWrapper>
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          Batima-Gest {isAdmin ? "Admin" : "Portal"}
        </h1>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-x-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors group">
            <item.icon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            {item.name}
          </Link>
        ))}
      </nav>
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
