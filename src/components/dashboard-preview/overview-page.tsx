"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  METRICS,
  MONTHS,
  PROCESSED_SIGNALS,
  RAW_INPUT,
  ANOMALIES,
  AUTOMATION_EVENTS,
} from "./dashboard-data";
import { MetricCard, riseVariants } from "./matric-card";
import { AreaChart } from "./area-chart";
import { AnomaliesTable } from "./anomalie-stable";
import { AutomationEventsList } from "./automation-event-list";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const panelVariants: Variants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

const CHART_TABS = ["Signal Volume", "Anomalies", "Automation Events"] as const;
type ChartTab = (typeof CHART_TABS)[number];

export function OverviewPage() {
  const [activeTab, setActiveTab] = useState<ChartTab>("Signal Volume");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div className="mb-6 grid grid-cols-3 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </div>

      <motion.div
        variants={riseVariants}
        className="rounded-card border border-foreground/9 rounded-md bg-surface/40"
      >
        <div className="flex border-b border-foreground/9 rounded-md px-2">
          {CHART_TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-4 text-[13px] transition-colors duration-150 ${
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {tab}
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Signal Volume" && (
            <motion.div
              key="signal-volume"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="flex items-center gap-6 border-b border-foreground/9 rounded-md px-5 py-3">
                <div className="flex items-center gap-2.5 text-[13px] text-foreground">
                  <span className="h-[1.5px] w-5 bg-accent" />
                  Processed signals
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-muted">
                  <span className="h-[1.5px] w-5 bg-foreground/30" />
                  Raw input
                </div>
              </div>
              <div className="p-5">
                <AreaChart
                  months={MONTHS}
                  series={[
                    { label: "Processed signals", color: "var(--color-accent)", values: PROCESSED_SIGNALS },
                    { label: "Raw input", color: "var(--color-muted)", values: RAW_INPUT },
                  ]}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "Anomalies" && (
            <motion.div key="anomalies" variants={panelVariants} initial="enter" animate="center" exit="exit">
              <AnomaliesTable rows={ANOMALIES} />
            </motion.div>
          )}

          {activeTab === "Automation Events" && (
            <motion.div
              key="automation-events"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <AutomationEventsList rows={AUTOMATION_EVENTS} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
