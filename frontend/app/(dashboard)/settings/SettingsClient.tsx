"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { Shield, Bell, Key, Save, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export function SettingsClient() {
  const [settings, setSettings] = useState({
    siteName: "Batima-Gest Platform",
    supportEmail: "support@batima-gest.com",
    maxUploadSize: "50",
  });

  const [modalAction, setModalAction] = useState<{
    title: string;
    description: string;
    actionLabel: string;
    actionVariant: "default" | "destructive" | "outline";
    onConfirm: () => void;
  } | null>(null);

  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  const handleSave = () => {
    toast.success("Platform settings updated successfully");
  };

  const executeAction = (actionTitle: string) => {
    toast.success(`${actionTitle} executed successfully.`);
    setModalAction(null);
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
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto"
      >
        {/* General Settings */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 border-t-4 border-t-primary shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40 h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
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
                  className="bg-card/50 transition-colors focus:ring-primary h-11"
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
                  className="bg-card/50 transition-colors focus:ring-primary h-11"
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
                  className="bg-card/50 transition-colors focus:ring-primary h-11"
                />
              </div>
              <Button onClick={handleSave} className="w-full mt-6 shadow-md group border border-primary/20">
                <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Save Configuration
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
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
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-background/80 hover:shadow-sm transition-all">
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
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-background/80 hover:shadow-sm transition-all">
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
        </motion.div>

        {/* Security & Danger Zone */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="p-8 border border-destructive/20 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-destructive/50 to-orange-500/50" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-destructive/10 rounded-xl">
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
              <div className="p-5 border border-border/40 rounded-2xl bg-card/40 space-y-4 shadow-sm hover:border-primary/40 hover:bg-background/80 transition-colors">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Admin 2FA
                </h3>
                <p className="text-xs text-muted-foreground h-10">
                  Require Two-Factor Authentication for all administrator accounts.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent hover:bg-primary/10"
                  onClick={() => setModalAction({
                    title: "Enforce Administrator 2FA",
                    description: "Are you sure you want to enforce 2FA globally? All admins will be logged out and required to set up an authenticator device on next login.",
                    actionLabel: "Enforce 2FA",
                    actionVariant: "default",
                    onConfirm: () => executeAction("2FA Enforcement")
                  })}
                >
                  Enforce 2FA
                </Button>
              </div>

              <div className="p-5 border border-border/40 rounded-2xl bg-card/40 space-y-4 shadow-sm hover:border-orange-500/40 hover:bg-background/80 transition-colors">
                <h3 className="font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-500" /> Active Sessions
                </h3>
                <p className="text-xs text-muted-foreground h-10">
                  Force logout all currently active users across the entire platform.
                </p>
                <Button
                  variant="outline"
                  className="w-full text-orange-500 border-orange-500/30 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-500/10 bg-transparent"
                  onClick={() => setModalAction({
                    title: "Reset All Active Sessions",
                    description: "This will instantly invalidate all active user tokens. Every user currently online will be disconnected and required to re-authenticate. Proceed?",
                    actionLabel: "Reset Sessions",
                    actionVariant: "outline",
                    onConfirm: () => executeAction("Session Reset")
                  })}
                >
                  Reset All Sessions
                </Button>
              </div>

              <div className="p-5 border border-destructive/30 rounded-2xl bg-destructive/5 space-y-4 shadow-sm hover:shadow-destructive/20 transition-all">
                <h3 className="font-semibold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground h-10">
                  Permanently delete cached user files and temporary storage.
                </p>
                <Button
                  variant="outline" 
                  className="text-destructive border-destructive/40 hover:bg-destructive text-white w-full shadow-lg hover:shadow-destructive/25 transition-all"
                  onClick={() => setModalAction({
                    title: "Purge Temporary Data",
                    description: "WARNING: This entails a permanent deletion of cached assets, temp files, and orphaned user uploads. This action cannot be undone.",
                    actionLabel: "Purge Data",
                    actionVariant: "destructive",
                    onConfirm: () => executeAction("Data Purge")
                  })}
                >
                  Purge Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Confirmation Modal Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {modalAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-card text-card-foreground w-full max-w-md rounded-3xl shadow-2xl p-7 border border-border/50 relative"
              >
                <button 
                  onClick={() => setModalAction(null)}
                  className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold pr-8">{modalAction.title}</h2>
                <div className="py-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {modalAction.description}
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setModalAction(null)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button 
                    variant={modalAction.actionVariant === "outline" ? "default" : modalAction.actionVariant} 
                    onClick={modalAction.onConfirm}
                    className="rounded-xl shadow-md"
                  >
                    {modalAction.actionLabel}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}


