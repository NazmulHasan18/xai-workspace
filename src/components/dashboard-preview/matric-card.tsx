"use client";

import { motion, Variants } from "framer-motion";
import { Globe } from "lucide-react";
import type { Metric } from "./types";
import { SparkLine } from "./spark-line";

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <motion.div
      variants={riseVariants}
      whileHover={{ y: -3, borderColor: "rgba(79,209,197,0.25)" }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className="rounded-card border border-foreground/9 rounded-md bg-surface/40 p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted">{metric.label}</span>
        <Globe size={14} className="text-muted" />
      </div>

      <div className="flex items-end justify-between pt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-[32px] leading-none text-foreground">{metric.value}</span>
          <span className="text-[16px] text-foreground">{metric.unit}</span>
        </div>
        <SparkLine values={metric.spark} />
      </div>

      <div className="flex items-center gap-1 pt-4 text-[12px]">
        <span className="text-accent">{metric.delta}</span>
      </div>
    </motion.div>
  );
}
