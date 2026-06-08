"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { ChevronDown, Monitor, Tablet, Smartphone, Undo2, Redo2, Loader2, Check, Upload, HelpCircle, Eye, EyeOff, AlertCircle, Cloud, Search, Activity, Gauge, Palette, Code2, Database, ShoppingBag, Users } from "lucide-react";
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
  deviceMode: "desktop" | "mobile";
  setDeviceMode: (mode: "desktop" | "mobile") => void;
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
    saved: "Autosaved",
    saving: "Saving...",
    unsaved: "Unsaved changes",
    error: "Save failed",
  }[saveStatus];

  const SaveIcon = saveStatus === "error" ? AlertCircle : saveStatus === "saved" ? Check : Cloud;

  return (
    <>
      <div className="builder-topbar">
      <div className="builder-topbar-left">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="builder-logo">Bookin</span>
        </div>

        <button type="button" onClick={onOpenPages} className="builder-page-switcher">
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>Page:</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", textTransform: "capitalize" }}>{activeSlug}</span>
          <ChevronDown size={14} style={{ color: "#9ca3af", marginLeft: "4px" }} />
        </button>
      </div>

      <div className="builder-topbar-center">
        <div className="builder-history-controls">
          <button
            type="button"
            onClick={() => actions.history.undo()}
            disabled={!canUndo || previewMode}
            className="builder-icon-button"
            title="Undo"
          >
            <Undo2 size={15} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => actions.history.redo()}
            disabled={!canRedo || previewMode}
            className="builder-icon-button"
            title="Redo"
          >
            <Redo2 size={15} strokeWidth={2.2} />
          </button>
        </div>

        <div className="builder-topbar-divider" />

        <div className="builder-device-controls">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`builder-icon-button ${deviceMode === "desktop" ? "active" : ""}`}
            title="Desktop"
          >
            <Monitor size={15} strokeWidth={2.2} />
          </button>
          <button type="button" className="builder-icon-button" disabled title="Tablet preview coming soon">
            <Tablet size={15} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`builder-icon-button ${deviceMode === "mobile" ? "active" : ""}`}
            title="Mobile"
          >
            <Smartphone size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="builder-topbar-divider" />

        <div className={`builder-save-state builder-save-state-${saveStatus}`}>
          <span>{saveLabel}</span>
          {saveStatus === "saving" ? <Loader2 size={13} className="animate-spin" /> : <SaveIcon size={13} strokeWidth={3} />}
        </div>
      </div>

      <div className="builder-topbar-right">
        <button
          type="button"
          onClick={() => setShowMembers(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Users size={14} />
          <span>Members</span>
        </button>
        <button
          type="button"
          onClick={() => setShowStore(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <ShoppingBag size={14} />
          <span>Store</span>
        </button>
        <button
          type="button"
          onClick={() => setShowCMS(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Database size={14} />
          <span>CMS</span>
        </button>
        <button
          type="button"
          onClick={() => setShowCode(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Code2 size={14} />
          <span>Code</span>
        </button>
        <button
          type="button"
          onClick={() => setShowPerformance(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Gauge size={14} />
          <span>Performance</span>
        </button>
        <button
          type="button"
          onClick={() => setShowTheme(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Palette size={14} />
          <span>Theme</span>
        </button>
        <button
          type="button"
          onClick={() => setShowAnalytics(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Activity size={14} />
          <span>Analytics</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSEO(true)}
          className="builder-preview-button"
          style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb" }}
        >
          <Search size={14} />
          <span>SEO Check</span>
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="builder-preview-button"
        >
          {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{previewMode ? "Back to edit" : "Preview"}</span>
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="builder-publish-button"
        >
          {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={14} strokeWidth={2.5} />}
          <span>{isPublishing ? "Publishing..." : "Publish"}</span>
        </button>
        <button type="button" className="builder-help-button" title="Builder help">
          <HelpCircle size={18} />
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
