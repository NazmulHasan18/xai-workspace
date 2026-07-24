"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./dashboard-preview/side-bar";
import { TopBar } from "./dashboard-preview/top-bar";
import { OverviewPage } from "./dashboard-preview/overview-page";
import { ListPage } from "./dashboard-preview/list-page";
import { PAGE_ROWS } from "./dashboard-preview/dashboard-data";

// Overview and Intelligence both land on the metrics + chart page (matches the reference layout).
// Everything else in the sidebar gets its own list page, driven by PAGE_ROWS in data.ts.
const CHART_PAGES = new Set(["Overview", "Intelligence"]);

export function DashboardPreview() {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <section className="px-24 py-24">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-3 pb-12">
          <span className="font-mono text-[11px] tracking-[1.1px] text-accent">INTELLIGENCE WORKSPACE</span>
          <h2 className="max-w-140 text-[38px] leading-13 tracking-[-1.2px] text-foreground">
            Your command center for every signal.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-card border border-foreground/9 rounded-md shadow-2xl"
        >
          {/* browser chrome bar */}
          <div className="flex h-10 items-center gap-4 border-b border-foreground/9 rounded-md bg-surface px-4">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
              <span className="size-2.5 rounded-full bg-foreground/10" />
            </div>
            <div className="flex flex-1 justify-center">
              <div className="rounded-control border border-foreground/9 rounded-md bg-ink/40 px-3 py-1 font-mono text-[12px] text-muted">
                workspace.xai.dev/intelligence
              </div>
            </div>
          </div>

          <div className="flex h-130">
            <Sidebar activeItem={activeItem} onSelect={setActiveItem} />

            <div className="flex flex-1 flex-col">
              <TopBar activeItem={activeItem} />

              <div
                className="flex-1 overflow-auto p-6"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(79,209,197,0.05), transparent 60%)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {CHART_PAGES.has(activeItem) ? (
                      <OverviewPage />
                    ) : (
                      <ListPage title={activeItem} rows={PAGE_ROWS[activeItem] ?? []} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
