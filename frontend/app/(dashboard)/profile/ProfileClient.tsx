"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { User, Mail, Phone, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRef } from "react";

interface Profile {
  id: string; email: string; name: string | null; role: string; avatar_url: string | null; created_at: string;
}

export function ProfileClient({ isAdmin, userId, initialProfile }: { isAdmin: boolean; userId: string; initialProfile: Profile | null }) {
  const supabase = createClient();
  const [profile, setProfile] = useState({
    name: initialProfile?.name || "User",
    email: initialProfile?.email || "",
    avatar: initialProfile?.avatar_url || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("users").update({ name: profile.name }).eq("id", userId);
    if (error) { toast.error("Failed to update profile"); console.error(error); }
    else { toast.success("Profile updated successfully"); }
    setSaving(false); setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filePath = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) { toast.error("Avatar upload failed"); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const { error } = await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", userId);
    if (error) { toast.error("Failed to save avatar"); }
    else { setProfile(prev => ({ ...prev, avatar: publicUrl })); toast.success("Avatar updated"); }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto mt-6">
      <Card className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative h-28 w-28 shrink-0">
          <div className="h-full w-full rounded-full border-4 border-muted bg-muted/50 flex items-center justify-center shadow-sm overflow-hidden">
            {profile.avatar ? <img src={profile.avatar} alt="Profile Picture" className="object-cover w-full h-full" /> : <User className="h-12 w-12 text-muted-foreground/70" />}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 border-2 border-background bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10"><Camera className="h-4 w-4" /></button>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
        </div>
        <div className="flex flex-col items-center sm:items-start flex-1 pt-2">
          <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">{isAdmin ? "System Administrator" : "Active Resident"}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
          <div><h3 className="text-xl font-bold tracking-tight">Personal Information</h3><p className="text-sm text-muted-foreground mt-1">Review and update your contact details.</p></div>
          {!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline" className="shadow-sm w-full sm:w-auto">Edit Details</Button>}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold"><User className="h-4 w-4" /> Full Name</Label>
            <Input value={profile.name} disabled={!isEditing} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={isEditing ? "bg-background focus:ring-2 ring-primary h-11" : "bg-muted/30 border-muted-foreground/20 text-foreground h-11"} />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold"><Mail className="h-4 w-4" /> Email Address</Label>
            <Input value={profile.email} disabled className="bg-muted/30 border-muted-foreground/20 text-foreground h-11" />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold"><ShieldCheck className="h-4 w-4" /> Account Role</Label>
            <Input value={isAdmin ? "Administrator" : "Resident"} disabled className="bg-muted/30 border-muted-foreground/20 text-muted-foreground cursor-not-allowed h-11" />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="shadow-sm">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Save Changes</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
