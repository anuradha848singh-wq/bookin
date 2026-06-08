"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { BadgeCheck, Quote as QuoteIcon } from "lucide-react";
import { RatingStars } from "./RatingStars";

interface SocialProofProps {
  avatarUrl?: string;
  name?: string;
  title?: string;
  quote?: string;
  rating?: number;
  verified?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const SocialProofSettings = () => {
  const { actions: { setProp }, avatarUrl, name, title, quote, rating, verified, backgroundColor, textColor, accentColor } = useNode((node) => ({
    avatarUrl: node.data.props.avatarUrl,
    name: node.data.props.name,
    title: node.data.props.title,
    quote: node.data.props.quote,
    rating: node.data.props.rating,
    verified: node.data.props.verified,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Reviewer Info</label>
        <input 
          type="text" 
          value={name || ""} 
          onChange={(e) => setProp((p: SocialProofProps) => { p.name = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Name"
        />
        <input 
          type="text" 
          value={title || ""} 
          onChange={(e) => setProp((p: SocialProofProps) => { p.title = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Title (e.g. Verified Patient)"
        />
        <input 
          type="text" 
          value={avatarUrl || ""} 
          onChange={(e) => setProp((p: SocialProofProps) => { p.avatarUrl = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Avatar Image URL"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Testimonial</label>
        <textarea 
          value={quote || ""} 
          onChange={(e) => setProp((p: SocialProofProps) => { p.quote = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[80px]" 
          placeholder="Quote text..."
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Details</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 w-1/2">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rating</div>
            <select 
              value={rating || 5} 
              onChange={(e) => setProp((p: SocialProofProps) => { p.rating = parseInt(e.target.value); })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Star</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer w-1/2">
            <input 
              type="checkbox" 
              checked={verified} 
              onChange={(e) => setProp((p: SocialProofProps) => { p.verified = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Verified Badge
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: SocialProofProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: SocialProofProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 mt-1">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Stars Color</div>
          <input type="color" value={accentColor || "#FBBF24"} onChange={(e) => setProp((p: SocialProofProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>
    </div>
  );
};

export const SocialProof = ({ 
  avatarUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  name = "Jane Doe",
  title = "Verified Patient",
  quote = "The care I received was absolutely phenomenal. The staff was attentive and the facilities were top-notch. I highly recommend this clinic to anyone.",
  rating = 5,
  verified = true,
  backgroundColor = "#ffffff",
  textColor = "#111827",
  accentColor = "#FBBF24"
}: SocialProofProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full rounded-xl border border-[#E5E5E5] p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden"
      style={{ 
        backgroundColor, 
        color: textColor,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      <QuoteIcon 
        size={80} 
        className="absolute -top-4 -left-4 opacity-5 pointer-events-none rotate-180" 
        style={{ color: textColor }}
      />

      {/* Stars */}
      <div className="flex" style={{ color: accentColor }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : 'fill-transparent stroke-current opacity-30'}`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-lg sm:text-xl font-medium leading-relaxed italic opacity-90 z-10">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 mt-2">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2" style={{ borderColor: accentColor }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold opacity-50">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base flex items-center gap-1.5">
            {name}
            {verified && <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />}
          </span>
          <span className="text-sm opacity-70">{title}</span>
        </div>
      </div>
    </div>
  );
};

SocialProof.craft = {
  displayName: "Testimonial Card",
  props: { 
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    name: "Jane Doe",
    title: "Verified Patient",
    quote: "The care I received was absolutely phenomenal. The staff was attentive and the facilities were top-notch. I highly recommend this clinic to anyone.",
    rating: 5,
    verified: true,
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#FBBF24"
  },
  rules: { canDrag: () => true },
  related: { settings: SocialProofSettings },
};
