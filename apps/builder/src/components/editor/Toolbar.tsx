"use client";

import React from "react";
import { useEditor, Element } from "@craftjs/core";
import { Layout, Type, MousePointerClick, Image as ImageIcon } from "lucide-react";
import { Container } from "../selectors/structure/Container";
import { Text } from "../selectors/content/Text";
import { Button } from "../selectors/content/Button";

export const Toolbar = () => {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Components</h2>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div 
          ref={(ref) => { connectors.create(ref as HTMLElement, <Element is={Container} padding={20} canvas />); }}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-[#ff5722] hover:text-[#ff5722] transition-colors group shadow-sm"
        >
          <div className="p-2 bg-gray-50 rounded group-hover:bg-[#fff0ed] group-hover:text-[#ff5722] text-gray-500 transition-colors">
            <Layout size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#ff5722]">Container</span>
        </div>

        <div 
          ref={(ref) => { connectors.create(ref as HTMLElement, <Text text="New Text Block" fontSize={16} />); }}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-[#ff5722] hover:text-[#ff5722] transition-colors group shadow-sm"
        >
          <div className="p-2 bg-gray-50 rounded group-hover:bg-[#fff0ed] group-hover:text-[#ff5722] text-gray-500 transition-colors">
            <Type size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#ff5722]">Text</span>
        </div>

        <div 
          ref={(ref) => { connectors.create(ref as HTMLElement, <Button text="Click Me" />); }}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-[#ff5722] hover:text-[#ff5722] transition-colors group shadow-sm"
        >
          <div className="p-2 bg-gray-50 rounded group-hover:bg-[#fff0ed] group-hover:text-[#ff5722] text-gray-500 transition-colors">
            <MousePointerClick size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#ff5722]">Button</span>
        </div>
      </div>
    </div>
  );
};
