"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";
import { X, ExternalLink } from "lucide-react";

interface ModalProps {
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  modalBackgroundColor?: string;
  overlayColor?: string;
  width?: number;
}

export const ModalSettings = () => {
  const { actions: { setProp }, buttonText, buttonColor, buttonTextColor, modalBackgroundColor, overlayColor, width, isSelected } = useNode((node) => ({
    buttonText: node.data.props.buttonText,
    buttonColor: node.data.props.buttonColor,
    buttonTextColor: node.data.props.buttonTextColor,
    modalBackgroundColor: node.data.props.modalBackgroundColor,
    overlayColor: node.data.props.overlayColor,
    width: node.data.props.width,
    isSelected: node.events.selected,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Trigger Button</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <input 
            type="text" 
            value={buttonText || ""} 
            onChange={(e) => setProp((p: ModalProps) => { p.buttonText = e.target.value; })} 
            className="w-full h-full px-3 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            placeholder="Open Modal"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={buttonColor || "#111827"} onChange={(e) => setProp((p: ModalProps) => { p.buttonColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={buttonTextColor || "#ffffff"} onChange={(e) => setProp((p: ModalProps) => { p.buttonTextColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Modal Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Max Width (px)</div>
          <input 
            type="number" 
            value={width || 600} 
            onChange={(e) => setProp((p: ModalProps) => { p.width = parseInt(e.target.value) || 600; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Modal Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={modalBackgroundColor || "#ffffff"} onChange={(e) => setProp((p: ModalProps) => { p.modalBackgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Overlay</div>
            <input type="color" value={overlayColor || "#000000"} onChange={(e) => setProp((p: ModalProps) => { p.overlayColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
          <strong>Pro Tip:</strong> When this Modal component is selected, the modal will stay open in the editor so you can drag and drop elements inside.
        </p>
      </div>
    </div>
  );
};

export const Modal = ({ 
  buttonText = "Open Modal",
  buttonColor = "#111827",
  buttonTextColor = "#ffffff",
  modalBackgroundColor = "#ffffff",
  overlayColor = "#000000",
  width = 600
}: ModalProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);

  // In the editor, always show the modal if it is selected so the user can edit it.
  const isModalVisible = isOpen || isSelected;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="inline-block"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: buttonColor, color: buttonTextColor }}
        className="px-6 py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        {buttonText} <ExternalLink size={16} />
      </button>

      {/* Modal Overlay & Container */}
      {isModalVisible && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 transition-opacity" 
            style={{ backgroundColor: overlayColor, opacity: 0.5 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content Window */}
          <div 
            className="relative rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]"
            style={{ backgroundColor: modalBackgroundColor, width: "100%", maxWidth: `${width}px` }}
          >
            {/* Header/Close */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            
            {/* Scrollable Content Area - Editable Dropzone */}
            <div className="p-8 overflow-y-auto">
              <Element id="modal-content" is={Container} canvas padding={0} background="transparent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Modal.craft = {
  displayName: "Lightbox / Modal",
  props: { 
    buttonText: "Open Details",
    buttonColor: "#0066FF",
    buttonTextColor: "#ffffff",
    modalBackgroundColor: "#ffffff",
    overlayColor: "#000000",
    width: 600
  },
  rules: { canDrag: () => true },
  related: { settings: ModalSettings },
};
