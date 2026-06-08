"use client";

import React, { useState, useEffect } from "react";
import { X, Palette, Check, Plus, Download, Upload, Save } from "lucide-react";

interface ThemeManagerProps {
  onClose: () => void;
}

export const ThemeManager = ({ onClose }: ThemeManagerProps) => {
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  
  const [view, setView] = useState<"library" | "creator">("library");
  const [customTheme, setCustomTheme] = useState({
    name: "My Custom Theme",
    colors: { primary: "#000000", secondary: "#444444", background: "#ffffff", text: "#111111", accent: "#aaaaaa" },
    fonts: { heading: "Inter", body: "Inter" },
    styles: { borderRadius: "8px", boxShadow: "none" }
  });

  useEffect(() => {
    fetchThemes();
  }, []);

  async function fetchThemes() {
    setLoading(true);
    try {
      const res = await fetch("/api/studio/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.themes || []);
        if (!activeThemeId) setActiveThemeId(data.themes[0]?.id || null);
      }
    } catch (err) {
      console.error("Failed to fetch themes", err);
    } finally {
      setLoading(false);
    }
  }

  const applyTheme = (theme: any) => {
    setActiveThemeId(theme.id);
    applyThemeVariables(theme);
  };

  const applyThemeVariables = (theme: any) => {
    const root = document.documentElement;
    if (theme.colors) Object.entries(theme.colors).forEach(([k, v]) => root.style.setProperty(`--theme-${k}`, v as string));
    if (theme.fonts) Object.entries(theme.fonts).forEach(([k, v]) => root.style.setProperty(`--font-${k}`, v as string));
    if (theme.styles) Object.entries(theme.styles).forEach(([k, v]) => root.style.setProperty(`--style-${k}`, v as string));
  };

  const handleSaveCustomTheme = async () => {
    // In a full implementation, you would POST to /api/studio/themes to save it
    // For now, we mock the addition to the local state
    const newTheme = {
      id: `custom-${Date.now()}`,
      slug: customTheme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...customTheme
    };
    setThemes([newTheme, ...themes]);
    applyTheme(newTheme);
    setView("library");
  };

  const handleExport = (theme: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${theme.slug}-theme.json`);
    dlAnchorElem.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setCustomTheme(json);
        setView("creator");
      } catch (err) {
        alert("Invalid theme JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-all font-sans">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] h-[85vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Palette size={24} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Global Themes</h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Instantly change the look and feel of your entire website.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {view === "library" ? (
              <button 
                onClick={() => setView("creator")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-all text-sm"
              >
                <Plus size={16} /> Create Theme
              </button>
            ) : (
              <button 
                onClick={() => setView("library")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 font-bold rounded-lg shadow-sm hover:bg-gray-200 transition-all text-sm"
              >
                Back to Library
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {view === "library" ? (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Theme Library</h3>
                <div className="relative">
                  <input type="file" id="import-theme" className="hidden" accept=".json" onChange={handleImport} />
                  <label htmlFor="import-theme" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer text-sm">
                    <Upload size={14} /> Import Theme
                  </label>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : themes.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">No themes available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {themes.map((theme) => {
                    const isActive = activeThemeId === theme.id;
                    return (
                      <div 
                        key={theme.id}
                        onClick={() => applyTheme(theme)}
                        className={`group relative bg-white border-2 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md ${isActive ? 'border-indigo-600 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="h-32 p-4 flex flex-col gap-2 relative" style={{ backgroundColor: theme.colors?.background || '#f9fafb' }}>
                          <div className="w-3/4 h-4 rounded-full" style={{ backgroundColor: theme.colors?.primary || '#000' }}></div>
                          <div className="w-1/2 h-3 rounded-full opacity-50" style={{ backgroundColor: theme.colors?.primary || '#000' }}></div>
                          <div className="mt-auto flex gap-2">
                            <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: theme.colors?.primary || '#000' }}></div>
                            <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: theme.colors?.secondary || '#000' }}></div>
                            <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: theme.colors?.accent || '#ccc' }}></div>
                          </div>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleExport(theme); }}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded text-gray-600 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Export Theme"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{theme.name}</h3>
                            <p className="text-xs font-medium text-gray-500">{theme.fonts?.heading} & {theme.fonts?.body}</p>
                          </div>
                          {isActive && (
                            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Custom Theme Creator View
            <div className="flex h-full">
              {/* Controls */}
              <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Theme Name</label>
                  <input 
                    type="text" 
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme({...customTheme, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Colors</h3>
                  <div className="space-y-4">
                    {Object.entries(customTheme.colors).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-600 capitalize">{key}</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono uppercase">{val}</span>
                          <input 
                            type="color" 
                            value={val}
                            onChange={(e) => setCustomTheme({
                              ...customTheme, 
                              colors: { ...customTheme.colors, [key]: e.target.value }
                            })}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Typography</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Heading Font</label>
                      <select 
                        value={customTheme.fonts.heading}
                        onChange={(e) => setCustomTheme({
                          ...customTheme, 
                          fonts: { ...customTheme.fonts, heading: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Body Font</label>
                      <select 
                        value={customTheme.fonts.body}
                        onChange={(e) => setCustomTheme({
                          ...customTheme, 
                          fonts: { ...customTheme.fonts, body: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Lato">Lato</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Roboto">Roboto</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveCustomTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-all"
                >
                  <Save size={16} /> Save Theme
                </button>
              </div>

              {/* Live Preview */}
              <div className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: customTheme.colors.background }}>
                <div className="max-w-2xl mx-auto space-y-8" style={{ color: customTheme.colors.text }}>
                  
                  <div className="p-8 rounded-2xl" style={{ backgroundColor: '#ffffff', boxShadow: customTheme.styles.boxShadow }}>
                    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: customTheme.fonts.heading }}>
                      Live Theme Preview
                    </h1>
                    <p className="text-lg mb-6 opacity-80" style={{ fontFamily: customTheme.fonts.body }}>
                      This is how your text will look with the selected body font. See how the colors apply to buttons and components below.
                    </p>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: customTheme.colors.primary, borderRadius: customTheme.styles.borderRadius }}>
                        Primary Action
                      </button>
                      <button className="px-6 py-3 font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: customTheme.colors.secondary, borderRadius: customTheme.styles.borderRadius }}>
                        Secondary Action
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border" style={{ borderColor: customTheme.colors.accent, backgroundColor: '#ffffff' }}>
                      <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: customTheme.colors.primary + '20' }}>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: customTheme.colors.primary }}></div>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: customTheme.fonts.heading }}>Feature Card</h3>
                      <p className="opacity-80 text-sm" style={{ fontFamily: customTheme.fonts.body }}>Notice how the accent colors and primary colors are utilized here.</p>
                    </div>
                    
                    <div className="p-6 rounded-2xl text-white" style={{ backgroundColor: customTheme.colors.primary }}>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: customTheme.fonts.heading }}>Inverted Card</h3>
                      <p className="opacity-90 text-sm" style={{ fontFamily: customTheme.fonts.body }}>Using the primary color as the background.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
