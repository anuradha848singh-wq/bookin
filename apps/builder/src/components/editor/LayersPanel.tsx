"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { Layers, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from "lucide-react";

export const LayersPanel = () => {
  const { query, actions } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  const renderNode = (nodeId: string, depth: number = 0) => {
    const node = query.node(nodeId).get();
    if (!node) return null;

    const hasChildren = node.data.nodes && node.data.nodes.length > 0;
    const [isExpanded, setIsExpanded] = React.useState(true);

    return (
      <div key={nodeId}>
        <div 
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer group"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => actions.selectNode(nodeId)}
        >
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-[14px]" />}
          
          <span className="text-[11px] font-medium text-gray-700 flex-1 truncate">
            {node.data.displayName || node.data.name}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-0.5 hover:bg-gray-200 rounded">
              <Eye size={12} className="text-gray-400" />
            </button>
            <button className="p-0.5 hover:bg-gray-200 rounded">
              <Lock size={12} className="text-gray-400" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.data.nodes.map((childId: string) => renderNode(childId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto py-2">
      <div className="px-3 py-2 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-gray-400" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layer Tree</span>
        </div>
      </div>
      <div className="py-2">
        {renderNode("ROOT")}
      </div>
    </div>
  );
};
