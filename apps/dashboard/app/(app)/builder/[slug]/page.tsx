"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, ExternalLink, Settings2, Globe, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { logError } from "@book-in/lib";

interface PageMeta {
  id: string;
  slug: string;
  title: string;
  is_home: boolean;
  seo_meta?: any;
}

export default function PageSettingsView() {
  const params = useParams();
  const router = useRouter();
  const currentSlug = (params.slug as string) || "home";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageMeta | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    jsonLd: ""
  });

  useEffect(() => {
    async function loadPageDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/builder/pages`);
        const data = await res.json();
        
        if (data.success) {
          const targetPage = data.pages.find((p: any) => p.slug === currentSlug);
          if (targetPage) {
            setPageData(targetPage);
            setForm({
              title: targetPage.title || "",
              slug: targetPage.slug || "",
              seoTitle: targetPage.seo_meta?.title || "",
              seoDescription: targetPage.seo_meta?.description || "",
              canonicalUrl: targetPage.seo_meta?.canonicalUrl || "",
              ogImage: targetPage.seo_meta?.ogImage || "",
              twitterCard: targetPage.seo_meta?.twitterCard || "summary_large_image",
              jsonLd: targetPage.seo_meta?.jsonLd || ""
            });
          } else {
            setError("Page not found");
          }
        } else {
          setError(data.error || "Failed to load page settings");
        }
      } catch (err: any) {
        logError("Failed to fetch page settings", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    loadPageDetails();
  }, [currentSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/builder/pages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug, // Can't change slug right now if home, but sent anyway
          name: form.title,
          seo: {
            title: form.seoTitle,
            description: form.seoDescription,
            canonicalUrl: form.canonicalUrl,
            ogImage: form.ogImage,
            twitterCard: form.twitterCard,
            jsonLd: form.jsonLd
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push("/builder");
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch(err) {
      console.error(err);
      alert("Error saving page settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p className="text-sm font-medium mb-6">{error}</p>
        <Link href="/builder" className="text-red-700 font-bold flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to Site Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-10">
      
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.push("/builder")} className="text-gray-400 hover:text-gray-700 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Page Settings</h1>
          <p className="text-sm text-gray-500 font-medium">Configure SEO and basic information for /{currentSlug}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Form */}
        <div className="flex-1 w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            
            {/* General Information Section */}
            <section>
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <Settings2 size={20} className="text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">General Information</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                  <input 
                    type="text" 
                    value={form.slug} 
                    disabled={pageData.is_home}
                    onChange={(e) => setForm({...form, slug: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none transition-all ${pageData.is_home ? 'bg-gray-50 text-gray-400' : 'focus:ring-2 focus:ring-red-600/20 focus:border-red-600'}`}
                  />
                  {pageData.is_home && <p className="mt-2 text-xs font-medium text-gray-500">The homepage slug cannot be changed.</p>}
                </div>
              </div>
            </section>

            {/* SEO Section */}
            <section className="pt-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <Globe size={20} className="text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">SEO Details</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    value={form.seoTitle} 
                    onChange={(e) => setForm({...form, seoTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                  <textarea 
                    value={form.seoDescription} 
                    onChange={(e) => setForm({...form, seoDescription: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Canonical URL</label>
                  <input 
                    type="text" 
                    value={form.canonicalUrl} 
                    onChange={(e) => setForm({...form, canonicalUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Open Graph Image URL</label>
                    <input 
                      type="text" 
                      value={form.ogImage} 
                      onChange={(e) => setForm({...form, ogImage: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Twitter Card Type</label>
                    <select 
                      value={form.twitterCard} 
                      onChange={(e) => setForm({...form, twitterCard: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all bg-white"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Structured Data (JSON-LD)</label>
                  <textarea 
                    value={form.jsonLd} 
                    onChange={(e) => setForm({...form, jsonLd: e.target.value})}
                    rows={5}
                    placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }'
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-sm outline-none transition-all resize-y font-mono text-gray-600"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6 mt-2 border-t border-gray-100">
              <button 
                disabled={saving} 
                type="submit" 
                className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm shadow-red-600/20 transition-all active:scale-[0.98] ${saving ? 'opacity-70 cursor-wait' : ''}`}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Studio Link Sidebar */}
        <div className="w-full lg:w-80 bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <LayoutTemplate size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">Design this page</h4>
          <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
            Open the Studio canvas to add sections, edit text, and customize the layout of {form.title}.
          </p>
          <Link href={`/editor/${currentSlug}`} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white border border-gray-900 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-all active:scale-[0.98]">
            Open Studio <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
