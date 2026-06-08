"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactInfoProps {
  title?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  layout?: "grid" | "stack";
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  borderRadius?: number;
}

export const ContactInfoSettings = () => {
  const { actions: { setProp }, title, address, phone, email, hours, layout, backgroundColor, textColor, iconColor, borderRadius } = useNode((node) => ({
    title: node.data.props.title,
    address: node.data.props.address,
    phone: node.data.props.phone,
    email: node.data.props.email,
    hours: node.data.props.hours,
    layout: node.data.props.layout,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    iconColor: node.data.props.iconColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Header</label>
        <input type="text" value={title || ""} onChange={(e) => setProp((p: ContactInfoProps) => { p.title = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Section Title (e.g. Get in touch)" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contact Details</label>
        
        <div className="flex items-start border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden">
          <div className="px-3 pt-2 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full bg-white">Address</div>
          <textarea value={address || ""} onChange={(e) => setProp((p: ContactInfoProps) => { p.address = e.target.value; })} className="w-full h-full px-2 py-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700 min-h-[60px]" placeholder="123 Street Name&#10;City, State 12345" />
        </div>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Phone</div>
          <input type="text" value={phone || ""} onChange={(e) => setProp((p: ContactInfoProps) => { p.phone = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="+1 (555) 000-0000" />
        </div>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Email</div>
          <input type="email" value={email || ""} onChange={(e) => setProp((p: ContactInfoProps) => { p.email = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="hello@company.com" />
        </div>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Hours</div>
          <input type="text" value={hours || ""} onChange={(e) => setProp((p: ContactInfoProps) => { p.hours = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="Mon-Fri: 9am - 5pm" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Style</div>
          <select value={layout || "stack"} onChange={(e) => setProp((p: ContactInfoProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="stack">Vertical Stack</option>
            <option value="grid">Grid Layout</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: ContactInfoProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: ContactInfoProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Icon</div>
            <input type="color" value={iconColor || "#0066FF"} onChange={(e) => setProp((p: ContactInfoProps) => { p.iconColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 16} onChange={(e) => setProp((p: ContactInfoProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactInfo = ({ 
  title = "Get in touch",
  address = "123 Innovation Drive\nSuite 400\nSan Francisco, CA 94103",
  phone = "+1 (555) 123-4567",
  email = "contact@example.com",
  hours = "Mon-Fri: 9am - 5pm\nSat-Sun: Closed",
  layout = "stack",
  backgroundColor = "#ffffff",
  textColor = "#111827",
  iconColor = "#0066FF",
  borderRadius = 16
}: ContactInfoProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const renderItem = (icon: React.ReactNode, title: string, content: string | undefined, linkPrefix?: string) => {
    if (!content) return null;
    return (
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-50/50 shadow-sm border border-gray-100" style={{ color: iconColor }}>
          {icon}
        </div>
        <div className="flex flex-col pt-1">
          <span className="text-sm font-semibold opacity-60 uppercase tracking-wider mb-1">{title}</span>
          {linkPrefix ? (
            <a 
              href={`${linkPrefix}${content}`} 
              onClick={(e) => isSelected && e.preventDefault()}
              className="font-medium hover:underline hover:opacity-80 transition-opacity whitespace-pre-line"
            >
              {content}
            </a>
          ) : (
            <span className="font-medium whitespace-pre-line leading-relaxed">{content}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full border border-[#E5E5E5] shadow-sm p-8"
      style={{ 
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {title && (
        <h3 className="text-2xl font-bold mb-8">{title}</h3>
      )}

      <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
        {renderItem(<MapPin size={20} />, "Address", address)}
        {renderItem(<Phone size={20} />, "Phone", phone, "tel:")}
        {renderItem(<Mail size={20} />, "Email", email, "mailto:")}
        {renderItem(<Clock size={20} />, "Hours", hours)}
      </div>
    </div>
  );
};

ContactInfo.craft = {
  displayName: "Contact Info",
  props: { 
    title: "Get in touch",
    address: "123 Innovation Drive\nSuite 400\nSan Francisco, CA 94103",
    phone: "+1 (555) 123-4567",
    email: "contact@example.com",
    hours: "Mon-Fri: 9am - 5pm\nSat-Sun: Closed",
    layout: "stack",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    iconColor: "#0066FF",
    borderRadius: 16
  },
  rules: { canDrag: () => true },
  related: { settings: ContactInfoSettings },
};
