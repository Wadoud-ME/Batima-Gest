"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-20 shrink-0 items-center justify-between gap-x-4 border-b border-border/40 bg-background/60 backdrop-blur-2xl px-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] sticky top-0 z-30"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 -ml-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
