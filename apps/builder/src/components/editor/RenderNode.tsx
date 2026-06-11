"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { createPortal } from "react-dom";
import { AlignLeft, Code2 } from "lucide-react";

const SelectionOverlay = ({ dom, name, id }: { dom: HTMLElement, name: string, id: string }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    if (dom) {
      setRect(dom.getBoundingClientRect());
    }
  }, [dom]);

  useEffect(() => {
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    
    // MutationObserver to track size changes
    const observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    // Animation frame for smooth drag tracking
    let frame: number;
    const loop = () => {
      updateRect();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [updateRect]);

  if (!rect) return null;

  return createPortal(
    <div 
      className="fixed pointer-events-none z-[9999]" 
      style={{ 
        top: rect.top, 
        left: rect.left, 
        width: rect.width, 
        height: rect.height 
      }}
    >
      {/* The Dotted Outline */}
      <div className="absolute inset-0 border-2 border-blue-500" style={{ borderStyle: 'dotted' }}></div>

      {/* Label Tab (Top Left) */}
      <div className="absolute -top-6 -left-0.5 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md whitespace-nowrap shadow-sm pointer-events-auto">
        {name}
      </div>

      {/* Grab Handles (Corners) */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 pointer-events-auto cursor-nwse-resize"></div>
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 pointer-events-auto cursor-nesw-resize"></div>
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 pointer-events-auto cursor-nesw-resize"></div>
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 pointer-events-auto cursor-nwse-resize"></div>

      {/* Context Floating Toolbar (Bottom) */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl border border-gray-200 flex items-center px-3 gap-3 pointer-events-auto h-10 select-none"
        style={{ bottom: '-52px' }}
      >
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors group">
            <span className="text-[12px] font-serif font-extrabold leading-none tracking-tight text-gray-800 group-hover:text-black pr-0.5">Aa</span>
            <span className="text-[11px] font-bold tracking-wide">Edit Text</span>
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors group">
            <AlignLeft size={13} strokeWidth={2.5} className="group-hover:text-black" />
            <span className="text-[11px] font-bold tracking-wide">Alignment</span>
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded border border-gray-200/50 transition-all duration-200">
            <Code2 size={13} strokeWidth={2.5} />
            <span className="text-[11px] font-bold tracking-wide">Code</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

import { Rnd } from "react-rnd";

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const { id } = useNode();
  const { actions, query } = useEditor();
  
  const { isActive, isRoot, dom, name, hoverEffect, props, parentId } = useNode((node) => ({
    isActive: query.getEvent('selected').contains(node.id),
    isRoot: node.data.parent === 'ROOT',
    dom: node.dom,
    name: node.data.custom.displayName || node.data.name,
    hoverEffect: node.data.props.animation?.hover || "",
    props: node.data.props,
    parentId: node.data.parent
  }));

  const prevHoverRef = useRef<string>("");

  useEffect(() => {
    if (dom) {
      dom.style.outline = 'none';

      const baseClasses = ['transition-all', 'duration-300', 'ease-in-out'];
      
      if (prevHoverRef.current && prevHoverRef.current !== hoverEffect) {
         const oldClasses = prevHoverRef.current.split(' ');
         dom.classList.remove(...baseClasses, ...oldClasses);
      }

      if (hoverEffect) {
         const newClasses = hoverEffect.split(' ');
         dom.classList.add(...baseClasses, ...newClasses);
         prevHoverRef.current = hoverEffect;
      } else {
         prevHoverRef.current = "";
      }
    }
  }, [dom, hoverEffect]);

  // If this is the Root node (the main Canvas), do not wrap it in Rnd.
  // Also, if the element doesn't opt-in to absolute positioning yet (Phase 3 transition), 
  // we fallback to standard rendering. For now, we'll force absolute on children of ROOT.
  const isAbsolute = !isRoot && props.position === 'absolute';

  if (isAbsolute) {
    return (
      <Rnd
        position={{ x: props.x || 0, y: props.y || 0 }}
        size={{ width: props.width || 'auto', height: props.height || 'auto' }}
        onDragStop={(e, d) => {
          actions.setProp(id, (p: any) => {
            p.x = d.x;
            p.y = d.y;
          });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          actions.setProp(id, (p: any) => {
            p.width = ref.style.width;
            p.height = ref.style.height;
            p.x = position.x;
            p.y = position.y;
          });
        }}
        bounds="parent"
        className={isActive ? "ring-2 ring-blue-500 z-50" : "hover:ring-1 hover:ring-blue-300 z-10"}
        style={{ position: 'absolute' }}
        enableResizing={isActive} // Only show resize handles when selected
        disableDragging={!isActive} // Only drag when selected, to allow interacting with children
      >
        {render}
        {isActive && dom && (
           <div className="absolute -top-6 -left-0.5 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-t-md whitespace-nowrap shadow-sm pointer-events-auto">
             {name}
           </div>
        )}
      </Rnd>
    );
  }

  // Standard Flow Render
  return (
    <>
      {render}
      {isActive && dom ? (
        <SelectionOverlay dom={dom} name={name} id={id} />
      ) : null}
    </>
  );
};
