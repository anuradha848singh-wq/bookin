"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "./Text";
import { Button } from "./Button";

interface HeroSectionProps {
  background?: string;
  paddingY?: number;
  imageSrc?: string;
  position?: string;
  x?: number;
  y?: number;
  width?: string | number;
  height?: string | number;
}

export const HeroSectionSettings = () => {
  const { actions: { setProp }, background, paddingY, imageSrc } = useNode((node) => ({
    background: node.data.props.background,
    paddingY: node.data.props.paddingY,
    imageSrc: node.data.props.imageSrc,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Background & Spacing */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Section Style</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={background || "#ffffff"} 
              onChange={(e) => setProp((p: HeroSectionProps) => { p.background = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Padding Y</label>
            <span className="text-[10px] font-bold text-blue-500">{paddingY || 100}px</span>
          </div>
          <input 
            type="range" 
            min={40} 
            max={200} 
            value={paddingY || 100} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.paddingY = parseInt(e.target.value); })} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
      </div>

      {/* Media & Reviews */}
      <div className="flex flex-col gap-3 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Media</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Doctor Image URL</label>
          <input 
            type="text" 
            value={imageSrc || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.imageSrc = e.target.value; })} 
            className={inputClass}
            placeholder="Image path or absolute URL..."
          />
        </div>
      </div>
    </div>
  );
};

export const HeroSection = ({ 
  background = "#ffffff", 
  paddingY = 100,
  imageSrc = "/doctor.png",
  position = "relative",
  x = 0,
  y = 0,
  width = "100%",
  height = "auto"
}: HeroSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background, 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px",
        width: position === "absolute" ? "100%" : width,
        height: position === "absolute" ? "100%" : height,
      }}
      className="w-full relative border-b border-[#E5E5E5] flex flex-col items-center select-none font-sans"
    >
      {/* 1. Header Navbar (Platinum Medical Clinic) */}
      <div className="w-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#115E59] flex items-center justify-center text-white shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <Element id="clinicName" is={Text} text="Platinum Med" fontSize={16} fontWeight="800" color="#111827" />
        </div>
        <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500">
          <Element id="nav1" is={Text} text="Home" fontSize={13} fontWeight="700" color="#6B7280" />
          <Element id="nav2" is={Text} text="Services" fontSize={13} fontWeight="700" color="#6B7280" />
          <Element id="nav3" is={Text} text="Doctors" fontSize={13} fontWeight="700" color="#6B7280" />
        </div>
        <Element id="navButton" is={Button} text="Book online" background="#115E59" color="#ffffff" borderRadius={9999} fontSize={12} paddingX={16} paddingY={6} />
      </div>

      {/* 2. Main 2-Column Medical Hero */}
      <div 
        className="w-full max-w-5xl mx-auto px-6 grid grid-cols-2 gap-8 items-center"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left gap-5">
          <div className="bg-[#EBF5EE] border border-[#A7F3D0]/20 rounded-full px-1">
            <Element id="badgeText" is={Text} text="CARE THAT HELPS YOU HEAL" fontSize={10} fontWeight="800" color="#115E59" />
          </div>
          <div className="flex flex-col gap-0 w-full">
            <Element id="titlePrimary" is={Text} text="Better care." fontSize={44} fontWeight="900" color="#111827" />
            <Element id="titleSecondary" is={Text} text="Better you." fontSize={44} fontWeight="600" color="#115E59" />
          </div>
          <div className="w-full max-w-md">
            <Element id="description" is={Text} text="Next-generation clinical services with dedicated medical professionals. Book appointments online in seconds, with real-time slot availability." fontSize={13.5} fontWeight="500" color="#6B7280" />
          </div>
          
          <div className="flex items-center gap-3 mt-1.5 w-full">
            <Element id="primaryBtn" is={Button} text="Book Appointment" background="#115E59" color="#ffffff" borderRadius={12} fontSize={12} paddingX={22} paddingY={10} />
            <Element id="secondaryBtn" is={Button} text="Meet Specialists" background="#F3F4F6" color="#1F2937" borderRadius={12} fontSize={12} paddingX={22} paddingY={10} />
          </div>

          {/* Tagline Row */}
          <div className="flex items-center gap-4 mt-5 text-[10px] font-extrabold text-gray-400">
            <span className="flex items-center gap-1.5"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.2"><polyline points="20 6 9 17 4 12"/></svg> Online Booking</span>
            <span className="flex items-center gap-1.5"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.2"><polyline points="20 6 9 17 4 12"/></svg> Top Specialists</span>
            <span className="flex items-center gap-1.5"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.2"><polyline points="20 6 9 17 4 12"/></svg> Modern Facility</span>
          </div>
        </div>

        {/* Right Column: Doctor Portrait & Rating */}
        <div className="relative flex justify-center items-center">
          {/* Arched Portrait frame */}
          <div className="relative w-[280px] h-[320px] bg-emerald-50/50 border-4 border-white rounded-t-full shadow-lg flex items-end justify-center overflow-hidden">
            <img 
              src={imageSrc} 
              alt="Doctor Portrait" 
              className="w-full h-full object-cover object-top rounded-t-full scale-102 hover:scale-108 transition-transform duration-[800ms]" 
            />
          </div>

          {/* Floating Review Card */}
          <div className="absolute -bottom-3 right-4 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-1 items-start text-left w-[150px] transition-transform duration-300 hover:scale-105">
            <div className="flex gap-0.5 text-amber-400 text-[10px]">
              ★ ★ ★ ★ ★
            </div>
            <Element id="reviewRatingText" is={Text} text="100% Trusted Rating" fontSize={11} fontWeight="800" color="#111827" />
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" alt="" />
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" alt="" />
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=60" alt="" />
              </div>
              <Element id="reviewCountText" is={Text} text="4.9/5 (1k+ reviews)" fontSize={8.5} fontWeight="800" color="#9CA3AF" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

HeroSection.craft = {
  displayName: "Hero Section",
  props: { 
    background: "#ffffff", 
    paddingY: 100,
    imageSrc: "/doctor.png",
    position: "relative",
    x: 0,
    y: 0,
    width: "100%",
    height: "auto"
  },
  rules: { canDrag: () => true },
  related: { settings: HeroSectionSettings },
};
