"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNodeCluster } from "./use-node-cluster";

interface NodeClusterProps {
  className?: string;
}

export function NodeCluster({ className }: NodeClusterProps) {
  const { containerRef, cursor } = useNodeCluster();

  return (
    <div className={`relative touch-none select-none overflow-hidden rounded-md ${className ?? ""}`}>
      <div ref={containerRef} className="h-full rounded-md">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 42%, rgba(79,209,197,0.08), transparent 18%), radial-gradient(circle at 50% 52%, rgba(255,255,255,0.05), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 24%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5" />

        <AnimatePresence>
          {cursor.active && (
            <motion.div
              key="signal-lock"
              initial={{ opacity: 0, scale: 0.82, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/25 bg-surface/85 px-3 py-1 font-mono text-[9px] tracking-[0.65px] text-accent shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
              style={{ left: cursor.x + 16, top: cursor.y - 12 }}
            >
              <motion.span
                className="size-1 rounded-full bg-accent"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              />
              signal locked
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
