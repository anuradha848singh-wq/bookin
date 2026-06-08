"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Play } from "lucide-react";

interface VideoProps {
  url?: string;
  borderRadius?: number;
  width?: string;
  height?: string;
  padding?: number;
  shadow?: string;
}

export const VideoSettings = () => {
  const { 
    actions: { setProp }, 
    url, 
    borderRadius,
    width,
    height,
    padding,
    shadow
  } = useNode((node) => ({
    url: node.data.props.url,
    borderRadius: node.data.props.borderRadius,
    width: node.data.props.width,
    height: node.data.props.height,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Video Link</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>YouTube or Video URL</label>
          <input 
            type="text" 
            value={url || ""} 
            onChange={(e) => setProp((p: VideoProps) => { p.url = e.target.value; })} 
            className={inputClass}
            placeholder="YouTube embed path, or mp4 URL..."
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
              onChange={(e) => setProp((p: VideoProps) => { p.width = e.target.value; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Height (px)</label>
            <input 
              type="text" 
              value={height || "315px"} 
              onChange={(e) => setProp((p: VideoProps) => { p.height = e.target.value; })} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="number" 
              value={padding || 0} 
              onChange={(e) => setProp((p: VideoProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Corner Radius</label>
            <input 
              type="number" 
              value={borderRadius || 8} 
              onChange={(e) => setProp((p: VideoProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <label className={labelClass}>Box Shadow</label>
          <select
            value={shadow || "none"}
            onChange={(e) => setProp((p: VideoProps) => { p.shadow = e.target.value; })}
            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
          >
            <option value="none">None</option>
            <option value="0 4px 6px -1px rgba(0,0,0,0.1)">Medium (md)</option>
            <option value="0 10px 15px -3px rgba(0,0,0,0.1)">Large (lg)</option>
            <option value="0 20px 25px -5px rgba(0,0,0,0.1)">Extra Large (xl)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const Video = ({ 
  url, 
  borderRadius = 8, 
  width = "100%", 
  height = "315px", 
  padding = 0,
  shadow = "none"
}: VideoProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  // Simple YouTube url regex matching
  const getEmbedUrl = (link?: string) => {
    if (!link) return "";
    let videoId = "";
    if (link.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(link).search);
      videoId = urlParams.get("v") || "";
    } else if (link.includes("youtu.be/")) {
      videoId = link.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (link.includes("youtube.com/embed/")) {
      return link; // Already embed
    }
    
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return link; // Fallback to raw link
  };

  const embedUrl = getEmbedUrl(url);

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
      {url ? (
        <iframe
          src={embedUrl}
          title="Embedded Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: `${borderRadius}px`,
            width: "100%",
            height: "100%",
            boxShadow: shadow,
          }}
        />
      ) : (
        <div 
          style={{ 
            borderRadius: `${borderRadius}px`, 
            width: "100%",
            height: "100%",
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
          <Play size={28} strokeWidth={1.5} />
          <span style={{ fontSize: "11px", fontWeight: "bold" }}>No Video Link Configured</span>
        </div>
      )}
    </div>
  );
};

Video.craft = {
  displayName: "Video",
  props: { 
    borderRadius: 8, 
    width: "100%", 
    height: "315px", 
    padding: 0,
    shadow: "none"
  },
  rules: { canDrag: () => true },
  related: { settings: VideoSettings },
};
