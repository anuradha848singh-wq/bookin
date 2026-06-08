"use client";

import React, { useState, useEffect } from "react";
import { X, Activity, LineChart, Hash, Code, Loader2 } from "lucide-react";

interface AnalyticsSettingsProps {
  onClose: () => void;
}

export const AnalyticsSettings = ({ onClose }: AnalyticsSettingsProps) => {
  const [form, setForm] = useState({
    gaId: "",
    gtmId: "",
    fbPixelId: "",
    customHead: "",
    customBody: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/studio/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setForm({
            gaId: data.settings.gaId || "",
            gtmId: data.settings.gtmId || "",
            fbPixelId: data.settings.fbPixelId || "",
            customHead: data.settings.customHead || "",
            customBody: data.settings.customBody || ""
          });
        }
      } catch(e) {
        console.error("Failed to load global settings", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/studio/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      onClose();
    } catch(e) {
      console.error("Failed to save", e);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2.5">
            <Activity size={20} className="text-red-600" />
            Global Analytics & Tracking
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm focus:outline-none transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-6 bg-white">
            <p className="text-sm font-medium text-gray-500">
              Configure global tracking pixels, analytics, and custom scripts. These will be injected into the compiled HTML when the site is published.
            </p>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <LineChart size={14} /> Google Analytics ID
                </label>
                <input 
                  type="text" 
                  value={form.gaId}
                  onChange={(e) => setForm({...form, gaId: e.target.value})}
                  placeholder="e.g. G-XXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash size={14} /> Google Tag Manager ID
                </label>
                <input 
                  type="text" 
                  value={form.gtmId}
                  onChange={(e) => setForm({...form, gtmId: e.target.value})}
                  placeholder="e.g. GTM-XXXXXXX"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} /> Facebook Pixel ID
              </label>
              <input 
                type="text" 
                value={form.fbPixelId}
                onChange={(e) => setForm({...form, fbPixelId: e.target.value})}
                placeholder="e.g. 123456789012345"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm transition-all"
              />
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Code size={16} className="text-gray-400" /> Custom Scripts
              </h4>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom &lt;head&gt; Code</label>
                  <textarea 
                    value={form.customHead}
                    onChange={(e) => setForm({...form, customHead: e.target.value})}
                    placeholder="<!-- Inject heatmaps, verified tags, or A/B testing scripts here -->"
                    rows={4}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm font-mono text-gray-600 transition-all resize-y"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom &lt;body&gt; Code</label>
                  <textarea 
                    value={form.customBody}
                    onChange={(e) => setForm({...form, customBody: e.target.value})}
                    placeholder="<!-- Inject body scripts, chat widgets, or noscript fallbacks -->"
                    rows={4}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm font-mono text-gray-600 transition-all resize-y"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 shrink-0">
          <button 
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl shadow-sm shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
