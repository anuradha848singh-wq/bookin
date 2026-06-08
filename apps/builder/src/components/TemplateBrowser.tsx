"use client";

import React, { useState, useEffect } from "react";
import { X, Search, ChevronRight, Layout, Check } from "lucide-react";

interface TemplateBrowserProps {
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export const TemplateBrowser = ({ onClose, onSelect }: TemplateBrowserProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/studio/templates");
        if (res.ok) {
          const data = await res.json();
          setTemplates(data.templates || []);
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch templates", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesCat = activeCategory ? t.categoryId === activeCategory : true;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md transition-all font-sans">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Choose a Template</h2>
            <p className="text-gray-500 font-medium mt-1">Start with a blank canvas or pick a pre-designed premium template.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Filters */}
          <div className="w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto hidden md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Categories</h3>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === null ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All Templates
                  <span className="text-xs bg-white text-gray-400 px-2 py-0.5 rounded-full border border-gray-200">{templates.length}</span>
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Blank Template */}
                <div 
                  className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-red-600 transition-all cursor-pointer"
                  onClick={() => onSelect("blank")}
                >
                  <div className="h-56 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-red-50/50 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layout size={32} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between bg-white">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Blank Canvas</h3>
                      <p className="text-sm font-medium text-gray-500">Start from scratch</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-red-600 transition-colors" />
                  </div>
                </div>

                {/* DB Templates */}
                {filteredTemplates.map(template => (
                  <div 
                    key={template.id}
                    className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-red-600 transition-all cursor-pointer relative"
                    onClick={() => onSelect(template.id)}
                  >
                    {template.isPremium && (
                      <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        Premium
                      </div>
                    )}
                    <div className="h-56 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                      {template.thumbnail ? (
                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Layout size={48} className="text-gray-300" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="px-6 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                          Use Template
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between bg-white">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                        <p className="text-sm font-medium text-gray-500">{template.category?.name || "General"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
