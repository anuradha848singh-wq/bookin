"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { Maximize, Link, ChevronDown, ChevronRight, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignJustify, Monitor, Tablet, Smartphone } from "lucide-react";
import { useThemeTokens } from "./ThemeTokenContext";

export const SettingsPanel = () => {
  const [openSections, setOpenSections] = useState({
    size: true,
    typography: false,
    background: false,
    border: false,
    effects: false,
    visibility: false,
    animation: false,
    logic: false,
    binding: false,
    layout: true,
    content: true,
    spacing: false,
  });

  const { actions, selected, isEnabled, props } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    let props: Record<string, any> = {};

    if (currentNodeId) {
      const selectedIds = Array.from(state.events.selected);
      selected = {
        id: currentNodeId,
        ids: selectedIds as string[],
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
    selected.ids.forEach(id => {
      actions.setProp(id, (p: any) => {
        p[key] = value;
      });
    });
  };

  const { tokens } = useThemeTokens();
  const colorTokens = tokens.filter(t => t.category === 'colors');
  const fontTokens = tokens.filter(t => t.category === 'typography');

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
          <span className="builder-settings-title">
            {selected.ids.length > 1 ? `Multiple Selected (${selected.ids.length})` : selected.name}
          </span>
          <div className="builder-settings-breadcrumb">
            {selected.ids.length > 1 ? 'Mixed Selection' : `Section > Container > ${selected.name}`}
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
            {/* Breakpoint Visibility */}
            <div className="flex flex-col gap-1.5 mt-1 border-t border-[#2C2D33]/50 pt-3">
              <span className="builder-settings-label text-[10px]">Visible On</span>
              <div className="flex bg-[#1A1A1E] border border-[#2C2D33] rounded-md overflow-hidden h-8">
                <button
                  className={`flex-1 flex justify-center items-center border-r border-[#2C2D33] last:border-0 hover:bg-[#2C2D33] transition-colors ${!props.hiddenBreakpoints?.desktop ? 'text-[#0D99FF] bg-[#0D99FF]/10' : 'text-gray-500 opacity-40 hover:opacity-100'}`}
                  onClick={() => handlePropChange("hiddenBreakpoints", { ...props.hiddenBreakpoints, desktop: !props.hiddenBreakpoints?.desktop })}
                  title="Toggle Desktop Visibility"
                >
                  <div className="relative">
                    <Monitor size={14} />
                    {props.hiddenBreakpoints?.desktop && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1.5px] bg-red-500 rotate-45 transform scale-125" /></div>}
                  </div>
                </button>
                <button
                  className={`flex-1 flex justify-center items-center border-r border-[#2C2D33] last:border-0 hover:bg-[#2C2D33] transition-colors ${!props.hiddenBreakpoints?.tablet ? 'text-[#0D99FF] bg-[#0D99FF]/10' : 'text-gray-500 opacity-40 hover:opacity-100'}`}
                  onClick={() => handlePropChange("hiddenBreakpoints", { ...props.hiddenBreakpoints, tablet: !props.hiddenBreakpoints?.tablet })}
                  title="Toggle Tablet Visibility"
                >
                  <div className="relative">
                    <Tablet size={14} />
                    {props.hiddenBreakpoints?.tablet && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1.5px] bg-red-500 rotate-45 transform scale-125" /></div>}
                  </div>
                </button>
                <button
                  className={`flex-1 flex justify-center items-center border-r border-[#2C2D33] last:border-0 hover:bg-[#2C2D33] transition-colors ${!props.hiddenBreakpoints?.mobile ? 'text-[#0D99FF] bg-[#0D99FF]/10' : 'text-gray-500 opacity-40 hover:opacity-100'}`}
                  onClick={() => handlePropChange("hiddenBreakpoints", { ...props.hiddenBreakpoints, mobile: !props.hiddenBreakpoints?.mobile })}
                  title="Toggle Mobile Visibility"
                >
                  <div className="relative">
                    <Smartphone size={14} />
                    {props.hiddenBreakpoints?.mobile && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1.5px] bg-red-500 rotate-45 transform scale-125" /></div>}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
               <div className="flex flex-col gap-1.5 flex-1">
                <span className="builder-settings-label text-[10px]">Position</span>
                <select 
                  className="builder-settings-select"
                  value={props.position || 'relative'}
                  onChange={(e) => handlePropChange("position", e.target.value)}
                >
                  <option value="relative">Flow (Relative)</option>
                  <option value="absolute">Freeform (Absolute)</option>
                </select>
              </div>
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
            </div>

            {props.position === 'absolute' && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="builder-settings-label text-[10px]">X (Left)</span>
                  <div className="builder-settings-input">
                    <input type="number" value={props.x || 0} onChange={(e) => handlePropChange("x", parseInt(e.target.value))} />
                    <span className="text-[10px] text-gray-500">px</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="builder-settings-label text-[10px]">Y (Top)</span>
                  <div className="builder-settings-input">
                    <input type="number" value={props.y || 0} onChange={(e) => handlePropChange("y", parseInt(e.target.value))} />
                    <span className="text-[10px] text-gray-500">px</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
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
                  <input type="text" className="builder-box-input top" value={props.marginY ?? props.margin ?? 0} onChange={(e) => handlePropChange("marginY", e.target.value)} />
                  <input type="text" className="builder-box-input bottom" value={props.marginY ?? props.margin ?? 0} onChange={(e) => handlePropChange("marginY", e.target.value)} />
                  <input type="text" className="builder-box-input left" value={props.marginX ?? props.margin ?? "auto"} onChange={(e) => handlePropChange("marginX", e.target.value)} />
                  <input type="text" className="builder-box-input right" value={props.marginX ?? props.margin ?? "auto"} onChange={(e) => handlePropChange("marginX", e.target.value)} />
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
            <div className="builder-settings-row relative group">
              <span className="builder-settings-label">Font</span>
              <select 
                className="builder-settings-select" style={{ width: '160px' }}
                value={props.fontFamily || 'Inter, sans-serif'}
                onChange={(e) => handlePropChange("fontFamily", e.target.value)}
              >
                <optgroup label="Tokens">
                  {fontTokens.map(t => (
                    <option key={t.id} value={`var(--token-${t.name.toLowerCase().replace(/\s+/g, '-')})`}>{t.name}</option>
                  ))}
                </optgroup>
                <optgroup label="System Fonts">
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Outfit, sans-serif">Outfit</option>
                </optgroup>
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

            <div className="builder-settings-row mt-2 relative group">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.color?.startsWith('var(') ? '#000000' : (props.color || '#000000')} onChange={(e) => handlePropChange("color", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.color?.startsWith('var(') ? 'transparent' : (props.color || '#000000'), background: props.color?.startsWith('var(') ? props.color : undefined }}></div>
                <span className="font-mono text-[11px] uppercase truncate w-full">
                  {props.color?.startsWith('var(') ? props.color.split('-').pop()?.replace(')', '') : (props.color || "#000000")}
                </span>
              </div>
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#111115] z-10 border border-[#2C2D33] rounded">
                <select 
                  className="bg-transparent text-[10px] text-indigo-400 p-1 outline-none appearance-none"
                  value={props.color || ""}
                  onChange={(e) => handlePropChange("color", e.target.value)}
                >
                  <option value="">Custom</option>
                  {colorTokens.map(t => (
                    <option key={t.id} value={`var(--token-${t.name.toLowerCase().replace(/\s+/g, '-')})`}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Fill / Background */}
        <AccordionHeader title="Fill" section="background" />
        {openSections.background && (
          <div className="p-4 bg-[#111115]">
            <div className="builder-settings-row relative group">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.background?.startsWith('var(') ? '#ffffff' : (props.background || '#ffffff')} onChange={(e) => handlePropChange("background", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.background === "transparent" ? "transparent" : (props.background?.startsWith('var(') ? 'transparent' : (props.background || '#ffffff')), background: props.background?.startsWith('var(') ? props.background : undefined }}></div>
                <span className="font-mono text-[11px] uppercase truncate w-full">
                  {props.background === "transparent" ? "None" : (props.background?.startsWith('var(') ? props.background.split('-').pop()?.replace(')', '') : (props.background || "#ffffff"))}
                </span>
              </div>
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#111115] z-10 border border-[#2C2D33] rounded">
                <select 
                  className="bg-transparent text-[10px] text-indigo-400 p-1 outline-none appearance-none"
                  value={props.background || ""}
                  onChange={(e) => handlePropChange("background", e.target.value)}
                >
                  <option value="">Custom</option>
                  <option value="transparent">None</option>
                  {colorTokens.map(t => (
                    <option key={t.id} value={`var(--token-${t.name.toLowerCase().replace(/\s+/g, '-')})`}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Borders */}
        <AccordionHeader title="Borders" section="border" />
        {openSections.border && (
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
            <div className="builder-settings-row relative group">
              <span className="builder-settings-label">Color</span>
              <div className="builder-settings-input" style={{ width: '160px', gap: '8px', position: 'relative' }}>
                <input type="color" value={props.borderColor?.startsWith('var(') ? '#e5e7eb' : (props.borderColor || '#e5e7eb')} onChange={(e) => handlePropChange("borderColor", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <div className="w-4 h-4 rounded-sm border border-[#3F404A]" style={{ backgroundColor: props.borderColor?.startsWith('var(') ? 'transparent' : (props.borderColor || '#e5e7eb'), background: props.borderColor?.startsWith('var(') ? props.borderColor : undefined }}></div>
                <span className="font-mono text-[11px] uppercase truncate w-full">
                   {props.borderColor?.startsWith('var(') ? props.borderColor.split('-').pop()?.replace(')', '') : (props.borderColor || "#E5E7EB")}
                </span>
              </div>
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#111115] z-10 border border-[#2C2D33] rounded">
                <select 
                  className="bg-transparent text-[10px] text-indigo-400 p-1 outline-none appearance-none"
                  value={props.borderColor || ""}
                  onChange={(e) => handlePropChange("borderColor", e.target.value)}
                >
                  <option value="">Custom</option>
                  <option value="transparent">None</option>
                  {colorTokens.map(t => (
                    <option key={t.id} value={`var(--token-${t.name.toLowerCase().replace(/\s+/g, '-')})`}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Effects & Shadows */}
        <AccordionHeader title="Effects & Shadows" section="effects" />
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

        {/* ANIMATIONS */}
        <AccordionHeader title="Animations" section="animation" />
        {openSections.animation && (
          <div className="p-4 bg-[#111115] flex flex-col gap-4">
            {/* Hover Effects */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hover State</span>
              <select 
                className="builder-settings-select w-full"
                value={props.animation?.hover || ""}
                onChange={(e) => handlePropChange("animation", { ...props.animation, hover: e.target.value })}
              >
                <option value="">None</option>
                <option value="hover:scale-105">Scale Up</option>
                <option value="hover:scale-95">Scale Down</option>
                <option value="hover:-translate-y-1">Lift Up</option>
                <option value="hover:opacity-75">Fade Out</option>
                <option value="hover:shadow-lg">Add Shadow</option>
              </select>
            </div>

            {/* Scroll Effects */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#2C2D33]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scroll Reveal</span>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Type</span>
                <select 
                  className="builder-settings-select" style={{ width: '130px' }}
                  value={props.animation?.scroll?.type || ""}
                  onChange={(e) => handlePropChange("animation", { 
                    ...props.animation, 
                    scroll: { ...(props.animation?.scroll || {}), type: e.target.value } 
                  })}
                >
                  <option value="">None</option>
                  <option value="fade-in">Fade In</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="slide-left">Slide Left</option>
                  <option value="slide-right">Slide Right</option>
                  <option value="zoom-in">Zoom In</option>
                </select>
              </div>

              {props.animation?.scroll?.type && (
                <>
                  <div className="builder-settings-row mt-1">
                    <span className="builder-settings-label">Duration</span>
                    <div className="builder-settings-input" style={{ width: '130px' }}>
                      <input 
                        type="number" 
                        value={props.animation?.scroll?.duration || 500} 
                        onChange={(e) => handlePropChange("animation", { 
                          ...props.animation, 
                          scroll: { ...props.animation.scroll, duration: parseInt(e.target.value) || 0 } 
                        })} 
                        step={100}
                      />
                      <span className="text-[10px] text-gray-500">ms</span>
                    </div>
                  </div>
                  <div className="builder-settings-row mt-1">
                    <span className="builder-settings-label">Delay</span>
                    <div className="builder-settings-input" style={{ width: '130px' }}>
                      <input 
                        type="number" 
                        value={props.animation?.scroll?.delay || 0} 
                        onChange={(e) => handlePropChange("animation", { 
                          ...props.animation, 
                          scroll: { ...props.animation.scroll, delay: parseInt(e.target.value) || 0 } 
                        })} 
                        step={100}
                      />
                      <span className="text-[10px] text-gray-500">ms</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CONDITIONAL LOGIC */}
        <AccordionHeader title="Conditional Logic" section="logic" />
        {openSections.logic && (
          <div className="p-4 bg-[#111115] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Field Identifier</span>
              <div className="builder-settings-input">
                <input 
                  type="text" 
                  value={props.fieldId || ''} 
                  onChange={(e) => handlePropChange("fieldId", e.target.value)} 
                  placeholder="e.g. insurance_type"
                />
              </div>
              <span className="text-[9px] text-gray-500">Unique ID used to target this field in conditions.</span>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#2C2D33]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visibility Rules</span>
                <button 
                  onClick={() => {
                    const current = props.conditionalRules || [];
                    handlePropChange("conditionalRules", [...current, { targetId: '', operator: 'equals', value: '' }]);
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  + Add Rule
                </button>
              </div>

              {props.conditionalRules?.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                  {props.conditionalRules?.length > 1 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-400">Match</span>
                      <select 
                        className="builder-settings-select" style={{ width: '60px', padding: '2px 4px' }}
                        value={props.conditionalLogic || 'AND'}
                        onChange={(e) => handlePropChange("conditionalLogic", e.target.value)}
                      >
                        <option value="AND">ALL</option>
                        <option value="OR">ANY</option>
                      </select>
                      <span className="text-[10px] text-gray-400">rules</span>
                    </div>
                  )}

                  {props.conditionalRules.map((rule: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2 p-2 bg-[#1A1A1E] border border-[#2C2D33] rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-500">RULE {i + 1}</span>
                        <button 
                          onClick={() => {
                            const newRules = [...props.conditionalRules];
                            newRules.splice(i, 1);
                            handlePropChange("conditionalRules", newRules);
                          }}
                          className="text-[9px] text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Target Field ID" 
                        value={rule.targetId || ''}
                        onChange={(e) => {
                          const newRules = [...props.conditionalRules];
                          newRules[i].targetId = e.target.value;
                          handlePropChange("conditionalRules", newRules);
                        }}
                        className="w-full bg-[#111115] border border-[#2C2D33] rounded px-2 py-1 text-[10px] text-white outline-none"
                      />
                      <select 
                        value={rule.operator || 'equals'}
                        onChange={(e) => {
                          const newRules = [...props.conditionalRules];
                          newRules[i].operator = e.target.value;
                          handlePropChange("conditionalRules", newRules);
                        }}
                        className="w-full bg-[#111115] border border-[#2C2D33] rounded px-2 py-1 text-[10px] text-white outline-none"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Does Not Equal</option>
                        <option value="contains">Contains</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Value" 
                        value={rule.value || ''}
                        onChange={(e) => {
                          const newRules = [...props.conditionalRules];
                          newRules[i].value = e.target.value;
                          handlePropChange("conditionalRules", newRules);
                        }}
                        className="w-full bg-[#111115] border border-[#2C2D33] rounded px-2 py-1 text-[10px] text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DATA BINDINGS */}
        <AccordionHeader title="Data Bindings" section="binding" />
        {openSections.binding && (
          <div className="p-4 bg-[#111115] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bind Properties to CMS</span>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-2">Connect component properties to dynamic CMS variables (e.g. <code className="bg-[#1A1A1E] px-1 py-0.5 rounded text-indigo-300">clinic.name</code> or <code className="bg-[#1A1A1E] px-1 py-0.5 rounded text-indigo-300">staff.avatar</code>).</p>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-300">Active Bindings</span>
                <button 
                  onClick={() => {
                    const current = props.bindings || {};
                    handlePropChange("bindings", { ...current, ['']: '' });
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  + Add Binding
                </button>
              </div>

              {props.bindings && Object.keys(props.bindings).length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {Object.entries(props.bindings).map(([propKey, cmsPath]: [string, any], i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select 
                        value={propKey}
                        onChange={(e) => {
                          const newBindings = { ...props.bindings };
                          const oldVal = newBindings[propKey];
                          delete newBindings[propKey];
                          if (e.target.value) newBindings[e.target.value] = oldVal;
                          handlePropChange("bindings", newBindings);
                        }}
                        className="w-1/2 bg-[#1A1A1E] border border-[#2C2D33] rounded px-2 py-1 text-[10px] text-white outline-none"
                      >
                        <option value="">Select Prop...</option>
                        {Object.keys(props).filter(k => k !== 'bindings' && k !== 'hiddenBreakpoints' && typeof props[k] !== 'object').map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                        <option value="text">text</option>
                        <option value="src">src</option>
                      </select>
                      
                      <span className="text-gray-500 text-[10px]">=</span>

                      <input 
                        type="text" 
                        placeholder="CMS Path" 
                        value={cmsPath}
                        onChange={(e) => {
                          handlePropChange("bindings", { ...props.bindings, [propKey]: e.target.value });
                        }}
                        className="w-1/2 bg-[#1A1A1E] border border-[#2C2D33] rounded px-2 py-1 text-[10px] text-indigo-300 outline-none font-mono"
                      />

                      <button 
                        onClick={() => {
                          const newBindings = { ...props.bindings };
                          delete newBindings[propKey];
                          handlePropChange("bindings", newBindings);
                        }}
                        className="text-[10px] text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
