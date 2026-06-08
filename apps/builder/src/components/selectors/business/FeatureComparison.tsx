"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Check, X, Info } from "lucide-react";

interface ComparisonFeature {
  id: string;
  name: string;
  description?: string;
  values: (string | boolean)[];
}

interface FeatureComparisonProps {
  tiers?: string[];
  features?: ComparisonFeature[];
  primaryColor?: string;
}

export const FeatureComparisonSettings = () => {
  const { actions: { setProp }, tiers, features, primaryColor } = useNode((node) => ({
    tiers: node.data.props.tiers as string[],
    features: node.data.props.features as ComparisonFeature[],
    primaryColor: node.data.props.primaryColor,
  }));

  const updateTier = (index: number, value: string) => {
    setProp((props: FeatureComparisonProps) => {
      if (props.tiers) props.tiers[index] = value;
    });
  };

  const updateFeatureName = (index: number, value: string) => {
    setProp((props: FeatureComparisonProps) => {
      if (props.features) props.features[index].name = value;
    });
  };

  const updateFeatureValue = (featureIndex: number, tierIndex: number, value: string | boolean) => {
    setProp((props: FeatureComparisonProps) => {
      if (props.features) props.features[featureIndex].values[tierIndex] = value;
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Brand Color</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Primary</div>
          <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: FeatureComparisonProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Plans/Tiers</label>
        {tiers && tiers.map((tier, idx) => (
          <input 
            key={idx}
            type="text" 
            value={tier} 
            onChange={(e) => updateTier(idx, e.target.value)}
            className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
            placeholder={`Tier ${idx + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Features</label>
        {features && features.map((feature, fIdx) => (
          <div key={feature.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <input 
              type="text" 
              value={feature.name} 
              onChange={(e) => updateFeatureName(fIdx, e.target.value)}
              className="w-full px-2 py-1 text-[12px] font-bold border border-[#E5E5E5] rounded focus:outline-none" 
              placeholder="Feature Name"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {tiers && tiers.map((tier, tIdx) => (
                <div key={tIdx} className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-400 font-semibold truncate">{tier}</span>
                  <select
                    value={feature.values[tIdx] === true ? "true" : feature.values[tIdx] === false ? "false" : String(feature.values[tIdx])}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "true") updateFeatureValue(fIdx, tIdx, true);
                      else if (val === "false") updateFeatureValue(fIdx, tIdx, false);
                      else updateFeatureValue(fIdx, tIdx, val);
                    }}
                    className="w-full px-1 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none bg-gray-50"
                  >
                    <option value="true">Check (Yes)</option>
                    <option value="false">Cross (No)</option>
                    <option value="Unlimited">"Unlimited"</option>
                    <option value="Limited">"Limited"</option>
                    <option value="Basic">"Basic"</option>
                    <option value="Advanced">"Advanced"</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: FeatureComparisonProps) => {
              p.features?.push({
                id: Date.now().toString(),
                name: "New Feature",
                values: [false, true, true]
              });
            });
          }}
          className="w-full py-2 border border-dashed border-gray-300 rounded text-[12px] font-medium text-gray-500 hover:text-gray-800"
        >
          + Add Feature
        </button>
      </div>
    </div>
  );
};

export const FeatureComparison = ({ 
  tiers = ["Basic", "Pro", "Enterprise"],
  features = [
    { id: "1", name: "Users included", values: ["1 user", "5 users", "Unlimited"] },
    { id: "2", name: "Custom Domain", values: [false, true, true] },
    { id: "3", name: "Analytics", values: ["Basic", "Advanced", "Custom"] },
    { id: "4", name: "Support Response", values: ["48 hours", "24 hours", "1 hour"] },
    { id: "5", name: "API Access", values: [false, false, true] },
  ],
  primaryColor = "#0066FF"
}: FeatureComparisonProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const renderValue = (value: string | boolean) => {
    if (value === true) return <Check size={20} className="mx-auto" style={{ color: primaryColor }} />;
    if (value === false) return <X size={20} className="mx-auto text-gray-300" />;
    return <span className="font-medium text-gray-800 text-sm">{value}</span>;
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full py-8 overflow-x-auto"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "0px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="min-w-[700px] w-full max-w-5xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
          <div className="p-4 md:p-6 flex items-center">
            <h4 className="font-bold text-gray-900">Compare Plans</h4>
          </div>
          {tiers && tiers.map((tier, idx) => (
            <div key={idx} className="p-4 md:p-6 flex flex-col items-center justify-center text-center border-l border-gray-200">
              <h4 className="font-bold text-gray-900 text-lg">{tier}</h4>
            </div>
          ))}
        </div>

        {/* Feature Rows */}
        <div className="flex flex-col">
          {features && features.map((feature, idx) => (
            <div key={feature.id} className={`grid grid-cols-4 ${idx !== features.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
              <div className="p-4 md:px-6 md:py-4 flex items-center">
                <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                {feature.description && (
                  <span title={feature.description} className="ml-2 text-gray-400 cursor-help flex items-center">
                    <Info size={14} />
                  </span>
                )}
              </div>
              {tiers && tiers.map((_, tIdx) => (
                <div key={tIdx} className="p-4 md:px-6 md:py-4 flex items-center justify-center text-center border-l border-gray-100">
                  {renderValue(feature.values[tIdx])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

FeatureComparison.craft = {
  displayName: "Compare Table",
  props: { 
    tiers: ["Basic", "Pro", "Enterprise"],
    features: [
      { id: "1", name: "Users included", values: ["1 user", "5 users", "Unlimited"] },
      { id: "2", name: "Custom Domain", values: [false, true, true] },
      { id: "3", name: "Analytics", values: ["Basic", "Advanced", "Custom"] },
      { id: "4", name: "Support Response", values: ["48 hours", "24 hours", "1 hour"] },
      { id: "5", name: "API Access", values: [false, false, true] },
    ],
    primaryColor: "#0066FF"
  },
  rules: { canDrag: () => true },
  related: { settings: FeatureComparisonSettings },
};
