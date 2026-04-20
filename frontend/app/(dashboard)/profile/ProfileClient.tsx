"use client";

import { useState, useRef } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { User, Mail, Phone, ShieldCheck, Camera } from "lucide-react";
import Image from "next/image";

export function ProfileClient({ isAdmin }: { isAdmin: boolean }) {
  const [profile, setProfile] = useState({
    name: isAdmin ? "Admin User" : "Resident User",
    email: isAdmin ? "admin@demo.com" : "resident@demo.com",
    phone: "+1 234 567 8900",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image upload by creating a local object URL
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  return (
    <div className="grid gap-8 max-w-4xl mt-6">
      {/* Profile Header */}
      <Card className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative h-28 w-28 shrink-0 rounded-full border-4 border-muted bg-muted/50 flex items-center justify-center shadow-sm overflow-hidden">
          {profile.avatar ? (
            <Image 
              src={profile.avatar} 
              alt="Profile Picture" 
              fill 
              className="object-cover" 
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground/70" />
          )}
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 border-2 border-background bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="flex flex-col items-center sm:items-start flex-1 pt-2">
          <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              {isAdmin ? "System Administrator" : "Active Resident"}
            </span>
          </div>
        </div>
      </Card>

      {/* Profile Details Form */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Personal Information
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review and update your contact details.
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="shadow-sm w-full sm:w-auto">
              Edit Details
            </Button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold">
              <User className="h-4 w-4" /> Full Name
            </Label>
            <Input
              value={profile.name}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={
                isEditing
                  ? "bg-background focus:ring-2 ring-primary h-11"
                  : "bg-muted/30 border-muted-foreground/20 text-foreground h-11"
              }
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <Input
              value={profile.email}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className={
                isEditing
                  ? "bg-background focus:ring-2 ring-primary h-11"
                  : "bg-muted/30 border-muted-foreground/20 text-foreground h-11"
              }
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold">
              <Phone className="h-4 w-4" /> Phone Number
            </Label>
            <Input
              value={profile.phone}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className={
                isEditing
                  ? "bg-background focus:ring-2 ring-primary h-11"
                  : "bg-muted/30 border-muted-foreground/20 text-foreground h-11"
              }
            />
          </div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-muted-foreground font-semibold">
              <ShieldCheck className="h-4 w-4" /> Account Role
            </Label>
            <Input
              value={isAdmin ? "Administrator" : "Resident"}
              disabled
              className="bg-muted/30 border-muted-foreground/20 text-muted-foreground cursor-not-allowed h-11"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="shadow-sm">
              Save Changes
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
