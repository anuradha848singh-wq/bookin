"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";

interface ResponsiveGridProps {
  columns?: number;
  gap?: number;
  mobileColumns?: number;
  tabletColumns?: number;
  padding?: number;
  background?: string;
}

export const ResponsiveGridSettings = () => {
  const { actions: { setProp }, columns, gap, mobileColumns, tabletColumns, padding, background } = useNode((node) => ({
    columns: node.data.props.columns,
    gap: node.data.props.gap,
    mobileColumns: node.data.props.mobileColumns,
    tabletColumns: node.data.props.tabletColumns,
    padding: node.data.props.padding,
    background: node.data.props.background,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          Desktop Columns
        </label>
        <input 
          type="number" 
          value={columns} 
          min="1"
          max="6"
          onChange={(e) => setProp((p: ResponsiveGridProps) => { p.columns = parseInt(e.target.value) || 3; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Tablet Columns
          </label>
          <input 
            type="number" 
            value={tabletColumns} 
            min="1"
            max="4"
            onChange={(e) => setProp((p: ResponsiveGridProps) => { p.tabletColumns = parseInt(e.target.value) || 2; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Mobile Columns
          </label>
          <input 
            type="number" 
            value={mobileColumns} 
            min="1"
            max="2"
            onChange={(e) => setProp((p: ResponsiveGridProps) => { p.mobileColumns = parseInt(e.target.value) || 1; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gap</label>
          <input 
            type="number" 
            value={gap} 
            onChange={(e) => setProp((p: ResponsiveGridProps) => { p.gap = parseInt(e.target.value) || 20; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Padding</label>
          <input 
            type="number" 
            value={padding} 
            onChange={(e) => setProp((p: ResponsiveGridProps) => { p.padding = parseInt(e.target.value) || 20; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <input 
          type="color" 
          value={background} 
          onChange={(e) => setProp((p: ResponsiveGridProps) => { p.background = e.target.value; })}
          className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-[10px] text-blue-800 leading-relaxed">
          <strong>Responsive:</strong> Grid automatically adjusts columns based on screen size.
        </p>
      </div>
    </div>
  );
};

export const ResponsiveGrid = ({ 
  columns = 3,
  gap = 20,
  mobileColumns = 1,
  tabletColumns = 2,
  padding = 20,
  background = "#FFFFFF"
}: ResponsiveGridProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        padding: `${padding}px`,
        background,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
        className="responsive-grid"
      >
        <Element id="grid-item-1" is={Container} canvas padding={20} background="#F3F4F6">
          <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center" }}>
            Grid Item 1
          </p>
        </Element>
        <Element id="grid-item-2" is={Container} canvas padding={20} background="#F3F4F6">
          <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center" }}>
            Grid Item 2
          </p>
        </Element>
        <Element id="grid-item-3" is={Container} canvas padding={20} background="#F3F4F6">
          <p style={{ fontSize: "14px", color: "#6B7280", textAlign: "center" }}>
            Grid Item 3
          </p>
        </Element>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: repeat(${mobileColumns}, 1fr) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1199px) {
          .responsive-grid {
            grid-template-columns: repeat(${tabletColumns}, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

ResponsiveGrid.craft = {
  displayName: "Responsive Grid",
  props: { 
    columns: 3,
    gap: 20,
    mobileColumns: 1,
    tabletColumns: 2,
    padding: 20,
    background: "#FFFFFF"
  },
  related: { settings: ResponsiveGridSettings },
};
