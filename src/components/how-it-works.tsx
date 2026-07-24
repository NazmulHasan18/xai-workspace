"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Database, BrainCircuit, Zap, type LucideIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Stage = {
  tab: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  percentTarget: number;
  metricLabel: string;
};

const STAGES: Stage[] = [
  {
    tab: "01 — INGEST",
    icon: Database,
    label: "INGEST DATA",
    title: "Connect any source",
    description:
      "Stream structured and unstructured data from APIs, databases, and event pipelines in real time.",
    percentTarget: 100,
    metricLabel: "Throughput",
  },
  {
    tab: "02 — ANALYZE",
    icon: BrainCircuit,
    label: "ANALYZE WITH AI",
    title: "Surface hidden patterns",
    description:
      "Multi-model inference runs continuously, identifying anomalies, correlations, and emergent signals.",
    percentTarget: 67,
    metricLabel: "Confidence",
  },
  {
    tab: "03 — GENERATE",
    icon: Zap,
    label: "GENERATE INSIGHT",
    title: "Decisions at the speed of data",
    description:
      "Structured intelligence delivered as actionable outputs — alerts, forecasts, and recommended actions.",
    percentTarget: 94,
    metricLabel: "Precision",
  },
];

const NODE_X = [140, 600, 1060];
const TRACE_PATH = `M${NODE_X[0]},60 L360,60 L360,26 L${NODE_X[1] - 90},26 L${NODE_X[1] - 90},60 L${NODE_X[1]},60 L820,60 L820,26 L${NODE_X[2] - 90},26 L${NODE_X[2] - 90},60 L${NODE_X[2]},60`;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pctRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const iconWrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pathTraceRef = useRef<SVGPathElement | null>(null);
  const pathGhostRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const trace = pathTraceRef.current;
      const totalLength = trace ? trace.getTotalLength() : 0;

      gsap.set(cardRefs.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0.35,
      });
      gsap.set(nodeRefs.current, { scale: 0, transformOrigin: "50% 50%" });
      if (trace) gsap.set(trace, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

      if (reduceMotion) {
        gsap.set(cardRefs.current, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
        gsap.set(nodeRefs.current, { scale: 1 });
        if (trace) gsap.set(trace, { strokeDashoffset: 0 });
        tabRefs.current.forEach((t, i) => t?.classList.toggle("is-active", i === 1));
        return;
      }

      const setActive = (index: number) => {
        tabRefs.current.forEach((t, i) => t?.classList.toggle("is-active", i === index));
      };

      const revealStage = (i: number, localProgress: number) => {
        const card = cardRefs.current[i];
        const bar = barRefs.current[i];
        const pct = pctRefs.current[i];
        const node = nodeRefs.current[i];
        const clip = gsap.utils.clamp(0, 100, localProgress * 100);
        gsap.set(card, {
          clipPath: `inset(0 ${100 - clip}% 0 0)`,
          opacity: gsap.utils.mapRange(0, 30, 0.35, 1, clip),
        });
        gsap.set(node, { scale: gsap.utils.clamp(0, 1, localProgress * 1.6) });
        const value = Math.round(STAGES[i].percentTarget * gsap.utils.clamp(0, 1, localProgress));
        if (bar) bar.style.width = `${value}%`;
        if (pct) pct.textContent = `${value}%`;
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            const segment = 1 / STAGES.length;

            if (trace) trace.style.strokeDashoffset = String(totalLength * (1 - p));
            if (dotRef.current && trace && totalLength) {
              const point = trace.getPointAtLength(totalLength * p);
              gsap.set(dotRef.current, { attr: { cx: point.x, cy: point.y } });
            }

            STAGES.forEach((_, i) => {
              const local = gsap.utils.clamp(0, 1, (p - i * segment) / segment + 0.15);
              revealStage(i, local);
            });

            setActive(Math.min(STAGES.length - 1, Math.floor(p * STAGES.length)));
          },
        });
        return () => st.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set(cardRefs.current, { clipPath: "inset(0 0 0 0)" });
        const triggers = STAGES.map((_, i) => {
          const card = cardRefs.current[i];
          return ScrollTrigger.create({
            trigger: card,
            start: "top 78%",
            end: "top 40%",
            scrub: 0.5,
            onUpdate: (self) => {
              revealStage(i, self.progress);
              if (self.progress > 0.5) setActive(i);
            },
            onEnter: () => gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" }),
          });
        });
        gsap.set(cardRefs.current, { y: 24 });
        return () => triggers.forEach((t) => t.kill());
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bindHover = (i: number) => ({
    onMouseEnter: () => {
      gsap.to(iconWrapRefs.current[i], { rotate: 8, scale: 1.08, duration: 0.35, ease: "power2.out" });
      gsap.to(cardRefs.current[i], {
        y: -4,
        borderColor: "rgba(79,209,197,0.35)",
        duration: 0.35,
        ease: "power2.out",
      });
    },
    onMouseLeave: () => {
      gsap.to(iconWrapRefs.current[i], { rotate: 0, scale: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(cardRefs.current[i], {
        y: 0,
        borderColor: "rgba(35,42,52,1)",
        duration: 0.35,
        ease: "power2.out",
      });
    },
    onFocus: () => {
      gsap.to(iconWrapRefs.current[i], { rotate: 8, scale: 1.08, duration: 0.25, ease: "power2.out" });
    },
    onBlur: () => {
      gsap.to(iconWrapRefs.current[i], { rotate: 0, scale: 1, duration: 0.25, ease: "power2.out" });
    },
  });

  return (
    <section ref={sectionRef} className="relative border-t border-surface-raised bg-ink px-6 py-24 md:px-24">
      <div className="mx-auto flex h-full max-w-300 flex-col justify-center gap-3 pb-2">
        <span className="font-mono text-[11px] tracking-[1.1px] text-accent">HOW IT WORKS</span>
        <h2 className="text-[32px] leading-[1.15] tracking-[-1.2px] text-foreground md:text-[38px]">
          Three stages. One continuous signal.
        </h2>

        <div className="mb-8 mt-6 flex gap-1 border-b border-surface-raised">
          {STAGES.map((stage, i) => (
            <div
              key={stage.tab}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className="border-b-2 border-transparent px-3 pb-4 pt-2 font-mono text-[10px] tracking-[0.88px] text-muted transition-colors duration-300 [&.is-active]:border-accent [&.is-active]:text-accent md:px-5 md:text-[11px]"
            >
              {stage.tab}
            </div>
          ))}
        </div>

        <div className="relative">
          {" "}
          ,,,
          <svg
            className="pointer-events-none absolute inset-x-0 -top-2 hidden h-27.5 w-full lg:block"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path d={TRACE_PATH} stroke="#232A34" strokeWidth={1.5} ref={pathGhostRef} />
            <path d={TRACE_PATH} stroke="#4FD1C5" strokeWidth={1.5} ref={pathTraceRef} />
            {NODE_X.map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={60}
                r={5}
                fill="#0E1116"
                stroke="#4FD1C5"
                strokeWidth={1.5}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
              />
            ))}
            <circle
              ref={dotRef}
              cx={NODE_X[0]}
              cy={60}
              r={4}
              fill="#4FD1C5"
              style={{ filter: "drop-shadow(0 0 6px #4FD1C5)" }}
            />
          </svg>
          <div className="flex flex-col items-stretch gap-4 pt-2 lg:flex-row lg:gap-6 lg:pt-16">
            {STAGES.map((stage, i) => (
              <div
                key={stage.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                tabIndex={0}
                role="group"
                aria-label={stage.title}
                {...bindHover(i)}
                className="flex flex-1 flex-col gap-2.5 rounded-[10px] border border-surface-raised bg-surface p-7 outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <div
                  ref={(el) => {
                    iconWrapRefs.current[i] = el;
                  }}
                  className="flex size-10 items-center justify-center rounded-lg border border-surface-raised bg-surface-raised/40 text-foreground"
                >
                  <stage.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="pt-2 font-mono text-[10px] tracking-[1px] text-muted">{stage.label}</span>
                <h3 className="text-[18px] leading-[1.35] tracking-[-0.4px] text-foreground">
                  {stage.title}
                </h3>
                <p className="text-[12.6px] leading-[1.55] text-muted">{stage.description}</p>

                <div className="flex flex-col gap-1.5 pt-4">
                  <div className="h-0.5 w-full rounded-full bg-foreground/6">
                    <div
                      ref={(el) => {
                        barRefs.current[i] = el;
                      }}
                      className="h-0.5 rounded-full bg-accent"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-muted">{stage.metricLabel}</span>
                    <span
                      ref={(el) => {
                        pctRefs.current[i] = el;
                      }}
                      className="text-accent"
                    >
                      0%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
