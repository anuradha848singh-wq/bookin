"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { Clock, Save, RotateCcw, Trash2 } from "lucide-react";

export interface VersionSnapshot {
  id: string;
  name: string;
  createdAt: string;
  data: any; // Serialized craft nodes
}

export const VersionsPanel = ({ websiteId, activeSlug }: { websiteId: string, activeSlug: string }) => {
  const { actions, query } = useEditor();
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [newVersionName, setNewVersionName] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/studio/versions?websiteId=${websiteId}&pageSlug=${activeSlug}`);
        const data = await res.json();
        if (data.success) {
          setVersions(data.versions);
        }
      } catch (err) {
        console.error("Failed to fetch versions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [websiteId, activeSlug]);

  const saveVersion = async () => {
    if (!newVersionName.trim()) return;
    const data = query.serialize();
    
    // Optimistic update
    const tempId = Date.now().toString();
    const newVersion: VersionSnapshot = {
      id: tempId,
      name: newVersionName.trim(),
      createdAt: new Date().toISOString(),
      data
    };
    setVersions([newVersion, ...versions]);
    setNewVersionName("");

    try {
      const res = await fetch("/api/studio/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, pageSlug: activeSlug, name: newVersion.name, data })
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.error);
      
      // Update with real ID
      setVersions(prev => prev.map(v => v.id === tempId ? resData.version : v));
    } catch (err) {
      console.error("Failed to save version:", err);
      // Revert on failure
      setVersions(prev => prev.filter(v => v.id !== tempId));
      alert("Failed to save version.");
    }
  };

  const restoreVersion = (version: VersionSnapshot) => {
    if (window.confirm(`Are you sure you want to restore "${version.name}"? Current unsaved changes will be lost.`)) {
      actions.deserialize(typeof version.data === "string" ? JSON.parse(version.data) : version.data);
    }
  };

  const deleteVersion = (id: string) => {
    // NOTE: This requires a DELETE endpoint which we didn't add yet, so we just remove from state for now.
    const updated = versions.filter(v => v.id !== id);
    setVersions(updated);
  };

  return (
    <div className="flex flex-col px-5 pb-8 pt-4 h-full">
      {/* Create new snapshot */}
      <div className="flex flex-col gap-3 mb-6">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Create Snapshot</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. V1.0 - Launch" 
            value={newVersionName}
            onChange={(e) => setNewVersionName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveVersion(); }}
            className="flex-1 bg-[#111115] border border-[#2C2D33] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button 
            onClick={saveVersion}
            disabled={!newVersionName.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-md transition-colors"
          >
            <Save size={16} />
          </button>
        </div>
      </div>

      <div className="h-px bg-[#2C2D33] w-full mb-6"></div>

      {/* List of snapshots */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Version History</label>
        <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar pr-1 pb-4">
          {versions.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              <Clock size={24} className="mx-auto mb-2 opacity-50" />
              No snapshots saved yet.
            </div>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="group flex flex-col bg-[#1E1E24] border border-[#2C2D33] rounded-md p-3 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{version.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(version.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteVersion(version.id)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => restoreVersion(version)}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-[#2C2D33] hover:bg-[#3F404A] text-xs font-medium text-white rounded transition-colors mt-1"
                >
                  <RotateCcw size={12} />
                  Restore This Version
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
