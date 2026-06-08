"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Mail, Send } from "lucide-react";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  layout?: "vertical" | "horizontal" | "minimal";
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  borderRadius?: number;
}

export const NewsletterSignupSettings = () => {
  const { actions: { setProp }, title, description, placeholder, buttonText, layout, backgroundColor, textColor, buttonColor, borderRadius } = useNode((node) => ({
    title: node.data.props.title,
    description: node.data.props.description,
    placeholder: node.data.props.placeholder,
    buttonText: node.data.props.buttonText,
    layout: node.data.props.layout,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    buttonColor: node.data.props.buttonColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Content</label>
        <input type="text" value={title || ""} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.title = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Heading" />
        <textarea value={description || ""} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.description = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[60px]" placeholder="Description..." />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Form Fields</label>
        <input type="text" value={placeholder || ""} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.placeholder = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Input Placeholder" />
        <input type="text" value={buttonText || ""} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.buttonText = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Button Text" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Style</div>
          <select value={layout || "horizontal"} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="horizontal">Horizontal Box</option>
            <option value="vertical">Vertical Card</option>
            <option value="minimal">Minimal Inline</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#f3f4f6"} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BTN</div>
            <input type="color" value={buttonColor || "#0066FF"} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.buttonColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 12} onChange={(e) => setProp((p: NewsletterSignupProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewsletterSignup = ({ 
  title = "Subscribe to our newsletter",
  description = "Get the latest news, updates, and special offers delivered directly to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  layout = "horizontal",
  backgroundColor = "#f3f4f6",
  textColor = "#111827",
  buttonColor = "#0066FF",
  borderRadius = 12
}: NewsletterSignupProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelected) return;
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  if (layout === "minimal") {
    return (
      <div
        ref={(ref) => { connect(drag(ref as HTMLElement)); }}
        className="w-full max-w-md mx-auto"
        style={{ 
          outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
          outlineOffset: "4px", 
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 relative">
          <div className="relative flex-1">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ borderRadius: `${borderRadius}px` }}
              required
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shrink-0"
            style={{ backgroundColor: buttonColor, borderRadius: `${borderRadius}px` }}
          >
            {buttonText} <Send size={16} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full ${layout === 'vertical' ? 'max-w-md mx-auto' : ''}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      <div 
        className={`p-8 md:p-10 ${layout === 'horizontal' ? 'flex flex-col md:flex-row items-center gap-8 md:gap-12' : 'flex flex-col gap-6 text-center'}`}
        style={{ 
          backgroundColor, 
          color: textColor, 
          borderRadius: `${borderRadius}px` 
        }}
      >
        <div className={`flex-1 flex flex-col gap-2 ${layout === 'vertical' ? 'items-center' : ''}`}>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="opacity-80 text-sm leading-relaxed max-w-md">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className={`flex ${layout === 'horizontal' ? 'w-full md:w-auto flex-1' : 'w-full flex-col'} gap-3 relative`}>
          <div className="relative flex-1 w-full">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-inner text-gray-900 bg-white"
              style={{ borderRadius: `${borderRadius}px` }}
              required
            />
          </div>
          <button 
            type="submit"
            className="px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap shadow-md flex items-center justify-center"
            style={{ backgroundColor: buttonColor, borderRadius: `${borderRadius}px` }}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

NewsletterSignup.craft = {
  displayName: "Newsletter",
  props: { 
    title: "Subscribe to our newsletter",
    description: "Get the latest news, updates, and special offers delivered directly to your inbox.",
    placeholder: "Enter your email address",
    buttonText: "Subscribe",
    layout: "horizontal",
    backgroundColor: "#f3f4f6",
    textColor: "#111827",
    buttonColor: "#0066FF",
    borderRadius: 12
  },
  rules: { canDrag: () => true },
  related: { settings: NewsletterSignupSettings },
};
