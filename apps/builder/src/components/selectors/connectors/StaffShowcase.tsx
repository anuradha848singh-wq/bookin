"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "../content/Text";
import { Container } from "../structure/Container";
import { Calendar } from "lucide-react";

interface StaffShowcaseProps {
  backgroundColor?: string;
  columns?: number;
}

export const StaffShowcaseSettings = () => {
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
          <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: StaffShowcaseProps) => { p.backgroundColor = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Columns</label>
        <div className="flex border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          {[2, 3, 4].map((col) => (
            <button
              key={col}
              onClick={() => setProp((p: StaffShowcaseProps) => { p.columns = col; })}
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

const StaffCard = ({ name, role, image, nextAvailable }: { name: string, role: string, image: string, nextAvailable: string }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-[#E5E5E5] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-300 transition-all group">
    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
    <p className="text-sm text-gray-500 mb-6">{role}</p>
    
    <div className="w-full bg-gray-50 p-3 rounded-lg mb-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-700">
      <Calendar size={14} className="text-emerald-500" />
      Next available: {nextAvailable}
    </div>

    <button className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors">
      Book {name.split(' ')[0]}
    </button>
  </div>
);

export const StaffShowcase = ({ backgroundColor = "#FAFAFA", columns = 3 }: StaffShowcaseProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const mockStaff = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Lead Dermatologist",
      nextAvailable: "Today, 2:00 PM",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Michael Chen",
      role: "Senior Aesthetician",
      nextAvailable: "Tomorrow, 10:00 AM",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Emma Watson",
      role: "Massage Therapist",
      nextAvailable: "Thursday, 1:00 PM",
      image: "https://images.unsplash.com/photo-1594824432258-0062a4fa3793?auto=format&fit=crop&q=80&w=300",
    }
  ];

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-24 px-8 w-full relative border-y border-[#E5E5E5]"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <Element id="staff-showcase-header" is={Container} padding={0} background="transparent" canvas>
          <div className="text-center mb-16">
            <Text text="Meet Our Experts" fontSize={36} fontWeight="700" color="#111827" textAlign="center" />
            <div className="h-4" />
            <Text text="Book directly with your preferred specialist." fontSize={16} color="#6B7280" textAlign="center" />
          </div>
        </Element>
        
        <div 
          className="w-full grid gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {mockStaff.slice(0, columns).map((staff, idx) => (
            <StaffCard key={idx} {...staff} />
          ))}
        </div>
      </div>
    </div>
  );
};

StaffShowcase.craft = {
  displayName: "Staff Showcase",
  props: { backgroundColor: "#FAFAFA", columns: 3 },
  rules: { canDrag: () => true },
  related: { settings: StaffShowcaseSettings },
};
