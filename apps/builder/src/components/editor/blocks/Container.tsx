"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { useDeviceMode, resolveResponsiveProp, updateResponsiveProp, ResponsiveValue } from "../DeviceModeContext";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ArrowDown, 
  ArrowRight,
  Maximize2,
  ChevronDown
} from "lucide-react";

interface ContainerProps {
  background?: ResponsiveValue<string>;
  padding?: ResponsiveValue<number | string>;
  borderRadius?: ResponsiveValue<number>;
  flexDirection?: ResponsiveValue<"row" | "column">;
  display?: ResponsiveValue<"flex" | "grid">;
  gridTemplateColumns?: ResponsiveValue<string>;
  gridTemplateRows?: ResponsiveValue<string>;
  alignItems?: ResponsiveValue<"flex-start" | "center" | "flex-end" | "stretch">;
  justifyContent?: ResponsiveValue<"flex-start" | "center" | "flex-end" | "space-between" | "space-around">;
  gap?: ResponsiveValue<number>;
  width?: ResponsiveValue<string | number>;
  height?: ResponsiveValue<string | number>;
  boxShadow?: ResponsiveValue<string>;
  opacity?: ResponsiveValue<number>;
  zIndex?: ResponsiveValue<number>;
  overflow?: ResponsiveValue<"visible" | "hidden" | "scroll" | "auto">;
  position?: string;
  x?: number;
  y?: number;
  hiddenBreakpoints?: { desktop: boolean, tablet: boolean, mobile: boolean };
  children?: React.ReactNode;
}

export const ContainerSettings = () => {
  const { mode } = useDeviceMode();
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ContainerProps,
  }));

  const background = resolveResponsiveProp(props.background, mode);
  const padding = resolveResponsiveProp(props.padding, mode);
  const display = resolveResponsiveProp(props.display, mode) || "flex";
  const gridTemplateColumns = resolveResponsiveProp(props.gridTemplateColumns, mode);
  const gridTemplateRows = resolveResponsiveProp(props.gridTemplateRows, mode);
  const borderRadius = resolveResponsiveProp(props.borderRadius, mode);
  const flexDirection = resolveResponsiveProp(props.flexDirection, mode);
  const alignItems = resolveResponsiveProp(props.alignItems, mode);
  const justifyContent = resolveResponsiveProp(props.justifyContent, mode);
  const gap = resolveResponsiveProp(props.gap, mode);
  const width = resolveResponsiveProp(props.width, mode);
  const height = resolveResponsiveProp(props.height, mode);
  const boxShadow = resolveResponsiveProp(props.boxShadow, mode);
  const opacity = resolveResponsiveProp(props.opacity, mode);
  const zIndex = resolveResponsiveProp(props.zIndex, mode);
  const overflow = resolveResponsiveProp(props.overflow, mode);
  const position = resolveResponsiveProp(props.position as any, mode) || "relative";

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Background Fill */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Section Styling</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={background || "#ffffff"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.background = updateResponsiveProp(p.background, e.target.value, mode); })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
      </div>

      {/* Layout Mode */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Layout System</h4>
        
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Display Mode</label>
          <div className="flex border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <button
              onClick={() => setProp((p: ContainerProps) => { p.display = updateResponsiveProp(p.display, "flex", mode); })}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${display === "flex" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Flex
            </button>
            <button
              onClick={() => setProp((p: ContainerProps) => { p.display = updateResponsiveProp(p.display, "grid", mode); })}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${display === "grid" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Grid
            </button>
          </div>
        </div>

        {display === "grid" ? (
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Columns</label>
              <input 
                type="text" 
                value={gridTemplateColumns || "1fr 1fr"} 
                onChange={(e) => setProp((p: ContainerProps) => { p.gridTemplateColumns = updateResponsiveProp(p.gridTemplateColumns, e.target.value, mode); })} 
                className={inputClass}
                placeholder="e.g. 1fr 1fr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Rows</label>
              <input 
                type="text" 
                value={gridTemplateRows || "auto"} 
                onChange={(e) => setProp((p: ContainerProps) => { p.gridTemplateRows = updateResponsiveProp(p.gridTemplateRows, e.target.value, mode); })} 
                className={inputClass}
                placeholder="e.g. auto"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            <label className={labelClass}>Direction</label>
            <div className="flex border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
              <button
                onClick={() => setProp((p: ContainerProps) => { p.flexDirection = updateResponsiveProp(p.flexDirection, "column", mode); })}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${flexDirection === "column" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                <ArrowDown size={12} strokeWidth={2.5} /> Column
              </button>
              <button
                onClick={() => setProp((p: ContainerProps) => { p.flexDirection = updateResponsiveProp(p.flexDirection, "row", mode); })}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${flexDirection === "row" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                <ArrowRight size={12} strokeWidth={2.5} /> Row
              </button>
            </div>
          </div>
        )}

        {/* Alignment & Justification */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Align Items</label>
            <div className="relative">
              <select
                value={alignItems || "stretch"}
                onChange={(e) => setProp((p: ContainerProps) => { p.alignItems = updateResponsiveProp(p.alignItems, e.target.value as any, mode); })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="stretch">Stretch</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Justify Content</label>
            <div className="relative">
              <select
                value={justifyContent || "flex-start"}
                onChange={(e) => setProp((p: ContainerProps) => { p.justifyContent = updateResponsiveProp(p.justifyContent, e.target.value as any, mode); })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Spacing & Gap */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Gap (px)</label>
            <input 
              type="number" 
              value={gap || 0} 
              onChange={(e) => setProp((p: ContainerProps) => { p.gap = updateResponsiveProp(p.gap, parseInt(e.target.value) || 0, mode); }, 500)} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="text" 
              value={padding || 0} 
              onChange={(e) => setProp((p: ContainerProps) => { 
                const val = e.target.value;
                p.padding = updateResponsiveProp(p.padding, isNaN(Number(val)) ? val : parseInt(val) || 0, mode); 
              }, 500)} 
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Sizing & Borders */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Dimensions & Borders</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Width</label>
            <input 
              type="text" 
              value={width || "100%"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.width = updateResponsiveProp(p.width, e.target.value, mode); })} 
              className={inputClass}
              placeholder="e.g. 100%, auto, 400px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Height</label>
            <input 
              type="text" 
              value={height || "auto"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.height = updateResponsiveProp(p.height, e.target.value, mode); })} 
              className={inputClass}
              placeholder="e.g. auto, 200px"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Border Radius (px)</label>
          <input 
            type="number" 
            value={borderRadius || 0} 
            onChange={(e) => setProp((p: ContainerProps) => { p.borderRadius = updateResponsiveProp(p.borderRadius, parseInt(e.target.value) || 0, mode); }, 500)} 
            className={inputClass}
          />
        </div>
      </div>

      {/* Advanced Styles */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Advanced Styling</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Box Shadow</label>
            <div className="relative">
              <select
                value={boxShadow || "none"}
                onChange={(e) => setProp((p: ContainerProps) => { p.boxShadow = updateResponsiveProp(p.boxShadow, e.target.value, mode); })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="none">None</option>
                <option value="0 1px 2px 0 rgba(0, 0, 0, 0.05)">Small</option>
                <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</option>
                <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Large</option>
                <option value="0 20px 25px -5px rgba(0, 0, 0, 0.1)">X-Large</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Opacity</label>
            <input 
              type="number" 
              step="0.1"
              min="0"
              max="1"
              value={opacity !== undefined ? opacity : 1} 
              onChange={(e) => setProp((p: ContainerProps) => { p.opacity = updateResponsiveProp(p.opacity, parseFloat(e.target.value), mode); }, 500)} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Z-Index</label>
            <input 
              type="number" 
              value={zIndex || 0} 
              onChange={(e) => setProp((p: ContainerProps) => { p.zIndex = updateResponsiveProp(p.zIndex, parseInt(e.target.value) || 0, mode); }, 500)} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Overflow</label>
            <div className="relative">
              <select
                value={overflow || "visible"}
                onChange={(e) => setProp((p: ContainerProps) => { p.overflow = updateResponsiveProp(p.overflow, e.target.value as any, mode); })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="scroll">Scroll</option>
                <option value="auto">Auto</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className={labelClass}>Position</label>
          <div className="relative">
            <select
              value={position}
              onChange={(e) => setProp((p: ContainerProps) => { p.position = updateResponsiveProp(p.position as any, e.target.value, mode); })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="static">Static</option>
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
              <option value="fixed">Fixed</option>
              <option value="sticky">Sticky</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Container = ({ 
  background: rawBackground = "transparent", 
  padding: rawPadding = 20, 
  borderRadius: rawBorderRadius = 0, 
  display: rawDisplay = "flex",
  gridTemplateColumns: rawGridTemplateColumns = "1fr 1fr",
  gridTemplateRows: rawGridTemplateRows = "auto",
  flexDirection: rawFlexDirection = "column",
  alignItems: rawAlignItems = "stretch",
  justifyContent: rawJustifyContent = "flex-start",
  gap: rawGap = 0,
  width: rawWidth = "100%",
  height: rawHeight = "auto",
  boxShadow: rawBoxShadow = "none",
  opacity: rawOpacity = 1,
  zIndex: rawZIndex = 0,
  overflow: rawOverflow = "visible",
  position: rawPosition = "relative",
  x = 0,
  y = 0,
  hiddenBreakpoints = { desktop: false, tablet: false, mobile: false },
  children 
}: ContainerProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));
  const { mode } = useDeviceMode();

  const background = resolveResponsiveProp(rawBackground, mode);
  const padding = resolveResponsiveProp(rawPadding, mode);
  const borderRadius = resolveResponsiveProp(rawBorderRadius, mode);
  const display = resolveResponsiveProp(rawDisplay, mode) || "flex";
  const gridTemplateColumns = resolveResponsiveProp(rawGridTemplateColumns, mode);
  const gridTemplateRows = resolveResponsiveProp(rawGridTemplateRows, mode);
  const flexDirection = resolveResponsiveProp(rawFlexDirection, mode);
  const alignItems = resolveResponsiveProp(rawAlignItems, mode);
  const justifyContent = resolveResponsiveProp(rawJustifyContent, mode);
  const gap = resolveResponsiveProp(rawGap, mode);
  const width = resolveResponsiveProp(rawWidth, mode);
  const height = resolveResponsiveProp(rawHeight, mode);
  const boxShadow = resolveResponsiveProp(rawBoxShadow, mode);
  const opacity = resolveResponsiveProp(rawOpacity, mode);
  const zIndex = resolveResponsiveProp(rawZIndex, mode);
  const overflow = resolveResponsiveProp(rawOverflow, mode);
  const position = resolveResponsiveProp(rawPosition as any, mode) || "relative";

  const isTransparent = !background || background === "transparent";

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background: background as string, 
        padding: typeof padding === "number" ? `${padding}px` : padding as string, 
        borderRadius: `${borderRadius}px`, 
        display: display as "flex" | "grid",
        gridTemplateColumns: display === "grid" ? (gridTemplateColumns as string) : undefined,
        gridTemplateRows: display === "grid" ? (gridTemplateRows as string) : undefined,
        flexDirection: flexDirection as "row" | "column",
        alignItems: alignItems as "flex-start" | "center" | "flex-end" | "stretch",
        justifyContent: justifyContent as "flex-start" | "center" | "flex-end" | "space-between" | "space-around",
        gap: `${gap}px`,
        width: width as string | number,
        height: height as string | number,
        opacity: opacity as number,
        zIndex: zIndex as number,
        overflow: overflow as any,
        position: position as any,
        left: position === "absolute" || position === "fixed" ? `${x}px` : undefined,
        top: position === "absolute" || position === "fixed" ? `${y}px` : undefined,
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px", 
        minHeight: "50px", 
        transition: "outline 0.15s, box-shadow 0.15s, background-color 0.15s",
        boxSizing: "border-box",
        boxShadow: isHovered ? "inset 0 0 0 2px #0066FF" : (boxShadow as string),
        backgroundColor: isHovered ? "rgba(0, 102, 255, 0.05)" : background,
      }}
      className={`relative ${isTransparent && !isHovered ? "border border-dashed border-gray-300" : ""}`}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: { 
    background: "transparent", 
    padding: 20, 
    display: "flex",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "auto",
    borderRadius: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 0,
    width: "100%",
    height: "auto",
    boxShadow: "none",
    opacity: 1,
    zIndex: 0,
    overflow: "visible",
    position: "relative",
    x: 0,
    y: 0,
    hiddenBreakpoints: { desktop: false, tablet: false, mobile: false },
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};
