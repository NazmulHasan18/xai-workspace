"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Anomaly, Severity } from "./types";

const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: "text-[#f2626c] border-[#f2626c]/25 bg-[#f2626c]/10",
  High: "text-[#f2a93c] border-[#f2a93c]/25 bg-[#f2a93c]/10",
  Medium: "text-accent border-accent-15 bg-accent-8",
  Low: "text-muted border-foreground/9 rounded-md bg-foreground/4",
};

export function AnomaliesTable({ rows }: { rows: Anomaly[] }) {
  return (
    <div className="p-2">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-[0.6px] text-muted">
            <th className="px-3 py-2 font-normal">Signal</th>
            <th className="px-3 py-2 font-normal">Severity</th>
            <th className="px-3 py-2 font-normal">Detected</th>
            <th className="px-3 py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.signal}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group rounded-control transition-colors hover:bg-foreground/4"
            >
              <td className="px-3 py-3 text-foreground">
                <span className="flex items-center gap-2">
                  <AlertTriangle size={13} className="text-muted group-hover:text-accent" />
                  {row.signal}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`rounded-control border px-2 py-0.5 font-mono text-[11px] ${SEVERITY_STYLES[row.severity]}`}
                >
                  {row.severity}
                </span>
              </td>
              <td className="px-3 py-3 font-mono text-[12px] text-muted">{row.detected}</td>
              <td className="px-3 py-3 text-muted">{row.status}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
