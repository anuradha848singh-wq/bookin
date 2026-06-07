"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, LayoutTemplate, MoreVertical, Globe, ArrowRight } from "lucide-react";

interface PageMeta {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updated_at: string;
  is_home: boolean;
}

export default function SiteManagerPage() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/builder/pages");
        const data = await res.json();
        if (data.success) {
          setPages(data.pages || []);
        } else {
          setError(data.error || "Unknown API error");
        }
      } catch (err: any) {
        console.error("Failed to fetch site pages", err);
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Site Manager</h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your clinic's public website pages. Open the Studio to design and publish changes.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors">
            <Globe size={16} className="text-gray-400" />
            View Live Site
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-red-600/20 transition-all active:scale-[0.98]">
            <Plus size={16} />
            New Page
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="text-lg font-bold mb-2">Error loading pages</h3>
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="py-24 px-8 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <LayoutTemplate size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">No pages found</h3>
          <p className="text-sm text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
            You don't have any website pages yet. Create your first page to start building your clinic's public presence.
          </p>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm shadow-red-600/20 transition-all active:scale-[0.98]">
            <Plus size={18} />
            Create First Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {pages.map((page) => (
            <div key={page.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
              
              {/* Thumbnail Area */}
              <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
                <LayoutTemplate size={48} className="text-gray-300 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                
                {page.is_home && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-700 uppercase tracking-wider shadow-sm z-20">
                    Homepage
                  </span>
                )}
                {page.published && (
                  <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 px-2 py-1 rounded-md text-[11px] font-bold text-emerald-700 uppercase tracking-wider z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{page.title}</h3>
                    <p className="text-xs font-medium text-gray-500 font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">
                      /{page.slug === 'home' ? '' : page.slug}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href={`/editor/${page.slug}`} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]">
                    Open Studio
                  </Link>
                  <Link href={`/builder/${page.slug}`} className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]">
                    Settings <ArrowRight size={14} className="text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
