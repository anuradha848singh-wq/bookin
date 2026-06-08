"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Image as ImageIcon } from "lucide-react";

interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  objectFit?: "cover" | "contain" | "fill";
}

export const ImageSettings = () => {
  const { actions: { setProp }, src, alt, width, height, borderRadius, objectFit } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    borderRadius: node.data.props.borderRadius,
    objectFit: node.data.props.objectFit,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Image URL</label>
        <input 
          type="text" 
          value={src} 
          onChange={(e) => setProp((p: ImageProps) => { p.src = e.target.value; })} 
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[11px] focus:outline-none focus:border-[#0066FF] transition-colors" 
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Alt Text</label>
        <input 
          type="text" 
          value={alt} 
          onChange={(e) => setProp((p: ImageProps) => { p.alt = e.target.value; })} 
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[11px] focus:outline-none focus:border-[#0066FF] transition-colors" 
          placeholder="Image description"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
            <span className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">W</span>
            <input 
              type="number" 
              value={width || 300} 
              onChange={(e) => setProp((p: ImageProps) => { p.width = parseInt(e.target.value) || 300; })} 
              className="w-full py-1 px-2 text-[11px] bg-transparent focus:outline-none" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
            <span className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">H</span>
            <input 
              type="number" 
              value={height || 200} 
              onChange={(e) => setProp((p: ImageProps) => { p.height = parseInt(e.target.value) || 200; })} 
              className="w-full py-1 px-2 text-[11px] bg-transparent focus:outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Border Radius</label>
        <input 
          type="range" 
          min={0} 
          max={50} 
          value={borderRadius || 0} 
          onChange={(e) => setProp((p: ImageProps) => { p.borderRadius = parseInt(e.target.value); })} 
          className="w-full" 
        />
        <span className="text-[10px] text-gray-500 text-center">{borderRadius || 0}px</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Object Fit</label>
        <select 
          value={objectFit || "cover"} 
          onChange={(e) => setProp((p: ImageProps) => { p.objectFit = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </div>
  );
};

export const Image = ({ 
  src = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800", 
  alt = "Image", 
  width = 300, 
  height = 200, 
  borderRadius = 0,
  objectFit = "cover"
}: ImageProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`, 
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px",
        overflow: "hidden",
        position: "relative"
      }}
      className="flex-shrink-0"
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: objectFit 
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ImageIcon size={32} className="text-gray-400" />
        </div>
      )}
    </div>
  );
};

Image.craft = {
  displayName: "Image",
  props: { 
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800", 
    alt: "Image", 
    width: 300, 
    height: 200, 
    borderRadius: 0,
    objectFit: "cover"
  },
  related: { settings: ImageSettings },
};
