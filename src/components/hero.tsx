"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ParticleField } from "./particle-field";

const STATS = [
  { value: "2.4B", label: "events / day" },
  { value: "99.97%", label: "uptime SLA" },
  { value: "<80ms", label: "p99 latency" },
];

// One orchestrated page-load moment, not scattered effects: the text column
// reveals top-to-bottom in a single stagger, then goes still.
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto flex max-w-content items-center justify-center gap-34 px-24 pb-16 pt-34.25">
      <motion.div
        className="flex w-130 max-w-130 flex-col items-start gap-5"
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "visible"}
      >
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-md border border-accent/15 bg-accent/8 px-3.25 py-1.5"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] tracking-[0.88px] text-accent">INTELLIGENCE LAYER v2.4</span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-[52px] font-normal leading-14.75 tracking-[-2.24px] text-foreground"
        >
          Raw data becomes
          <br />
          <span className="text-accent">structured</span>
          <br />
          <span className="text-accent">intelligence.</span>
        </motion.h1>

        <motion.p variants={item} className="max-w-105 text-base leading-[29.7px] text-muted">
          Xai transforms the noise of your data estate into decisions your team can act on — automatically,
          continuously, at scale.
        </motion.p>

        <motion.div variants={item} className="flex items-center gap-3 py-5">
          <Link
            href="#"
            className="rounded-sm bg-accent px-6 py-3 text-sm font-medium tracking-[-0.14px] text-ink transition-opacity hover:opacity-90"
          >
            Request access
          </Link>
          <Link
            href="#"
            className="rounded-sm border border-muted hover:border-foreground px-6.25 py-3.25 text-sm text-muted transition-colors hover:text-foreground"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex w-full gap-8 border-t border-foreground/9 pt-8.25">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-xl tracking-[-0.6px] text-foreground">{stat.value}</span>
              <span className="font-mono text-[11px] text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="relative flex h-95 w-148 shrink-0 items-center justify-center">
        <div
          className="absolute -inset-10 rounded-full opacity-60"
          style={{
            background: "radial-gradient(closest-side, rgba(79,209,197,0.06), transparent 70%)",
          }}
        />
        <ParticleField className="relative h-full w-full" rows={9} cols={14} />
        <p className="absolute -bottom-6 w-full text-center font-mono text-[9.5px] text-muted">
          animates: dust converges into one signal current on scroll · bends toward your cursor
        </p>
      </div>
    </section>
  );
}
