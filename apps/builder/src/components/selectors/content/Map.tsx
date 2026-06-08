"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { MapPin } from "lucide-react";

interface MapProps {
  address?: string;
  zoom?: number;
  width?: string;
  height?: string;
  mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
}

export const MapSettings = () => {
  const { actions: { setProp }, address, zoom, width, height, mapType } = useNode((node) => ({
    address: node.data.props.address,
    zoom: node.data.props.zoom,
    width: node.data.props.width,
    height: node.data.props.height,
    mapType: node.data.props.mapType,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Address</label>
        <textarea 
          value={address} 
          onChange={(e) => setProp((p: MapProps) => { p.address = e.target.value; })}
          placeholder="123 Main St, City, State, ZIP"
          rows={2}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
        />
        <p className="text-[10px] text-gray-500">Enter a full address or place name</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Map Type</label>
        <select 
          value={mapType} 
          onChange={(e) => setProp((p: MapProps) => { p.mapType = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="roadmap">Roadmap</option>
          <option value="satellite">Satellite</option>
          <option value="hybrid">Hybrid</option>
          <option value="terrain">Terrain</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Zoom Level</label>
        <div className="flex items-center gap-2">
          <input 
            type="range" 
            value={zoom} 
            min="1"
            max="20"
            onChange={(e) => setProp((p: MapProps) => { p.zoom = parseInt(e.target.value); })}
            className="flex-1"
          />
          <span className="text-[12px] font-medium text-gray-700 min-w-[30px]">{zoom}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Width</label>
          <input 
            type="text" 
            value={width} 
            onChange={(e) => setProp((p: MapProps) => { p.width = e.target.value; })}
            placeholder="100%"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height</label>
          <input 
            type="text" 
            value={height} 
            onChange={(e) => setProp((p: MapProps) => { p.height = e.target.value; })}
            placeholder="400px"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>
    </div>
  );
};

export const Map = ({ 
  address = "1600 Amphitheatre Parkway, Mountain View, CA", 
  zoom = 15,
  width = "100%",
  height = "400px",
  mapType = "roadmap"
}: MapProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const encodedAddress = encodeURIComponent(address);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        width,
        height,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        position: "relative",
      }}
    >
      {!address ? (
        <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
          <MapPin size={48} className="text-gray-400" />
          <p className="text-sm text-gray-500">Add an address in settings</p>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-3 p-6">
          <MapPin size={48} className="text-gray-500" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Map Preview</p>
            <p className="text-xs text-gray-500 max-w-[300px] truncate">{address}</p>
            <p className="text-xs text-gray-400 mt-2">Zoom: {zoom} | Type: {mapType}</p>
            <p className="text-xs text-gray-400 mt-1">Google Maps will render on published site</p>
          </div>
        </div>
      )}
    </div>
  );
};

Map.craft = {
  displayName: "Map",
  props: { 
    address: "1600 Amphitheatre Parkway, Mountain View, CA", 
    zoom: 15,
    width: "100%",
    height: "400px",
    mapType: "roadmap"
  },
  related: { settings: MapSettings },
};
