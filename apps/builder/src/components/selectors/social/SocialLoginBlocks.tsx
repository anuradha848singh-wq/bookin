"use client";

import React from "react";
import { useNode } from "@craftjs/core";

import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle, FaGithub } from "react-icons/fa";

interface SocialLoginBlocksProps {
  providers?: string[];
  layout?: "vertical" | "horizontal";
  style?: "solid" | "outline" | "logo-only";
  buttonText?: string; // e.g. "Continue with"
  borderRadius?: number;
}

export const SocialLoginBlocksSettings = () => {
  const { actions: { setProp }, providers, layout, style, buttonText, borderRadius } = useNode((node) => ({
    providers: node.data.props.providers || ["google", "apple", "facebook"],
    layout: node.data.props.layout,
    style: node.data.props.style,
    buttonText: node.data.props.buttonText,
    borderRadius: node.data.props.borderRadius,
  }));

  const toggleProvider = (provider: string) => {
    setProp((props: SocialLoginBlocksProps) => {
      if (!props.providers) props.providers = [];
      if (props.providers.includes(provider)) {
        props.providers = props.providers.filter(p => p !== provider);
      } else {
        props.providers.push(provider);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Providers</label>
        <div className="grid grid-cols-2 gap-2">
          {["google", "apple", "facebook", "twitter", "github", "linkedin"].map(provider => (
            <label key={provider} className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer capitalize">
              <input 
                type="checkbox" 
                checked={providers?.includes(provider) || false} 
                onChange={() => toggleProvider(provider)}
                className="rounded border-gray-300 text-blue-600"
              />
              {provider}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Design</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Layout</div>
            <select 
              value={layout || "vertical"} 
              onChange={(e) => setProp((p: SocialLoginBlocksProps) => { p.layout = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Style</div>
            <select 
              value={style || "outline"} 
              onChange={(e) => setProp((p: SocialLoginBlocksProps) => { p.style = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="outline">Outline</option>
              <option value="solid">Solid (Brand)</option>
              <option value="logo-only">Logo Only</option>
            </select>
          </div>
        </div>
      </div>

      {style !== "logo-only" && (
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Button Text</label>
          <input 
            type="text" 
            value={buttonText || "Continue with"} 
            onChange={(e) => setProp((p: SocialLoginBlocksProps) => { p.buttonText = e.target.value; })} 
            className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
            placeholder="e.g. Sign in with"
          />
        </div>
      )}

      <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 mt-1">
        <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius (px)</div>
        <input 
          type="number" 
          value={borderRadius || 8} 
          onChange={(e) => setProp((p: SocialLoginBlocksProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
          className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
        />
      </div>
    </div>
  );
};

export const SocialLoginBlocks = ({ 
  providers = ["google", "apple", "facebook"],
  layout = "vertical",
  style = "outline",
  buttonText = "Continue with",
  borderRadius = 8
}: SocialLoginBlocksProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const getProviderConfig = (provider: string) => {
    switch(provider) {
      case "google": return { 
        name: "Google", 
        color: "#DB4437", 
        icon: <FaGoogle size={20} className={style === 'solid' ? 'text-white' : 'text-[#DB4437]'} /> 
      };
      case "apple": return { 
        name: "Apple", 
        color: "#000000", 
        icon: <svg viewBox="0 0 384 512" width="20" height="20" className={style === 'solid' ? 'fill-white' : 'fill-black'}><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-103.1 22.7-28.9 0-72.2-22.7-108.8-22.7-35.6 0-71.6 22.7-97.9 58.4-53.7 72.7-103.3 225.8-38.5 310.7 46 61.3 104.9 60.1 143.3 60.1 38.4 0 46-24.6 114.6-24.6 68.6 0 86.3 24.6 114.6 24.6 38.4 0 71.3-15.1 104.9-60.1 18.9-25.2 46-77.4 46-77.4-31.4-15.2-40.8-46.5-41-77.4v-4.9zm-87.3-211c19.1-24.6 38.4-58.4 34.6-96-34.6 2.5-64.9 22.7-86.3 49.3-19.1 24.6-38.4 58.4-34.6 96 34.6-2.5 64.9-22.7 86.3-49.3z"/></svg>
      };
      case "facebook": return { 
        name: "Facebook", 
        color: "#1877F2", 
        icon: <FaFacebook size={20} className={style === 'solid' ? 'text-white' : 'text-[#1877F2]'} /> 
      };
      case "twitter": return { 
        name: "Twitter", 
        color: "#1DA1F2", 
        icon: <FaTwitter size={20} className={style === 'solid' ? 'text-white' : 'text-[#1DA1F2]'} /> 
      };
      case "github": return { 
        name: "GitHub", 
        color: "#333333", 
        icon: <FaGithub size={20} className={style === 'solid' ? 'text-white' : 'text-[#333333]'} /> 
      };
      case "linkedin": return { 
        name: "LinkedIn", 
        color: "#0A66C2", 
        icon: <FaLinkedin size={20} className={style === 'solid' ? 'text-white' : 'text-[#0A66C2]'} /> 
      };
      default: return { name: provider, color: "#gray", icon: null };
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full flex ${layout === 'horizontal' ? 'flex-row flex-wrap justify-center' : 'flex-col'} gap-3`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
        transition: "outline 0.15s"
      }}
    >
      {providers.map((p) => {
        const config = getProviderConfig(p);
        
        if (style === "logo-only") {
          return (
            <button 
              key={p}
              className="w-12 h-12 flex items-center justify-center border border-gray-200 shadow-sm bg-white hover:bg-gray-50 transition-colors"
              style={{ borderRadius: `${borderRadius}px` }}
              title={`${buttonText} ${config.name}`}
            >
              {config.icon}
            </button>
          );
        }

        const isSolid = style === "solid";
        
        return (
          <button 
            key={p}
            className={`flex items-center justify-center gap-3 px-4 py-2.5 font-medium transition-transform active:scale-95 hover:shadow-md ${layout === 'horizontal' ? 'flex-1 min-w-[200px]' : 'w-full'}`}
            style={{ 
              borderRadius: `${borderRadius}px`,
              backgroundColor: isSolid ? config.color : "#ffffff",
              color: isSolid ? "#ffffff" : "#374151",
              border: isSolid ? "none" : "1px solid #D1D5DB",
            }}
          >
            {config.icon}
            <span>{buttonText} {config.name}</span>
          </button>
        );
      })}
    </div>
  );
};

SocialLoginBlocks.craft = {
  displayName: "Social Login",
  props: { 
    providers: ["google", "apple", "facebook"],
    layout: "vertical",
    style: "outline",
    buttonText: "Continue with",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: SocialLoginBlocksSettings },
};
