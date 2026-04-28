"use client";

import { useState } from "react";
import { Card, Button, Input, Textarea, Label } from "@/components/ui";
import {
  Megaphone,
  Plus,
  X,
  Edit,
  Trash2,
  CalendarDays,
  User,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export function AnnouncementsClient({ isAdmin }: { isAdmin: boolean }) {
  const [announcements, setAnnouncements] = useState([
    {
      id: "1",
      title: "Summer Pool Hours Extended",
      content:
        "The community pool will now be open from 7 AM to 10 PM daily. Please remember to bring your resident ID tags and limit guests to 2 per household. Glass containers are strictly prohibited on the pool deck. Enjoy the summer!",
      created_at: new Date().toISOString(),
      views: 45,
      users: { name: "Sarah Admin" },
    },
    {
      id: "2",
      title: "Scheduled Fire Alarm Test",
      content:
        "There will be a brief fire alarm test this Friday at 1 PM. No evacuation is required unless the alarm sounds for longer than 3 continuous minutes. Maintenance personnel will be walking the halls during this time.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      views: 112,
      users: { name: "System Automated" },
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const handleOpenModal = (announcement?: any) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({ title: announcement.title, content: announcement.content });
    } else {
      setEditingId(null);
      setFormData({ title: "", content: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) return;

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...formData } : a)),
      );
      toast.success("Announcement updated");
    } else {
      const newAnnouncement = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        views: 0,
        users: { name: "Admin" },
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast.success("Announcement broadcasted successfully");
    }

    setIsModalOpen(false);
  };

  const promptDelete = (id: string) => {
    setAnnouncementToDelete(id);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete));
      toast.info("Announcement removed");
      setAnnouncementToDelete(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Community Board <Megaphone className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-2">
            Latest building news, updates, and general alerts.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => handleOpenModal()}
            className="shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Plus className="mr-2 h-4 w-4" /> Post Notice
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {announcements.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 bg-muted/10">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Megaphone className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No Active Announcements
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              There are currently no community bulletins. When administration
              posts important updates, they will appear here.
            </p>
            {isAdmin && (
              <Button
                onClick={() => handleOpenModal()}
                className="mt-6"
                variant="outline">
                Create Initial Post
              </Button>
            )}
          </Card>
        ) : (
          announcements.map((announcement, index) => (
            <motion.div variants={itemVariants} key={announcement.id}>
            <Card
              className={`p-0 overflow-hidden relative transition-all duration-300 hover:shadow-xl bg-card/60 backdrop-blur-xl ${index === 0 ? "border-primary/50 shadow-primary/5" : "border-border/40 shadow-sm"}`}>
              {index === 0 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-sm z-10">
                  Pinned
                </div>
              )}
              {/* Subtle top gradient bar */}
              <div
                className={`h-1.5 w-full ${index === 0 ? "bg-gradient-to-r from-primary/80 to-primary/20" : "bg-muted"}`}
              />

              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">
                        {announcement.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {announcement.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-border mt-4 text-xs font-semibold text-muted-foreground/80">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-foreground/30" /> By{" "}
                        {announcement.users?.name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-foreground/30" />{" "}
                        {new Date(announcement.created_at).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" },
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 ml-auto text-primary">
                          <Eye className="h-4 w-4" /> {announcement.views} views
                        </div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(announcement)}
                        className="hover:bg-primary/10 hover:text-primary transition-colors">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => promptDelete(announcement.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && mounted && createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-lg shadow-2xl rounded-3xl border border-border/50 bg-card relative p-7"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                  <Megaphone className="h-6 w-6 text-primary" />
                  {editingId ? "Edit Broadcast" : "New Broadcast"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-6 top-6 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground p-2 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 relative group">
                  <Label className="text-sm font-semibold">Message Title</Label>
                  <Input
                    placeholder="e.g., Garage Cleaning Required"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="font-medium text-lg placeholder:font-normal bg-card/50 transition-colors focus:ring-primary h-12"
                  />
                </div>
                <div className="space-y-2 relative group">
                  <Label className="text-sm font-semibold">
                    Detailed Context
                  </Label>
                  <Textarea
                    placeholder="Provide all necessary information to the residents..."
                    value={formData.content}
                    className="min-h-[160px] bg-card/50 focus-visible:ring-primary resize-none transition-colors"
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8">
                <Button variant="ghost" className="rounded-xl" onClick={() => setIsModalOpen(false)}>
                  Discard
                </Button>
                <Button onClick={handleSave} className="shadow-md rounded-xl">
                  {editingId ? "Update Notice" : "Publish to All"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {announcementToDelete && mounted && createPortal(
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
                onClick={() => setAnnouncementToDelete(null)}
                className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold pr-8">Remove Notice</h2>
              <div className="py-6">
                <p className="text-muted-foreground leading-relaxed">
                  Are you sure you want to delete this announcement? It will be removed from the community board permanently.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setAnnouncementToDelete(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={confirmDelete}
                  className="rounded-xl shadow-md border border-destructive/40"
                >
                  Delete Notice
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
