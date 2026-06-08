"use client";

import React, { useState } from "react";
import { Spinner, useToast } from "@book-in/ui";
import { ExternalLink, LayoutTemplate, MonitorSmartphone, Rocket, ServerCrash, RefreshCw } from "lucide-react";

export default function WebsiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleOpenStudio = async () => {
    setLoading(true);
    setErrorState(null);

    try {
      // 1. Try to get SSO Link directly
      const res = await fetch("/api/v1/studio/sso-link", { method: "GET" });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
        return;
      }

      // 2. If it failed because it's not provisioned (or if we got a 404/500), try provisioning first
      if (res.status === 404 || (data.error && data.error.includes("not found"))) {
        await handleProvision();
      } else {
        throw new Error(data.error || "Failed to connect to Studio service.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorState(err.message || "Studio API is temporarily unreachable.");
      addToast(err.message || "Studio API is temporarily unreachable.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProvision = async () => {
    setProvisioning(true);
    try {
      addToast("Provisioning your Studio workspace... this may take a moment.", "info");
      
      const res = await fetch("/api/v1/studio/provision", {
        method: "POST",
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to provision Studio workspace.");
      }

      addToast("Workspace provisioned successfully! Opening Studio...", "success");
      
      // Now that it's provisioned, try getting the SSO link again
      const ssoRes = await fetch("/api/v1/studio/sso-link", { method: "GET" });
      const ssoData = await ssoRes.json();
      
      if (ssoRes.ok && ssoData.success && ssoData.url) {
        window.open(ssoData.url, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("Provisioning succeeded but SSO link failed.");
      }
      
    } catch (err: any) {
      console.error(err);
      setErrorState(err.message || "Failed to provision workspace.");
      addToast(err.message || "Failed to provision workspace.", "error");
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* ── Page Header Title ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-family-display)",
          fontSize: "26px",
          fontWeight: 700,
          color: "var(--text-heading)",
          marginBottom: "6px"
        }}>
          Website & Builder
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Launch and manage your fully customizable clinic website via Bookin Studio.
        </p>
      </div>

      <div className="admin-card" style={{ 
        padding: "32px", 
        borderRadius: "12px", 
        border: "1px solid var(--border-default)",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Background Elements */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, rgba(14, 165, 233, 0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div style={{ 
            flexShrink: 0, 
            width: "64px", 
            height: "64px", 
            borderRadius: "16px", 
            background: "#4f46e5", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -4px rgba(79, 70, 229, 0.2)"
          }}>
            <LayoutTemplate color="#ffffff" size={32} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-heading)", marginBottom: "8px" }}>
              Bookin Studio Editor
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", maxWidth: "600px" }}>
              Bookin Studio is our professional-grade website builder. It allows you to drag-and-drop components, customize your clinical branding, and instantly publish a fast, mobile-friendly site with your booking widget automatically integrated.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", background: "#e0e7ff", borderRadius: "8px", color: "#4338ca" }}>
                  <MonitorSmartphone size={18} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-body)" }}>Responsive by default</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", background: "#dbeafe", borderRadius: "8px", color: "#0369a1" }}>
                  <Rocket size={18} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-body)" }}>Lightning fast rendering</span>
              </div>
            </div>

            {errorState ? (
              <div style={{ 
                background: "#fef2f2", 
                border: "1px solid #fca5a5", 
                borderRadius: "8px", 
                padding: "16px", 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "12px",
                marginBottom: "24px"
              }}>
                <ServerCrash color="#ef4444" size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#b91c1c", marginBottom: "4px" }}>Studio Service Unavailable</h4>
                  <p style={{ fontSize: "13px", color: "#991b1b", lineHeight: "1.5", marginBottom: "12px" }}>
                    {errorState}
                  </p>
                  <button 
                    onClick={handleOpenStudio}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #f87171",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#b91c1c",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <RefreshCw size={14} /> Retry Connection
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleOpenStudio}
                disabled={loading || provisioning}
                style={{
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 24px",
                  height: "44px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: (loading || provisioning) ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: (loading || provisioning) ? 0.7 : 1,
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
              >
                {loading || provisioning ? (
                  <>
                    <Spinner size="sm" color="white" />
                    {provisioning ? "Creating your website..." : "Authenticating..."}
                  </>
                ) : (
                  <>
                    <ExternalLink size={16} />
                    Open in Bookin Studio
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
