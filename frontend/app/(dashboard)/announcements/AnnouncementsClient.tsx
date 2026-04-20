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

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.info("Announcement removed");
  };

  return (
    <div className="space-y-6 max-w-5xl">
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
            <Card
              key={announcement.id}
              className={`p-0 overflow-hidden relative transition-all duration-300 hover:shadow-md ${index === 0 ? "border-primary/50 shadow-primary/5" : "border-border shadow-sm"}`}>
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
                        onClick={() => handleDelete(announcement.id)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-primary/20 translate-y-0 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                {editingId ? "Edit Broadcast" : "New Broadcast"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Message Title</Label>
                <Input
                  placeholder="e.g., Garage Cleaning Required"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="font-medium text-lg placeholder:font-normal bg-card focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Detailed Context
                </Label>
                <Textarea
                  placeholder="Provide all necessary information to the residents..."
                  value={formData.content}
                  className="min-h-[160px] bg-card focus-visible:ring-primary resize-none"
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/10">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Discard
              </Button>
              <Button onClick={handleSave} className="shadow-md">
                {editingId ? "Update Notice" : "Publish to All"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
