"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Maximize, Link, ChevronDown, ChevronRight, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

export const SettingsPanel = () => {
  const [openSections, setOpenSections] = useState({
    content: true,
    layout: true,
    spacing: true,
    typography: true,
    background: false,
    borders: false,
    effects: false,
    interactions: false
  });

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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const AccordionHeader = ({ title, section }: { title: string, section: keyof typeof openSections }) => (
    <div 
      className="flex items-center justify-between px-4 py-2.5 cursor-pointer border-t border-[#2C2D33] hover:bg-[#1A1A1E] transition-colors select-none"
      onClick={() => toggleSection(section)}
    >
      <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-300">{title}</span>
      {openSections[section] ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
    </div>
  );

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
      
      {/* Scrollable Properties List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        
        {/* Content Section (Custom Component Settings) */}
        {selected.settings && (
          <>
            <AccordionHeader title="Content" section="content" />
            {openSections.content && (
              <div className="p-4 bg-[#111115]">
                {React.createElement(selected.settings as any)}
              </div>
            )}
          </>
        )}

        {/* Layout Constraints & Flex */}
        <AccordionHeader title="Layout" section="layout" />
        {openSections.layout && (
          <div className="p-4 flex flex-col gap-4 bg-[#111115]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="builder-settings-label text-[10px]">W</span>
                <div className="builder-settings-input">
                  <input type="text" value={props.width || 'auto'} onChange={(e) => handlePropChange("width", e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="builder-settings-label text-[10px]">H</span>
                <div className="builder-settings-input">
                  <input type="text" value={props.height || 'auto'} onChange={(e) => handlePropChange("height", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
               <div className="flex flex-col gap-1.5 flex-1">
                <span className="builder-settings-label text-[10px]">Display</span>
                <select 
                  className="builder-settings-select"
                  value={props.display || 'block'}
                  onChange={(e) => handlePropChange("display", e.target.value)}
                >
                  <option value="block">Block</option>
                  <option value="flex">Flexbox</option>
                  <option value="grid">Grid</option>
                  <option value="inline-block">Inline</option>
                </select>
              </div>
              {props.display === 'flex' && (
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="builder-settings-label text-[10px]">Direction</span>
                  <select 
                    className="builder-settings-select"
                    value={props.flexDirection || 'column'}
                    onChange={(e) => handlePropChange("flexDirection", e.target.value)}
                  >
                    <option value="row">Horizontal</option>
                    <option value="column">Vertical</option>
                  </select>
                </div>
              )}
            </div>

            {props.display === 'flex' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="builder-settings-label text-[10px]">Alignment</span>
                  <div className="flex bg-[#1A1A1E] border border-[#2C2D33] rounded-md overflow-hidden">
                    {['flex-start', 'center', 'flex-end', 'space-between'].map(align => (
                      <button
                        key={align}
                        className={`flex-1 p-1.5 text-center border-r border-[#2C2D33] last:border-0 hover:bg-[#2C2D33] ${props.justifyContent === align ? 'bg-[#3F404A] text-white' : 'text-gray-500'}`}
                        onClick={() => handlePropChange("justifyContent", align)}
                        title={`Justify: ${align}`}
                      >
                        {align === 'flex-start' && <AlignLeft size={14} className="mx-auto" />}
                        {align === 'center' && <AlignCenter size={14} className="mx-auto" />}
                        {align === 'flex-end' && <AlignRight size={14} className="mx-auto" />}
                        {align === 'space-between' && <AlignJustify size={14} className="mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="builder-settings-label text-[10px]">Gap</span>
                  <div className="builder-settings-input">
                    <input type="number" value={props.gap || 0} onChange={(e) => handlePropChange("gap", parseInt(e.target.value))} />
                    <span className="text-[10px] text-gray-500">px</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Spacing (Box Model) */}
        <AccordionHeader title="Spacing" section="spacing" />
        {openSections.spacing && (
          <div className="p-4 bg-[#111115] flex justify-center">
             <div className="builder-box-model transform scale-90 origin-top">
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
        )}

        {/* Typography */}
        <AccordionHeader title="Typography" section="typography" />
        {openSections.typography && (
          <div className="p-4 flex flex-col gap-3 bg-[#111115]">
            <div className="builder-settings-row">
              <span className="builder-settings-label">Font</span>
              <select className="builder-settings-select" style={{ width: '160px' }}>
                <option>Inter</option>
                <option>Roboto</option>
                <option>Outfit</option>
              </select>
            </div>
            
            <div className="builder-settings-row">
              <span className="builder-settings-label">Weight</span>
              <select 
                value={props.fontWeight || '400'} 
                onChange={(e) => handlePropChange("fontWeight", e.target.value)}
                className="builder-settings-select" style={{ width: '160px' }}
              >
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="builder-settings-label text-[10px]">Size</span>
                <div className="builder-settings-input">
                  <input type="number" value={props.fontSize || 16} onChange={(e) => handlePropChange("fontSize", parseInt(e.target.value))} />
                  <span className="text-[10px] text-gray-500">px</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="builder-settings-label text-[10px]">Line Height</span>
                <div className="builder-settings-input">
                  <input type="text" value={props.lineHeight || '1.5'} onChange={(e) => handlePropChange("lineHeight", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="builder-settings-row mt-2">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.color || '#000000'} onChange={(e) => handlePropChange("color", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.color || '#000000' }}></div>
                <span className="font-mono text-[11px] uppercase">{props.color || "#000000"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Fill / Background */}
        <AccordionHeader title="Fill" section="background" />
        {openSections.background && (
          <div className="p-4 bg-[#111115]">
            <div className="builder-settings-row">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.background || '#ffffff'} onChange={(e) => handlePropChange("background", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.background || 'transparent' }}></div>
                <span className="font-mono text-[11px] uppercase">{props.background === "transparent" ? "None" : (props.background || "#ffffff")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Borders */}
        <AccordionHeader title="Borders" section="borders" />
        {openSections.borders && (
          <div className="p-4 flex flex-col gap-3 bg-[#111115]">
            <div className="flex items-center gap-2">
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
                  <input type="number" value={props.borderWidth || 0} onChange={(e) => handlePropChange("borderWidth", parseInt(e.target.value))} />
                  <span className="text-[10px] text-gray-500">px</span>
                </div>
              </div>
            </div>
            <div className="builder-settings-row">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.borderColor || '#e5e7eb'} onChange={(e) => handlePropChange("borderColor", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.borderColor || '#e5e7eb' }}></div>
                <span className="font-mono text-[11px] uppercase">{props.borderColor || "#E5E7EB"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Effects */}
        <AccordionHeader title="Effects" section="effects" />
        {openSections.effects && (
          <div className="p-4 bg-[#111115]">
            <div className="builder-settings-row">
              <span className="builder-settings-label">Shadow</span>
              <div className="builder-settings-input" style={{ width: '160px' }}>
                <input type="text" value={props.shadow || ''} onChange={(e) => handlePropChange("shadow", e.target.value)} placeholder="0px 4px 10px rgba(0,0,0,0.1)" />
              </div>
            </div>
          </div>
        )}

        {/* Interactions */}
        <AccordionHeader title="Interactions" section="interactions" />
        {openSections.interactions && (
          <div className="p-4 bg-[#111115]">
            <div className="builder-settings-row">
              <span className="builder-settings-label">Hover Preset</span>
              <select className="builder-settings-select" style={{ width: '160px' }}>
                <option>None</option>
                <option>Scale Up</option>
                <option>Lift & Glow</option>
                <option>Fade In</option>
              </select>
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
