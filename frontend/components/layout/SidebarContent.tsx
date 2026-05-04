"use client";
import { useSidebar } from "./SidebarContext";
import { LogoutButton } from "@/components/LogoutButton";
import { Building2 } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import Link from "next/link";

export function SidebarContent({ isAdmin, userName }: { isAdmin: boolean, userName: string }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Header Logo */}
      <Link href="/" className={`flex h-20 shrink-0 items-center gap-3 border-b border-border/50 transition-all duration-300 hover:bg-muted/30 cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Building2 className="h-6 w-6" />
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-extrabold tracking-tight text-primary truncate">
            Batima-Gest
          </h1>
        )}
      </Link>
      
      {/* Navigation */}
      <SidebarNav isAdmin={isAdmin} />

      {/* Footer User Info */}
      <div className={`mt-auto py-4 flex flex-col gap-3 bg-card/50 border-t border-border/50 transition-all duration-300 ${isCollapsed ? 'px-2 items-center' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden mb-1 px-2">
            <p className="text-sm font-bold text-foreground truncate">{userName}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{isAdmin ? "Administrator" : "Resident"}</p>
          </div>
        )}
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
    </>
  );
}
