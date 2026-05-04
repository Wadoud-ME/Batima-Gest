"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar: () => setIsCollapsed(p => !p) }}>
      <div className={mounted ? "contents" : "hidden lg:contents"}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
