"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Maximize, Link, ChevronDown, ChevronRight, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState<"design" | "layout" | "content" | "interactions" | "responsive">("design");
  const { actions, selected, isEnabled, props } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    let props: Record<string, any> = {};

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
      props = state.nodes[currentNodeId].data.props;
    }

    return {
      selected,
      props,
      isEnabled: state.options.enabled,
    };
  });

  const handlePropChange = (key: string, value: any) => {
    if (!selected) return;
    actions.setProp(selected.id, (p: any) => {
      p[key] = value;
    });
  };

  if (!selected) {
    return (
      <div className="builder-settings-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-xs text-gray-500 font-medium">No element selected</p>
      </div>
    );
  }

  const hasTypography = props.fontSize !== undefined || props.fontWeight !== undefined || props.color !== undefined;
  const hasBackground = props.background !== undefined;
  const hasBorder = props.borderRadius !== undefined;
  const hasEffects = props.shadow !== undefined;

  return (
    <div className="builder-settings-panel">
      
      {/* Header */}
      <div className="builder-settings-header">
        <div className="flex flex-col">
          <span className="builder-settings-title">{selected.name}</span>
          <div className="builder-settings-breadcrumb">
            Section <ChevronRight size={10} /> Container <ChevronRight size={10} /> {selected.name}
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1">
          <Maximize size={14} />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="builder-settings-tabs">
        <button onClick={() => setActiveTab("design")} className={`builder-settings-tab ${activeTab === "design" ? "active" : ""}`}>Design</button>
        <button onClick={() => setActiveTab("layout")} className={`builder-settings-tab ${activeTab === "layout" ? "active" : ""}`}>Layout</button>
        <button onClick={() => setActiveTab("content")} className={`builder-settings-tab ${activeTab === "content" ? "active" : ""}`}>Content</button>
        <button onClick={() => setActiveTab("interactions")} className={`builder-settings-tab ${activeTab === "interactions" ? "active" : ""}`}>Interactions</button>
        <button onClick={() => setActiveTab("responsive")} className={`builder-settings-tab ${activeTab === "responsive" ? "active" : ""}`}>Responsive</button>
      </div>

      {/* Tab Panels */}
      <div className="builder-settings-content hide-scrollbar">
        {activeTab === "design" && (
          <div className="flex flex-col">
            
            {/* Typography Section */}
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Typography <ChevronDown size={14} className="text-gray-500" /></div>
              
              <div className="flex flex-col gap-3">
                <div className="builder-settings-row">
                  <span className="builder-settings-label">Font Family</span>
                  <select className="builder-settings-select" style={{ width: '180px' }}>
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Outfit</option>
                    <option>Plus Jakarta Sans</option>
                  </select>
                </div>
                
                {props.fontWeight !== undefined && (
                  <div className="builder-settings-row">
                    <span className="builder-settings-label">Weight</span>
                    <select 
                      value={props.fontWeight} 
                      onChange={(e) => handlePropChange("fontWeight", e.target.value)}
                      className="builder-settings-select" style={{ width: '180px' }}
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extrabold</option>
                    </select>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mt-1">
                  {props.fontSize !== undefined && (
                    <div className="flex-1 flex flex-col gap-1.5">
                      <span className="builder-settings-label text-[10px]">Size</span>
                      <div className="builder-settings-input">
                        <input type="number" value={props.fontSize} onChange={(e) => handlePropChange("fontSize", parseInt(e.target.value))} />
                        <span className="text-[10px] text-gray-500">px</span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="builder-settings-label text-[10px]">Line Height</span>
                    <div className="builder-settings-input">
                      <input type="text" defaultValue="1.5" />
                    </div>
                  </div>
                </div>

                {props.color !== undefined && (
                  <div className="builder-settings-row mt-2">
                    <span className="builder-settings-label">Color</span>
                    <div className="builder-settings-input" style={{ width: '180px', gap: '8px', position: 'relative' }}>
                      <input type="color" value={props.color} onChange={(e) => handlePropChange("color", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                      <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.color || '#000000' }}></div>
                      <span className="font-mono text-[11px] uppercase">{props.color || "#000000"}</span>
                      <span className="ml-auto text-gray-500 text-[10px]">100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Section */}
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Background <PlusCircle size={14} className="text-gray-500" /></div>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Fill</span>
                <div className="builder-settings-input" style={{ width: '180px', gap: '8px', position: 'relative' }}>
                  <input type="color" value={props.background || '#ffffff'} onChange={(e) => handlePropChange("background", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                  <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.background || 'transparent' }}></div>
                  <span className="font-mono text-[11px] uppercase">{props.background === "transparent" ? "None" : (props.background || "#ffffff")}</span>
                  <span className="ml-auto text-gray-500 text-[10px]">100%</span>
                </div>
              </div>
            </div>

            {/* Borders Section */}
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Borders <PlusCircle size={14} className="text-gray-500" /></div>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="builder-settings-label text-[10px]">Radius</span>
                  <div className="builder-settings-input">
                    <input type="number" value={props.borderRadius || 0} onChange={(e) => handlePropChange("borderRadius", parseInt(e.target.value))} />
                    <span className="text-[10px] text-gray-500">px</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="builder-settings-label text-[10px]">Width</span>
                  <div className="builder-settings-input">
                    <input type="number" defaultValue="0" />
                    <span className="text-[10px] text-gray-500">px</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Effects Section */}
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Effects <PlusCircle size={14} className="text-gray-500" /></div>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Shadow</span>
                <div className="builder-settings-input" style={{ width: '180px' }}>
                  <input type="text" value={props.shadow || ''} onChange={(e) => handlePropChange("shadow", e.target.value)} placeholder="none" />
                </div>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === "layout" && (
          <div className="flex flex-col">
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Layout Constraints <ChevronDown size={14} className="text-gray-500" /></div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="builder-settings-label text-[10px]">W</span>
                    <div className="builder-settings-input">
                      <input type="text" defaultValue="auto" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="builder-settings-label text-[10px]">H</span>
                    <div className="builder-settings-input">
                      <input type="text" defaultValue="auto" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="builder-settings-label text-[10px]">Min W</span>
                    <div className="builder-settings-input">
                      <input type="text" defaultValue="" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="builder-settings-label text-[10px]">Max W</span>
                    <div className="builder-settings-input">
                      <input type="text" defaultValue="1200px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Spacing <ChevronDown size={14} className="text-gray-500" /></div>
              <div className="builder-box-model">
                <div className="builder-box-margin">
                  <input type="text" className="builder-box-input top" defaultValue="0" />
                  <input type="text" className="builder-box-input bottom" defaultValue="0" />
                  <input type="text" className="builder-box-input left" defaultValue="auto" />
                  <input type="text" className="builder-box-input right" defaultValue="auto" />
                  <span className="absolute top-1 left-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider">Margin</span>
                  
                  <div className="builder-box-padding">
                    <input type="text" className="builder-box-input top" value={props.paddingY ?? props.padding ?? 0} onChange={(e) => handlePropChange("paddingY", parseInt(e.target.value))} />
                    <input type="text" className="builder-box-input bottom" value={props.paddingY ?? props.padding ?? 0} onChange={(e) => handlePropChange("paddingY", parseInt(e.target.value))} />
                    <input type="text" className="builder-box-input left" value={props.padding ?? 0} onChange={(e) => handlePropChange("padding", parseInt(e.target.value))} />
                    <input type="text" className="builder-box-input right" value={props.padding ?? 0} onChange={(e) => handlePropChange("padding", parseInt(e.target.value))} />
                    <span className="absolute top-1 left-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider">Padding</span>
                    
                    <div className="builder-box-content">
                      {selected.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
           <div className="flex flex-col">
             <div className="builder-settings-section">
               {selected.settings ? React.createElement(selected.settings as any) : (
                 <p className="text-xs text-gray-500 text-center">No content settings for this component.</p>
               )}
             </div>
           </div>
        )}

        {activeTab === "interactions" && (
           <div className="flex flex-col">
            <div className="builder-settings-section">
              <div className="builder-settings-section-title">Hover Effects</div>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Preset</span>
                <select className="builder-settings-select" style={{ width: '180px' }}>
                  <option>None</option>
                  <option>Scale Up</option>
                  <option>Lift & Glow</option>
                  <option>Fade In</option>
                </select>
              </div>
            </div>
           </div>
        )}
      </div>
    </div>
  );
};

const PlusCircle = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
