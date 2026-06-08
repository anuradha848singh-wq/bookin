"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Database, Calendar } from "lucide-react";

export const ConnectorSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">API Integration</label>
        <div className="p-3 bg-[#F9FAFB] border border-[#E5E5E5] rounded text-[11px] text-gray-600">
          This component is connected to your backend services. Real data will be populated when the site is published.
        </div>
      </div>
    </div>
  );
};

export const BookingWidgetConnector = () => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="w-full bg-[#F9FAFB] border border-dashed border-[#0066FF]/30 p-8 rounded flex flex-col items-center justify-center text-center gap-3 relative"
    >
      <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded flex items-center justify-center">
        <Calendar size={20} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Booking Engine</h3>
        <p className="text-[11px] text-gray-500 mt-1">Connects to @book-in/db to fetch available slots.</p>
      </div>
    </div>
  );
};

BookingWidgetConnector.craft = {
  displayName: "Booking Widget",
  rules: { canDrag: () => true },
  related: { settings: ConnectorSettings },
};

export const CRMFormConnector = () => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="w-full bg-[#F9FAFB] border border-dashed border-emerald-500/30 p-8 rounded flex flex-col items-center justify-center text-center gap-3 relative"
    >
      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded flex items-center justify-center">
        <Database size={20} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">CRM Lead Form</h3>
        <p className="text-[11px] text-gray-500 mt-1">Submits directly to your Dashboard Leads API.</p>
      </div>
    </div>
  );
};

CRMFormConnector.craft = {
  displayName: "CRM Lead Form",
  rules: { canDrag: () => true },
  related: { settings: ConnectorSettings },
};
