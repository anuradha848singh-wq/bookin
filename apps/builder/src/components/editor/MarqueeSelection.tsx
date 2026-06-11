"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { createPortal } from "react-dom";

export const MarqueeSelection = () => {
  const { actions, query } = useEditor();
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    let isSpacePressed = false;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleMouseDown = (e: MouseEvent) => {
      if (isSpacePressed) return;
      
      const target = e.target as HTMLElement;
      // We start marquee if clicking the empty canvas or container elements
      if (
        target.id === 'infinite-canvas-container' || 
        target.classList.contains('builder-canvas-frame') ||
        target.classList.contains('react-transform-component') ||
        target.classList.contains('react-transform-wrapper')
      ) {
        setStartPoint({ x: e.clientX, y: e.clientY });
        setEndPoint({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (startPoint) {
        setEndPoint({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (startPoint && endPoint) {
        const left = Math.min(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y);
        const right = Math.max(startPoint.x, endPoint.x);
        const bottom = Math.max(startPoint.y, endPoint.y);

        if (right - left > 5 && bottom - top > 5) {
          const nodes = query.getNodes();
          const selectedIds: string[] = [];
          
          Object.keys(nodes).forEach(id => {
            if (id === 'ROOT') return;
            const node = nodes[id];
            if (node.dom) {
              const rect = node.dom.getBoundingClientRect();
              const isIntersecting = !(
                rect.right < left || 
                rect.left > right || 
                rect.bottom < top || 
                rect.top > bottom
              );
              if (isIntersecting) {
                selectedIds.push(id);
              }
            }
          });

          if (selectedIds.length > 0) {
             actions.selectNode(selectedIds);
          } else {
             actions.clearEvents();
          }
        }
      }
      setStartPoint(null);
      setEndPoint(null);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [startPoint, endPoint, actions, query]);

  if (!startPoint || !endPoint) return null;

  const left = Math.min(startPoint.x, endPoint.x);
  const top = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  if (width < 5 && height < 5) return null;

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        left,
        top,
        width,
        height,
        backgroundColor: 'rgba(13, 153, 255, 0.15)',
        border: '1px solid rgba(13, 153, 255, 0.8)',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    />,
    document.body
  );
};
