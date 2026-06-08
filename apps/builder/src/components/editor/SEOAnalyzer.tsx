"use client";

import React, { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { X, Search, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface SEOAnalyzerProps {
  onClose: () => void;
}

export const SEOAnalyzer = ({ onClose }: SEOAnalyzerProps) => {
  const { query } = useEditor();
  const [keyword, setKeyword] = useState("");
  
  const [analysis, setAnalysis] = useState({
    h1Count: 0,
    missingAltImages: 0,
    totalImages: 0,
    keywordDensity: 0,
    wordCount: 0,
    keywordOccurrences: 0,
  });

  const runAnalysis = () => {
    const nodes = query.getNodes();
    let h1Count = 0;
    let missingAltImages = 0;
    let totalImages = 0;
    let allText = "";

    Object.values(nodes).forEach((node) => {
      // Check Headings
      if (node.data.name === "Text" && node.data.props.tagName === "h1") {
        h1Count++;
      } else if (node.data.name === "Heading1") { // if custom H1 block exists
        h1Count++;
      }

      // Check Images
      if (node.data.name === "Image") {
        totalImages++;
        if (!node.data.props.alt || node.data.props.alt.trim() === "") {
          missingAltImages++;
        }
      }

      // Extract text
      if (node.data.props.text) {
        // Strip HTML if it's rich text
        const textContent = node.data.props.text.replace(/<[^>]*>?/gm, ' ');
        allText += " " + textContent;
      }
    });

    const words = allText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    let keywordOccurrences = 0;
    let keywordDensity = 0;

    if (keyword.trim()) {
      const targetWords = keyword.trim().toLowerCase().split(/\s+/);
      // Simple word-by-word matching for density (can be improved for exact phrase match)
      if (targetWords.length === 1) {
        keywordOccurrences = words.filter(w => w === targetWords[0]).length;
      } else {
        // Simple approximation for phrase
        const textLower = allText.toLowerCase();
        const phraseRegex = new RegExp(`\\b${keyword.trim().toLowerCase()}\\b`, 'g');
        keywordOccurrences = (textLower.match(phraseRegex) || []).length;
      }
      if (wordCount > 0) {
        keywordDensity = (keywordOccurrences / wordCount) * 100;
      }
    }

    setAnalysis({
      h1Count,
      missingAltImages,
      totalImages,
      keywordDensity,
      wordCount,
      keywordOccurrences,
    });
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]); // re-run when keyword changes

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2.5">
            <Search size={20} className="text-red-600" />
            SEO Analyzer
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm focus:outline-none transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-6 bg-white">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Keyword</label>
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. 'plumbing services'"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm transition-all"
            />
            <p className="text-xs font-medium text-gray-500 mt-1">Enter a target keyword to check its density across the page content.</p>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-900">Analysis Results</h4>
            </div>
            
            <div className="divide-y divide-gray-50 bg-white">
              {/* Heading Check */}
              <div className="p-5 flex items-start gap-3">
                {analysis.h1Count === 1 ? (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-sm font-bold text-gray-900">H1 Tag Structure</h5>
                  <p className="text-xs font-medium text-gray-500 mt-1.5 leading-relaxed">
                    {analysis.h1Count === 0 
                      ? "Missing H1 tag. Every page should have exactly one H1 tag for SEO." 
                      : analysis.h1Count > 1 
                        ? `Found ${analysis.h1Count} H1 tags. It's best practice to only have one H1 per page.` 
                        : "Perfect! You have exactly one H1 tag on this page."}
                  </p>
                </div>
              </div>

              {/* Alt Text Check */}
              <div className="p-5 flex items-start gap-3">
                {analysis.totalImages === 0 ? (
                  <CheckCircle2 size={20} className="text-gray-300 shrink-0 mt-0.5" />
                ) : analysis.missingAltImages === 0 ? (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-sm font-bold text-gray-900">Image Alt Text</h5>
                  <p className="text-xs font-medium text-gray-500 mt-1.5 leading-relaxed">
                    {analysis.totalImages === 0 
                      ? "No images found on the page."
                      : analysis.missingAltImages === 0 
                        ? `All ${analysis.totalImages} images have alt text.` 
                        : `${analysis.missingAltImages} out of ${analysis.totalImages} images are missing alt text. Add alt text for accessibility and image SEO.`}
                  </p>
                </div>
              </div>

              {/* Keyword Density Check */}
              <div className="p-5 flex items-start gap-3">
                {!keyword ? (
                  <Search size={20} className="text-gray-300 shrink-0 mt-0.5" />
                ) : (analysis.keywordDensity >= 1 && analysis.keywordDensity <= 3) ? (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-sm font-bold text-gray-900">Keyword Density</h5>
                  <p className="text-xs font-medium text-gray-500 mt-1.5 leading-relaxed">
                    {!keyword 
                      ? "Enter a keyword above to check density."
                      : <>
                          Found <strong>{analysis.keywordOccurrences}</strong> occurrences out of <strong>{analysis.wordCount}</strong> words 
                          (<strong>{analysis.keywordDensity.toFixed(2)}%</strong> density).
                          <br/><br/>
                          {analysis.keywordDensity < 1 
                            ? "Density is a bit low. Consider naturally adding the keyword more often." 
                            : analysis.keywordDensity > 3 
                              ? "Density is high. Be careful of keyword stuffing." 
                              : "Optimal density! (1% - 3%)"}
                        </>
                    }
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
