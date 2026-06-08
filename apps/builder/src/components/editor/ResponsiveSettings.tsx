"use client";

import React from "react";
import { Smartphone, Tablet, Monitor, Tv, Eye, EyeOff } from "lucide-react";
import { Breakpoint } from "./BreakpointSwitcher";

interface ResponsiveSettingsProps {
  currentBreakpoint: Breakpoint;
  onBreakpointChange: (breakpoint: Breakpoint) => void;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  onHideChange?: (breakpoint: Breakpoint, hidden: boolean) => void;
}

const breakpoints = [
  { id: "mobile" as Breakpoint, label: "Mobile", icon: Smartphone, width: "375px" },
  { id: "tablet" as Breakpoint, label: "Tablet", icon: Tablet, width: "768px" },
  { id: "desktop" as Breakpoint, label: "Desktop", icon: Monitor, width: "1200px" },
  { id: "large" as Breakpoint, label: "Large", icon: Tv, width: "1920px" },
];

export const ResponsiveSettings = ({
  currentBreakpoint,
  onBreakpointChange,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  onHideChange,
}: ResponsiveSettingsProps) => {
  const getHiddenState = (bp: Breakpoint) => {
    switch (bp) {
      case "mobile":
        return hideOnMobile;
      case "tablet":
        return hideOnTablet;
      case "desktop":
      case "large":
        return hideOnDesktop;
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          Edit For Breakpoint
        </label>
        <div className="grid grid-cols-2 gap-2">
          {breakpoints.map((bp) => {
            const Icon = bp.icon;
            const isActive = currentBreakpoint === bp.id;
            const isHidden = getHiddenState(bp.id);

            return (
              <button
                key={bp.id}
                onClick={() => onBreakpointChange(bp.id)}
                className={`
                  relative p-3 rounded-lg border-2 transition-all text-left
                  ${isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                  ${isHidden ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-600'} />
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                    {bp.label}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">{bp.width}</div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {onHideChange && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Visibility
          </label>
          <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3">
            {breakpoints.slice(0, 3).map((bp) => {
              const Icon = bp.icon;
              const isHidden = getHiddenState(bp.id);

              return (
                <div key={bp.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-700">{bp.label}</span>
                  </div>
                  <button
                    onClick={() => onHideChange(bp.id, !isHidden)}
                    className={`
                      p-1.5 rounded transition-all
                      ${isHidden
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }
                    `}
                    title={isHidden ? 'Hidden' : 'Visible'}
                  >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Hide this component on specific devices
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-[10px] text-blue-800 leading-relaxed">
          <strong>Tip:</strong> Switch between breakpoints to customize styles for each device size. Changes apply only to the selected breakpoint.
        </p>
      </div>
    </div>
  );
};
