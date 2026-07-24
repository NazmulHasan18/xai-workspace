"use client";

import { motion, Variants } from "framer-motion";
import { Circle } from "lucide-react";
import type { ListRow, Tone } from "./types";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const TONE_STYLES: Record<Tone, string> = {
  positive: "text-accent border-accent-15 bg-accent-8",
  warning: "text-[#f2a93c] border-[#f2a93c]/25 bg-[#f2a93c]/10",
  neutral: "text-muted border-foreground/9 rounded-md bg-foreground/4",
  negative: "text-[#f2626c] border-[#f2626c]/25 bg-[#f2626c]/10",
};

const DOT_STYLES: Record<Tone, string> = {
  positive: "text-accent",
  warning: "text-[#f2a93c]",
  neutral: "text-muted",
  negative: "text-[#f2626c]",
};

export function ListPage({ title, rows }: { title: string; rows: ListRow[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="rounded-card border border-foreground/9 rounded-md bg-surface/40"
    >
      <div className="border-b border-foreground/9 rounded-md px-5 py-4 text-[13px] text-foreground">
        {title}
      </div>

      <div className="flex flex-col gap-1 p-2">
        {rows.map((row) => (
          <motion.div
            key={row.name}
            variants={rowVariants}
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 rounded-control px-3 py-3 text-[13px] transition-colors hover:bg-foreground/4"
          >
            <Circle size={7} className={`fill-current ${DOT_STYLES[row.tone]}`} strokeWidth={0} />
            <div className="flex flex-col">
              <span className="text-foreground">{row.name}</span>
              <span className="text-[12px] text-muted">{row.detail}</span>
            </div>
            <span className="ml-auto font-mono text-[12px] text-muted">{row.meta}</span>
            <span
              className={`rounded-control border px-2 py-0.5 font-mono text-[11px] ${TONE_STYLES[row.tone]}`}
            >
              {row.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
