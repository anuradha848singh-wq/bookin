"use client";

import React, { useEffect } from "react";
import { useEditor } from "@craftjs/core";

const visualProps = [
  'background', 'color', 'fontSize', 'fontWeight', 'fontFamily', 
  'textAlign', 'borderRadius', 'padding', 'paddingX', 'paddingY', 
  'borderWidth', 'borderColor', 'shadow', 'display', 'flexDirection', 
  'justifyContent', 'gap', 'opacity'
];

export const CopyPasteManager = () => {
  const { actions, query } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+C / Cmd+Opt+C -> Copy Styles
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const selectedIds = Array.from(query.getState().events.selected);
        if (selectedIds.length > 0) {
          const sourceNode = query.node(selectedIds[0]).get();
          const props = sourceNode.data.props;
          const styleToCopy: Record<string, any> = {};
          visualProps.forEach(key => {
            if (props[key] !== undefined) styleToCopy[key] = props[key];
          });
          localStorage.setItem('craft_copied_styles', JSON.stringify(styleToCopy));
        }
      }

      // Ctrl+Alt+V / Cmd+Opt+V -> Paste Styles
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        const copiedStr = localStorage.getItem('craft_copied_styles');
        if (copiedStr) {
          try {
            const styleToPaste = JSON.parse(copiedStr);
            const selectedIds = Array.from(query.getState().events.selected);
            selectedIds.forEach(id => {
              actions.setProp(id, (props: any) => {
                Object.keys(styleToPaste).forEach(key => {
                  props[key] = styleToPaste[key];
                });
              });
            });
          } catch (err) {
            console.error("Failed to parse copied styles", err);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions, query]);

  return null;
};
