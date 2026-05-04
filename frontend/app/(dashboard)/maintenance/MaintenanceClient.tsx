"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button, Input, Textarea, Label } from "@/components/ui";
import { Wrench, Plus, AlertTriangle, Clock, X, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";

interface MaintenanceRequest {
  id: string; title: string; description: string; status: string;
  image_url: string | null; created_at: string; resident_id: string;
  users: { name: string | null } | null;
}

export function MaintenanceClient({ isAdmin, currentUser }: { isAdmin: boolean; currentUser: { id: string; name: string } }) {
  const supabase = createClient();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const fetchRequests = useCallback(async () => {
    let query = supabase.from("maintenance_requests").select("*, users(name)").order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("resident_id", currentUser.id);
    const { data, error } = await query;
    if (error) { toast.error("Failed to load requests"); console.error(error); }
    else setRequests(data as unknown as MaintenanceRequest[]);
    setLoading(false);
  }, [supabase, isAdmin, currentUser.id]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
      pending: { cls: "bg-red-500/10 text-red-500 border-red-500/20", icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Awaiting Review" },
      in_progress: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="w-3.5 h-3.5" />, label: "Tech Dispatched" },
      resolved: { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Completed" },
    };
    const s = map[status] || { cls: "bg-muted/50 text-muted-foreground border-border", icon: <CircleDashed className="w-3.5 h-3.5" />, label: "Unknown" };
    return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-semibold text-xs ${s.cls}`}>{s.icon} {s.label}</span>;
  };

  const handleCreate = async () => {
    if (!formData.title) return;
    setSaving(true);
    const { error } = await supabase.from("maintenance_requests").insert({ title: formData.title, description: formData.description, resident_id: currentUser.id });
    if (error) { toast.error("Failed to create request"); console.error(error); }
    else { toast.success("Maintenance ticket generated successfully."); fetchRequests(); }
    setSaving(false); setIsModalOpen(false); setFormData({ title: "", description: "" });
  };

  const updateStatus = async (id: string, newStatus: "pending" | "in_progress" | "resolved") => {
    const { error } = await supabase.from("maintenance_requests").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Failed to update status"); console.error(error); }
    else { toast.info(`Ticket status updated to ${newStatus.replace("_", " ")}`); fetchRequests(); }
  };

  const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const iV = { hidden: { opacity: 0, scale: 0.95, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  return (
    <motion.div variants={cV} initial="hidden" animate="show" className="space-y-6 max-w-6xl relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">{isAdmin ? "Facility Tickets" : "My Requests"} <Wrench className="h-6 w-6 text-amber-500" /></h1>
          <p className="text-muted-foreground mt-2">{isAdmin ? "Oversee, assign, and resolve property issues." : "Log and track your maintenance needs."}</p>
        </div>
        {!isAdmin && <Button onClick={() => setIsModalOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/40"><Plus className="mr-2 h-4 w-4" /> Open New Ticket</Button>}
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 bg-muted/10">
            <div className="p-4 bg-muted/50 rounded-full mb-4"><CheckCircle2 className="h-10 w-10 text-muted-foreground/50" /></div>
            <h3 className="text-xl font-bold text-foreground">Zero Active Tickets</h3>
            <p className="text-muted-foreground mt-2 max-w-md">Everything is running smoothly! There are no open facility maintenance logs.</p>
            {!isAdmin && <Button onClick={() => setIsModalOpen(true)} className="mt-6" variant="outline">Need fixing?</Button>}
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {requests.map((req) => (
              <motion.div variants={iV} key={req.id}>
                <Card className="flex flex-col p-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border-border/40 bg-card/60 backdrop-blur-xl h-full">
                  <div className="p-6 pb-4 border-b border-border/40 bg-card/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors">{req.title}</h3>
                      <div className="shrink-0">{getStatusBadge(req.status)}</div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{req.description}</p>
                    <div className="flex items-center text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="p-3 bg-muted/20 flex flex-wrap items-center justify-end gap-3 text-sm">
                      <span className="mr-auto font-medium text-muted-foreground text-xs px-3">Reported by <span className="text-foreground">{req.users?.name || "Unknown"}</span></span>
                      {req.status === "pending" && <Button size="sm" variant="secondary" onClick={() => updateStatus(req.id, "in_progress")} className="h-8 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">Dispatch Tech</Button>}
                      {(req.status === "pending" || req.status === "in_progress") && <Button size="sm" onClick={() => updateStatus(req.id, "resolved")} className="h-8 bg-emerald-500 text-white hover:bg-emerald-600">Mark Fixed</Button>}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && mounted && createPortal(
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-lg shadow-2xl rounded-3xl border border-border/50 bg-card relative p-7">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight"><Wrench className="h-6 w-6 text-amber-500" /> Need Maintenance?</h2>
                <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground p-2 transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2"><Label className="text-sm font-semibold text-muted-foreground">Short Summary</Label><Input placeholder="e.g., A/C Unit vibrating loudly" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="font-medium bg-card/50 transition-colors focus:ring-amber-500 h-12" /></div>
                <div className="space-y-2"><Label className="text-sm font-semibold text-muted-foreground">Problem Details</Label><Textarea placeholder="Describe where the issue is and when it started..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[120px] bg-card/50 resize-none transition-colors focus-visible:ring-amber-500" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-8">
                <Button variant="ghost" className="rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Submit Ticket</Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}
    </motion.div>
  );
}
