"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { X } from "lucide-react";

interface ModalProps {
  buttonText?: string;
  modalTitle?: string;
  buttonClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ModalSettings = () => {
  const { actions: { setProp }, buttonText, modalTitle } = useNode((node) => ({
    buttonText: node.data.props.buttonText,
    modalTitle: node.data.props.modalTitle,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Modal Settings</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Button Text</label>
          <input 
            type="text" 
            value={buttonText || "Open Modal"} 
            onChange={(e) => setProp((p: ModalProps) => { p.buttonText = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Modal Title</label>
          <input 
            type="text" 
            value={modalTitle || "Modal Title"} 
            onChange={(e) => setProp((p: ModalProps) => { p.modalTitle = e.target.value; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const Modal = ({ buttonText = "Open Modal", modalTitle = "Modal Title", className, buttonClassName, children }: ModalProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`relative ${className || ''}`}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px",
      }}
    >
      {/* Editor representation of the Modal Button */}
      <button 
        className={`bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors ${buttonClassName || ''}`}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </button>

      {/* Editor representation of the Modal Body */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
              <h3 className="font-bold text-lg text-gray-800">{modalTitle}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 bg-white rounded-md border border-gray-200"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            {/* The dropzone for modal content */}
            <div className="p-6 overflow-y-auto min-h-[100px] flex-1">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Modal.craft = {
  displayName: "Modal",
  props: { 
    buttonText: "Open Modal",
    modalTitle: "Modal Title"
  },
  rules: { canDrag: () => true },
  related: { settings: ModalSettings },
};
