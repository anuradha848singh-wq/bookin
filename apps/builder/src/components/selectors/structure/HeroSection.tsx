"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Text } from "../content/Text";
import { Button } from "../content/Button";
import { Container } from "../structure/Container";

interface HeroSectionProps {
  background?: string;
  paddingY?: number;
  parallax?: boolean;
}

export const HeroSectionSettings = () => {
  const { actions: { setProp }, background, paddingY, parallax } = useNode((node) => ({
    background: node.data.props.background,
    paddingY: node.data.props.paddingY,
    parallax: node.data.props.parallax,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
          <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
          <input type="color" value={background || "#ffffff"} onChange={(e) => setProp((p: HeroSectionProps) => { p.background = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer">
          Parallax Background
          <input type="checkbox" checked={parallax || false} onChange={(e) => setProp((p: HeroSectionProps) => { p.parallax = e.target.checked; })} className="accent-black" />
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spacing Y</label>
        <input type="range" min={40} max={200} value={paddingY || 100} onChange={(e) => setProp((p: HeroSectionProps) => { p.paddingY = parseInt(e.target.value); })} className="w-full" />
      </div>
    </div>
  );
};

export const HeroSection = ({ background = "#ffffff", paddingY = 100, parallax = false }: HeroSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background, 
        padding: `${paddingY}px 20px`, 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px",
        backgroundAttachment: parallax ? "fixed" : "scroll",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
      className={`flex flex-col items-center justify-center text-center w-full relative border-b border-[#E5E5E5] ${parallax ? 'bg-fixed' : ''}`}
    >
      <div className="max-w-3xl w-full mx-auto flex flex-col items-center gap-6">
        <Element id="hero-text" is={Container} padding={0} background="transparent" canvas>
          <Text text="Wireframe Hero Title" fontSize={48} fontWeight="600" textAlign="center" color="#111827" />
          <Text text="A sophisticated, structural placeholder for the hero copy. This establishes visual hierarchy without relying on color or marketing fluff." fontSize={18} textAlign="center" color="#6B7280" />
        </Element>
        <Element id="hero-actions" is={Container} padding={0} background="transparent" canvas>
          <div className="flex items-center gap-4 mt-2">
            <Button text="Primary Action" background="#111827" color="#ffffff" paddingX={24} paddingY={12} fontSize={14} borderRadius={4} />
            <Button text="Secondary" background="#F3F4F6" color="#111827" paddingX={24} paddingY={12} fontSize={14} borderRadius={4} />
          </div>
        </Element>
      </div>
    </div>
  );
};

HeroSection.craft = {
  displayName: "Hero Section",
  props: { background: "#ffffff", paddingY: 100, parallax: false },
  rules: { canDrag: () => true },
  related: { settings: HeroSectionSettings },
};
