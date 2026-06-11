"use client";

import React, { useState, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "./Text";
import { FileText, ChevronDown } from "lucide-react";

export interface FormEmbedProps {
  margin?: number;
  themeColor?: string;
  borderRadius?: number;
  formId?: string; // ID of the form to embed
}

export const FormEmbedSettings = () => {
  const { 
    actions: { setProp }, 
    margin, 
    themeColor, 
    borderRadius, 
    formId
  } = useNode((node) => ({
    margin: node.data.props.margin,
    themeColor: node.data.props.themeColor,
    borderRadius: node.data.props.borderRadius,
    formId: node.data.props.formId,
  }));

  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    // Fetch available forms for the dropdown in settings
    fetch("/api/dashboard/forms")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForms(data.forms);
        }
      })
      .catch(console.error);
  }, []);

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Form Configuration</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Select Form to Embed</label>
          <div className="relative">
            <select
              value={formId || ""}
              onChange={(e) => setProp((p: FormEmbedProps) => { p.formId = e.target.value; })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-2 pr-8 focus:outline-none appearance-none font-bold text-[#4F46E5] cursor-pointer"
            >
              <option value="" disabled>-- Select a Form --</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Styling</h4>
        
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Theme Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Color</div>
            <input 
              type="color" 
              value={themeColor || "#4F46E5"} 
              onChange={(e) => setProp((p: FormEmbedProps) => { p.themeColor = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Margin Y (px)</label>
            <input 
              type="number" 
              value={margin} 
              onChange={(e) => setProp((p: FormEmbedProps) => { p.margin = Number(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Corner Radius</label>
            <input 
              type="number" 
              value={borderRadius} 
              onChange={(e) => setProp((p: FormEmbedProps) => { p.borderRadius = Number(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormEmbed = ({
  margin = 24,
  themeColor = "#4F46E5",
  borderRadius = 12,
  formId,
  ...props
}: FormEmbedProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
    setProp
  } = useNode((state) => ({
    isSelected: state.events.selected
  }));

  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    // Fetch available forms for the dropdown
    fetch("/api/dashboard/forms")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForms(data.forms);
        }
      })
      .catch(console.error);
  }, []);

  const selectedForm = forms.find(f => f.id === formId);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        margin: `${margin}px 0`,
        boxSizing: "border-box",
        width: "100%",
        cursor: "grab",
        outline: isSelected ? `2px solid ${themeColor}` : "none",
        outlineOffset: "2px",
        borderRadius: `${borderRadius}px`
      }}
      {...props}
    >
      <div
        style={{
          border: `1.5px dashed ${themeColor}aa`,
          background: `${themeColor}04`, // Very faint theme tint
          borderRadius: `${borderRadius}px`,
          padding: "24px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: `${themeColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={20} style={{ color: themeColor }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <Element id="formTitle" is={Text} text="Custom Form Embed" fontSize={15} fontWeight="700" color="#111827" />
            <Element id="formSubtitle" is={Text} text="Intake, feedback, or consent form" fontSize={11} color="#6b7280" />
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "left",
            maxWidth: "400px",
            margin: "0 auto",
          }}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when interacting with dropdown
        >
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "8px" }}>
            Select Form to Display
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={formId || ""}
              onChange={(e) => setProp((p: any) => (p.formId = e.target.value))}
              style={{
                width: "100%",
                padding: "10px 36px 10px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "13px",
                color: "#111827",
                appearance: "none",
                background: "#f9fafb",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="" disabled>-- Select a Form --</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }} />
          </div>

          {selectedForm && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#f3f4f6", borderRadius: "6px", border: "1px dashed #d1d5db" }}>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: "500", color: "#4b5563", textAlign: "center" }}>
                Previewing: <strong style={{ color: "#111827" }}>{selectedForm.name}</strong>
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
                Interactive form will render here on the live site.
              </p>
            </div>
          )}
        </div>

        <p style={{ margin: "16px 0 0 0", fontSize: "12px", fontWeight: "600", color: themeColor }}>
          Drag to reposition on the page.
        </p>
      </div>
    </div>
  );
};

FormEmbed.craft = {
  displayName: "Form Embed",
  props: {
    margin: 24,
    themeColor: "#4F46E5",
    borderRadius: 12,
    formId: "",
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: FormEmbedSettings
  }
};
