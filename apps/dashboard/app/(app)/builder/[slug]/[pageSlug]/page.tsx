"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LayoutTemplate, Loader2, ArrowRight } from "lucide-react";

const TEMPLATES = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, whitespace-heavy design perfect for modern clinics.",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
    layout: '{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":0},"displayName":"Container","custom":{},"hidden":false,"nodes":["hero-node","services-node"],"linkedNodes":{}},"hero-node":{"type":{"resolvedName":"HeroSection"},"isCanvas":false,"props":{"background":"#ffffff","paddingY":120},"displayName":"Hero Section","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}},"services-node":{"type":{"resolvedName":"ServicesGrid"},"isCanvas":false,"props":{"backgroundColor":"#FAFAFA","columns":3},"displayName":"Services Grid","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}'
  },
  {
    id: "bold-healthcare",
    name: "Bold Healthcare",
    description: "Trust-inspiring, professional layout with prominent booking actions.",
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    layout: '{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":0},"displayName":"Container","custom":{},"hidden":false,"nodes":["hero-node","staff-node"],"linkedNodes":{}},"hero-node":{"type":{"resolvedName":"HeroSection"},"isCanvas":false,"props":{"background":"#EFF6FF","paddingY":100},"displayName":"Hero Section","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}},"staff-node":{"type":{"resolvedName":"StaffShowcase"},"isCanvas":false,"props":{"backgroundColor":"#ffffff","columns":4},"displayName":"Staff Showcase","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}'
  },
  {
    id: "elegant-spa",
    name: "Elegant Wellness",
    description: "Soft colors and smooth aesthetics for spas and wellness centers.",
    thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600",
    layout: '{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":0},"displayName":"Container","custom":{},"hidden":false,"nodes":["hero-node","service-node"],"linkedNodes":{}},"hero-node":{"type":{"resolvedName":"HeroSection"},"isCanvas":false,"props":{"background":"#FDF4FF","paddingY":140},"displayName":"Hero Section","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}},"service-node":{"type":{"resolvedName":"ServiceShowcase"},"isCanvas":false,"props":{"backgroundColor":"#ffffff"},"displayName":"Service Showcase","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}'
  }
];

export default function TemplateChooserPage() {
  const params = useParams();
  const router = useRouter();
  // We renamed [clinicSlug] to [slug] to avoid Next.js routing conflicts
  const clinicSlug = params.slug as string;
  const pageSlug = params.pageSlug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingLayout() {
      try {
        setLoading(true);
        // Load the page to see if it already has a design
        const res = await fetch(`/api/builder/load?slug=${pageSlug}`);
        const data = await res.json();
        
        if (data.success) {
          if (data.content) {
            // The page has content! Bypass the template chooser and go to the editor
            router.replace(`/editor/${pageSlug}`);
          } else {
            // Content is null, meaning it's the first time
            setLoading(false);
          }
        } else {
          setError(data.error || "Failed to load page status");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to check layout status", err);
        setError("Network error");
        setLoading(false);
      }
    }
    checkExistingLayout();
  }, [pageSlug, router]);

  const handleSelectTemplate = async (templateLayout: string) => {
    try {
      setSaving(true);
      const res = await fetch("/api/builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: templateLayout, slug: pageSlug }),
      });
      const result = await res.json();
      if (result.success) {
        // Success! Go to editor
        router.push(`/editor/${pageSlug}`);
      } else {
        throw new Error(result.error || "Failed to save template");
      }
    } catch (err: any) {
      console.error("Failed to apply template", err);
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "#f3f4f6" }}>
        <Loader2 className="animate-spin text-[#0066FF] mb-4" size={32} />
        <p style={{ fontSize: "15px", color: "#6b7280", fontWeight: "500" }}>Loading builder...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "48px 40px", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <LayoutTemplate size={48} color="#0066FF" style={{ margin: "0 auto 20px" }} />
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Choose a Starting Template</h1>
        <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
          Select a layout for <strong style={{ color: "#111827" }}>/{pageSlug}</strong>. You can completely customize everything in the studio, or start from scratch.
        </p>
      </div>

      {error && (
        <div style={{ padding: "16px", background: "#fee2e2", border: "1px solid #f87171", borderRadius: "8px", color: "#b91c1c", marginBottom: "24px", textAlign: "center", maxWidth: "600px", margin: "0 auto 32px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} style={{ 
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ height: "200px", background: "#f3f4f6", overflow: "hidden" }}>
              <img src={tpl.thumbnail} alt={tpl.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{tpl.name}</h3>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 24px 0", flex: 1 }}>{tpl.description}</p>
              
              <button 
                disabled={saving}
                onClick={() => handleSelectTemplate(tpl.layout)}
                style={{ 
                  width: "100%", background: "#111827", border: "1px solid #111827", borderRadius: "8px",
                  padding: "12px", fontSize: "14px", fontWeight: "600", color: "#fff", cursor: saving ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  opacity: saving ? 0.7 : 1, transition: "background 0.2s"
                }}
              >
                Use this Template <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Start from Scratch Option */}
        <div style={{ 
          background: "#F9FAFB", border: "2px dashed #D1D5DB", borderRadius: "16px", overflow: "hidden",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px", textAlign: "center"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Start from Scratch</h3>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 24px 0" }}>Build a completely custom design starting with a blank canvas.</p>
          
          <button 
            disabled={saving}
            onClick={() => handleSelectTemplate('{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#ffffff","padding":60},"displayName":"Container","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}')}
            style={{ 
              background: "#fff", border: "1px solid #D1D5DB", borderRadius: "8px",
              padding: "12px 24px", fontSize: "14px", fontWeight: "600", color: "#374151", cursor: saving ? "wait" : "pointer"
            }}
          >
            Blank Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
