"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Users, Megaphone, CreditCard, ArrowUpRight, Wrench, ShieldAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ usersCount: 0, pendingRequests: 0, totalPayments: 0 });

  useEffect(() => {
    async function loadAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
      if (profile?.role !== "Admin") { router.push("/dashboard"); return; }

      // Fetch stats
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true });
      const { count: pendingRequests } = await supabase.from("maintenance_requests").select("*", { count: "exact", head: true }).in("status", ["pending", "in_progress"]);
      const { data: payments } = await supabase.from("payments").select("amount").eq("status", "paid");
      const totalPayments = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({ usersCount: usersCount || 0, pendingRequests: pendingRequests || 0, totalPayments });
      setLoading(false);
    }
    loadAdmin();
  }, [supabase, router]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 relative">
        <div className="absolute -left-4 top-1 w-1 h-12 bg-primary rounded-r-md"></div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">Admin Overview <ShieldAlert className="h-6 w-6 text-primary mt-1" /></h1>
        <p className="text-muted-foreground mt-2 text-lg">Global metrics and pending actions for your managed properties.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-500/15 text-blue-500 rounded-2xl shadow-inner"><Users className="h-7 w-7" /></div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Active Residents</p>
              <div className="flex items-baseline space-x-2"><p className="text-4xl font-extrabold text-foreground">{stats.usersCount}</p></div>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-amber-500/20 bg-gradient-to-br from-card to-amber-500/5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="p-4 bg-amber-500/15 text-amber-500 rounded-2xl shadow-inner"><Wrench className="h-7 w-7" /></div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Pending Requests</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-foreground">{stats.pendingRequests}</p>
                {stats.pendingRequests > 0 && <span className="text-[10px] font-bold text-amber-600 bg-amber-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">Action required</span>}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-destructive/15 text-destructive rounded-2xl shadow-inner"><CreditCard className="h-7 w-7" /></div>
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Total Revenue</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-foreground">${stats.totalPayments}</p>
                <span className="text-[10px] font-bold text-destructive bg-destructive/15 px-2 py-0.5 rounded-full uppercase tracking-wider">from {stats.usersCount} users</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col border-border/60 bg-card shadow-sm">
          <div className="px-6 py-5 border-b border-border/40 bg-muted/5"><h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3></div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button onClick={() => router.push('/announcements')} className="flex flex-col items-center justify-center p-6 space-y-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-primary/5 hover:border-primary/30 transition-all group">
              <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform"><Megaphone className="h-6 w-6" /></div>
              <span className="font-semibold text-sm">Post Notice</span>
            </button>
            <button onClick={() => router.push('/maintenance')} className="flex flex-col items-center justify-center p-6 space-y-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full group-hover:scale-110 transition-transform"><Wrench className="h-6 w-6" /></div>
              <span className="font-semibold text-sm">Dispatch Tech</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
