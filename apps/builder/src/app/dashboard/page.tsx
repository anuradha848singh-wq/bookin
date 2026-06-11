"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Plus, Settings, Globe, MoreVertical, LogOut, Loader2 } from "lucide-react";
import { TemplateBrowser } from "../../components/TemplateBrowser";

export default function DashboardPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      // In a fully integrated version, we would fetch the user's specific BuilderWebsites from the DB.
      // For now, we will mock the fetching of sites or use localStorage if there's no API yet in this standalone app.
      try {
        // Attempt to fetch from the shared dashboard API if accessible (CORS permitting), 
        // otherwise default to a demo site.
        const res = await fetch("/api/studio/pages");
        if (res.ok) {
          const data = await res.json();
          setSites(data.pages || []);
        } else {
          throw new Error("API not available");
        }
      } catch (err) {
        // Fallback demo site for the standalone builder showcase
        setSites([
          {
            id: "demo-site-1",
            slug: "my-clinic",
            title: "Apex Healthcare Clinic",
            status: "published",
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCreateSite = async (templateId: string) => {
    // In a full implementation, you would POST to /api/studio/sites with the templateId
    // and it would clone the template's JSON into a new BuilderWebsite row.
    // For now, we mock the redirection.
    const tempSlug = `site-${Math.random().toString(36).substring(7)}`;
    router.push(`/editor/${tempSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Dashboard Topbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Layout size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Bookin Studio</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600">
              {user?.email}
            </span>
            <div className="w-px h-6 bg-gray-200"></div>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Sites</h1>
            <p className="text-gray-500 font-medium">Manage and edit your clinical websites.</p>
          </div>
          <button 
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-sm hover:bg-red-700 transition-all active:scale-95"
          >
            <Plus size={18} /> Create New Site
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              {/* Thumbnail Area */}
              <div className="h-48 bg-gray-100 border-b border-gray-100 relative group-hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Layout size={48} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Link 
                    href={`/editor/${site.slug}`}
                    className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-full text-sm hover:scale-105 transition-transform"
                  >
                    Edit Site
                  </Link>
                </div>
              </div>
              
              {/* Site Details */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{site.title || site.slug}</h3>
                    <a href={`https://${site.slug}.bookin.app`} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors w-max">
                      {site.slug}.bookin.app
                    </a>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${site.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {site.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    Updated {new Date(site.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Create Card */}
          {sites.length === 0 && (
            <div 
              onClick={() => setShowTemplates(true)}
              className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 h-[340px] text-center hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Create your first site</h3>
              <p className="text-sm font-medium text-gray-500">Start from scratch or use a medical template.</p>
            </div>
          )}
        </div>
      </main>

      {showTemplates && (
        <TemplateBrowser 
          onClose={() => setShowTemplates(false)} 
          onSelect={handleCreateSite}
        />
      )}
    </div>
  );
}
