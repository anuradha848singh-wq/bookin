"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Play } from "lucide-react";

interface AdvancedVideoProps {
  url?: string;
  sourceType?: "youtube" | "vimeo" | "mp4";
  coverImage?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
  borderRadius?: number;
  playButtonColor?: string;
}

export const AdvancedVideoSettings = () => {
  const { actions: { setProp }, url, sourceType, coverImage, autoPlay, loop, muted, controls, aspectRatio, borderRadius, playButtonColor } = useNode((node) => ({
    url: node.data.props.url,
    sourceType: node.data.props.sourceType,
    coverImage: node.data.props.coverImage,
    autoPlay: node.data.props.autoPlay,
    loop: node.data.props.loop,
    muted: node.data.props.muted,
    controls: node.data.props.controls,
    aspectRatio: node.data.props.aspectRatio,
    borderRadius: node.data.props.borderRadius,
    playButtonColor: node.data.props.playButtonColor,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Video Source</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={sourceType || "youtube"} 
            onChange={(e) => setProp((p: AdvancedVideoProps) => { p.sourceType = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="mp4">Direct MP4 URL</option>
          </select>
        </div>
        <input 
          type="text" 
          value={url || ""} 
          onChange={(e) => setProp((p: AdvancedVideoProps) => { p.url = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Video URL"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Custom Cover Image (Optional)</label>
        <input 
          type="text" 
          value={coverImage || ""} 
          onChange={(e) => setProp((p: AdvancedVideoProps) => { p.coverImage = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Image URL"
        />
        {coverImage && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Play Button</div>
            <input type="color" value={playButtonColor || "#EF4444"} onChange={(e) => setProp((p: AdvancedVideoProps) => { p.playButtonColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Ratio</div>
            <select 
              value={aspectRatio || "16/9"} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.aspectRatio = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="16/9">16:9</option>
              <option value="4/3">4:3</option>
              <option value="1/1">1:1</option>
              <option value="9/16">9:16 (Vertical)</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius</div>
            <input 
              type="number" 
              value={borderRadius || 12} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Playback Options</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoPlay} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.autoPlay = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            AutoPlay
          </label>
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={loop} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.loop = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Loop
          </label>
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={muted} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.muted = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Muted
          </label>
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={controls} 
              onChange={(e) => setProp((p: AdvancedVideoProps) => { p.controls = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Controls
          </label>
        </div>
        <span className="text-[10px] text-gray-400 mt-1">Note: Browsers usually require videos to be Muted for AutoPlay to work.</span>
      </div>
    </div>
  );
};

export const AdvancedVideo = ({ 
  url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  sourceType = "youtube",
  coverImage = "",
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  aspectRatio = "16/9",
  borderRadius = 12,
  playButtonColor = "#EF4444"
}: AdvancedVideoProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isPlaying, setIsPlaying] = useState(false);

  // In editor, never autoplay real videos so they don't annoy the user
  const effectiveAutoPlay = isSelected ? false : autoPlay;
  const showCover = coverImage && !isPlaying && !effectiveAutoPlay;

  const getEmbedUrl = () => {
    if (!url) return "";
    
    let embedUrl = url;
    let params = new URLSearchParams();
    
    if (effectiveAutoPlay) params.append("autoplay", "1");
    if (loop) params.append("loop", "1");
    if (muted) params.append("mute", "1");
    if (!controls) params.append("controls", "0");

    if (sourceType === "youtube") {
      // Extract video ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      if (id) {
        if (loop) params.append("playlist", id); // YT needs playlist for loop
        embedUrl = `https://www.youtube.com/embed/${id}?${params.toString()}`;
      }
    } else if (sourceType === "vimeo") {
      const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
      const match = url.match(regExp);
      const id = match ? match[1] : null;
      if (id) {
        if (muted) params.append("muted", "1");
        embedUrl = `https://player.vimeo.com/video/${id}?${params.toString()}`;
      }
    }

    return embedUrl;
  };

  const getAspectClass = () => {
    switch(aspectRatio) {
      case "4/3": return "aspect-[4/3]";
      case "1/1": return "aspect-square";
      case "9/16": return "aspect-[9/16]";
      case "16/9":
      default: return "aspect-video";
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`relative w-full overflow-hidden bg-gray-100 ${getAspectClass()}`}
      style={{ 
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {showCover ? (
        <div 
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img src={coverImage} alt="Video cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 pl-1"
              style={{ backgroundColor: playButtonColor }}
            >
              <Play size={28} fill="white" color="white" />
            </div>
          </div>
        </div>
      ) : (
        sourceType === "mp4" ? (
          <video 
            src={url}
            className="w-full h-full object-cover"
            autoPlay={effectiveAutoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
          />
        ) : (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded Video"
          />
        )
      )}
    </div>
  );
};

AdvancedVideo.craft = {
  displayName: "Advanced Video",
  props: { 
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceType: "youtube",
    coverImage: "",
    autoPlay: false,
    loop: false,
    muted: false,
    controls: true,
    aspectRatio: "16/9",
    borderRadius: 12,
    playButtonColor: "#EF4444"
  },
  rules: { canDrag: () => true },
  related: { settings: AdvancedVideoSettings },
};
