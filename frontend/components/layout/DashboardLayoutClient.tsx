"use client";

import { useSidebar } from "./SidebarContext";
import Navbar from "./Navbar";
import { cn } from "@/components/ui";

export function DashboardLayoutClient({ children, sidebar }: { children: React.ReactNode, sidebar: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground w-full relative">
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:inset-y-0 lg:fixed z-50 transition-all duration-300",
        isCollapsed ? "lg:w-20" : "lg:w-64"
      )}>
        {sidebar}
      </div>
      <div className={cn(
        "flex flex-1 flex-col lg:static lg:h-full overflow-hidden w-full transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex flex-col items-center">
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
