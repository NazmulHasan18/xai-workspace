import type { LucideIcon } from "lucide-react";

export type Tone = "positive" | "warning" | "neutral" | "negative";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface Metric {
  label: string;
  value: string;
  unit: string;
  delta: string;
  up: boolean;
  spark: number[];
}

export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface Anomaly {
  signal: string;
  severity: Severity;
  detected: string;
  status: string;
}

export interface AutomationEvent {
  event: string;
  target: string;
  time: string;
  status: "Completed" | "Failed";
}

/** A generic row used by every non-chart sidebar page (Pipelines, Data Sources, ...) */
export interface ListRow {
  name: string;
  detail: string;
  status: string;
  tone: Tone;
  meta: string;
}

export interface Series {
  label: string;
  color: string;
  values: number[];
}
