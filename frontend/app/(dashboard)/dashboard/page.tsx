"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { motion } from "framer-motion";
import { Megaphone, Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock role read
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// MOCK DATA
const mockAnnouncements = [
  {
    id: "1",
    title: "Elevator Maintenance Scheduled",
    content: "Elevator will be under maintenance on April 22nd from 8am to 12pm. Please use the stairs.",
    date: "Today, 09:00 AM",
    urgent: true
  },
  {
    id: "2",
    title: "Water Shutoff Notice",
    content: "Temporary water shutoff for building B to repair main pipe. Will last around 2 hours.",
    date: "Yesterday, 14:30 PM",
    urgent: false
  }
];

const mockMaintenance = [
  {
    id: "m1",
    title: "Leaking Faucet in Kitchen",
    status: "In Progress",
    date: "2026-04-18T10:00:00Z"
  },
  {
    id: "m2",
    title: "AC Unit Output is Weak",
    status: "Resolved",
    date: "2026-04-10T12:00:00Z"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const roleCookie = getCookie("mockRole") || "Resident";
    if (roleCookie === "Admin") {
      router.push("/admin");
    } else {
      setRole(roleCookie);
    }
  }, [router]);

  if (!role) return null;

  const urgentAnnouncements = mockAnnouncements.filter(a => a.urgent).length;
  const activeRequests = mockMaintenance.filter(m => m.status !== "Resolved").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 space-y-8 container mx-auto px-4 sm:px-6 md:px-8 py-8"
    >
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl tracking-tight font-bold text-foreground">Welcome back, {role}</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening in your building today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="p-6 flex flex-col justify-center space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Unread Notices</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">{urgentAnnouncements}</p>
                  {urgentAnnouncements > 0 && <span className="text-sm font-medium text-destructive">Urgent attention needed</span>}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="p-6 flex flex-col justify-center space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-xl border-border/40">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Active Requests</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">{activeRequests}</p>
                  <span className="text-sm font-medium text-amber-500">In progress</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div variants={itemVariants} className="flex flex-col">
          <Card className="flex flex-col border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-md h-full">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">Community Board</h3>
              </div>
              <div className="space-y-4 flex-1">
                {mockAnnouncements.map((notice, i) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-2xl border border-border/30 bg-background/50 hover:bg-background/80 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 mt-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-sm leading-none">{notice.title}</h4>
                          {notice.urgent && (
                            <span className="inline-flex items-center rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive ring-1 ring-inset ring-destructive/20 uppercase tracking-widest">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">{notice.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col">
          <Card className="flex flex-col border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-md h-full">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">Your Requests</h3>
              </div>
              <div className="space-y-4 flex-1">
                {mockMaintenance.map((item, i) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-5 rounded-2xl border border-border/30 bg-background/50 hover:bg-background/80 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        item.status === 'Resolved' ? 'bg-green-500/15 text-green-500' : 'bg-amber-500/15 text-amber-500'
                      }`}>
                        {item.status === 'Resolved' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-medium flex items-center space-x-1">
                          <Clock className="h-3 w-3 inline mr-1 opacity-70" />
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      item.status === 'Resolved' 
                        ? 'bg-green-500/10 text-green-600 ring-1 ring-inset ring-green-500/20' 
                        : 'bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
