"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { AutomationEvent } from "./types";

export function AutomationEventsList({ rows }: { rows: AutomationEvent[] }) {
  return (
    <div className="flex flex-col gap-1 p-3">
      {rows.map((row, i) => (
        <motion.div
          key={row.event}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-center gap-3 rounded-control px-3 py-3 text-[13px] transition-colors hover:bg-foreground/4"
        >
          <Zap size={14} className="text-accent" />
          <span className="text-foreground">{row.event}</span>
          <span className="font-mono text-[12px] text-muted">{row.target}</span>
          <span className="ml-auto font-mono text-[12px] text-muted">{row.time}</span>
          <span
            className={`rounded-control border px-2 py-0.5 font-mono text-[11px] ${
              row.status === "Completed"
                ? "border-accent-15 bg-accent-8 text-accent"
                : "border-[#f2626c]/25 bg-[#f2626c]/10 text-[#f2626c]"
            }`}
          >
            {row.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
