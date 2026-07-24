"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function TopBar({ activeItem }: { activeItem: string }) {
  return (
    <div className="flex h-13 items-center justify-between border-b border-foreground/9 px-6">
      <div className="flex items-baseline gap-2 text-[16px]">
        <span className="text-muted">Dashboard /</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeItem}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="text-foreground"
          >
            {activeItem}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-control border border-foreground/9-hover px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-accent-15 hover:text-foreground">
          Last 30 days
          <ChevronDown size={12} />
        </button>
        <div className="flex items-center gap-2 rounded-control border border-accent-15 bg-accent-8 px-3 py-1.5">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-[13px] text-accent">Live</span>
        </div>
      </div>
    </div>
  );
}
