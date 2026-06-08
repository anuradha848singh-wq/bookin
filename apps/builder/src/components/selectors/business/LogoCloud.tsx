"use client";

import React, { useEffect, useState } from "react";
import { useNode } from "@craftjs/core";

interface Logo {
  id: string;
  url: string;
  name: string;
}

interface LogoCloudProps {
  title?: string;
  logos?: Logo[];
  animation?: "none" | "marquee" | "fade";
  speed?: number;
  grayscale?: boolean;
  opacity?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const LogoCloudSettings = () => {
  const { actions: { setProp }, title, logos, animation, speed, grayscale, opacity, backgroundColor, textColor } = useNode((node) => ({
    title: node.data.props.title,
    logos: node.data.props.logos as Logo[],
    animation: node.data.props.animation,
    speed: node.data.props.speed,
    grayscale: node.data.props.grayscale,
    opacity: node.data.props.opacity,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
  }));

  const updateLogo = (index: number, key: keyof Logo, value: string) => {
    setProp((props: LogoCloudProps) => {
      if (props.logos && props.logos[index]) {
        props.logos[index][key] = value;
      }
    });
  };

  const removeLogo = (index: number) => {
    setProp((props: LogoCloudProps) => {
      if (props.logos) {
        props.logos.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Section Details</label>
        <input 
          type="text" 
          value={title || ""} 
          onChange={(e) => setProp((p: LogoCloudProps) => { p.title = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Section Title (e.g. Trusted By)"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: LogoCloudProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#6B7280"} onChange={(e) => setProp((p: LogoCloudProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Logo Display</label>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8">
            <input 
              type="checkbox" 
              checked={grayscale} 
              onChange={(e) => setProp((p: LogoCloudProps) => { p.grayscale = e.target.checked; })}
              className="rounded border-gray-300 text-blue-600"
            />
            Grayscale Filter
          </label>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Opacity</div>
            <input 
              type="number" 
              min={0} max={1} step={0.1}
              value={opacity || 0.6} 
              onChange={(e) => setProp((p: LogoCloudProps) => { p.opacity = parseFloat(e.target.value) || 0.6; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>

        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Animation</div>
          <select 
            value={animation || "marquee"} 
            onChange={(e) => setProp((p: LogoCloudProps) => { p.animation = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="none">Static Grid</option>
            <option value="marquee">Scrolling Marquee</option>
            <option value="fade">Fade Cycle</option>
          </select>
        </div>
        
        {animation === "marquee" && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Speed (s)</div>
            <input 
              type="number" 
              value={speed || 20} 
              onChange={(e) => setProp((p: LogoCloudProps) => { p.speed = parseInt(e.target.value) || 20; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Logos ({logos?.length || 0})</label>
        {logos && logos.map((logo, index) => (
          <div key={logo.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Logo {index + 1}</span>
              <button onClick={() => removeLogo(index)} className="text-[10px] text-red-500 font-semibold uppercase">Remove</button>
            </div>
            <input type="text" value={logo.name} onChange={(e) => updateLogo(index, "name", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Company Name" />
            <input type="text" value={logo.url} onChange={(e) => updateLogo(index, "url", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Image URL (PNG/SVG)" />
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: LogoCloudProps) => {
              if (!p.logos) p.logos = [];
              p.logos.push({ id: Date.now().toString(), name: "Company", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" });
            });
          }}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Logo
        </button>
      </div>
    </div>
  );
};

export const LogoCloud = ({ 
  title = "Trusted by innovative teams worldwide",
  logos = [
    { id: "1", name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { id: "2", name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { id: "3", name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: "4", name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { id: "5", name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
  ],
  animation = "marquee",
  speed = 20,
  grayscale = true,
  opacity = 0.6,
  backgroundColor = "#ffffff",
  textColor = "#6B7280"
}: LogoCloudProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full py-12 px-4 overflow-hidden"
      style={{ 
        backgroundColor,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {title && (
          <p className="text-sm font-semibold uppercase tracking-wider mb-8 text-center" style={{ color: textColor }}>
            {title}
          </p>
        )}

        {animation === "marquee" ? (
          <div className="relative w-full flex overflow-hidden group">
            {/* We render two sets of logos side-by-side to make the infinite scroll seamless */}
            {[1, 2].map((set) => (
              <div 
                key={set}
                className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10 flex-shrink-0 animate-marquee"
                style={{ 
                  animationDuration: `${speed}s`,
                  animationPlayState: isSelected ? 'paused' : 'running'
                }}
              >
                {logos.map((logo) => (
                  <img
                    key={`${set}-${logo.id}`}
                    src={logo.url}
                    alt={logo.name}
                    className="h-8 sm:h-10 object-contain max-w-[150px] transition-all hover:opacity-100 hover:filter-none cursor-pointer"
                    style={{ 
                      filter: grayscale ? 'grayscale(100%)' : 'none',
                      opacity
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
            {logos.map((logo) => (
              <img
                key={logo.id}
                src={logo.url}
                alt={logo.name}
                className="h-8 sm:h-10 object-contain max-w-[150px] transition-all hover:opacity-100 hover:filter-none hover:scale-105 cursor-pointer"
                style={{ 
                  filter: grayscale ? 'grayscale(100%)' : 'none',
                  opacity
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Required CSS for the marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}} />
    </div>
  );
};

LogoCloud.craft = {
  displayName: "Logo Cloud",
  props: { 
    title: "Trusted by innovative teams worldwide",
    logos: [
      { id: "1", name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
      { id: "2", name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
      { id: "3", name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
      { id: "4", name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { id: "5", name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    ],
    animation: "marquee",
    speed: 20,
    grayscale: true,
    opacity: 0.6,
    backgroundColor: "#ffffff",
    textColor: "#6B7280"
  },
  rules: { canDrag: () => true },
  related: { settings: LogoCloudSettings },
};
