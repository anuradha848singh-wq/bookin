"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter
} from "lucide-react";

export const AlignmentTools = () => {
  const { actions, query, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    return {
      selected: currentNodeId ? {
        id: currentNodeId,
        node: query.node(currentNodeId).get(),
      } : null,
    };
  });

  // Helper to get all selected nodes (for multi-select in future)
  const getSelectedNodes = () => {
    if (!selected) return [];
    return [selected];
  };

  // Alignment functions
  const alignLeft = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id, node }) => {
      const props = node.data.props;
      actions.setProp(id, (props: any) => {
        props.textAlign = 'left';
        if (props.style) {
          props.style.textAlign = 'left';
        }
      });
    });
  };

  const alignCenter = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id, node }) => {
      actions.setProp(id, (props: any) => {
        props.textAlign = 'center';
        if (props.style) {
          props.style.textAlign = 'center';
        }
      });
    });
  };

  const alignRight = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id, node }) => {
      actions.setProp(id, (props: any) => {
        props.textAlign = 'right';
        if (props.style) {
          props.style.textAlign = 'right';
        }
      });
    });
  };

  const alignTop = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id }) => {
      actions.setProp(id, (props: any) => {
        if (!props.style) props.style = {};
        props.style.alignSelf = 'flex-start';
      });
    });
  };

  const alignMiddle = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id }) => {
      actions.setProp(id, (props: any) => {
        if (!props.style) props.style = {};
        props.style.alignSelf = 'center';
      });
    });
  };

  const alignBottom = () => {
    const nodes = getSelectedNodes();
    nodes.forEach(({ id }) => {
      actions.setProp(id, (props: any) => {
        if (!props.style) props.style = {};
        props.style.alignSelf = 'flex-end';
      });
    });
  };

  const distributeHorizontally = () => {
    // For now, apply flex with space-between to parent
    if (!selected) return;
    const parentId = selected.node.data.parent;
    if (parentId) {
      actions.setProp(parentId, (props: any) => {
        if (!props.style) props.style = {};
        props.style.display = 'flex';
        props.style.justifyContent = 'space-between';
      });
    }
  };

  const distributeVertically = () => {
    // Apply flex column with space-between to parent
    if (!selected) return;
    const parentId = selected.node.data.parent;
    if (parentId) {
      actions.setProp(parentId, (props: any) => {
        if (!props.style) props.style = {};
        props.style.display = 'flex';
        props.style.flexDirection = 'column';
        props.style.justifyContent = 'space-between';
      });
    }
  };

  if (!selected) return null;

  return (
    <div className="flex items-center gap-1">
      {/* Horizontal Alignment */}
      <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
        <button 
          onClick={alignLeft}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Left"
        >
          <AlignLeft size={14} strokeWidth={2} />
        </button>
        <button 
          onClick={alignCenter}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Center"
        >
          <AlignCenter size={14} strokeWidth={2} />
        </button>
        <button 
          onClick={alignRight}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Right"
        >
          <AlignRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      {/* Vertical Alignment */}
      <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
        <button 
          onClick={alignTop}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Top"
        >
          <AlignVerticalJustifyStart size={14} strokeWidth={2} />
        </button>
        <button 
          onClick={alignMiddle}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Middle"
        >
          <AlignVerticalJustifyCenter size={14} strokeWidth={2} />
        </button>
        <button 
          onClick={alignBottom}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Align Bottom"
        >
          <AlignVerticalJustifyEnd size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      {/* Distribution */}
      <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
        <button 
          onClick={distributeHorizontally}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Distribute Horizontally"
        >
          <AlignHorizontalDistributeCenter size={14} strokeWidth={2} />
        </button>
        <button 
          onClick={distributeVertically}
          className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900"
          title="Distribute Vertically"
        >
          <AlignVerticalDistributeCenter size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
