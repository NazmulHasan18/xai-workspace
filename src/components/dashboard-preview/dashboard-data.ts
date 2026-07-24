import { LayoutGrid, Boxes, GitBranch, Database as DatabaseIcon, Workflow, FileBarChart } from "lucide-react";
import type { Anomaly, AutomationEvent, ListRow, Metric, NavItem } from "./types";

export const SIDEBAR_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Intelligence", icon: Boxes, badge: "NEW" },
  { label: "Pipelines", icon: GitBranch },
  { label: "Data Sources", icon: DatabaseIcon },
  { label: "Automations", icon: Workflow },
  { label: "Reports", icon: FileBarChart },
];

export const METRICS: Metric[] = [
  {
    label: "signals / hour",
    value: "94.2",
    unit: "K",
    delta: "+12.4%",
    up: true,
    spark: [40, 44, 41, 50, 55, 52, 60, 58, 65, 70, 68, 76],
  },
  {
    label: "inference runs",
    value: "1.8",
    unit: "M",
    delta: "+8.1%",
    up: true,
    spark: [50, 48, 53, 51, 58, 56, 62, 60, 66, 64, 70, 74],
  },
  {
    label: "avg. latency",
    value: "61",
    unit: "ms",
    delta: "-18%",
    up: false,
    spark: [70, 68, 66, 69, 63, 65, 60, 58, 55, 57, 52, 50],
  },
];

export const MONTHS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];

// Overview chart — "processed signals" vs "raw input", 0-100 scale
export const PROCESSED_SIGNALS = [30, 38, 34, 50, 45, 60, 55, 72, 66, 82, 78, 92];
export const RAW_INPUT = [22, 26, 24, 34, 30, 40, 36, 48, 44, 54, 50, 60];

export const ANOMALIES: Anomaly[] = [
  { signal: "Auth latency spike", severity: "Critical", detected: "2m ago", status: "Investigating" },
  { signal: "Payment webhook drop", severity: "High", detected: "14m ago", status: "Resolved" },
  { signal: "Model drift — pricing", severity: "Medium", detected: "1h ago", status: "Monitoring" },
  { signal: "Queue backlog — EU", severity: "Low", detected: "3h ago", status: "Resolved" },
];

export const AUTOMATION_EVENTS: AutomationEvent[] = [
  { event: "Escalation rule triggered", target: "on-call/platform", time: "09:42", status: "Completed" },
  { event: "Auto-remediation applied", target: "pipeline/ingest-03", time: "09:31", status: "Completed" },
  { event: "Threshold recalibrated", target: "model/churn-v4", time: "08:57", status: "Completed" },
  { event: "Retry policy engaged", target: "connector/salesforce", time: "08:12", status: "Failed" },
];

// Content shown when the sidebar item has no chart — a simple, real-feeling list page.
export const PAGE_ROWS: Record<string, ListRow[]> = {
  Pipelines: [
    {
      name: "ingest-orders",
      detail: "Kafka → Warehouse",
      status: "Healthy",
      tone: "positive",
      meta: "12ms lag",
    },
    {
      name: "ingest-events",
      detail: "HTTP → Lakehouse",
      status: "Degraded",
      tone: "warning",
      meta: "1.2s lag",
    },
    { name: "model-scoring", detail: "Batch → Postgres", status: "Healthy", tone: "positive", meta: "340ms" },
    { name: "reverse-etl", detail: "Warehouse → Salesforce", status: "Paused", tone: "neutral", meta: "—" },
  ],
  "Data Sources": [
    {
      name: "Postgres — primary",
      detail: "Production database",
      status: "Connected",
      tone: "positive",
      meta: "synced 2m ago",
    },
    { name: "Salesforce", detail: "CRM", status: "Connected", tone: "positive", meta: "synced 8m ago" },
    {
      name: "Segment",
      detail: "Event stream",
      status: "Reauth needed",
      tone: "warning",
      meta: "expires in 2d",
    },
    {
      name: "S3 — cold storage",
      detail: "Archive",
      status: "Connected",
      tone: "positive",
      meta: "synced 1h ago",
    },
  ],
  Automations: [
    {
      name: "Escalate critical anomalies",
      detail: "PagerDuty → on-call",
      status: "Active",
      tone: "positive",
      meta: "42 runs today",
    },
    {
      name: "Auto-remediate ingest failures",
      detail: "Retry with backoff",
      status: "Active",
      tone: "positive",
      meta: "9 runs today",
    },
    {
      name: "Weekly model recalibration",
      detail: "Sunday 02:00 UTC",
      status: "Scheduled",
      tone: "neutral",
      meta: "next in 3d",
    },
    {
      name: "Slack digest — anomalies",
      detail: "#platform-alerts",
      status: "Paused",
      tone: "neutral",
      meta: "—",
    },
  ],
  Reports: [
    {
      name: "Weekly Intelligence Summary",
      detail: "Auto-generated",
      status: "Sent",
      tone: "positive",
      meta: "Mon 08:00",
    },
    {
      name: "Anomaly Postmortem — Jul 21",
      detail: "Auth latency spike",
      status: "Draft",
      tone: "neutral",
      meta: "—",
    },
    {
      name: "Q3 Signal Volume Report",
      detail: "Board deck",
      status: "Sent",
      tone: "positive",
      meta: "Jul 1",
    },
    {
      name: "Automation ROI",
      detail: "Finance request",
      status: "In review",
      tone: "warning",
      meta: "due Fri",
    },
  ],
};
