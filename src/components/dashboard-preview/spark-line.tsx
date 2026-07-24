"use client";

import { motion } from "framer-motion";

function toPath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

interface SparkLineProps {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function SparkLine({
  values,
  color = "var(--color-accent)",
  width = 72,
  height = 24,
}: SparkLineProps) {
  const d = toPath(values, width, height - 2);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
