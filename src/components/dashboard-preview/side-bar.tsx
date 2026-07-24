"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SIDEBAR_ITEMS } from "./dashboard-data";

interface SidebarProps {
  activeItem: string;
  onSelect: (label: string) => void;
}

export function Sidebar({ activeItem, onSelect }: SidebarProps) {
  return (
    <div className="flex w-60 shrink-0 flex-col border-r border-foreground/9">
      <div className="p-4">
        <div className="flex items-center gap-2.5 rounded-md bg-surface p-2.5 transition-colors hover:bg-surface-raised">
          <div className="flex size-6 items-center justify-center rounded-md bg-foreground/10 font-mono text-xs text-foreground">
            X
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] text-foreground">Acme Corp</span>
            <span className="text-[15px] text-muted">Intelligence Pro</span>
          </div>
          <ChevronDown size={14} className="ml-auto text-muted" />
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.label === activeItem;
          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] transition-colors duration-150 ${
                isActive ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-md bg-foreground/6"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-3">
                <item.icon
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-150 group-hover:scale-110"
                />
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <span className="relative ml-auto rounded-md border border-accent-15 bg-accent-8 px-2 py-0.5 font-mono text-[10px] text-accent">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-foreground/9 p-4 transition-colors hover:bg-surface">
        <div className="flex size-7 items-center justify-center rounded-full bg-foreground/10 font-mono text-xs text-foreground">
          JD
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] text-foreground">Jordan D.</span>
          <span className="text-[12px] text-muted">admin</span>
        </div>
      </div>
    </div>
  );
}
