"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Image as ImageIcon } from "lucide-react";
import { useCMS } from "../CMSContext";
import { useDeviceMode, resolveResponsiveProp, updateResponsiveProp, ResponsiveValue } from "../DeviceModeContext";

interface ImageProps {
  src?: string;
  alt?: string;
  borderRadius?: ResponsiveValue<number>;
  width?: ResponsiveValue<string | number>;
  height?: ResponsiveValue<string | number>;
  padding?: ResponsiveValue<number>;
  shadow?: string;
  opacity?: ResponsiveValue<number>;
  zIndex?: ResponsiveValue<number>;
  overflow?: ResponsiveValue<"visible" | "hidden" | "scroll" | "auto">;
  lazyLoad?: boolean;
  optimizeFormat?: boolean;
  position?: string;
  objectFit?: ResponsiveValue<"cover" | "contain" | "fill" | "none">;
  aspectRatio?: ResponsiveValue<string>;
  hiddenBreakpoints?: { desktop: boolean, tablet: boolean, mobile: boolean };
  bindings?: Record<string, string>;
}

export const ImageSettings = () => {
  const { mode } = useDeviceMode();
  const { 
    actions: { setProp }, 
    props
  } = useNode((node) => ({
    props: node.data.props as ImageProps,
  }));

  const src = props.src;
  const alt = props.alt;
  const shadow = props.shadow;
  const lazyLoad = props.lazyLoad;
  const optimizeFormat = props.optimizeFormat;
  
  const borderRadius = resolveResponsiveProp(props.borderRadius, mode);
  const width = resolveResponsiveProp(props.width, mode);
  const height = resolveResponsiveProp(props.height, mode);
  const padding = resolveResponsiveProp(props.padding, mode);
  const objectFit = resolveResponsiveProp(props.objectFit, mode);
  const aspectRatio = resolveResponsiveProp(props.aspectRatio, mode);
  const opacity = resolveResponsiveProp(props.opacity, mode);
  const zIndex = resolveResponsiveProp(props.zIndex, mode);
  const overflow = resolveResponsiveProp(props.overflow, mode);

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Image Source</h4>
        
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Upload Image</label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const formData = new FormData();
                  formData.append("file", file);
                  
                  try {
                    const res = await fetch("/api/studio/upload", {
                      method: "POST",
                      body: formData
                    });
                    const data = await res.json();
                    if (data.success) {
                      setProp((p: ImageProps) => { p.src = data.url; });
                    } else {
                      alert("Upload failed: " + data.error);
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Upload error");
                  }
                }
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 border-dashed rounded px-2.5 py-3 focus:outline-none focus:border-blue-500 text-gray-600 font-medium cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[10px] text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Image URL</label>
          <input 
            type="text" 
            value={src || ""} 
            onChange={(e) => setProp((p: ImageProps) => { p.src = e.target.value; })} 
            className={inputClass}
            placeholder="Absolute URL... (https://...)"
          />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <label className={labelClass}>Alt Description</label>
          <input 
            type="text" 
            value={alt || ""} 
            onChange={(e) => setProp((p: ImageProps) => { p.alt = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. Doctor consulting patient"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Styling & Layout</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Width</label>
            <input 
              type="text" 
              value={width || "100%"} 
              onChange={(e) => setProp((p: ImageProps) => { p.width = updateResponsiveProp(p.width, e.target.value, mode); })} 
              className={inputClass}
              placeholder="e.g. 100%, 250px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Height</label>
            <input 
              type="text" 
              value={height || "auto"} 
              onChange={(e) => setProp((p: ImageProps) => { p.height = updateResponsiveProp(p.height, e.target.value, mode); })} 
              className={inputClass}
              placeholder="e.g. auto, 250px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Aspect Ratio</label>
            <select
              value={aspectRatio || "auto"}
              onChange={(e) => setProp((p: ImageProps) => { p.aspectRatio = updateResponsiveProp(p.aspectRatio, e.target.value, mode); })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="1 / 1">1:1 Square</option>
              <option value="16 / 9">16:9 Landscape</option>
              <option value="4 / 3">4:3 Standard</option>
              <option value="3 / 4">3:4 Portrait</option>
              <option value="9 / 16">9:16 Vertical</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Object Fit</label>
            <select
              value={objectFit || "cover"}
              onChange={(e) => setProp((p: ImageProps) => { p.objectFit = updateResponsiveProp(p.objectFit, e.target.value as any, mode); })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="cover">Cover (Crop)</option>
              <option value="contain">Contain (Fit)</option>
              <option value="fill">Fill (Stretch)</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="number" 
              value={padding || 0} 
              onChange={(e) => setProp((p: ImageProps) => { p.padding = updateResponsiveProp(p.padding, parseInt(e.target.value) || 0, mode); }, 500)} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Corner Radius</label>
            <input 
              type="number" 
              value={borderRadius || 0} 
              onChange={(e) => setProp((p: ImageProps) => { p.borderRadius = updateResponsiveProp(p.borderRadius, parseInt(e.target.value) || 0, mode); }, 500)} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <label className={labelClass}>Box Shadow</label>
          <select
            value={shadow || "none"}
            onChange={(e) => setProp((p: ImageProps) => { p.shadow = e.target.value; })}
            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
          >
            <option value="none">None</option>
            <option value="0 1px 3px rgba(0,0,0,0.1)">Small (sm)</option>
            <option value="0 4px 6px -1px rgba(0,0,0,0.1)">Medium (md)</option>
            <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Large (lg)</option>
            <option value="0 20px 25px -5px rgba(0,0,0,0.1)">Extra Large (xl)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Advanced Styling</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Opacity</label>
            <input 
              type="number" 
              step="0.1"
              min="0"
              max="1"
              value={opacity !== undefined ? opacity : 1} 
              onChange={(e) => setProp((p: ImageProps) => { p.opacity = updateResponsiveProp(p.opacity, parseFloat(e.target.value), mode); }, 500)} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Z-Index</label>
            <input 
              type="number" 
              value={zIndex || 0} 
              onChange={(e) => setProp((p: ImageProps) => { p.zIndex = updateResponsiveProp(p.zIndex, parseInt(e.target.value) || 0, mode); }, 500)} 
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          <label className={labelClass}>Overflow</label>
          <div className="relative">
            <select
              value={overflow || "visible"}
              onChange={(e) => setProp((p: ImageProps) => { p.overflow = updateResponsiveProp(p.overflow, e.target.value as any, mode); })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
              <option value="scroll">Scroll</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Performance</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={lazyLoad !== false} // Default to true
              onChange={(e) => setProp((p: ImageProps) => { p.lazyLoad = e.target.checked; })} 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-gray-700">Lazy Load Image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={optimizeFormat !== false} // Default to true
              onChange={(e) => setProp((p: ImageProps) => { p.optimizeFormat = e.target.checked; })} 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-gray-700">Serve WebP/AVIF</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export const Image = ({ 
  src, 
  alt = "Custom Image", 
  borderRadius: rawBorderRadius = 8, 
  width: rawWidth = "100%", 
  height: rawHeight = "auto", 
  padding: rawPadding = 0,
  shadow = "none",
  opacity: rawOpacity = 1,
  zIndex: rawZIndex = 0,
  overflow: rawOverflow = "visible",
  lazyLoad = true,
  optimizeFormat = true,
  position = "relative",
  hiddenBreakpoints = { desktop: false, tablet: false, mobile: false },
  objectFit: rawObjectFit = "cover",
  aspectRatio: rawAspectRatio = "auto",
  bindings
}: ImageProps) => {
  const { resolvePath } = useCMS();
  const displaySrc = bindings?.src ? (resolvePath(bindings.src) || src) : src;

  const { mode } = useDeviceMode();
  
  const borderRadius = resolveResponsiveProp(rawBorderRadius, mode);
  const width = resolveResponsiveProp(rawWidth, mode);
  const height = resolveResponsiveProp(rawHeight, mode);
  const padding = resolveResponsiveProp(rawPadding, mode);
  const objectFit = resolveResponsiveProp(rawObjectFit, mode);
  const aspectRatio = resolveResponsiveProp(rawAspectRatio, mode);
  const opacity = resolveResponsiveProp(rawOpacity, mode);
  const zIndex = resolveResponsiveProp(rawZIndex, mode);
  const overflow = resolveResponsiveProp(rawOverflow, mode);

  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const hasImage = !!src;
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!domRef.current || !isSelected) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          setProp((p: ImageProps) => {
            p.width = `${entry.borderBoxSize[0].inlineSize}px`;
            p.height = `${entry.borderBoxSize[0].blockSize}px`;
          }, 500);
        }
      }
    });

    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [isSelected, setProp]);

  return (
    <div
      ref={(ref) => { 
        if (ref) domRef.current = ref;
        connect(drag(ref as HTMLElement)); 
      }}
      style={{ 
        width: width as string | number, 
        height: height as string | number,
        opacity: opacity as number,
        zIndex: zIndex as number,
        overflow: isSelected ? "hidden" : (overflow as any),
        padding: position === "absolute" ? 0 : `${padding}px`, 
        position: position as any,
        boxSizing: "border-box",
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px", 
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        resize: isSelected ? "both" : "none",
      }}
    >
      {isSelected && position !== "absolute" && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl-lg pointer-events-none z-10 flex items-center justify-center">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="21 15 21 21 15 21" /><line x1="21" y1="21" x2="15" y2="15" /></svg>
        </div>
      )}
      {displaySrc ? (
        <img 
          src={optimizeFormat && displaySrc && !displaySrc.includes('format=webp') ? `${displaySrc}${displaySrc.includes('?') ? '&' : '?'}format=webp` : displaySrc} 
          alt={alt} 
          loading={lazyLoad ? "lazy" : "eager"}
          decoding={lazyLoad ? "async" : "auto"}
          style={{ 
            borderRadius: `${borderRadius}px`, 
            width: "100%",
            height: "100%",
            objectFit: objectFit as any,
            aspectRatio: aspectRatio as string,
            boxShadow: shadow,
          }}
        />
      ) : (
        <div 
          style={{ 
            borderRadius: `${borderRadius}px`, 
            width: "100%",
            height: position === "absolute" ? "100%" : "150px",
            minHeight: "150px",
            background: "#F3F4F6",
            border: "2px dashed #D1D5DB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#9CA3AF"
          }}
        >
          <ImageIcon size={28} strokeWidth={1.5} />
          <span style={{ fontSize: "11px", fontWeight: "bold" }}>No Image Selected</span>
        </div>
      )}
    </div>
  );
};

Image.craft = {
  displayName: "Image",
  props: { 
    alt: "Custom Image",
    borderRadius: 8, 
    width: "100%", 
    height: "auto", 
    padding: 0,
    shadow: "none",
    opacity: 1,
    zIndex: 0,
    overflow: "visible",
    lazyLoad: true,
    optimizeFormat: true,
    position: "relative",
    x: 0,
    y: 0,
    objectFit: "cover",
    aspectRatio: "auto",
    hiddenBreakpoints: { desktop: false, tablet: false, mobile: false }
  },
  rules: { canDrag: () => true },
  related: { settings: ImageSettings },
};
