"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { UserPlus, ShieldCheck, Mail, Shield, X, Edit, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface UserRow { id: string; email: string; name: string | null; role: string; created_at: string; }

export function UsersClient() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Resident" });
  const [saving, setSaving] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load users"); console.error(error); }
    else setUsers(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleOpenModal = (user?: UserRow) => {
    if (user) { setEditingId(user.id); setFormData({ name: user.name || "", email: user.email, role: user.role }); }
    else { setEditingId(null); setFormData({ name: "", email: "", role: "Resident" }); }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingId(null); setFormData({ name: "", email: "", role: "Resident" }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase.from("users").update({ name: formData.name, role: formData.role as "Admin" | "Resident" }).eq("id", editingId);
      if (error) { toast.error("Failed to update user"); console.error(error); }
      else { toast.success("User updated"); fetchUsers(); }
    } else {
      toast.info("To add a new user, they need to sign up through the registration page. You can then change their role here.");
    }
    setSaving(false); handleCloseModal();
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "Admin" ? "Resident" : "Admin";
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", id);
    if (error) { toast.error("Failed to change role"); console.error(error); }
    else { toast.success(`Role changed to ${newRole}`); fetchUsers(); }
  };

  const confirmRemove = async () => {
    if (!userToDelete) return;
    const { error } = await supabase.from("users").delete().eq("id", userToDelete.id);
    if (error) { toast.error("Failed to remove user"); console.error(error); }
    else { toast.success(`${userToDelete.name} has been removed.`); fetchUsers(); }
    setUserToDelete(null);
  };

  const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const iV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <motion.div variants={cV} initial="hidden" animate="show" className="space-y-6 relative max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div><h1 className="text-3xl font-bold text-foreground">User Management</h1><p className="text-muted-foreground mt-2">Manage building residents and administrators.</p></div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-sm rounded-xl"><UserPlus className="h-4 w-4" /> Edit User</Button>
      </div>

      <motion.div variants={iV}>
        <Card className="p-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-foreground">Name</th>
                  <th className="px-6 py-4 font-bold text-foreground">Email</th>
                  <th className="px-6 py-4 font-bold text-foreground">Role</th>
                  <th className="px-6 py-4 font-bold text-foreground">Join Date</th>
                  <th className="px-6 py-4 font-bold text-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((u) => (
                  <tr key={u.id} className="bg-transparent hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{(u.name || "U").charAt(0)}</div>
                        {u.name || "Unnamed"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground/70" />{u.email}</div></td>
                    <td className="px-6 py-4">
                      {u.role === "Admin" ? (
                        <button onClick={() => handleToggleRole(u.id, u.role)} title="Click to downgrade role" className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full w-max text-xs font-semibold border border-purple-500/20 hover:bg-purple-500/20 transition-colors"><ShieldCheck className="h-3.5 w-3.5" /> Admin</button>
                      ) : (
                        <button onClick={() => handleToggleRole(u.id, u.role)} title="Click to upgrade role" className="flex items-center gap-1.5 text-foreground bg-secondary px-2.5 py-1 rounded-full w-max text-xs font-semibold border border-border hover:bg-muted/60 transition-colors"><Shield className="h-3.5 w-3.5" /> Resident</button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(u)}><Edit className="h-4 w-4 shrink-0" /><span className="sr-only sm:not-sr-only sm:ml-2">Edit</span></Button>
                      <Button variant="ghost" size="sm" onClick={() => setUserToDelete({ id: u.id, name: u.name || "User" })} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent"><Trash2 className="h-4 w-4 shrink-0" /><span className="sr-only sm:not-sr-only sm:ml-2">Remove</span></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {isModalOpen && mounted && createPortal(
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-md p-7 rounded-3xl bg-card border border-border/50 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold tracking-tight">{editingId ? "Edit User" : "Add User"}</h2><button onClick={handleCloseModal} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button></div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="e.g., Alice Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 bg-card/50" required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="user@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 bg-card/50" disabled={!!editingId} required /></div>
                <div className="space-y-2"><Label htmlFor="role">Account Role</Label>
                  <select id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="flex h-11 w-full rounded-md border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" required><option value="Resident">Resident</option><option value="Admin">Administrator</option></select>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4">
                  <Button type="button" variant="ghost" className="rounded-xl" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="rounded-xl shadow-md">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editingId ? "Save Changes" : "Add User"}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}

      {userToDelete && mounted && createPortal(
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-card text-card-foreground w-full max-w-md rounded-3xl shadow-2xl p-7 border border-border/50 relative">
              <button onClick={() => setUserToDelete(null)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              <h2 className="text-2xl font-bold pr-8">Remove User</h2>
              <div className="py-6"><p className="text-muted-foreground leading-relaxed">Are you sure you want to remove <strong>{userToDelete.name}</strong> from the system? This action cannot be undone.</p></div>
              <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setUserToDelete(null)} className="rounded-xl">Cancel</Button><Button variant="destructive" onClick={confirmRemove} className="rounded-xl shadow-md border border-destructive/40">Confirm Delete</Button></div>
            </motion.div>
          </motion.div>
        </AnimatePresence>, document.body
      )}
    </motion.div>
  );
}
