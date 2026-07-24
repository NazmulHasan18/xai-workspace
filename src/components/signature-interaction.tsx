"use client";

import { motion } from "framer-motion";
import { NodeCluster } from "./signature-interaction/node-cluster";

export function SignatureInteraction() {
  return (
    <section className="border-t border-foreground/8 px-6 py-20 sm:px-10 lg:px-24 lg:py-28">
      <div className="mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-14"
        >
          <div className="flex max-w-176 flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[1.1px] text-accent">SIGNATURE INTERACTION</span>
            <h2 className="max-w-[24rem] text-[34px] leading-[1.05] tracking-[-1.4px] text-foreground sm:text-[40px]">
              Watch your data find its structure.
            </h2>
            <p className="max-w-lg text-[14px] leading-6 text-muted sm:text-[15px]">
              Glide across the canvas and the cluster responds with a calmer, more intentional geometry,
              tightening from dispersion into signal in real time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] tracking-[0.9px] text-muted lg:justify-end">
            <span className="rounded-full border border-foreground/8 bg-surface/70 px-3 py-1 font-mono">
              cursor-aware
            </span>
            <span className="rounded-full border border-foreground/8 bg-surface/70 px-3 py-1 font-mono">
              fluid easing
            </span>
            <span className="rounded-full border border-foreground/8 bg-surface/70 px-3 py-1 font-mono">
              low-latency motion
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative isolate overflow-hidden rounded-4xl border border-foreground/8 bg-[linear-gradient(180deg,rgba(15,19,24,0.94),rgba(10,13,18,0.98))] shadow-[0_30px_120px_rgba(0,0,0,0.22)]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 20% 18%, rgba(79,209,197,0.12), transparent 24%), radial-gradient(circle at 82% 26%, rgba(255,255,255,0.05), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.03), transparent 36%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
              maskImage: "linear-gradient(180deg, rgba(0,0,0,0.75), transparent 92%)",
            }}
          />
          <div
            className="pointer-events-none absolute -left-32 top-1/2 size-80 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(closest-side, rgba(79,209,197,0.09), transparent 72%)",
            }}
          />
          <NodeCluster className="relative h-112 w-full px-5 py-6 sm:h-120 sm:px-8 sm:py-10 lg:h-136 lg:px-10 lg:py-12" />
          <p className="pointer-events-none absolute bottom-4 right-5 font-mono text-[9.5px] tracking-[0.6px] text-muted/90 sm:right-8">
            trigger: cursor position {"->"} reorganizes on hover
          </p>
        </motion.div>
      </div>
    </section>
  );
}
