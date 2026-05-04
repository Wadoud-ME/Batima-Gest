"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      return;
    }
    toast.success("Logged out successfully");
    setIsOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-center gap-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-xl transition-all font-semibold ${isCollapsed ? 'p-3 w-12 h-12' : 'py-3 px-4 w-full'}`}
        title={isCollapsed ? "Sign Out" : undefined}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="text-sm">Sign Out</span>}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground w-full max-w-sm rounded-2xl shadow-xl p-6 border border-border animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-semibold mb-2">Sign out</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to log out of Batima-Gest?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
