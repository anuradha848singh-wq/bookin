"use client";

import React from "react";
import { useEditor, Element } from "@craftjs/core";
import { Container } from "./blocks/Container";
import { Text } from "./blocks/Text";
import { Button } from "./blocks/Button";
import { HeroSection } from "./blocks/HeroSection";
import { ServicesGrid } from "./blocks/ServicesGrid";
import { ServiceShowcase } from "./blocks/ServiceShowcase";
import { StaffShowcase } from "./blocks/StaffShowcase";
import { BookingWidgetConnector, CRMFormConnector } from "./blocks/Connectors";
import { BookingWidgetBlock } from "./blocks/BookingWidgetBlock";
import { FormEmbed } from "./blocks/FormEmbed";
import { Image } from "./blocks/Image";
import { Video } from "./blocks/Video";
import { Divider } from "./blocks/Divider";
import { Spacer } from "./blocks/Spacer";
import { Icon } from "./blocks/Icon";
import { Accordion } from "./blocks/Accordion";
import { Modal } from "./blocks/Modal";
import { Toggle } from "./blocks/Toggle";
import { Dropdown } from "./blocks/Dropdown";
import { Tabs } from "./blocks/Tabs";
import { Search, X, Square, Columns, LayoutGrid, Layers, Type, Heading1, MousePointerClick, Image as ImageIcon, Smile, Minus, Space, Video as VideoIcon, PictureInPicture, SlidersHorizontal, FormInput, MapPin, Table, AlignJustify, Menu, ToggleLeft, CalendarDays, ConciergeBell, Clock, Users, Repeat, Baseline, List, CreditCard, Code2, Star, Link, ArrowUpDown, PlaySquare, FileText, MonitorPlay, MousePointer2 } from "lucide-react";

interface BuilderPageMeta {
  id?: string;
  name: string;
  slug: string;
  is_home?: boolean;
}

export const LeftPanel = ({ 
  activeTab,
  activeSlug,
  onPageSwitch
}: { 
  activeTab: string;
  activeSlug: string;
  onPageSwitch: (newSlug: string) => void;
}) => {
  const { connectors, actions, query, nodesJson } = useEditor((state) => ({
    nodesJson: JSON.stringify(
      Object.keys(state.nodes).reduce((acc: any, key) => {
        acc[key] = {
          name: state.nodes[key].data.displayName || state.nodes[key].data.name,
          props: state.nodes[key].data.props,
        };
        return acc;
      }, {}),
      null,
      2
    )
  }));

  const handleAddClick = React.useCallback((element: React.ReactElement) => {
    const node = query.parseReactElement(element).toNodeTree();
    actions.addNodeTree(node, "ROOT");
  }, [actions, query]);

  const DraggableBlock = ({ element, icon, label }: { element: React.ReactElement, icon: React.ReactNode, label: string }) => {
    return (
      <div 
        ref={(ref) => { if (ref) connectors.create(ref, element); }}
        onClick={() => handleAddClick(element)}
      >
        <BlockItem icon={icon} label={label} />
      </div>
    );
  };

  // Pages State
  const [pages, setPages] = React.useState<BuilderPageMeta[]>([]);
  const [newPageName, setNewPageName] = React.useState("");
  const [pagesLoading, setPagesLoading] = React.useState(false);
  const [pagesError, setPagesError] = React.useState<string | null>(null);
  const [creatingPage, setCreatingPage] = React.useState(false);

  const normalizePage = (page: any): BuilderPageMeta => ({
    id: page.id,
    name: page.title || page.name || page.slug,
    slug: page.slug,
    is_home: page.is_home,
  });

  const fetchPages = React.useCallback(async () => {
    try {
      setPagesLoading(true);
      setPagesError(null);
      const res = await fetch("/api/studio/pages");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load pages");
      setPages((data.pages || []).map(normalizePage));
    } catch (err: any) {
      setPagesError(err.message || "Failed to load pages");
      setPages([
        { name: "Home Landing", slug: "home", is_home: true },
        { name: "About Clinic", slug: "about" },
        { name: "Clinical Specialties", slug: "services" },
        { name: "Our Specialists", slug: "staff" },
        { name: "Schedule Appointment", slug: "booking" },
      ]);
    } finally {
      setPagesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "pages") fetchPages();
  }, [activeTab, fetchPages]);

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newPageName.trim();
    if (!title || creatingPage) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "new-page";

    try {
      setCreatingPage(true);
      setPagesError(null);
      const res = await fetch("/api/studio/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create page");
      const created = normalizePage(data.page || { title, slug });
      setPages((current) => [...current.filter((p) => p.slug !== created.slug), created]);
      setNewPageName("");
      onPageSwitch(created.slug);
    } catch (err: any) {
      setPagesError(err.message || "Failed to create page");
    } finally {
      setCreatingPage(false);
    }
  };

  // Global Theme Preset State
  const [selectedTheme, setSelectedTheme] = React.useState("teal");
  const [selectedFont, setSelectedFont] = React.useState("sans");

  // SEO State
  const [seoTitle, setSeoTitle] = React.useState("Platinum Medical Center | Modern Clinical Care");
  const [seoDesc, setSeoDesc] = React.useState("Book premium clinical appointments online in seconds. Our dedicated medical specialists offer cardiological, dental, and general diagnostic care.");
  const [seoKeywords, setSeoKeywords] = React.useState("doctor, clinic, booking, cardiologists");

  // Integrations Toggles
  const [integrations, setIntegrations] = React.useState({
    supabase: true,
    booking: true,
    stripe: false,
    whatsapp: false,
  });
  const [stripeKey, setStripeKey] = React.useState("");

  // Settings Toggles
  const [settings, setSettings] = React.useState({
    autosave: true,
    snapping: true,
    rulers: false,
    developerMode: false,
  });

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium shadow-sm";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  if (activeTab === "add") {
    return (
      <div className="builder-panel">
        
        {/* Header */}
        <div className="builder-panel-header">
          <span className="builder-panel-title">Add Elements</span>
          <button style={{ color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
        </div>

        {/* Search Bar */}
        <div className="builder-panel-search-wrap">
          <div className="builder-panel-search">
            <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search elements..." 
            />
          </div>
        </div>

        <div className="builder-panel-content">
          
          {/* LAYOUT */}
          <div>
            <h4 className="builder-category-title">LAYOUT</h4>
            <div className="builder-block-grid">
              <BlockItem icon={<div style={{ width: 22, height: 22, border: '2px dashed currentColor', borderRadius: 3 }}></div>} label="Section" />
              <DraggableBlock element={<Element is={Container} padding={20} canvas />} icon={<div style={{ width: 22, height: 22, border: '2px dashed currentColor', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 10, height: 10, border: '2px dashed currentColor', borderRadius: 2 }}></div></div>} label="Container" />
              <DraggableBlock element={<Element is={ServicesGrid} canvas />} icon={<LayoutGrid size={24} strokeWidth={1.5} />} label="Grid" />
              <BlockItem icon={<SlidersHorizontal size={24} strokeWidth={1.5} />} label="Stack" />
            </div>
          </div>

          {/* BASIC */}
          <div>
            <h4 className="builder-category-title">BASIC</h4>
            <div className="builder-block-grid">
              <DraggableBlock element={<Element is={Text} text="Text Block" />} icon={<span style={{ fontFamily: 'serif', fontSize: 26, lineHeight: 1 }}>A</span>} label="Text" />
              <DraggableBlock element={<Element is={Text} text="Heading" fontSize={32} fontWeight="bold" />} icon={<span style={{ fontFamily: 'serif', fontSize: 26, lineHeight: 1 }}>H</span>} label="Heading" />
              <DraggableBlock element={<Element is={Button} text="Button" />} icon={<div style={{ width: 26, height: 14, borderRadius: 999, border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><Link size={10} strokeWidth={2.5} style={{ position: 'absolute', backgroundColor: '#fff', padding: '0 2px' }} /></div>} label="Button" />
              <DraggableBlock element={<Element is={Image} canvas />} icon={<ImageIcon size={24} strokeWidth={1.5} />} label="Image" />
              <DraggableBlock element={<Element is={Icon} canvas />} icon={<Star size={24} strokeWidth={1.5} />} label="Icon" />
              <DraggableBlock element={<Element is={Divider} canvas />} icon={<Minus size={24} strokeWidth={1.5} />} label="Divider" />
              <DraggableBlock element={<Element is={Spacer} canvas />} icon={<ArrowUpDown size={24} strokeWidth={1.5} />} label="Spacer" />
              <DraggableBlock element={<Element is={Video} canvas />} icon={<PlaySquare size={24} strokeWidth={1.5} />} label="Video" />
            </div>
          </div>

          {/* ADVANCED */}
          <div>
            <h4 className="builder-category-title">ADVANCED</h4>
            <div className="builder-block-grid">
              <BlockItem icon={<LayoutGrid size={24} strokeWidth={1.5} />} label="Gallery" />
              <BlockItem icon={<MonitorPlay size={24} strokeWidth={1.5} />} label="Slider" />
              <DraggableBlock element={<Element is={FormEmbed as any} canvas />} icon={<FileText size={24} strokeWidth={1.5} />} label="Form" />
              <BlockItem icon={<MapPin size={24} strokeWidth={1.5} />} label="Map" />
              <BlockItem icon={<Table size={24} strokeWidth={1.5} />} label="Table" />
              <DraggableBlock element={<Element is={Tabs as any} canvas />} icon={<FileText size={24} strokeWidth={1.5} />} label="Tabs" />
              <DraggableBlock element={<Element is={Accordion} canvas />} icon={<AlignJustify size={24} strokeWidth={1.5} />} label="Accordion" />
              <DraggableBlock element={<Element is={Modal as any} canvas />} icon={<LayoutGrid size={24} strokeWidth={1.5} />} label="Modal" />
              <DraggableBlock element={<Toggle />} icon={<ToggleLeft size={24} strokeWidth={1.5} />} label="Toggle" />
              <DraggableBlock element={<Element is={Dropdown as any} canvas />} icon={<Menu size={24} strokeWidth={1.5} />} label="Dropdown" />
            </div>
          </div>

          {/* BOOKING */}
          <div>
            <h4 className="builder-category-title">BOOKING</h4>
            <div className="builder-block-grid">
              <DraggableBlock element={<Element is={BookingWidgetBlock} canvas />} icon={<CalendarDays size={24} strokeWidth={1.5} />} label="Booking Widget" />
              <DraggableBlock element={<Element is={ServiceShowcase} canvas />} icon={<MonitorPlay size={24} strokeWidth={1.5} />} label="Services" />
              <BlockItem icon={<CalendarDays size={24} strokeWidth={1.5} />} label="Availability" />
              <DraggableBlock element={<Element is={StaffShowcase} canvas />} icon={<Users size={24} strokeWidth={1.5} />} label="Staff List" />
            </div>
          </div>

          {/* CMS */}
          <div>
            <h4 className="builder-category-title">CMS</h4>
            <div className="builder-block-grid">
              <BlockItem icon={<Repeat size={24} strokeWidth={1.5} />} label="Repeater" />
              <BlockItem icon={<Baseline size={24} strokeWidth={1.5} />} label="Dynamic Text" />
              <BlockItem icon={<List size={24} strokeWidth={1.5} />} label="List" />
              <BlockItem icon={<CreditCard size={24} strokeWidth={1.5} />} label="Card" />
            </div>
          </div>

          {/* Custom Code */}
          <div className="builder-custom-code">
            <div className="builder-custom-code-icon">
              <Code2 size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="builder-custom-code-title">Add custom code</div>
              <div className="builder-custom-code-subtitle">HTML, CSS, JS</div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render Pages Management Tab
  if (activeTab === "pages") {
    return (
      <div className="builder-panel">
        <div className="builder-panel-header">
          <span className="builder-panel-title">Site Pages</span>
        </div>
        <div className="builder-panel-content pb-8">
          <form onSubmit={handleAddPage} className="flex gap-2">
            <input 
              type="text" 
              value={newPageName} 
              onChange={(e) => setNewPageName(e.target.value)} 
              placeholder="Page title..." 
              className={inputClass}
            />
            <button type="submit" className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold shrink-0 transition-colors shadow-sm">
              + Add
            </button>
          </form>

          <div className="flex flex-col gap-1.5 mt-5">
            <span className={labelClass}>Page List</span>
            {pages.map((p) => {
              const isActive = activeSlug === p.slug;
              return (
                <button
                  key={p.slug}
                  onClick={() => onPageSwitch(p.slug)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={14} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                  {isActive ? (
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-400 truncate max-w-[80px]">
                      /{p.slug}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render Theme & Font Swatches Customizer Tab
  if (activeTab === "theme") {
    const swatches = [
      { id: "teal", name: "Emerald Medical", primary: "#115E59", secondary: "#A7F3D0", bg: "#F0FDFA" },
      { id: "indigo", name: "Royal Care", primary: "#4F46E5", secondary: "#C7D2FE", bg: "#EEF2FF" },
      { id: "rose", name: "Elegant Wellness", primary: "#BE123C", secondary: "#FECDD3", bg: "#FFF1F2" },
      { id: "slate", name: "Classic Diagnostics", primary: "#334155", secondary: "#E2E8F0", bg: "#F8FAFC" },
    ];

    const fonts = [
      { id: "sans", name: "Modern Sans (Inter/Outfit)" },
      { id: "serif", name: "Elegant Serif (Playfair)" },
      { id: "mono", name: "Tech Minimal (JetBrains Mono)" },
    ];

    return (
      <div className="builder-panel">
        <div className="builder-panel-header">
          <span className="builder-panel-title">Global Theme Design</span>
        </div>
        <div className="builder-panel-content pb-8">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5">
            <span className={labelClass}>Branding Colors</span>
            <div className="flex flex-col gap-2">
              {swatches.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedTheme(s.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all bg-white ${selectedTheme === s.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <span className="text-xs font-bold text-gray-700">{s.name}</span>
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: s.primary }} />
                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: s.secondary }} />
                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: s.bg }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-5">
            <span className={labelClass}>Branding Typography</span>
            <div className="flex flex-col gap-2">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all bg-white text-xs font-bold text-gray-700 ${selectedFont === f.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Real-time Google SEO Preview Tab
  if (activeTab === "seo") {
    return (
      <div className="builder-panel">
        <div className="builder-panel-header">
          <span className="builder-panel-title">SEO & Metadata</span>
        </div>
        <div className="builder-panel-content pb-8">
          
          {/* Inputs */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>SEO Page Title</label>
              <input 
                type="text" 
                value={seoTitle} 
                onChange={(e) => setSeoTitle(e.target.value)} 
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Meta Description</label>
              <textarea 
                value={seoDesc} 
                onChange={(e) => setSeoDesc(e.target.value)} 
                className={`${inputClass} min-h-[70px] resize-y`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Keywords</label>
              <input 
                type="text" 
                value={seoKeywords} 
                onChange={(e) => setSeoKeywords(e.target.value)} 
                className={inputClass}
              />
            </div>
          </div>

          {/* Premium Google Result Preview Snippet */}
          <div className="flex flex-col gap-3.5 mt-5">
            <span className={labelClass}>Google Search Snippet Preview</span>
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-md text-left font-sans flex flex-col gap-1 hover:shadow-lg transition-shadow">
              <span className="text-[12px] text-gray-500 flex items-center gap-1">
                https://platinum-med.bookin.clinic <span className="text-[8px] text-gray-400">/home</span>
              </span>
              <span className="text-[15px] font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight block">
                {seoTitle || "No title configured"}
              </span>
              <span className="text-[12px] text-[#4d5156] leading-relaxed block mt-1 line-clamp-3">
                {seoDesc || "Provide a meta description to let search engines and clinical visitors find your website listing on the web."}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render CRM/Booking Integrations Panel Tab
  if (activeTab === "integrations") {
    return (
      <div className="builder-panel">
        <div className="builder-panel-header">
          <span className="builder-panel-title">Integrations</span>
        </div>
        <div className="builder-panel-content pb-8">
          
          <div className="flex flex-col gap-4">
            
            {/* Supabase Integration */}
            <div className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700">Supabase DB Sync</span>
                  <span className="text-[10px] text-gray-400">Connected database hosting</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-extrabold uppercase border border-emerald-500/10">Active</span>
              </div>
              <input type="text" disabled value="https://xtwipmryzndm.supabase.co" className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
            </div>

            {/* Booking Calendar Widget */}
            <div className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700">Booking Engine</span>
                  <span className="text-[10px] text-gray-400">Real-time scheduling sync</span>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-extrabold uppercase border border-emerald-500/10">Active</span>
              </div>
              <input type="text" disabled value="Clinic ID: DEV_CLINIC_01" className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
            </div>

            {/* Stripe Payments */}
            <div className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700">Stripe Payments</span>
                  <span className="text-[10px] text-gray-400">Accept patient prepayments</span>
                </div>
                <button 
                  onClick={() => setIntegrations({ ...integrations, stripe: !integrations.stripe })}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${integrations.stripe ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${integrations.stripe ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </div>
              {integrations.stripe && (
                <div className="flex flex-col gap-2 border-t border-dashed border-gray-100 pt-2 text-left">
                  <label className={labelClass}>Stripe Publishable Key</label>
                  <input 
                    type="text" 
                    value={stripeKey} 
                    onChange={(e) => setStripeKey(e.target.value)} 
                    placeholder="pk_test_..." 
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-700">WhatsApp Alert Bot</span>
                  <span className="text-[10px] text-gray-400">Automated patient notifications</span>
                </div>
                <button 
                  onClick={() => setIntegrations({ ...integrations, whatsapp: !integrations.whatsapp })}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${integrations.whatsapp ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${integrations.whatsapp ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Render Global Settings and Live Developer JSON inspector Tab
  if (activeTab === "settings") {
    return (
      <div className="builder-panel">
        <div className="builder-panel-header">
          <span className="builder-panel-title">Editor Settings</span>
        </div>
        <div className="builder-panel-content pb-8">
          
          <div className="flex flex-col gap-3.5 border-b border-gray-100 pb-5">
            {/* Auto save */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-700">Auto-Save Drafts</span>
                <span className="text-[10px] text-gray-400">Backup canvas state every 2m</span>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, autosave: !settings.autosave })}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.autosave ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${settings.autosave ? 'translate-x-4.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Snapping */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-700">Grid Snapping Rules</span>
                <span className="text-[10px] text-gray-400">Align items on 8px intervals</span>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, snapping: !settings.snapping })}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.snapping ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${settings.snapping ? 'translate-x-4.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Guides */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-700">Canvas Ruler Guides</span>
                <span className="text-[10px] text-gray-400">Display visual margin lines</span>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, rulers: !settings.rulers })}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.rulers ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${settings.rulers ? 'translate-x-4.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Dev Mode toggle */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1"><Code2 size={13} /> Developer Mode</span>
                <span className="text-[10px] text-gray-400">Inspect live Craft JSON nodes</span>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, developerMode: !settings.developerMode })}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${settings.developerMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4.5 h-4.5 bg-white rounded-full shadow transform duration-200 ${settings.developerMode ? 'translate-x-4.5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Real-time Visual Craft Node JSON Viewer */}
          {settings.developerMode && (
            <div className="flex flex-col gap-2 mt-5 text-left">
              <span className={labelClass}>Live Craft Nodes JSON Tree</span>
              <pre className="text-[9px] text-emerald-400 bg-slate-950 p-3 rounded-lg max-h-[220px] overflow-auto font-mono leading-normal shadow-inner border border-slate-900 hide-scrollbar">
                {nodesJson}
              </pre>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Placeholder for other tabs (Layers, Sections, CMS, etc.)
  return (
    <div className="builder-panel">
      <div className="builder-panel-header" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <span className="builder-panel-title" style={{ textTransform: 'capitalize' }}>{activeTab}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Settings panel under construction.</p>
      </div>
    </div>
  );
};

// Helper component for block items
const BlockItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="builder-block-item">
    <div className="builder-block-icon">
      {icon}
    </div>
    <span className="builder-block-label">{label}</span>
  </div>
);



