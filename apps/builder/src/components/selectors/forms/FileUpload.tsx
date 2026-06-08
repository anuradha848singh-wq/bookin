"use client";

import React, { useState, useRef } from "react";
import { useNode } from "@craftjs/core";
import { UploadCloud, File, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  label?: string;
  helperText?: string;
  buttonText?: string;
  accept?: string;
  maxSizeMB?: number;
  layout?: "dropzone" | "button";
  primaryColor?: string;
  borderRadius?: number;
}

export const FileUploadSettings = () => {
  const { actions: { setProp }, label, helperText, buttonText, accept, maxSizeMB, layout, primaryColor, borderRadius } = useNode((node) => ({
    label: node.data.props.label,
    helperText: node.data.props.helperText,
    buttonText: node.data.props.buttonText,
    accept: node.data.props.accept,
    maxSizeMB: node.data.props.maxSizeMB,
    layout: node.data.props.layout,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Content</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: FileUploadProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Label (e.g. Upload your resume)" />
        <input type="text" value={helperText || ""} onChange={(e) => setProp((p: FileUploadProps) => { p.helperText = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Helper Text (e.g. PDF up to 5MB)" />
        <input type="text" value={buttonText || ""} onChange={(e) => setProp((p: FileUploadProps) => { p.buttonText = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Button Text (e.g. Browse Files)" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Rules</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Accepted Types</span>
            <input type="text" value={accept || ""} onChange={(e) => setProp((p: FileUploadProps) => { p.accept = e.target.value; })} className="w-full px-2 py-1 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none" placeholder=".pdf, .png, .jpg" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 font-medium">Max Size (MB)</span>
            <input type="number" value={maxSizeMB || 5} onChange={(e) => setProp((p: FileUploadProps) => { p.maxSizeMB = parseInt(e.target.value) || 1; })} className="w-full px-2 py-1 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Layout</div>
          <select value={layout || "dropzone"} onChange={(e) => setProp((p: FileUploadProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="dropzone">Large Dropzone</option>
            <option value="button">Compact Button</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: FileUploadProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: FileUploadProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FileUpload = ({ 
  label = "Upload Document",
  helperText = "Drag & drop your files here, or click to browse. Max 5MB.",
  buttonText = "Browse Files",
  accept = ".pdf,.jpg,.png,.doc,.docx",
  maxSizeMB = 5,
  layout = "dropzone",
  primaryColor = "#0066FF",
  borderRadius = 8
}: FileUploadProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const validateFile = (f: File) => {
    setError(null);
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return false;
    }
    // Basic accept validation
    if (accept) {
      const allowedExts = accept.split(',').map(ext => ext.trim().toLowerCase());
      const fileExt = '.' + f.name.split('.').pop()?.toLowerCase();
      if (!allowedExts.includes(fileExt) && !allowedExts.includes(f.type)) {
        setError(`File type not allowed. Accepted: ${accept}`);
        return false;
      }
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isSelected) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (validateFile(f)) setFile(f);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isSelected) return;
    
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (validateFile(f)) setFile(f);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openDialog = () => {
    if (!isSelected && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full flex flex-col gap-2"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      {label && <label className="block text-sm font-semibold text-gray-800">{label}</label>}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept={accept}
        className="hidden" 
      />

      {file ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200" style={{ borderRadius: `${borderRadius}px` }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 shrink-0">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm truncate">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <button 
            onClick={removeFile}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <X size={20} />
          </button>
        </div>
      ) : layout === "dropzone" ? (
        <div 
          onClick={openDialog}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-8 md:p-12 text-center border-2 border-dashed transition-all cursor-pointer group ${isDragging ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
          style={{ 
            borderRadius: `${borderRadius}px`,
            borderColor: isDragging ? primaryColor : '#E5E7EB'
          }}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isDragging ? 'bg-white shadow-md' : 'bg-white'}`}>
            <UploadCloud size={32} style={{ color: primaryColor }} />
          </div>
          <span className="font-bold text-gray-800 mb-2">{buttonText}</span>
          <p className="text-sm text-gray-500 max-w-xs">{helperText}</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button 
            onClick={openDialog}
            className="px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
          >
            <UploadCloud size={18} /> {buttonText}
          </button>
          <span className="text-sm text-gray-500">{helperText}</span>
        </div>
      )}

      {error && (
        <span className="text-xs font-medium text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};

FileUpload.craft = {
  displayName: "File Upload",
  props: { 
    label: "Upload Document",
    helperText: "Drag & drop your files here, or click to browse. Max 5MB.",
    buttonText: "Browse Files",
    accept: ".pdf,.jpg,.png,.doc,.docx",
    maxSizeMB: 5,
    layout: "dropzone",
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: FileUploadSettings },
};
