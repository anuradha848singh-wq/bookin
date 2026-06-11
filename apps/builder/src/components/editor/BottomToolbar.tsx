"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { Layers, Cuboid, Database, CloudOff, Cloud, SearchPlus, SearchMinus, Grid, MousePointer2 } from "lucide-react";

export const BottomToolbar = ({ saveStatus }: { saveStatus: "saved" | "saving" | "unsaved" | "error" }) => {
  const { nodes } = useEditor((state) => ({
    nodes: state.nodes
  }));

  const elementCount = Object.keys(nodes).length;

  return (
    <div className="builder-bottom-toolbar">
      <div className="builder-bottom-left">
        <div className="builder-bottom-item">
          <Layers size={14} />
          <span>Section &gt; Container &gt; Heading</span>
        </div>
      </div>

      <div className="builder-bottom-right">
        <div className="builder-bottom-item border-r border-[#2C2D33] pr-4">
          <Cuboid size={14} />
          <span>{elementCount} Elements</span>
        </div>
        
        <div className="builder-bottom-item border-r border-[#2C2D33] pr-4 text-emerald-500">
          <Database size={14} />
          <span>CMS Connected</span>
        </div>

        <div className="builder-bottom-item border-r border-[#2C2D33] pr-4">
          {saveStatus === "saved" ? (
            <span className="flex items-center gap-1.5 text-emerald-500"><Cloud size={14} /> Auto Saved</span>
          ) : saveStatus === "saving" ? (
            <span className="flex items-center gap-1.5 text-amber-500"><Cloud size={14} /> Saving...</span>
          ) : (
            <span className="flex items-center gap-1.5 text-gray-500"><CloudOff size={14} /> Unsaved</span>
          )}
        </div>

        <div className="builder-zoom-controls">
          <button className="builder-zoom-btn"><SearchMinus size={12} /></button>
          <div className="builder-zoom-value">100%</div>
          <button className="builder-zoom-btn"><SearchPlus size={12} /></button>
        </div>

        <button className="builder-bottom-item hover:text-white ml-2 bg-transparent border-none cursor-pointer">
          <Grid size={14} />
        </button>
      </div>
    </div>
  );
};
