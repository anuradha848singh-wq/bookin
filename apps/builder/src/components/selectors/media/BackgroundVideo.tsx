"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";

interface BackgroundVideoProps {
  url?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: number;
  padding?: number;
}

export const BackgroundVideoSettings = () => {
  const { actions: { setProp }, url, overlayColor, overlayOpacity, height, padding } = useNode((node) => ({
    url: node.data.props.url,
    overlayColor: node.data.props.overlayColor,
    overlayOpacity: node.data.props.overlayOpacity,
    height: node.data.props.height,
    padding: node.data.props.padding,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Video Source (MP4)</label>
        <input 
          type="text" 
          value={url || ""} 
          onChange={(e) => setProp((p: BackgroundVideoProps) => { p.url = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Direct MP4 URL..."
        />
        <span className="text-[10px] text-gray-400">Must be a direct link to a video file (.mp4, .webm). YouTube links do not work for background videos.</span>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Height (px)</div>
            <input 
              type="number" 
              value={height || 500} 
              onChange={(e) => setProp((p: BackgroundVideoProps) => { p.height = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Padding</div>
            <input 
              type="number" 
              value={padding || 40} 
              onChange={(e) => setProp((p: BackgroundVideoProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Overlay Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={overlayColor || "#000000"} onChange={(e) => setProp((p: BackgroundVideoProps) => { p.overlayColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Opacity (%)</div>
            <input 
              type="number" 
              min={0}
              max={100}
              value={Math.round((overlayOpacity || 0.5) * 100)} 
              onChange={(e) => setProp((p: BackgroundVideoProps) => { p.overlayOpacity = (parseInt(e.target.value) || 0) / 100; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BackgroundVideo = ({ 
  url = "https://cdn.pixabay.com/vimeo/328940142/waves-22873.mp4?width=1280&hash=bd9a4cb3e0e71ce0ed6b7b2520c4516ff2580798",
  overlayColor = "#000000",
  overlayOpacity = 0.5,
  height = 500,
  padding = 40
}: BackgroundVideoProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  // AutoPlay is disabled in editor for sanity, but we show a static frame or play it. 
  // Let's actually play it because background videos are usually ambient.
  const playAmbient = true; 

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="relative w-full overflow-hidden flex flex-col justify-center items-center"
      style={{ 
        minHeight: `${height}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Background Video Layer */}
      {url && (
        <video
          src={url}
          autoPlay={playAmbient}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      
      {/* Overlay Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
      />

      {/* Content Canvas Area */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto h-full min-h-[200px]"
        style={{ padding: `${padding}px` }}
      >
        <Element id="bg-video-content" is={Container} canvas padding={0} background="transparent" />
      </div>
    </div>
  );
};

BackgroundVideo.craft = {
  displayName: "Background Video",
  props: { 
    url: "https://cdn.pixabay.com/video/2021/08/04/83864-584742637_tiny.mp4",
    overlayColor: "#000000",
    overlayOpacity: 0.5,
    height: 500,
    padding: 40
  },
  rules: { canDrag: () => true },
  related: { settings: BackgroundVideoSettings },
};
