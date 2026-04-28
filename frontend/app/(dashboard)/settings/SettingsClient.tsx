"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { Shield, Bell, Key, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function SettingsClient() {
  const [settings, setSettings] = useState({
    siteName: "Batima-Gest Platform",
    supportEmail: "support@batima-gest.com",
    maxUploadSize: "50",
  });

  const handleSave = () => {
    toast.success("Platform settings updated successfully");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
      {/* General Settings */}
      <Card className="p-8 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">General Settings</h2>
              <p className="text-sm text-muted-foreground">
                Core platform configuration
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 relative group">
            <Label className="text-muted-foreground font-semibold">
              Platform Name
            </Label>
            <Input
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="bg-card transition-colors group-hover:border-primary"
            />
          </div>
          <div className="space-y-3 relative group">
            <Label className="text-muted-foreground font-semibold">
              Support Email
            </Label>
            <Input
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              className="bg-card transition-colors group-hover:border-primary"
            />
          </div>
          <div className="space-y-3 relative group">
            <Label className="text-muted-foreground font-semibold">
              Max Upload Size (MB)
            </Label>
            <Input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) =>
                setSettings({ ...settings, maxUploadSize: e.target.value })
              }
              className="bg-card transition-colors group-hover:border-primary"
            />
          </div>
          <Button onClick={handleSave} className="w-full mt-6 shadow-sm group">
            <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Save Configuration
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <Bell className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Notifications Defaults</h2>
            <p className="text-sm text-muted-foreground">
              Global user communications
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
            <div>
              <p className="font-semibold">Maintenance Updates</p>
              <p className="text-xs text-muted-foreground mt-1">
                Email users on status change
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-background transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
            <div>
              <p className="font-semibold">New Announcements</p>
              <p className="text-xs text-muted-foreground mt-1">
                App push notifications
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-background transition-transform" />
            </button>
          </div>
        </div>
      </Card>

      {/* Security & Danger Zone */}
      <Card className="p-8 md:col-span-2 border border-destructive/20 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-destructive/50 to-orange-500/50" />
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-destructive/10 rounded-lg">
            <Key className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Security & Access</h2>
            <p className="text-sm text-muted-foreground">
              Manage platform security policies
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-xl bg-card space-y-4 shadow-sm hover:border-border transition-colors">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Admin 2FA
            </h3>
            <p className="text-xs text-muted-foreground">
              Require Two-Factor Authentication for all administrator accounts.
            </p>
            <Button variant="outline" className="w-full">
              Enforce 2FA
            </Button>
          </div>

          <div className="p-4 border rounded-xl bg-card space-y-4 shadow-sm hover:border-border transition-colors">
            <h3 className="font-semibold flex items-center gap-2">
              <Key className="w-4 h-4 text-orange-500" /> Active Sessions
            </h3>
            <p className="text-xs text-muted-foreground">
              Force logout all currently active users across the entire
              platform.
            </p>
            <Button
              variant="outline"
              className="w-full text-orange-500 hover:text-orange-600">
              Reset All Sessions
            </Button>
          </div>

          <div className="p-4 border border-destructive/30 rounded-xl bg-destructive/5 space-y-4 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">
              Permanently delete cached user files and temporary storage.
            </p>
            <Button
              variant="outline" className="text-destructive border-border/60 hover:bg-destructive/10 w-full shadow-lg hover:shadow-destructive/25 transition-shadow">
              Purge Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


