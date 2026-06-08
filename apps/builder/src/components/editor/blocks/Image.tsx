"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { ImageIcon } from "lucide-react";

interface ImageProps {
  src?: string;
  alt?: string;
  borderRadius?: number;
  width?: string;
  height?: string;
  padding?: number;
  shadow?: string;
  lazyLoad?: boolean;
  optimizeFormat?: boolean;
}

export const ImageSettings = () => {
  const { 
    actions: { setProp }, 
    src, 
    alt, 
    borderRadius,
    width,
    height,
    padding,
    shadow,
    lazyLoad,
    optimizeFormat
  } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    borderRadius: node.data.props.borderRadius,
    width: node.data.props.width,
    height: node.data.props.height,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    lazyLoad: node.data.props.lazyLoad,
    optimizeFormat: node.data.props.optimizeFormat,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Image Source</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>URL</label>
          <input 
            type="text" 
            value={src || ""} 
            onChange={(e) => setProp((p: ImageProps) => { p.src = e.target.value; })} 
            className={inputClass}
            placeholder="Image path or absolute URL..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Alt Description</label>
          <input 
            type="text" 
            value={alt || ""} 
            onChange={(e) => setProp((p: ImageProps) => { p.alt = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Doctor consulting patient"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Styling & Layout</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Width</label>
            <input 
              type="text" 
              value={width || "100%"} 
              onChange={(e) => setProp((p: ImageProps) => { p.width = e.target.value; })} 
              className={inputClass}
              placeholder="e.g. 100%, 250px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Height</label>
            <input 
              type="text" 
              value={height || "auto"} 
              onChange={(e) => setProp((p: ImageProps) => { p.height = e.target.value; })} 
              className={inputClass}
              placeholder="e.g. auto, 250px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="number" 
              value={padding || 0} 
              onChange={(e) => setProp((p: ImageProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Corner Radius</label>
            <input 
              type="number" 
              value={borderRadius || 0} 
              onChange={(e) => setProp((p: ImageProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <label className={labelClass}>Box Shadow</label>
          <select
            value={shadow || "none"}
            onChange={(e) => setProp((p: ImageProps) => { p.shadow = e.target.value; })}
            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
          >
            <option value="none">None</option>
            <option value="0 1px 3px rgba(0,0,0,0.1)">Small (sm)</option>
            <option value="0 4px 6px -1px rgba(0,0,0,0.1)">Medium (md)</option>
            <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Large (lg)</option>
            <option value="0 20px 25px -5px rgba(0,0,0,0.1)">Extra Large (xl)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Performance</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={lazyLoad !== false} // Default to true
              onChange={(e) => setProp((p: ImageProps) => { p.lazyLoad = e.target.checked; })} 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-gray-700">Lazy Load Image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={optimizeFormat !== false} // Default to true
              onChange={(e) => setProp((p: ImageProps) => { p.optimizeFormat = e.target.checked; })} 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-gray-700">Serve WebP/AVIF</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export const Image = ({ 
  src, 
  alt = "Custom Image", 
  borderRadius = 8, 
  width = "100%", 
  height = "auto", 
  padding = 0,
  shadow = "none",
  lazyLoad = true,
  optimizeFormat = true
}: ImageProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const hasImage = !!src;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        padding: `${padding}px`, 
        width,
        height,
        boxSizing: "border-box",
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px", 
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hasImage ? (
        <img 
          src={optimizeFormat && src && !src.includes('format=webp') ? `${src}${src.includes('?') ? '&' : '?'}format=webp` : src} 
          alt={alt} 
          loading={lazyLoad ? "lazy" : "eager"}
          decoding={lazyLoad ? "async" : "auto"}
          style={{ 
            borderRadius: `${borderRadius}px`, 
            width: "100%",
            height: "100%",
            objectFit: "cover",
            boxShadow: shadow,
          }}
        />
      ) : (
        <div 
          style={{ 
            borderRadius: `${borderRadius}px`, 
            width: "100%",
            height: "150px",
            background: "#F3F4F6",
            border: "2px dashed #D1D5DB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#9CA3AF"
          }}
        >
          <ImageIcon size={28} strokeWidth={1.5} />
          <span style={{ fontSize: "11px", fontWeight: "bold" }}>No Image Selected</span>
        </div>
      )}
    </div>
  );
};

Image.craft = {
  displayName: "Image",
  props: { 
    alt: "Custom Image",
    borderRadius: 8, 
    width: "100%", 
    height: "auto", 
    padding: 0,
    shadow: "none",
    lazyLoad: true,
    optimizeFormat: true
  },
  rules: { canDrag: () => true },
  related: { settings: ImageSettings },
};
