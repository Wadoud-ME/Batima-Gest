"use client";

// import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-x-4 border-b bg-card/80 backdrop-blur-xl px-8 shadow-sm">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6"></div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <ThemeToggle />
      </div>
    </header>
  );
}
