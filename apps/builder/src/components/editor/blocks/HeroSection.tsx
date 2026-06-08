"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface HeroSectionProps {
  background?: string;
  paddingY?: number;
  clinicName?: string;
  badgeText?: string;
  titlePrimary?: string;
  titleSecondary?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  imageSrc?: string;
  reviewRatingText?: string;
  reviewCountText?: string;
}

export const HeroSectionSettings = () => {
  const { 
    actions: { setProp }, 
    background, 
    paddingY,
    clinicName,
    badgeText,
    titlePrimary,
    titleSecondary,
    description,
    primaryButtonText,
    secondaryButtonText,
    imageSrc,
    reviewRatingText,
    reviewCountText
  } = useNode((node) => ({
    background: node.data.props.background,
    paddingY: node.data.props.paddingY,
    clinicName: node.data.props.clinicName,
    badgeText: node.data.props.badgeText,
    titlePrimary: node.data.props.titlePrimary,
    titleSecondary: node.data.props.titleSecondary,
    description: node.data.props.description,
    primaryButtonText: node.data.props.primaryButtonText,
    secondaryButtonText: node.data.props.secondaryButtonText,
    imageSrc: node.data.props.imageSrc,
    reviewRatingText: node.data.props.reviewRatingText,
    reviewCountText: node.data.props.reviewCountText,
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

      {/* Hero Content */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Clinic Branding</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Clinic Name</label>
          <input 
            type="text" 
            value={clinicName || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.clinicName = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Platinum Med"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Badge Subtitle</label>
          <input 
            type="text" 
            value={badgeText || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.badgeText = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Care that helps you heal"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Hero Headings</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Primary Heading Line</label>
          <input 
            type="text" 
            value={titlePrimary || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.titlePrimary = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Better care."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Secondary Heading Line</label>
          <input 
            type="text" 
            value={titleSecondary || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.titleSecondary = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Better you."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Description</label>
          <textarea 
            value={description || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.description = e.target.value; })} 
            className={`${inputClass} min-h-[60px] resize-y`}
            placeholder="Hero paragraph text..."
          />
        </div>
      </div>

      {/* Media & Reviews */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Media & Reviews</h4>
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
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Review Rating Text</label>
          <input 
            type="text" 
            value={reviewRatingText || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.reviewRatingText = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. 100% Trusted Rating"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Review Subtext</label>
          <input 
            type="text" 
            value={reviewCountText || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.reviewCountText = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. 4.9/5 (1k+ reviews)"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Action Buttons</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Primary Button Text</label>
          <input 
            type="text" 
            value={primaryButtonText || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.primaryButtonText = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Secondary Button Text</label>
          <input 
            type="text" 
            value={secondaryButtonText || ""} 
            onChange={(e) => setProp((p: HeroSectionProps) => { p.secondaryButtonText = e.target.value; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const HeroSection = ({ 
  background = "#ffffff", 
  paddingY = 100,
  clinicName = "Platinum Med",
  badgeText = "Care that helps you heal",
  titlePrimary = "Better care.",
  titleSecondary = "Better you.",
  description = "Next-generation clinical services with dedicated medical professionals. Book appointments online in seconds, with real-time slot availability.",
  primaryButtonText = "Book Appointment",
  secondaryButtonText = "Meet Specialists",
  imageSrc = "/doctor.png",
  reviewRatingText = "100% Trusted Rating",
  reviewCountText = "4.9/5 (1k+ reviews)"
}: HeroSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ background, outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "-2px" }}
      className="w-full relative border-b border-[#E5E5E5] flex flex-col items-center select-none font-sans"
    >
      {/* 1. Header Navbar (Platinum Medical Clinic) */}
      <div className="w-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#115E59] flex items-center justify-center text-white shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <span className="font-extrabold text-base text-gray-900 tracking-tight">{clinicName}</span>
        </div>
        <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500">
          <span className="hover:text-black cursor-pointer transition-colors">Home</span>
          <span className="hover:text-black cursor-pointer transition-colors">Services</span>
          <span className="hover:text-black cursor-pointer transition-colors">Doctors</span>
          <span className="hover:text-black cursor-pointer transition-colors">Book appointment</span>
        </div>
        <button className="bg-[#115E59] hover:bg-[#134E4A] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm">
          Book online
        </button>
      </div>

      {/* 2. Main 2-Column Medical Hero */}
      <div 
        className="w-full max-w-5xl mx-auto px-6 grid grid-cols-2 gap-8 items-center"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left gap-5">
          <span className="text-[10px] font-extrabold bg-[#EBF5EE] text-[#115E59] px-3.5 py-1 rounded-full uppercase tracking-[0.12em] border border-[#A7F3D0]/20">
            {badgeText}
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="text-[44px] font-black text-gray-900 tracking-tight leading-[1.12]">
              {titlePrimary}<br/>
              <span className="font-serif italic font-semibold text-[#115E59]">{titleSecondary}</span>
            </h1>
            <p className="text-[13.5px] text-gray-500 font-medium leading-relaxed max-w-md mt-1">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-1.5">
            <button className="bg-[#115E59] hover:bg-[#134E4A] text-white px-5.5 py-2.5 rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all">
              {primaryButtonText}
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5.5 py-2.5 rounded-xl text-xs font-extrabold transition-all">
              {secondaryButtonText}
            </button>
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
            <span className="text-[11px] font-extrabold text-gray-900 tracking-tight leading-tight">{reviewRatingText}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" alt="" />
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" alt="" />
                <img className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=60" alt="" />
              </div>
              <span className="text-[8.5px] text-gray-400 font-extrabold tracking-tight">{reviewCountText}</span>
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
    clinicName: "Platinum Med",
    badgeText: "Care that helps you heal",
    titlePrimary: "Better care.",
    titleSecondary: "Better you.",
    description: "Next-generation clinical services with dedicated medical professionals. Book appointments online in seconds, with real-time slot availability.",
    primaryButtonText: "Book Appointment",
    secondaryButtonText: "Meet Specialists",
    imageSrc: "/doctor.png",
    reviewRatingText: "100% Trusted Rating",
    reviewCountText: "4.9/5 (1k+ reviews)"
  },
  rules: { canDrag: () => true },
  related: { settings: HeroSectionSettings },
};
