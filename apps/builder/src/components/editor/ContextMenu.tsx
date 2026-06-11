"use client";

import React, { useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";
import { Copy, Trash2, LayoutTemplate, Layers, Lock, EyeOff, Scissors, ClipboardPaste } from "lucide-react";

export const ContextMenu = () => {
  const { actions, query } = useEditor();
  const [menuState, setMenuState] = useState<{ x: number; y: number; id: string } | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setMenuState(customEvent.detail);
    };

    const handleClickOutside = () => {
      setMenuState(null);
    };

    window.addEventListener("openContextMenu", handleOpen);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleClickOutside, true);

    return () => {
      window.removeEventListener("openContextMenu", handleOpen);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside, true);
    };
  }, []);

  if (!menuState) return null;

  const node = query.node(menuState.id).get();
  const isRoot = node?.data.parent === "ROOT" || menuState.id === "ROOT";

  const handleAction = (action: string) => {
    switch (action) {
      case "delete":
        if (!isRoot) actions.delete(menuState.id);
        break;
      case "duplicate":
        if (!isRoot) {
           const nodeData = query.node(menuState.id).get();
           const parentId = nodeData.data.parent;
           if (parentId) {
              const tree = query.node(menuState.id).toNodeTree();
              actions.addNodeTree(tree, parentId);
           }
        }
        break;
      case "copy":
        if (!isRoot) {
          const tree = query.node(menuState.id).toNodeTree();
          localStorage.setItem("craft_clipboard", JSON.stringify(tree));
        }
        break;
      case "paste":
        const clipboard = localStorage.getItem("craft_clipboard");
        if (clipboard) {
          try {
            const tree = JSON.parse(clipboard);
            const canHaveChildren = node ? query.node(menuState.id).isCanvas() : true;
            const targetParent = canHaveChildren ? menuState.id : (node?.data.parent || "ROOT");
            actions.addNodeTree(tree, targetParent);
          } catch (e) {}
        }
        break;
      case "selectParent":
        const parentId = node?.data.parent;
        if (parentId) actions.selectNode(parentId);
        break;
      case "saveTemplate":
        if (!isRoot) {
          const tree = query.node(menuState.id).toNodeTree();
          const templatesStr = localStorage.getItem("bookin_templates");
          const templates = templatesStr ? JSON.parse(templatesStr) : [];
          templates.push({
            id: crypto.randomUUID(),
            name: `${node?.data.name || "Element"} Template`,
            tree: tree,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem("bookin_templates", JSON.stringify(templates));
          alert("Template saved successfully! It is now available in your components library.");
        }
        break;
    }
    setMenuState(null);
  };

  return (
    <div 
      className="fixed z-[99999] bg-[#1A1A1E] border border-[#2C2D33] rounded-md shadow-2xl flex flex-col py-1.5 w-48 font-sans"
      style={{ left: menuState.x, top: menuState.y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 border-b border-[#2C2D33] mb-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate block">
          {node?.data.custom.displayName || node?.data.name || "Element"}
        </span>
      </div>

      <button onClick={() => handleAction("selectParent")} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-gray-300 text-[11px] font-medium transition-colors text-left w-full">
        <Layers size={13} /> Select Parent
      </button>

      <div className="h-px bg-[#2C2D33] my-1 mx-2" />

      <button onClick={() => handleAction("copy")} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/5 text-gray-300 text-[11px] font-medium transition-colors text-left w-full" disabled={isRoot}>
        <Copy size={13} /> Copy
      </button>
      <button onClick={() => handleAction("paste")} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/5 text-gray-300 text-[11px] font-medium transition-colors text-left w-full">
        <ClipboardPaste size={13} /> Paste
      </button>

      <div className="h-px bg-[#2C2D33] my-1 mx-2" />

      <button onClick={() => handleAction("saveTemplate")} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/5 text-gray-300 text-[11px] font-medium transition-colors text-left w-full" disabled={isRoot}>
        <LayoutTemplate size={13} /> Save as Template
      </button>

      <div className="h-px bg-[#2C2D33] my-1 mx-2" />

      <button onClick={() => handleAction("delete")} className="flex items-center justify-between px-3 py-1.5 hover:bg-red-500/10 hover:text-red-400 text-gray-300 text-[11px] font-medium transition-colors text-left w-full group" disabled={isRoot}>
        <div className="flex items-center gap-2.5">
          <Trash2 size={13} className="group-hover:text-red-400" /> Delete
        </div>
        <span className="text-[9px] text-gray-500 font-mono">Del</span>
      </button>
    </div>
  );
};
