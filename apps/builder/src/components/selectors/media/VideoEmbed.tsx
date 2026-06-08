"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Video } from "lucide-react";

interface VideoEmbedProps {
  url?: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export const VideoEmbedSettings = () => {
  const { actions: { setProp }, url, width, height, autoplay, controls, muted } = useNode((node) => ({
    url: node.data.props.url,
    width: node.data.props.width,
    height: node.data.props.height,
    autoplay: node.data.props.autoplay,
    controls: node.data.props.controls,
    muted: node.data.props.muted,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Video URL</label>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setProp((p: VideoEmbedProps) => { p.url = e.target.value; })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
        <p className="text-[10px] text-gray-500">Supports YouTube, Vimeo, and direct video URLs</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Width</label>
          <input 
            type="text" 
            value={width} 
            onChange={(e) => setProp((p: VideoEmbedProps) => { p.width = e.target.value; })}
            placeholder="100%"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height</label>
          <input 
            type="text" 
            value={height} 
            onChange={(e) => setProp((p: VideoEmbedProps) => { p.height = e.target.value; })}
            placeholder="400px"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Autoplay</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoplay}
              onChange={(e) => setProp((p: VideoEmbedProps) => { p.autoplay = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Show Controls</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={controls}
              onChange={(e) => setProp((p: VideoEmbedProps) => { p.controls = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Muted</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={muted}
              onChange={(e) => setProp((p: VideoEmbedProps) => { p.muted = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

// Helper to convert YouTube/Vimeo URLs to embed URLs
const getEmbedUrl = (url: string, autoplay: boolean, controls: boolean, muted: boolean): string => {
  if (!url) return "";

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      controls: controls ? "1" : "0",
      mute: muted ? "1" : "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      controls: controls ? "1" : "0",
      muted: muted ? "1" : "0",
    });
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }

  // Direct video URL
  return url;
};

export const VideoEmbed = ({ 
  url = "", 
  width = "100%", 
  height = "400px",
  autoplay = false,
  controls = true,
  muted = false
}: VideoEmbedProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const embedUrl = getEmbedUrl(url, autoplay, controls, muted);
  const isDirectVideo = embedUrl === url && url && !url.includes('youtube') && !url.includes('vimeo');

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        width,
        height,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        position: "relative",
      }}
    >
      {!url ? (
        <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
          <Video size={48} className="text-gray-400" />
          <p className="text-sm text-gray-500">Add a video URL in settings</p>
        </div>
      ) : isDirectVideo ? (
        <video
          src={embedUrl}
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        />
      ) : (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: "8px" }}
        />
      )}
    </div>
  );
};

VideoEmbed.craft = {
  displayName: "Video",
  props: { url: "", width: "100%", height: "400px", autoplay: false, controls: true, muted: false },
  related: { settings: VideoEmbedSettings },
};
