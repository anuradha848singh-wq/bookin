"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "../content/Text";
import { Container } from "../structure/Container";
import { Image as ImageIcon, ArrowRight } from "lucide-react";

interface ServicesGridProps {
  backgroundColor?: string;
  columns?: number;
}

export const ServicesGridSettings = () => {
  const { actions: { setProp }, backgroundColor, columns } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    columns: node.data.props.columns,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: ServicesGridProps) => { p.backgroundColor = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Columns</label>
        <div className="flex border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          {[2, 3, 4].map((col) => (
            <button
              key={col}
              onClick={() => setProp((p: ServicesGridProps) => { p.columns = col; })}
              className={`flex-1 py-1 text-[11px] font-medium transition-colors ${columns === col ? "bg-white text-[#0066FF] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, desc }: { title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-lg border border-[#E5E5E5] flex flex-col items-start text-left">
    <div className="w-10 h-10 rounded bg-[#F3F4F6] text-gray-400 flex items-center justify-center mb-6">
      <ImageIcon size={18} />
    </div>
    <Element id={`card-title-${title.replace(/\s+/g, '-')}`} is={Container} padding={0} canvas>
      <Text text={title} fontSize={16} fontWeight="600" color="#111827" />
      <div className="h-2" />
      <Text text={desc} fontSize={13} color="#6B7280" />
    </Element>
  </div>
);

export const ServicesGrid = ({ backgroundColor = "#ffffff", columns = 3 }: ServicesGridProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-24 px-8 w-full relative border-b border-[#E5E5E5]"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <Element id="services-header" is={Container} padding={0} background="transparent" canvas>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-3 block">Section Tag</span>
            <Text text="Wireframe Content Grid" fontSize={32} fontWeight="600" color="#111827" textAlign="center" />
          </div>
        </Element>
        
        <div 
          className="w-full grid gap-6" 
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          <ServiceCard title="Card Feature 1" desc="Description placeholder for the wireframe grid. Content sits here cleanly." />
          <ServiceCard title="Card Feature 2" desc="Description placeholder for the wireframe grid. Content sits here cleanly." />
          <ServiceCard title="Card Feature 3" desc="Description placeholder for the wireframe grid. Content sits here cleanly." />
        </div>
      </div>
    </div>
  );
};

ServicesGrid.craft = {
  displayName: "Services Grid",
  props: { backgroundColor: "#ffffff", columns: 3 },
  rules: { canDrag: () => true },
  related: { settings: ServicesGridSettings },
};
