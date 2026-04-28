"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "mockRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully (Mock)");
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 py-3 px-4 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-xl transition-all w-full font-semibold">
        <LogOut className="h-5 w-5" />
        <span className="text-sm">Sign Out</span>
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
