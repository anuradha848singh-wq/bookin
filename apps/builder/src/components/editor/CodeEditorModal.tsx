"use client";

import React, { useState, useEffect } from "react";
import { X, Code2, Save, Play, Check } from "lucide-react";
import Editor from "@monaco-editor/react";

interface CodeEditorModalProps {
  onClose: () => void;
  websiteId: string;
}

export const CodeEditorModal = ({ onClose, websiteId }: CodeEditorModalProps) => {
  const [activeTab, setActiveTab] = useState<"css" | "headJs" | "bodyJs">("css");
  
  const [cssCode, setCssCode] = useState<string>("/* Write your Global CSS or SCSS here */\n\nbody {\n  /* example */\n}");
  const [headJsCode, setHeadJsCode] = useState<string>("// Scripts injected into <head>\n");
  const [bodyJsCode, setBodyJsCode] = useState<string>("// Scripts injected at the end of <body>\n");
  
  const [compiledCss, setCompiledCss] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [compileError, setCompileError] = useState<string | null>(null);

  // In a full implementation, you would load the initial values from the database here
  useEffect(() => {
    // Mock fetching initial state
    // fetch(`/api/studio/sites/${websiteId}`).then(...)
  }, [websiteId]);

  const handleCompileAndSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setCompileError(null);
    
    try {
      // 1. Compile SCSS
      let finalCss = cssCode;
      
      const scssRes = await fetch("/api/studio/compile-scss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scss: cssCode }),
      });
      
      if (!scssRes.ok) {
        const errData = await scssRes.json();
        throw new Error(errData.error || "SCSS Compilation failed");
      }
      
      const { css } = await scssRes.json();
      finalCss = css;
      setCompiledCss(css);

      // 2. Save to database (mocked for now, normally a PUT to /api/studio/sites/[id])
      console.log("Saving to DB:", {
        customCss: finalCss,
        customHead: headJsCode,
        customBody: bodyJsCode
      });
      
      // Inject the compiled CSS immediately so the user can see it
      let styleTag = document.getElementById("builder-custom-css");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "builder-custom-css";
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = finalCss;

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      
    } catch (err: any) {
      console.error(err);
      setCompileError(err.message);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-all font-sans">
      <div 
        className="bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#252526]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center border border-blue-500/30">
              <Code2 size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100 tracking-tight">Global Custom Code</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {compileError && (
              <span className="text-xs text-red-400 font-mono bg-red-400/10 px-2 py-1 rounded">
                Compile Error
              </span>
            )}
            
            <button 
              onClick={handleCompileAndSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded shadow-sm hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveStatus === "saved" ? (
                <Check size={16} />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? "Compiling..." : saveStatus === "saved" ? "Saved" : "Save & Apply"}
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#252526] border-r border-gray-800 flex flex-col py-2">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2 mt-2">Files</h3>
            
            <button 
              onClick={() => setActiveTab("css")}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${activeTab === "css" ? "bg-[#37373d] text-blue-400 border-l-2 border-blue-400" : "text-gray-300 hover:bg-[#2a2d2e] border-l-2 border-transparent"}`}
            >
              <span className="text-blue-400 font-mono text-xs">#</span>
              styles.scss
            </button>
            
            <button 
              onClick={() => setActiveTab("headJs")}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${activeTab === "headJs" ? "bg-[#37373d] text-yellow-400 border-l-2 border-yellow-400" : "text-gray-300 hover:bg-[#2a2d2e] border-l-2 border-transparent"}`}
            >
              <span className="text-yellow-400 font-mono text-xs">{}</span>
              head.js
            </button>

            <button 
              onClick={() => setActiveTab("bodyJs")}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${activeTab === "bodyJs" ? "bg-[#37373d] text-yellow-400 border-l-2 border-yellow-400" : "text-gray-300 hover:bg-[#2a2d2e] border-l-2 border-transparent"}`}
            >
              <span className="text-yellow-400 font-mono text-xs">{}</span>
              body.js
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
            {/* Breadcrumb */}
            <div className="h-8 flex items-center px-4 bg-[#1e1e1e] text-xs text-gray-400 font-mono border-b border-gray-800">
              bookin-studio / global / {activeTab === "css" ? "styles.scss" : activeTab === "headJs" ? "head.js" : "body.js"}
            </div>

            <div className="flex-1 relative">
              {activeTab === "css" && (
                <Editor
                  height="100%"
                  defaultLanguage="scss"
                  theme="vs-dark"
                  value={cssCode}
                  onChange={(val) => setCssCode(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              )}
              {activeTab === "headJs" && (
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={headJsCode}
                  onChange={(val) => setHeadJsCode(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              )}
              {activeTab === "bodyJs" && (
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={bodyJsCode}
                  onChange={(val) => setBodyJsCode(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              )}
            </div>

            {/* Error Console */}
            {compileError && (
              <div className="h-40 border-t border-gray-800 bg-[#1e1e1e] flex flex-col">
                <div className="h-8 bg-[#252526] flex items-center px-4 border-b border-gray-800">
                  <span className="text-xs font-mono text-gray-300">Terminal - Output</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap">{compileError}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
