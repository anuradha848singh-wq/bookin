"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Code2 } from "lucide-react";

interface HtmlEmbedProps {
  html?: string;
}

export const HtmlEmbedSettings = () => {
  const { actions: { setProp }, html } = useNode((node) => ({
    html: node.data.props.html,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">HTML Code</label>
        <textarea 
          value={html || ""} 
          onChange={(e) => setProp((p: HtmlEmbedProps) => { p.html = e.target.value; })} 
          className="w-full h-40 p-2 text-xs font-mono bg-gray-900 text-gray-100 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="<div>...</div>"
        />
        <p className="text-[10px] text-gray-400">Warning: Raw HTML will be injected exactly as written.</p>
      </div>
    </div>
  );
};

export const HtmlEmbed = ({ html = "<div style=\"padding: 20px; background: #f3f4f6; text-align: center; border: 2px dashed #ccc;\">Custom HTML Block</div>" }: HtmlEmbedProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full relative ${isSelected ? 'outline outline-2 outline-blue-500 outline-offset-2' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold flex items-center gap-1">
          <Code2 size={12} /> HTML Embed
        </div>
      )}
      
      {/* Dangerously inject the user's custom HTML */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

HtmlEmbed.craft = {
  displayName: "HTML Embed",
  props: { 
    html: "<div style=\"padding: 20px; background: #f3f4f6; text-align: center; border: 2px dashed #ccc; border-radius: 8px; color: #666;\">\n  <strong>Custom HTML Block</strong><br/>\n  Click to edit in settings panel.\n</div>" 
  },
  rules: { canDrag: () => true },
  related: { settings: HtmlEmbedSettings },
};
