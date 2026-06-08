"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { Quote as QuoteIcon } from "lucide-react";

interface QuoteProps {
  text?: string;
  author?: string;
  fontSize?: number;
  color?: string;
  authorColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  style?: "default" | "modern" | "minimal";
}

export const QuoteSettings = () => {
  const { actions: { setProp }, text, author, fontSize, color, authorColor, borderColor, backgroundColor, style } = useNode((node) => ({
    text: node.data.props.text,
    author: node.data.props.author,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    authorColor: node.data.props.authorColor,
    borderColor: node.data.props.borderColor,
    backgroundColor: node.data.props.backgroundColor,
    style: node.data.props.style,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Quote Text</label>
        <textarea 
          value={text} 
          onChange={(e) => setProp((p: QuoteProps) => { p.text = e.target.value; })}
          rows={3}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Author</label>
        <input 
          type="text" 
          value={author} 
          onChange={(e) => setProp((p: QuoteProps) => { p.author = e.target.value; })}
          placeholder="Author name"
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <select 
          value={style} 
          onChange={(e) => setProp((p: QuoteProps) => { p.style = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="default">Default</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Font Size</label>
        <input 
          type="number" 
          value={fontSize} 
          onChange={(e) => setProp((p: QuoteProps) => { p.fontSize = parseInt(e.target.value) || 18; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Text Color</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setProp((p: QuoteProps) => { p.color = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Author Color</label>
          <input 
            type="color" 
            value={authorColor} 
            onChange={(e) => setProp((p: QuoteProps) => { p.authorColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Border Color</label>
          <input 
            type="color" 
            value={borderColor} 
            onChange={(e) => setProp((p: QuoteProps) => { p.borderColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Background</label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setProp((p: QuoteProps) => { p.backgroundColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
      </div>
    </div>
  );
};

export const Quote = ({ 
  text = "The only way to do great work is to love what you do.", 
  author = "Steve Jobs",
  fontSize = 18,
  color = "#374151",
  authorColor = "#6B7280",
  borderColor = "#0066FF",
  backgroundColor = "#F9FAFB",
  style = "default"
}: QuoteProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && quoteRef.current) {
      quoteRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (quoteRef.current) {
      const newText = quoteRef.current.textContent || text;
      setProp((props: QuoteProps) => {
        props.text = newText;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      if (quoteRef.current) {
        quoteRef.current.textContent = text;
      }
    }
  };

  const getStyleClasses = () => {
    switch (style) {
      case "modern":
        return {
          container: "relative pl-8 pr-6 py-6",
          quote: "relative z-10",
          icon: "absolute top-4 left-2 opacity-20",
        };
      case "minimal":
        return {
          container: "border-l-4 pl-6 py-4",
          quote: "",
          icon: "hidden",
        };
      default:
        return {
          container: "p-6 rounded-lg",
          quote: "",
          icon: "absolute top-4 right-4 opacity-10",
        };
    }
  };

  const styleClasses = getStyleClasses();

  return (
    <blockquote
      ref={(ref) => { if (!isEditing && ref) connect(drag(ref)); }}
      style={{
        backgroundColor,
        borderLeftColor: style === "minimal" ? borderColor : "transparent",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        position: "relative",
        maxWidth: "800px",
        margin: "20px auto",
      }}
      className={styleClasses.container}
    >
      <QuoteIcon 
        size={48} 
        color={borderColor} 
        className={styleClasses.icon}
      />
      
      <div
        ref={quoteRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          fontSize: `${fontSize}px`,
          color,
          fontStyle: "italic",
          lineHeight: "1.6",
          marginBottom: author ? "12px" : "0",
          cursor: isEditing ? "text" : "default",
          userSelect: isEditing ? "text" : "none",
        }}
        className={styleClasses.quote}
      >
        {text}
      </div>
      
      {author && (
        <cite
          style={{
            fontSize: `${fontSize * 0.85}px`,
            color: authorColor,
            fontStyle: "normal",
            fontWeight: 600,
            display: "block",
          }}
        >
          — {author}
        </cite>
      )}
    </blockquote>
  );
};

Quote.craft = {
  displayName: "Quote",
  props: { 
    text: "The only way to do great work is to love what you do.", 
    author: "Steve Jobs",
    fontSize: 18,
    color: "#374151",
    authorColor: "#6B7280",
    borderColor: "#0066FF",
    backgroundColor: "#F9FAFB",
    style: "default"
  },
  related: { settings: QuoteSettings },
};
