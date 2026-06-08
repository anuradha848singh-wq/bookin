"use client";

import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";
import { Trash2, ArrowUp, ArrowDown, Settings } from "lucide-react";

export const ContextualMenu = () => {
  const { selected, actions } = useEditor((state, query) => {
    const selectedId = state.events.selected.values().next().value;
    return {
      selected: selectedId ? {
        id: selectedId,
        name: state.nodes[selectedId].data.name,
        isDeletable: query.node(selectedId).isDeletable(),
        dom: state.nodes[selectedId].dom,
      } : null,
    };
  });

  const [position, setPosition] = useState<{ top: number, left: number } | null>(null);

  useEffect(() => {
    if (selected && selected.dom) {
      const selectedDom = selected.dom;
      const updatePosition = () => {
        const rect = selectedDom.getBoundingClientRect();
        // Position it just above the element
        setPosition({
          top: rect.top - 40, // 40px above
          left: rect.left,
        });
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else {
      setPosition(null);
    }
  }, [selected]);

  if (!selected || !position) return null;

  return (
    <div 
      className="fixed z-50 flex items-center bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-1.5 border-r border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600">
        {selected.name}
      </div>
      
      {/* Quick Action Buttons */}
      <button 
        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        title="Settings"
      >
        <Settings size={14} />
      </button>
      
      <button 
        onClick={() => {
          // Add move up logic or just generic actions
        }}
        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors border-l border-gray-100"
      >
        <ArrowUp size={14} />
      </button>
      
      <button 
        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors border-l border-gray-100"
      >
        <ArrowDown size={14} />
      </button>

      {selected.isDeletable && (
        <button 
          onClick={() => actions.delete(selected.id)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-gray-100"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};
