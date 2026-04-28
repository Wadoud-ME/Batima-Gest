"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Shield,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export function UsersClient() {
  const [users, setUsers] = useState([
    {
      id: "1",
      email: "admin@demo.com",
      name: "Sarah Admin",
      role: "Admin",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      email: "resident@demo.com",
      name: "John Doe Resident",
      role: "Resident",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      email: "alice@demo.com",
      name: "Alice Smith",
      role: "Resident",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Resident",
  });
  
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingId(user.id);
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", role: "Resident" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", role: "Resident" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...formData } : u)),
      );
    } else {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setUsers([newUser, ...users]);
    }
    handleCloseModal();
  };

  const handleToggleRole = (id: string, currentRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: currentRole === "Admin" ? "Resident" : "Admin" }
          : u,
      ),
    );
  };

  const promptRemove = (id: string, name: string) => {
    setUserToDelete({ id, name });
  };

  const confirmRemove = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success(`${userToDelete.name} has been removed.`);
      setUserToDelete(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 relative max-w-6xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage building residents and administrators.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 shadow-sm rounded-xl">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="p-0 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40">
          <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-foreground">Name</th>
                <th className="px-6 py-4 font-bold text-foreground">Email</th>
                <th className="px-6 py-4 font-bold text-foreground">Role</th>
                <th className="px-6 py-4 font-bold text-foreground">
                  Join Date
                </th>
                <th className="px-6 py-4 font-bold text-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="bg-transparent hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground/70" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === "Admin" ? (
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        title="Click to downgrade role"
                        className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full w-max text-xs font-semibold border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                        <ShieldCheck className="h-3.5 w-3.5" /> Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        title="Click to upgrade role"
                        className="flex items-center gap-1.5 text-foreground bg-secondary px-2.5 py-1 rounded-full w-max text-xs font-semibold border border-border hover:bg-muted/60 transition-colors">
                        <Shield className="h-3.5 w-3.5" /> Resident
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(u)}>
                      <Edit className="h-4 w-4 shrink-0" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">
                        Edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => promptRemove(u.id, u.name)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent">
                      <Trash2 className="h-4 w-4 shrink-0" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">
                        Remove
                      </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Card>
      </motion.div>

      {/* Modal */}
      {isModalOpen && mounted && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-md p-7 rounded-3xl bg-card border border-border/50 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  {editingId ? "Edit User" : "Invite User"}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Alice Smith"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-11 bg-card/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@demo.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11 bg-card/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="flex h-11 w-full rounded-md border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    required>
                    <option value="Resident">Resident</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl"
                    onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl shadow-md">
                    {editingId ? "Save Changes" : "Send Invite"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && mounted && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-card text-card-foreground w-full max-w-md rounded-3xl shadow-2xl p-7 border border-border/50 relative"
            >
              <button 
                onClick={() => setUserToDelete(null)}
                className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold pr-8">Remove User</h2>
              <div className="py-6">
                <p className="text-muted-foreground leading-relaxed">
                  Are you sure you want to completely remove <strong>{userToDelete.name}</strong> from the system? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setUserToDelete(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={confirmRemove}
                  className="rounded-xl shadow-md border border-destructive/40"
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
