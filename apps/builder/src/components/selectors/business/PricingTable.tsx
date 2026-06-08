"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Check } from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

interface PricingTableProps {
  tiers?: PricingTier[];
  primaryColor?: string;
  backgroundColor?: string;
}

export const PricingTableSettings = () => {
  const { actions: { setProp }, tiers, primaryColor, backgroundColor } = useNode((node) => ({
    tiers: node.data.props.tiers as PricingTier[],
    primaryColor: node.data.props.primaryColor,
    backgroundColor: node.data.props.backgroundColor,
  }));

  const updateTier = (index: number, key: keyof PricingTier, value: any) => {
    setProp((props: PricingTableProps) => {
      if (props.tiers && props.tiers[index]) {
        (props.tiers[index] as any)[key] = value;
      }
    });
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    setProp((props: PricingTableProps) => {
      if (props.tiers && props.tiers[tierIndex] && props.tiers[tierIndex].features) {
        props.tiers[tierIndex].features[featureIndex] = value;
      }
    });
  };

  const addFeature = (tierIndex: number) => {
    setProp((props: PricingTableProps) => {
      if (props.tiers && props.tiers[tierIndex]) {
        props.tiers[tierIndex].features.push("New Feature");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Primary</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: PricingTableProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#FAFAFA"} onChange={(e) => setProp((p: PricingTableProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tiers</label>
        {tiers && tiers.map((tier, tIndex) => (
          <div key={tier.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">{tier.name}</span>
              <label className="flex items-center gap-2 text-[10px] text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={tier.isPopular} 
                  onChange={(e) => updateTier(tIndex, "isPopular", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                Highlighted
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={tier.name} onChange={(e) => updateTier(tIndex, "name", e.target.value)} className="px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Tier Name" />
              <input type="text" value={tier.price} onChange={(e) => updateTier(tIndex, "price", e.target.value)} className="px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Price (e.g. $29)" />
            </div>
            
            <input type="text" value={tier.period} onChange={(e) => updateTier(tIndex, "period", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Period (e.g. /month)" />
            <input type="text" value={tier.description} onChange={(e) => updateTier(tIndex, "description", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Description" />
            <input type="text" value={tier.buttonText} onChange={(e) => updateTier(tIndex, "buttonText", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Button Text" />
            
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Features</label>
              {tier.features.map((feature, fIndex) => (
                <div key={fIndex} className="flex gap-1">
                  <input type="text" value={feature} onChange={(e) => updateFeature(tIndex, fIndex, e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" />
                </div>
              ))}
              <button onClick={() => addFeature(tIndex)} className="text-[10px] text-blue-600 text-left hover:underline font-medium">+ Add Feature</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PricingTable = ({ 
  tiers = [
    {
      id: "1",
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals and small teams.",
      features: ["Up to 3 users", "Basic analytics", "24-hour support response", "Custom domain"],
      buttonText: "Start Basic",
      isPopular: false
    },
    {
      id: "2",
      name: "Pro",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses and agencies.",
      features: ["Up to 10 users", "Advanced analytics", "1-hour support response", "Custom domain", "API Access"],
      buttonText: "Start Pro",
      isPopular: true
    },
    {
      id: "3",
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large scale organizations.",
      features: ["Unlimited users", "Custom reporting", "Dedicated account manager", "Custom domain", "API Access", "SSO Login"],
      buttonText: "Contact Sales",
      isPopular: false
    }
  ],
  primaryColor = "#0066FF",
  backgroundColor = "#FAFAFA"
}: PricingTableProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full py-12 px-4 md:px-8"
      style={{ 
        backgroundColor,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 justify-center items-stretch">
        {tiers && tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`flex-1 flex flex-col p-8 rounded-2xl relative transition-transform hover:-translate-y-1 ${tier.isPopular ? 'bg-white shadow-xl border-2' : 'bg-white shadow-sm border border-gray-200'}`}
            style={{ borderColor: tier.isPopular ? primaryColor : undefined, zIndex: tier.isPopular ? 10 : 1 }}
          >
            {tier.isPopular && (
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: primaryColor }}
              >
                Most Popular
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{tier.description}</p>
            
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">{tier.price}</span>
              <span className="text-sm font-medium text-gray-500">{tier.period}</span>
            </div>
            
            <button 
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 mb-8`}
              style={{ 
                backgroundColor: tier.isPopular ? primaryColor : "transparent",
                color: tier.isPopular ? "white" : primaryColor,
                border: tier.isPopular ? "none" : `2px solid ${primaryColor}`
              }}
            >
              {tier.buttonText}
            </button>
            
            <div className="flex flex-col gap-4 flex-1">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">What's included</p>
              <ul className="flex flex-col gap-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check size={18} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PricingTable.craft = {
  displayName: "Pricing Table",
  props: { 
    tiers: [
      {
        id: "1",
        name: "Basic",
        price: "$29",
        period: "/month",
        description: "Perfect for individuals and small teams.",
        features: ["Up to 3 users", "Basic analytics", "24-hour support response", "Custom domain"],
        buttonText: "Start Basic",
        isPopular: false
      },
      {
        id: "2",
        name: "Pro",
        price: "$79",
        period: "/month",
        description: "Ideal for growing businesses and agencies.",
        features: ["Up to 10 users", "Advanced analytics", "1-hour support response", "Custom domain", "API Access"],
        buttonText: "Start Pro",
        isPopular: true
      },
      {
        id: "3",
        name: "Enterprise",
        price: "$199",
        period: "/month",
        description: "For large scale organizations.",
        features: ["Unlimited users", "Custom reporting", "Dedicated account manager", "Custom domain", "API Access", "SSO Login"],
        buttonText: "Contact Sales",
        isPopular: false
      }
    ],
    primaryColor: "#0066FF",
    backgroundColor: "#FAFAFA"
  },
  rules: { canDrag: () => true },
  related: { settings: PricingTableSettings },
};
