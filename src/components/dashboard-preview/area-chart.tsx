"use client";

import { motion } from "framer-motion";
import type { Series } from "./types";

const WIDTH = 600;
const HEIGHT = 160;

function toLinePath(values: number[]) {
  const step = WIDTH / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = HEIGHT - (v / 100) * HEIGHT;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function toAreaPath(values: number[]) {
  const step = WIDTH / (values.length - 1);
  const line = values
    .map((v, i) => {
      const x = i * step;
      const y = HEIGHT - (v / 100) * HEIGHT;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
}

interface AreaChartProps {
  series: Series[];
  months: string[];
}

export function AreaChart({ series, months }: AreaChartProps) {
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="overflow-visible">
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.label}
              id={`fill-${s.label.replace(/\s+/g, "-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {series.map((s, i) => (
          <motion.path
            key={`area-${s.label}`}
            d={toAreaPath(s.values)}
            fill={`url(#fill-${s.label.replace(/\s+/g, "-")})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
          />
        ))}

        {series.map((s, i) => (
          <motion.path
            key={`line-${s.label}`}
            d={toLinePath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>

      <div className="flex justify-between pt-3 font-mono text-[11px] text-muted">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
