"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { ChevronDown, Monitor, Tablet, Smartphone, Undo2, Redo2, Loader2, Check, Upload, HelpCircle, Eye, EyeOff, AlertCircle, Cloud, Search, Activity, Gauge, Palette, Code2, Database, ShoppingBag, Users, Zap } from "lucide-react";
import { SEOAnalyzer } from "./SEOAnalyzer";
import { AnalyticsSettings } from "./AnalyticsSettings";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { ThemeManager } from "./ThemeManager";
import { CodeEditorModal } from "./CodeEditorModal";
import { CMSManagerModal } from "./CMSManagerModal";
import { StoreManagerModal } from "./StoreManagerModal";
import { MembersManagerModal } from "./MembersManagerModal";

interface TopbarProps {
  onSave: (data: string) => Promise<void>;
  onLoad: () => Promise<string | null>;
  activeSlug: string;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  setSaveStatus: (status: "saved" | "saving" | "unsaved" | "error") => void;
  onOpenPages: () => void;
}

export const Topbar = ({
  onSave,
  activeSlug,
  deviceMode,
  setDeviceMode,
  previewMode,
  setPreviewMode,
  saveStatus,
  setSaveStatus,
  onOpenPages,
}: TopbarProps) => {
  const { query, actions, canUndo, canRedo } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCMS, setShowCMS] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    setSaveStatus("saving");
    try {
      const json = query.serialize();
      await onSave(json);
      
      const res = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteSlug: activeSlug })
      });
      
      if (!res.ok) throw new Error("Publish failed");
      
      setSaveStatus("saved");
      alert("Site published successfully!");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      alert("Failed to publish site.");
    } finally {
      setIsPublishing(false);
    }
  };

  const saveLabel = {
    saved: "Saved",
    saving: "Saving",
    unsaved: "Unsaved",
    error: "Error",
  }[saveStatus];

  return (
    <>
      <div className="builder-topbar">
      <div className="builder-topbar-left">
        <div className="builder-logo">
          <div className="builder-logo-icon"><Zap size={14} fill="currentColor" /></div>
          Bookin
        </div>

        <button type="button" onClick={onOpenPages} className="builder-page-switcher">
          <span className="text-gray-400">Page:</span>
          <span className="capitalize text-white">{activeSlug}</span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="builder-topbar-center">
        <div className="builder-device-controls flex items-center gap-1 bg-[#1A1A1E] border border-[#2C2D33] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`builder-icon-button ${deviceMode === "desktop" ? "active" : ""}`}
            title="Desktop"
          >
            <Monitor size={15} />
          </button>
          <button 
            type="button" 
            onClick={() => setDeviceMode("tablet")}
            className={`builder-icon-button ${deviceMode === "tablet" ? "active" : ""}`}
            title="Tablet"
          >
            <Tablet size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`builder-icon-button ${deviceMode === "mobile" ? "active" : ""}`}
            title="Mobile"
          >
            <Smartphone size={15} />
          </button>
        </div>

        <div className="builder-topbar-divider" />

        <div className="flex items-center gap-1 bg-[#1A1A1E] border border-[#2C2D33] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => actions.history.undo()}
            disabled={!canUndo || previewMode}
            className="builder-icon-button"
            title="Undo"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => actions.history.redo()}
            disabled={!canRedo || previewMode}
            className="builder-icon-button"
            title="Redo"
          >
            <Redo2 size={15} />
          </button>
        </div>

        <div className="builder-topbar-divider" />

        <div className={`builder-save-state builder-save-state-${saveStatus}`}>
          <div className="builder-save-state-dot"></div>
          <span>{saveLabel}</span>
        </div>
      </div>

      <div className="builder-topbar-right">
        <button type="button" onClick={() => setShowMembers(true)} className="builder-btn-secondary" title="Members">
          <Users size={14} />
        </button>
        <button type="button" onClick={() => setShowStore(true)} className="builder-btn-secondary" title="Store">
          <ShoppingBag size={14} />
        </button>
        <button type="button" onClick={() => setShowCode(true)} className="builder-btn-secondary" title="Code Editor">
          <Code2 size={14} />
        </button>
        <button type="button" onClick={() => setShowPerformance(true)} className="builder-btn-secondary" title="Performance">
          <Gauge size={14} />
        </button>
        
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="builder-btn-secondary"
        >
          {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{previewMode ? "Edit" : "Preview"}</span>
        </button>
        
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="builder-btn-primary"
        >
          {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>{isPublishing ? "Publishing..." : "Publish"}</span>
        </button>
      </div>
    </div>
    
    {showSEO && <SEOAnalyzer onClose={() => setShowSEO(false)} />}
    {showAnalytics && <AnalyticsSettings onClose={() => setShowAnalytics(false)} />}
    {showPerformance && <PerformanceMonitor onClose={() => setShowPerformance(false)} />}
    {showTheme && <ThemeManager onClose={() => setShowTheme(false)} />}
    {showCode && <CodeEditorModal onClose={() => setShowCode(false)} websiteId={activeSlug} />}
    {showCMS && <CMSManagerModal onClose={() => setShowCMS(false)} websiteId={activeSlug} />}
    {showStore && <StoreManagerModal onClose={() => setShowStore(false)} websiteId={activeSlug} />}
    {showMembers && <MembersManagerModal onClose={() => setShowMembers(false)} websiteId={activeSlug} />}
    </>
  );
};
