"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
import {
  Users,
  Megaphone,
  Wrench,
  FileText,
  LayoutDashboard,
  Settings,
  User,
  ShieldAlert,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

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
    <nav className="flex flex-1 flex-col px-3 py-4 space-y-2 overflow-y-auto">
      {navigation.map((item) => {
        // Precise active state matching
        const isActive = pathname === item.href || (item.href !== "/" && item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            title={isCollapsed ? item.name : undefined}
            className={cn(
              "flex items-center rounded-xl transition-all duration-200 group overflow-hidden",
              isCollapsed ? "justify-center w-12 h-12 mx-auto" : "gap-x-3 px-3 py-2.5 text-sm font-semibold",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            <item.icon 
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground group-hover:text-foreground"
              )} 
            />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
