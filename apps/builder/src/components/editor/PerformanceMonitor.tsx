"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { X, Zap, Gauge, Image as ImageIcon, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface PerformanceMonitorProps {
  onClose: () => void;
}

export const PerformanceMonitor = ({ onClose }: PerformanceMonitorProps) => {
  const { query } = useEditor();
  
  const [metrics, setMetrics] = useState({
    score: 100,
    domNodes: 0,
    imagesTotal: 0,
    imagesUnoptimized: 0,
    imagesMissingDimensions: 0,
    imagesEager: 0,
    suggestions: [] as string[]
  });

  const runAnalysis = () => {
    const nodes = query.getNodes();
    let score = 100;
    const suggestions: string[] = [];
    
    let domNodes = Object.keys(nodes).length;
    let imagesTotal = 0;
    let imagesUnoptimized = 0;
    let imagesMissingDimensions = 0;
    let imagesEager = 0;

    // Analyze DOM size
    if (domNodes > 200) {
      score -= 5;
      suggestions.push("High DOM depth: Consider simplifying your layout to improve rendering performance.");
    }

    Object.values(nodes).forEach((node: any) => {
      if (node.type?.resolvedName === 'Image') {
        imagesTotal++;
        const props = node.props || {};
        
        if (props.optimizeFormat === false) {
          imagesUnoptimized++;
          score -= 2;
        }

        if (props.lazyLoad === false) {
          imagesEager++;
        }

        // Check if width/height are set to absolute values to prevent CLS
        if (!props.width || props.width === "100%" || props.width === "auto") {
          imagesMissingDimensions++;
        }
      }
    });

    if (imagesUnoptimized > 0) {
      suggestions.push(`${imagesUnoptimized} image(s) have format optimization disabled. Enable WebP/AVIF serving for smaller payloads.`);
    }

    if (imagesMissingDimensions > 0) {
      score -= Math.min(10, imagesMissingDimensions * 2);
      suggestions.push(`${imagesMissingDimensions} image(s) lack explicit pixel dimensions. This can cause Cumulative Layout Shift (CLS).`);
    }

    if (imagesEager > 1) {
      score -= Math.min(10, (imagesEager - 1) * 3);
      suggestions.push(`Found ${imagesEager} eager-loaded images. Only the hero image should be eager loaded; the rest should be lazy loaded.`);
    }

    setMetrics({
      score: Math.max(0, score),
      domNodes,
      imagesTotal,
      imagesUnoptimized,
      imagesMissingDimensions,
      imagesEager,
      suggestions
    });
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50";
    if (score >= 50) return "bg-amber-50";
    return "bg-red-50";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2.5">
            <Gauge size={20} className="text-red-600" />
            Performance Monitor
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm focus:outline-none transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-6 bg-white">
          
          <div className="flex gap-6 items-center">
            <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 ${metrics.score >= 90 ? 'border-green-500' : metrics.score >= 50 ? 'border-amber-500' : 'border-red-500'} ${getScoreBg(metrics.score)}`}>
              <span className={`text-4xl font-bold ${getScoreColor(metrics.score)}`}>{metrics.score}</span>
              <span className={`text-xs font-bold ${getScoreColor(metrics.score)} uppercase tracking-wider mt-1`}>
                {metrics.score >= 90 ? 'Excellent' : metrics.score >= 50 ? 'Average' : 'Poor'}
              </span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">Simulated Lighthouse Score</h4>
              <p className="text-sm font-medium text-gray-500 mb-4 leading-relaxed">
                This is a heuristic estimate of your page's performance based on Google Lighthouse and Core Web Vitals best practices.
              </p>
              
              <div className="flex gap-4">
                <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">DOM Elements</div>
                  <div className="text-xl font-black text-gray-900">{metrics.domNodes}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Images</div>
                  <div className="text-xl font-black text-gray-900">{metrics.imagesTotal}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-900">Core Web Vitals Tracker</h4>
            </div>
            <div className="p-5 grid grid-cols-2 gap-6 bg-white">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon size={16} className="text-red-500"/> LCP
                </span>
                <span className="text-xs font-medium text-gray-500 leading-relaxed">The compiler automatically injects a preload tag for the first image found to optimize Largest Contentful Paint.</span>
                <span className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1.5 bg-green-50 w-max px-2 py-1 rounded-md">
                  <CheckCircle2 size={14}/> Optimized
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500"/> CLS
                </span>
                <span className="text-xs font-medium text-gray-500 leading-relaxed">Checking for missing explicit image dimensions that cause Cumulative Layout Shifts.</span>
                {metrics.imagesMissingDimensions > 0 ? (
                  <span className="text-xs font-bold text-amber-700 mt-2 flex items-center gap-1.5 bg-amber-50 w-max px-2 py-1 rounded-md">
                    <AlertTriangle size={14}/> {metrics.imagesMissingDimensions} Risks Found
                  </span>
                ) : (
                  <span className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1.5 bg-green-50 w-max px-2 py-1 rounded-md">
                    <CheckCircle2 size={14}/> Optimized
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-900">Performance Suggestions</h4>
              <span className="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded-md">{metrics.suggestions.length} items</span>
            </div>
            <div className="divide-y divide-gray-50 bg-white">
              {metrics.suggestions.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 size={40} className="text-green-500 mb-3" />
                  <p className="text-sm font-bold text-gray-900">Your page is fully optimized!</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">No suggestions found.</p>
                </div>
              ) : (
                metrics.suggestions.map((sug, i) => (
                  <div key={i} className="p-5 flex items-start gap-3 text-sm font-medium text-gray-700">
                    <ChevronRight size={18} className="text-red-500 shrink-0 mt-0.5" />
                    {sug}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex gap-4 items-start">
            <CheckCircle2 size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-bold text-red-900">Unused CSS Detection</h5>
              <p className="text-xs font-medium text-red-800/80 mt-1.5 leading-relaxed">
                The Bookin Static Compiler natively analyzes your DOM during publish and automatically strips all unused Tailwind utility classes using Critical CSS Extraction.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
