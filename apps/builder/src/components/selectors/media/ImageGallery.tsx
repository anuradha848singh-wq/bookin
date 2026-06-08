"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { X, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface ImageGalleryProps {
  images?: GalleryImage[];
  columns?: number;
  gap?: number;
  borderRadius?: number;
  enableLightbox?: boolean;
}

export const ImageGallerySettings = () => {
  const { actions: { setProp }, images, columns, gap, borderRadius, enableLightbox } = useNode((node) => ({
    images: node.data.props.images as GalleryImage[],
    columns: node.data.props.columns,
    gap: node.data.props.gap,
    borderRadius: node.data.props.borderRadius,
    enableLightbox: node.data.props.enableLightbox,
  }));

  const addImage = () => {
    setProp((props: ImageGalleryProps) => {
      if (!props.images) props.images = [];
      props.images.push({ 
        id: Date.now().toString(), 
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80", 
        alt: "Clinic Image" 
      });
    });
  };

  const updateImage = (index: number, key: keyof GalleryImage, value: string) => {
    setProp((props: ImageGalleryProps) => {
      if (props.images && props.images[index]) {
        props.images[index][key] = value;
      }
    });
  };

  const removeImage = (index: number) => {
    setProp((props: ImageGalleryProps) => {
      if (props.images) {
        props.images.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Cols</div>
            <select 
              value={columns || 3} 
              onChange={(e) => setProp((p: ImageGalleryProps) => { p.columns = parseInt(e.target.value); })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Gap</div>
            <input 
              type="number" 
              value={gap || 16} 
              onChange={(e) => setProp((p: ImageGalleryProps) => { p.gap = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius (px)</div>
          <input 
            type="number" 
            value={borderRadius || 8} 
            onChange={(e) => setProp((p: ImageGalleryProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Behavior</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={enableLightbox} 
            onChange={(e) => setProp((p: ImageGalleryProps) => { p.enableLightbox = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Enable Lightbox (Click to Expand)
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Images ({images?.length || 0})</label>
        {images && images.map((img, index) => (
          <div key={img.id} className="border border-[#E5E5E5] p-3 rounded-md bg-[#FAFAFA] flex flex-col gap-2">
            <div className="flex gap-2 items-center mb-1">
              <img src={img.url} alt={img.alt} className="w-10 h-10 object-cover rounded bg-gray-200" />
              <button 
                onClick={() => removeImage(index)}
                className="text-[10px] text-red-500 font-semibold uppercase tracking-wide ml-auto"
              >
                Remove
              </button>
            </div>
            <input 
              type="text" 
              value={img.url} 
              onChange={(e) => updateImage(index, "url", e.target.value)}
              className="w-full px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none"
              placeholder="Image URL"
            />
          </div>
        ))}
        <button 
          onClick={addImage}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Image
        </button>
      </div>
    </div>
  );
};

export const ImageGallery = ({ 
  images = [
    { id: "1", url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80", alt: "Clinic Interior" },
    { id: "2", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80", alt: "Lab" },
    { id: "3", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80", alt: "Hospital" },
  ],
  columns = 3,
  gap = 16,
  borderRadius = 8,
  enableLightbox = true
}: ImageGalleryProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const getGridCols = () => {
    switch(columns) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 4: return "grid-cols-2 sm:grid-cols-4";
      case 5: return "grid-cols-2 sm:grid-cols-5";
      case 3:
      default: return "grid-cols-1 sm:grid-cols-3";
    }
  };

  return (
    <>
      <div
        ref={(ref) => { connect(drag(ref as HTMLElement)); }}
        className={`w-full grid ${getGridCols()}`}
        style={{ 
          gap: `${gap}px`,
          outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
          outlineOffset: "4px", 
          transition: "outline 0.15s"
        }}
      >
        {images && images.map((img) => (
          <div 
            key={img.id} 
            className={`relative group overflow-hidden ${enableLightbox ? 'cursor-pointer' : ''}`}
            style={{ borderRadius: `${borderRadius}px` }}
            onClick={() => { if (enableLightbox && !isSelected) setActiveImage(img.url); }}
          >
            <img 
              src={img.url} 
              alt={img.alt} 
              className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {enableLightbox && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white drop-shadow-md" size={32} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}
          >
            <X size={32} />
          </button>
          <img 
            src={activeImage} 
            alt="Expanded view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </>
  );
};

ImageGallery.craft = {
  displayName: "Image Gallery",
  props: { 
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&q=80", alt: "Clinic Interior" },
      { id: "2", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80", alt: "Lab" },
      { id: "3", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80", alt: "Hospital" },
    ],
    columns: 3,
    gap: 16,
    borderRadius: 8,
    enableLightbox: true
  },
  rules: { canDrag: () => true },
  related: { settings: ImageGallerySettings },
};
