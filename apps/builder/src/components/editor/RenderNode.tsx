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
    
    // Track size changes
    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(dom);
    
    // Track position changes via mutations within the canvas only
    const canvasContainer = dom.closest('.builder-canvas-wrapper') || dom.parentElement;
    const mutationObserver = new MutationObserver(updateRect);
    if (canvasContainer) {
      mutationObserver.observe(canvasContainer, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
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

      // Handle Breakpoint Visibility Classes
      dom.classList.toggle('hide-desktop', !!props.hiddenBreakpoints?.desktop);
      dom.classList.toggle('hide-tablet', !!props.hiddenBreakpoints?.tablet);
      dom.classList.toggle('hide-mobile', !!props.hiddenBreakpoints?.mobile);

      // Handle Scroll Animations
      if (props.animation?.scroll?.type) {
        dom.style.setProperty('--animate-duration', `${props.animation.scroll.duration}ms`);
        dom.style.setProperty('--animate-delay', `${props.animation.scroll.delay}ms`);
        dom.classList.add('scroll-animate', `animate-type-${props.animation.scroll.type}`);
        
        // Only run observer if not active (to prevent jumping while selecting)
        if (!isActive) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                dom.classList.add('is-visible');
              } else {
                // Optional: remove class to repeat animation on scroll up
                // dom.classList.remove('is-visible'); 
              }
            });
          }, { threshold: 0.1 });
          observer.observe(dom);
          
          return () => {
            observer.disconnect();
          };
        } else {
           dom.classList.add('is-visible'); // always visible when selected
        }
      } else {
        dom.classList.remove('scroll-animate', 'is-visible');
        ['fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in'].forEach(t => dom.classList.remove(`animate-type-${t}`));
      }

      // Handle Shift-Click Multi-Select and Cmd-Click Deep Select
      const handleClick = (e: MouseEvent) => {
        if (e.shiftKey) {
          e.stopPropagation();
          e.preventDefault();
          const currentSelection = Array.from(query.getState().events.selected);
          if (currentSelection.includes(id)) {
            // Remove from selection
            const nextSelection = currentSelection.filter(n => n !== id);
            if (nextSelection.length > 0) {
              actions.selectNode(nextSelection);
            } else {
              actions.clearEvents();
            }
          } else {
            // Add to selection
            actions.selectNode([...currentSelection, id]);
          }
        } else if (e.metaKey || e.ctrlKey) {
          // Deep select: stop propagation so parent doesn't override
          e.stopPropagation();
          actions.selectNode(id);
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        actions.selectNode(id);
        window.dispatchEvent(new CustomEvent('openContextMenu', { 
          detail: { x: e.clientX, y: e.clientY, id } 
        }));
      };

      dom.addEventListener('click', handleClick, { capture: true });
      dom.addEventListener('contextmenu', handleContextMenu, { capture: true });
      return () => {
        dom.removeEventListener('click', handleClick, { capture: true });
        dom.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      };
    }
  }, [dom, hoverEffect, props.hiddenBreakpoints, id, actions, query]);

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
        className={isActive ? "ring-[1.5px] ring-[#0D99FF] z-50 shadow-[0_0_0_1px_rgba(13,153,255,0.2)]" : "hover:ring-1 hover:ring-[#0D99FF]/50 z-10"}
        style={{ position: 'absolute' }}
        enableResizing={isActive} // Only show resize handles when selected
        disableDragging={!isActive} // Only drag when selected, to allow interacting with children
        resizeHandleStyles={{
          topLeft: { width: '8px', height: '8px', background: 'white', border: '1.5px solid #0D99FF', borderRadius: '1px', left: '-4px', top: '-4px' },
          topRight: { width: '8px', height: '8px', background: 'white', border: '1.5px solid #0D99FF', borderRadius: '1px', right: '-4px', top: '-4px' },
          bottomLeft: { width: '8px', height: '8px', background: 'white', border: '1.5px solid #0D99FF', borderRadius: '1px', left: '-4px', bottom: '-4px' },
          bottomRight: { width: '8px', height: '8px', background: 'white', border: '1.5px solid #0D99FF', borderRadius: '1px', right: '-4px', bottom: '-4px' },
          top: { height: '8px', top: '-4px', cursor: 'ns-resize' },
          bottom: { height: '8px', bottom: '-4px', cursor: 'ns-resize' },
          left: { width: '8px', left: '-4px', cursor: 'ew-resize' },
          right: { width: '8px', right: '-4px', cursor: 'ew-resize' }
        }}
      >
        {render}
        {isActive && dom && (
           <div className="absolute -top-6 -left-0.5 bg-[#0D99FF] text-white text-[10px] font-bold px-2 py-1 rounded-t-sm whitespace-nowrap shadow-sm pointer-events-auto">
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
