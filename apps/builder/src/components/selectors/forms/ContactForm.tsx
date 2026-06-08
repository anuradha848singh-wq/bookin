"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  showPhoneField?: boolean;
  layout?: "vertical" | "horizontal";
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  borderRadius?: number;
}

export const ContactFormSettings = () => {
  const { actions: { setProp }, title, description, buttonText, showPhoneField, layout, backgroundColor, textColor, buttonColor, borderRadius } = useNode((node) => ({
    title: node.data.props.title,
    description: node.data.props.description,
    buttonText: node.data.props.buttonText,
    showPhoneField: node.data.props.showPhoneField,
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
        <input type="text" value={title || ""} onChange={(e) => setProp((p: ContactFormProps) => { p.title = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Form Title" />
        <textarea value={description || ""} onChange={(e) => setProp((p: ContactFormProps) => { p.description = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[60px]" placeholder="Form Description" />
        <input type="text" value={buttonText || ""} onChange={(e) => setProp((p: ContactFormProps) => { p.buttonText = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Button Text (e.g. Send Message)" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Fields</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md px-3">
          <input 
            type="checkbox" 
            checked={showPhoneField} 
            onChange={(e) => setProp((p: ContactFormProps) => { p.showPhoneField = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Include Phone Number Field
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Layout</div>
          <select value={layout || "vertical"} onChange={(e) => setProp((p: ContactFormProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal (2 Columns)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: ContactFormProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: ContactFormProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BTN</div>
            <input type="color" value={buttonColor || "#0066FF"} onChange={(e) => setProp((p: ContactFormProps) => { p.buttonColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 12} onChange={(e) => setProp((p: ContactFormProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactForm = ({ 
  title = "Send us a message",
  description = "Fill out the form below and our team will get back to you within 24 hours.",
  buttonText = "Send Message",
  showPhoneField = false,
  layout = "vertical",
  backgroundColor = "#ffffff",
  textColor = "#111827",
  buttonColor = "#0066FF",
  borderRadius = 12
}: ContactFormProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelected) return;
    
    setStatus("submitting");
    // Simulate network request
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors text-gray-900";
  const labelClass = "block text-sm font-semibold mb-1 opacity-80";

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full max-w-3xl mx-auto p-8 shadow-sm border border-[#E5E5E5]"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {description && <p className="opacity-70 leading-relaxed">{description}</p>}
        </div>
      )}

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
          <p className="opacity-70">Thanks for reaching out. We'll be in touch soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className={layout === "horizontal" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "flex flex-col gap-5"}>
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" required placeholder="Jane Doe" className={inputClass} style={{ borderRadius: `${Math.min(borderRadius, 8)}px` }} />
            </div>
            
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" required placeholder="jane@example.com" className={inputClass} style={{ borderRadius: `${Math.min(borderRadius, 8)}px` }} />
            </div>
          </div>

          {showPhoneField && (
            <div>
              <label className={labelClass}>Phone Number (Optional)</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className={inputClass} style={{ borderRadius: `${Math.min(borderRadius, 8)}px` }} />
            </div>
          )}

          <div>
            <label className={labelClass}>Message</label>
            <textarea required rows={4} placeholder="How can we help you?" className={`${inputClass} resize-y min-h-[120px]`} style={{ borderRadius: `${Math.min(borderRadius, 8)}px` }} />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm">
              <AlertCircle size={16} />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === "submitting"}
            className="mt-2 py-4 px-8 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 group"
            style={{ backgroundColor: buttonColor, borderRadius: `${Math.min(borderRadius, 8)}px` }}
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <>
                {buttonText}
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

ContactForm.craft = {
  displayName: "Contact Form",
  props: { 
    title: "Send us a message",
    description: "Fill out the form below and our team will get back to you within 24 hours.",
    buttonText: "Send Message",
    showPhoneField: false,
    layout: "vertical",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    buttonColor: "#0066FF",
    borderRadius: 12
  },
  rules: { canDrag: () => true },
  related: { settings: ContactFormSettings },
};
