"use client";

import { motion } from "framer-motion";

export function SidebarClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col w-64 bg-card border-r border-border h-full shadow-lg text-foreground backdrop-blur-3xl relative z-40"
    >
      {children}
    </motion.div>
  );
}
