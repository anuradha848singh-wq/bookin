"use client";

import { useEffect, useState, use } from "react";
import { Editor } from "@/components/editor/Editor";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StandaloneEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const websiteId = use(params).slug; // URL parameter is the website ID or slug
  
  const [layout, setLayout] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home"); // Can expand to handle multiple pages
  
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/studio/load?slug=${websiteId}&page=${activePage}`);
        if (!res.ok) {
           if (res.status === 401) router.push("/login");
           return;
        }
        const data = await res.json();
        if (data.success && data.content) {
          setLayout(data.content);
        } else {
          setLayout(null);
        }
      } catch (err) {
        console.error("Failed to load layout", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [websiteId, activePage, router]);

  const handleSave = async (content: string) => {
    const res = await fetch("/api/studio/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, websiteSlug: websiteId, pageSlug: activePage }),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  const handleLoad = async () => {
    return layout;
  };

  const handlePageSwitch = (newSlug: string) => {
    setActivePage(newSlug);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        <p className="text-gray-500 font-medium">Loading Bookin Studio...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Editor 
        initialData={layout} 
        onSave={handleSave} 
        onLoad={handleLoad} 
        activeSlug={activePage}
        onPageSwitch={handlePageSwitch}
      />
    </div>
  );
}
