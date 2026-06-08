"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "../content/Text";
import { Container } from "../structure/Container";
import { Clock, IndianRupee } from "lucide-react";

interface ServiceShowcaseProps {
  backgroundColor?: string;
}

export const ServiceShowcaseSettings = () => {
  const { actions: { setProp }, backgroundColor } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: ServiceShowcaseProps) => { p.backgroundColor = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ title, desc, price, duration, image }: { title: string, desc: string, price: number, duration: string, image: string }) => (
  <div className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-transparent hover:border-[#E5E5E5] hover:bg-gray-50 transition-all group cursor-pointer">
    <div className="w-full md:w-48 h-32 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="font-semibold text-gray-900 flex items-center"><IndianRupee size={14} className="mr-0.5" />{price}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center text-xs font-medium text-gray-400">
          <Clock size={14} className="mr-1" /> {duration}
        </span>
        <button className="text-sm font-medium text-[#0066FF] hover:text-[#0052CC] opacity-0 group-hover:opacity-100 transition-opacity">
          Book Now →
        </button>
      </div>
    </div>
  </div>
);

export const ServiceShowcase = ({ backgroundColor = "#ffffff" }: ServiceShowcaseProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const mockServices = [
    {
      title: "Signature Facial Treatment",
      desc: "A deeply cleansing and hydrating facial customized to your skin type. Includes extraction, massage, and premium serum infusion.",
      price: 2499,
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Advanced Laser Therapy",
      desc: "Targeted laser treatment for skin rejuvenation, reducing fine lines and improving overall texture with minimal downtime.",
      price: 4999,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
    },
    {
      title: "Holistic Wellness Massage",
      desc: "Full body restorative massage using organic essential oils. Designed to relieve tension and promote deep relaxation.",
      price: 3500,
      duration: "90 min",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400",
    }
  ];

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ backgroundColor, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="py-24 px-8 w-full relative"
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        <Element id="service-showcase-header" is={Container} padding={0} background="transparent" canvas>
          <div className="mb-12">
            <Text text="Our Services" fontSize={36} fontWeight="700" color="#111827" />
            <div className="h-4" />
            <Text text="Select a treatment to book your appointment." fontSize={16} color="#6B7280" />
          </div>
        </Element>
        
        <div className="flex flex-col gap-4">
          {mockServices.map((service, idx) => (
            <ServiceItem key={idx} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

ServiceShowcase.craft = {
  displayName: "Service Showcase",
  props: { backgroundColor: "#ffffff" },
  rules: { canDrag: () => true },
  related: { settings: ServiceShowcaseSettings },
};
