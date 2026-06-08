"use client";

import React from "react";
import { Smartphone, Tablet, Monitor, Tv } from "lucide-react";

export type Breakpoint = "mobile" | "tablet" | "desktop" | "large";

interface BreakpointSwitcherProps {
  currentBreakpoint: Breakpoint;
  onBreakpointChange: (breakpoint: Breakpoint) => void;
}

const breakpoints = [
  { id: "mobile" as Breakpoint, label: "Mobile", width: 375, icon: Smartphone },
  { id: "tablet" as Breakpoint, label: "Tablet", width: 768, icon: Tablet },
  { id: "desktop" as Breakpoint, label: "Desktop", width: 1200, icon: Monitor },
  { id: "large" as Breakpoint, label: "Large", width: 1920, icon: Tv },
];

export const BreakpointSwitcher = ({ currentBreakpoint, onBreakpointChange }: BreakpointSwitcherProps) => {
  return (
    <div className="flex items-center gap-1">
      {breakpoints.map((bp) => {
        const Icon = bp.icon;
        const isActive = currentBreakpoint === bp.id;
        
        return (
          <button
            key={bp.id}
            onClick={() => onBreakpointChange(bp.id)}
            className={`
              relative p-1.5 rounded-full transition-all
              ${isActive 
                ? 'bg-gray-100 text-gray-800 shadow-sm' 
                : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
            title={`${bp.label} (${bp.width}px)`}
          >
            <Icon size={16} strokeWidth={2} />
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export const getBreakpointWidth = (breakpoint: Breakpoint): number => {
  const bp = breakpoints.find(b => b.id === breakpoint);
  return bp?.width || 1200;
};

export const getBreakpointMaxWidth = (breakpoint: Breakpoint): string => {
  switch (breakpoint) {
    case "mobile":
      return "375px";
    case "tablet":
      return "768px";
    case "desktop":
      return "1200px";
    case "large":
      return "100%";
    default:
      return "1200px";
  }
};
