"use client";

import React, { useEffect } from "react";
import { useNode } from "@craftjs/core";

interface ScrollProgressProps {
  height?: number;
  color?: string;
}

export const ScrollProgressSettings = () => {
  const { actions: { setProp }, height, color } = useNode((node) => ({
    height: node.data.props.height,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Color</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input 
            type="color" 
            value={color || "#0066FF"} 
            onChange={(e) => setProp((p: ScrollProgressProps) => { p.color = e.target.value; })} 
            className="w-full h-6 cursor-pointer border-none bg-transparent" 
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height (px)</label>
        <input 
          type="range" min={1} max={10} 
          value={height || 4} 
          onChange={(e) => setProp((p: ScrollProgressProps) => { p.height = parseInt(e.target.value); })} 
          className="w-full accent-black" 
        />
      </div>
    </div>
  );
};

export const ScrollProgress = ({ height = 4, color = "#0066FF" }: ScrollProgressProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  useEffect(() => {
    const handleScroll = () => {
      // In the builder, we listen to the canvas wrapper scroll
      const canvasWrapper = document.getElementById('craft-canvas-root') || document.documentElement;
      const winScroll = canvasWrapper.scrollTop || document.documentElement.scrollTop;
      const calcHeight = (canvasWrapper.scrollHeight || document.documentElement.scrollHeight) - (canvasWrapper.clientHeight || document.documentElement.clientHeight);
      const scrolled = (winScroll / calcHeight) * 100;
      
      const bars = document.querySelectorAll('.scroll-progress-bar') as NodeListOf<HTMLElement>;
      bars.forEach(bar => {
        bar.style.width = scrolled + "%";
      });
    };

    // Attach to window and the builder's overflow container if needed
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "2px" }}
      className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
    >
      <div 
        className="scroll-progress-bar transition-all duration-150" 
        style={{ height: `${height}px`, background: color, width: '0%' }}
      />
      {/* Script injected for published sites to calculate scroll autonomously */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.addEventListener('scroll', function() {
          var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          var scrolled = (winScroll / height) * 100;
          var bars = document.querySelectorAll('.scroll-progress-bar');
          bars.forEach(function(bar) { bar.style.width = scrolled + "%"; });
        });
      `}} />
    </div>
  );
};

ScrollProgress.craft = {
  displayName: "Scroll Progress",
  props: { height: 4, color: "#0066FF" },
  rules: { canDrag: () => true },
  related: { settings: ScrollProgressSettings },
};
