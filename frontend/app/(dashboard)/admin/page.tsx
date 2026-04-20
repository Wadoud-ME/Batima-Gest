"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Users, Megaphone, CreditCard, ArrowUpRight, Wrench, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock role read
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const roleCookie = getCookie("mockRole") || "Resident";
    if (roleCookie !== "Admin") {
      router.push("/dashboard");
    } else {
      setRole(roleCookie);
    }
  }, [router]);

  if (!role) return null;

  // MOCK DATA
  const usersCount = 25;
  const pendingRequests = 4;
  const currentRevenue = 4250;

  return (
    <div className="space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 relative">
        <div className="absolute -left-4 top-1 w-1 h-12 bg-primary rounded-r-md"></div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          Admin Overview <ShieldAlert className="h-6 w-6 text-primary mt-1" />
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Global metrics and pending actions for your managed properties.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-500/15 text-blue-500 rounded-2xl shadow-inner">
              <Users className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Active Residents</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-foreground">{usersCount}</p>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> 12%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-amber-500/20 bg-gradient-to-br from-card to-amber-500/5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="p-4 bg-amber-500/15 text-amber-500 rounded-2xl shadow-inner">
              <Wrench className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Pending Requests</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-foreground">{pendingRequests}</p>
                {pendingRequests > 0 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Action required
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-destructive/15 text-destructive rounded-2xl shadow-inner">
              <CreditCard className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Monthly Revenue</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-foreground">${currentRevenue}</p>
                <span className="text-[10px] font-bold text-destructive bg-destructive/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  from {usersCount} active
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border/40 bg-muted/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold tracking-tight">Recent Activity Log</h3>
            <span className="text-xs font-medium text-muted-foreground">Last 24 hours</span>
          </div>
          <div className="p-6 flex-1 bg-gradient-to-b from-transparent to-muted/10">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-blue-500/20 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Users className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-foreground">New User Added</div>
                    <time className="text-xs font-medium text-muted-foreground">10:00 AM</time>
                  </div>
                  <div className="text-sm text-muted-foreground">Mark Smith joined as Resident in Apt 4B.</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col border-border/60 bg-card shadow-sm">
          <div className="px-6 py-5 border-b border-border/40 bg-muted/5">
            <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 space-y-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-primary/5 hover:border-primary/30 transition-all group">
              <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                <Megaphone className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm">Post Notice</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 space-y-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full group-hover:scale-110 transition-transform">
                <Wrench className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm">Dispatch Tech</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
