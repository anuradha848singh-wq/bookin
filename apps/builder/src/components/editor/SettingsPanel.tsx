"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { X, Type, Search, LayoutTemplate, Link, Maximize, Settings, AlignLeft, Paintbrush, Sliders, Hash, Move, ChevronDown, PlusCircle, MoreVertical } from "lucide-react";

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState<"design" | "layout" | "advanced">("design");
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
      <div className="builder-settings-panel" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>No element selected</p>
      </div>
    );
  }

  // Determine which sections to show based on prop existence
  const hasTypography = props.fontSize !== undefined || props.fontWeight !== undefined || props.color !== undefined;
  const hasBackground = props.background !== undefined;
  const hasSpacing = props.padding !== undefined || props.paddingY !== undefined || props.margin !== undefined;
  const hasBorder = props.borderRadius !== undefined;
  const hasEffects = props.shadow !== undefined;

  return (
    <div className="builder-settings-panel">
      
      {/* Header */}
      <div className="builder-settings-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="builder-settings-title">{selected.name}</span>
          <span className="builder-settings-id">#{selected.id.substring(0, 8)}</span>
        </div>
        <button style={{ color: '#111827', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <Maximize size={16} strokeWidth={2} />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="builder-settings-tabs">
        <button onClick={() => setActiveTab("design")} className={`builder-settings-tab ${activeTab === "design" ? "active" : ""}`}>Design</button>
        <button onClick={() => setActiveTab("layout")} className={`builder-settings-tab ${activeTab === "layout" ? "active" : ""}`}>Layout</button>
        <button onClick={() => setActiveTab("advanced")} className={`builder-settings-tab ${activeTab === "advanced" ? "active" : ""}`}>Content</button>
      </div>

      {/* Tab Panels */}
      <div className="builder-settings-content hide-scrollbar">
        {activeTab === "design" && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Typography Section */}
            {hasTypography && (
              <div className="builder-settings-section">
                <h4 className="builder-settings-section-title">Typography</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {props.fontWeight !== undefined && (
                    <div className="builder-settings-row">
                      <span className="builder-settings-label">Weight</span>
                      <select 
                        value={props.fontWeight} 
                        onChange={(e) => handlePropChange("fontWeight", e.target.value)}
                        className="builder-settings-select" style={{ width: '160px', appearance: 'none', outline: 'none' }}
                      >
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semibold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extrabold (800)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </div>
                  )}
                  
                  {props.fontSize !== undefined && (
                    <div className="builder-settings-row">
                      <span className="builder-settings-label">Size</span>
                      <div className="builder-settings-input-group" style={{ width: '160px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                          <input type="range" min="8" max="120" value={props.fontSize} onChange={(e) => handlePropChange("fontSize", parseInt(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div className="builder-settings-input" style={{ width: '60px', padding: '0 8px', borderLeft: '1px solid #e5e7eb', borderRadius: '0 6px 6px 0', border: 'none' }}>
                          <input type="number" value={props.fontSize} onChange={(e) => handlePropChange("fontSize", parseInt(e.target.value))} style={{ width: '30px', border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }} />
                          <span style={{ color: '#9ca3af', fontSize: '10px' }}>px</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {props.color !== undefined && (
                    <div className="builder-settings-row">
                      <span className="builder-settings-label">Color</span>
                      <div className="builder-settings-input" style={{ width: '160px', justifyContent: 'flex-start', gap: '8px', padding: '0 8px', position: 'relative' }}>
                        <input type="color" value={props.color} onChange={(e) => handlePropChange("color", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                        <div style={{ width: '16px', height: '16px', borderRadius: '3px', backgroundColor: props.color || '#000000', border: '1px solid #e5e7eb' }}></div>
                        <span style={{ letterSpacing: '0.05em' }}>{props.color || "#000000"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Background Section */}
            {hasBackground && (
              <div className="builder-settings-section">
                <h4 className="builder-settings-section-title">Background</h4>
                <div className="builder-settings-input" style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', padding: '8px', position: 'relative', height: '36px' }}>
                  <input type="color" value={props.background} onChange={(e) => handlePropChange("background", e.target.value)} style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: props.background || 'transparent', border: '1px solid #e5e7eb' }}></div>
                  <span style={{ letterSpacing: '0.05em', fontWeight: 600 }}>{props.background === "transparent" ? "Transparent" : props.background}</span>
                </div>
              </div>
            )}

            {/* Spacing Section */}
            {hasSpacing && (
              <div className="builder-settings-section">
                <h4 className="builder-settings-section-title">Spacing</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {props.paddingY !== undefined && (
                    <div className="builder-settings-row">
                      <span className="builder-settings-label">Padding Y</span>
                      <div className="builder-settings-input" style={{ width: '160px', padding: '0 8px' }}>
                        <input type="number" value={props.paddingY} onChange={(e) => handlePropChange("paddingY", parseInt(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }} />
                        <span style={{ color: '#9ca3af', fontSize: '10px' }}>px</span>
                      </div>
                    </div>
                  )}

                  {props.padding !== undefined && (
                    <div className="builder-settings-row">
                      <span className="builder-settings-label">Padding</span>
                      <div className="builder-settings-input" style={{ width: '160px', padding: '0 8px' }}>
                        <input type="number" value={props.padding} onChange={(e) => handlePropChange("padding", parseInt(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }} />
                        <span style={{ color: '#9ca3af', fontSize: '10px' }}>px</span>
                      </div>
                    </div>
                  )}

                  {/* Visual Box Model (Mock) */}
                  {(props.padding !== undefined || props.paddingY !== undefined) && (
                    <div style={{ width: '100%', maxWidth: '240px', margin: '8px auto 0', padding: '24px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#111827' }}>{props.paddingY ?? props.padding} <span style={{ color: '#9ca3af', marginLeft: '2px' }}>px</span></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#111827' }}>{props.padding || 0} <span style={{ color: '#9ca3af', marginLeft: '2px' }}>px</span></div>
                        <div style={{ color: '#3b82f6', fontWeight: 'bold' }}><Link size={16} strokeWidth={3} /></div>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#111827' }}>{props.padding || 0} <span style={{ color: '#9ca3af', marginLeft: '2px' }}>px</span></div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#111827' }}>{props.paddingY ?? props.padding} <span style={{ color: '#9ca3af', marginLeft: '2px' }}>px</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Border Section */}
            {hasBorder && (
              <div className="builder-settings-section">
                <h4 className="builder-settings-section-title">Border</h4>
                <div className="builder-settings-row">
                  <span className="builder-settings-label">Radius</span>
                  <div className="builder-settings-input-group" style={{ width: '160px' }}>
                    <div className="builder-settings-input" style={{ flex: 1, padding: '0 8px' }}>
                      <input type="number" value={props.borderRadius} onChange={(e) => handlePropChange("borderRadius", parseInt(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }} />
                      <span style={{ color: '#9ca3af', fontSize: '10px' }}>px</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {hasEffects && (
              <div className="builder-settings-section">
                <h4 className="builder-settings-section-title">Effects</h4>
                <div className="builder-settings-row">
                  <span className="builder-settings-label">Shadow</span>
                  <div className="builder-settings-input" style={{ width: '160px', padding: '0 8px' }}>
                    <input type="text" value={props.shadow} onChange={(e) => handlePropChange("shadow", e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }} />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        )}

        {activeTab === "layout" && (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Layout constraints and responsive settings.</p>
          </div>
        )}

        {activeTab === "advanced" && (
           <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {selected.settings ? React.createElement(selected.settings as any) : (
              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>No content settings for this component.</p>
            )}
            
            <div className="builder-settings-section">
              <h4 className="builder-settings-section-title">Entrance Animation</h4>
              
              <div className="builder-settings-row">
                <span className="builder-settings-label">Type</span>
                <select 
                  value={props.animation?.type || 'none'} 
                  onChange={(e) => {
                    if (!selected) return;
                    actions.setProp(selected.id, (p: any) => {
                      if (!p.animation) p.animation = { type: 'none', duration: 800, delay: 0 };
                      p.animation.type = e.target.value;
                    });
                  }}
                  className="builder-settings-select" style={{ width: '160px', appearance: 'none', outline: 'none', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontSize: '12px' }}
                >
                  <option value="none">None</option>
                  <option value="fade-up">Fade Up</option>
                  <option value="fade-down">Fade Down</option>
                  <option value="fade-right">Fade Right</option>
                  <option value="fade-left">Fade Left</option>
                  <option value="zoom-in">Zoom In</option>
                  <option value="zoom-out">Zoom Out</option>
                  <option value="flip-left">Flip Left</option>
                  <option value="flip-right">Flip Right</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="slide-down">Slide Down</option>
                  <option value="bounce-in">Bounce In</option>
                </select>
              </div>

              {props.animation?.type && props.animation.type !== 'none' && (
                <>
                  <div className="builder-settings-row">
                    <span className="builder-settings-label">Duration</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '160px' }}>
                      <input 
                        type="range" min="0" max="3000" step="100" 
                        value={props.animation.duration || 800} 
                        onChange={(e) => {
                          if (!selected) return;
                          actions.setProp(selected.id, (p: any) => { p.animation.duration = parseInt(e.target.value); });
                        }}
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>{props.animation.duration || 800}ms</span>
                    </div>
                  </div>

                  <div className="builder-settings-row">
                    <span className="builder-settings-label">Delay</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '160px' }}>
                      <input 
                        type="range" min="0" max="3000" step="50" 
                        value={props.animation.delay || 0} 
                        onChange={(e) => {
                          if (!selected) return;
                          actions.setProp(selected.id, (p: any) => { p.animation.delay = parseInt(e.target.value); });
                        }}
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>{props.animation.delay || 0}ms</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="builder-settings-section">
              <h4 className="builder-settings-section-title">Hover & Click Effects</h4>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Preset</span>
                <select 
                  value={props.animation?.hover || ""} 
                  onChange={(e) => {
                    if (!selected) return;
                    actions.setProp(selected.id, (p: any) => {
                      if (!p.animation) p.animation = {};
                      p.animation.hover = e.target.value;
                    });
                  }}
                  className="builder-settings-select" style={{ width: '160px', appearance: 'none', outline: 'none', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontSize: '12px' }}
                >
                  <option value="">None</option>
                  <option value="hover:scale-105">Scale Up</option>
                  <option value="hover:scale-95">Scale Down</option>
                  <option value="hover:-translate-y-2 hover:shadow-xl">Lift</option>
                  <option value="hover:-rotate-3 hover:scale-105">Rotate Left</option>
                  <option value="hover:rotate-3 hover:scale-105">Rotate Right</option>
                  <option value="hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]">Glow</option>
                  <option value="hover:opacity-75">Fade Opacity</option>
                  <option value="hover:bg-blue-50">Bg Color (Blue)</option>
                  <option value="hover:text-blue-600">Text Color (Blue)</option>
                  <option value="active:scale-95">Click Shrink (Active)</option>
                </select>
              </div>
              <div className="builder-settings-row mt-2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="builder-settings-label">Custom Tailwind Classes (Hover/Active)</span>
                <input 
                  type="text" 
                  value={props.animation?.customHover || ""} 
                  onChange={(e) => {
                    if (!selected) return;
                    actions.setProp(selected.id, (p: any) => {
                      if (!p.animation) p.animation = {};
                      p.animation.customHover = e.target.value;
                    });
                  }}
                  placeholder="e.g. hover:blur-sm active:rotate-180"
                  className="builder-settings-input" style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontSize: '12px' }}
                />
              </div>
            </div>

            <div className="builder-settings-section">
              <h4 className="builder-settings-section-title">Cursor & Scroll</h4>
              <div className="builder-settings-row">
                <span className="builder-settings-label">Cursor</span>
                <select 
                  value={props.animation?.cursor || "auto"} 
                  onChange={(e) => {
                    if (!selected) return;
                    actions.setProp(selected.id, (p: any) => {
                      if (!p.animation) p.animation = {};
                      p.animation.cursor = e.target.value;
                    });
                  }}
                  className="builder-settings-select" style={{ width: '160px', appearance: 'none', outline: 'none', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontSize: '12px' }}
                >
                  <option value="auto">Auto</option>
                  <option value="pointer">Pointer (Hand)</option>
                  <option value="wait">Wait (Spinner)</option>
                  <option value="not-allowed">Not Allowed</option>
                  <option value="crosshair">Crosshair</option>
                  <option value="move">Move</option>
                </select>
              </div>
              
              <div className="builder-settings-row mt-2">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Sticky on Scroll
                  <input 
                    type="checkbox" 
                    checked={props.animation?.sticky || false} 
                    onChange={(e) => {
                      if (!selected) return;
                      actions.setProp(selected.id, (p: any) => {
                        if (!p.animation) p.animation = {};
                        p.animation.sticky = e.target.checked;
                      });
                    }} 
                  />
                </label>
              </div>

              {props.animation?.sticky && (
                <div className="builder-settings-row mt-2">
                  <span className="builder-settings-label">Top Offset</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '160px' }}>
                    <input 
                      type="range" min="0" max="200" step="5" 
                      value={props.animation.stickyOffset || 0} 
                      onChange={(e) => {
                        if (!selected) return;
                        actions.setProp(selected.id, (p: any) => { p.animation.stickyOffset = parseInt(e.target.value); });
                      }}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>{props.animation.stickyOffset || 0}px</span>
                  </div>
                </div>
              )}
            </div>
           </div>
        )}
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
