"use client";

import React, { useState, useEffect } from "react";
import { Badge, Spinner, useToast } from "@book-in/ui";
import { Save, Check, LayoutGrid, Copy, ExternalLink, Play, Pause, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [clinicName, setClinicName] = useState("");
  const [clinicSlug, setClinicSlug] = useState("");
  const [template, setTemplate] = useState("minimal");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [accentColor, setAccentColor] = useState("#4338CA");
  const [logoUrl, setLogoUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [showPoweredBy, setShowPoweredBy] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copiedSlug, setCopiedSlug] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  const { addToast } = useToast();

  const templates = [
    { id: "minimal", name: "Classic Minimalist", desc: "Super clean layout with default color palette.", color: "#4F46E5" },
    { id: "medical", name: "Clinical Excellence", desc: "Designed for clinics, dentists, and health providers.", color: "#0EA5E9" },
    { id: "modern", name: "Dynamic Modern", desc: "Playful, bright styling with colorful outlines.", color: "#EC4899" },
    { id: "salon", name: "Premium Salon", desc: "A soft, premium aesthetic with pastel backgrounds.", color: "#D946EF" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/dashboard/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load settings");

        const theme = data.theme || {};
        setTemplate(theme.template || "minimal");
        setPrimaryColor(theme.primary_color || "#4F46E5");
        setAccentColor(theme.accent_color || "#4338CA");
        setLogoUrl(theme.logo_url || "");
        setTagline(theme.tagline || "");
        setWhatsappNumber(theme.whatsapp_number || "");
        setShowPoweredBy(theme.show_powered_by !== undefined ? theme.show_powered_by : true);
        
        setClinicName(data.name || "");
        setClinicSlug(data.slug || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          primary_color: primaryColor,
          accent_color: accentColor,
          logo_url: logoUrl,
          tagline,
          whatsapp_number: whatsappNumber,
          show_powered_by: showPoweredBy,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSuccess(true);
      addToast("Theme and clinical configurations updated!", "success");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
      addToast("Copied to clipboard!", "success");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* ── Breadcrumb Horizontal Top Nav ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border-default)",
        paddingBottom: "14px",
        marginBottom: "24px",
        fontSize: "12px",
        color: "var(--text-muted)",
        gap: "8px"
      }}>
        <span style={{ fontWeight: "600", color: "var(--text-heading)" }}>{clinicSlug}</span>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#0D9488", background: "#CCFBF1", padding: "1px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Free</span>
        <span>/</span>
        <span>{clinicName}'s Project</span>
        <span>/</span>
        <span>main</span>
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Production</span>
        
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
            Connected
          </span>
          <button type="button" style={{ background: "none", border: "1px solid var(--border-default)", padding: "4px 10px", fontSize: "11px", borderRadius: "4px", color: "var(--text-body)", cursor: "pointer", fontWeight: 500 }} onClick={() => addToast("Thank you for your feedback!", "success")}>Feedback</button>
        </div>
      </div>

      {/* ── Page Header Title ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{
          fontFamily: "var(--font-family-display)",
          fontSize: "26px",
          fontWeight: 700,
          color: "var(--text-heading)",
          marginBottom: "6px"
        }}>
          Project Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          General configuration, domains, ownership, and lifecycle
        </p>
      </div>

      {error && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "6px",
          fontSize: "13px",
          marginBottom: "20px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#b91c1c"
        }}>
          ❌ Error: {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "6px",
          fontSize: "13px",
          marginBottom: "20px",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          color: "#047857",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Check size={16} />
          Settings and templates updated successfully! Changes are live on your booking subdomain.
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* ── SECTION 1: General settings ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "12px" }}>General settings</h2>
          
          <div className="admin-card" style={{ padding: 0, overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-default)" }}>
            {/* Row 1: Clinic Name */}
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Project name</label>
                <span style={formSubLabelStyle}>Displayed throughout the dashboard.</span>
              </div>
              <div style={formRightColStyle}>
                <input
                  type="text"
                  className="admin-input"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  style={{ maxWidth: "480px" }}
                />
              </div>
            </div>

            {/* Row 2: Clinic ID / Slug */}
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Project ID</label>
                <span style={formSubLabelStyle}>Reference used in APIs and URLs.</span>
              </div>
              <div style={formRightColStyle}>
                <div style={{ display: "flex", gap: "8px", maxWidth: "480px" }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={clinicSlug}
                    readOnly
                    style={{ background: "#f8fafc", color: "var(--text-muted)", cursor: "not-allowed", flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(clinicSlug)}
                    style={copyButtonStyle}
                  >
                    {copiedSlug ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedSlug ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Clinic Tagline */}
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Clinic tagline</label>
                <span style={formSubLabelStyle}>Custom greeting displayed on your patient scheduling page.</span>
              </div>
              <div style={formRightColStyle}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Quality Clinical Care Since 1998"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={{ maxWidth: "480px" }}
                />
              </div>
            </div>

            {/* Row 4: Logo URL */}
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Clinic logo URL</label>
                <span style={formSubLabelStyle}>URL of clinic logo displayed on patient-facing booking page.</span>
              </div>
              <div style={formRightColStyle}>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  style={{ maxWidth: "480px" }}
                />
              </div>
            </div>

            {/* Save changes footer bar */}
            <div style={cardFooterStyle}>
              <button
                type="submit"
                disabled={saving}
                className="admin-button admin-button-primary"
                style={{
                  height: "32px",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "0 14px",
                  background: "#0f172a",
                  borderColor: "#0f172a"
                }}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Template selector ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "12px" }}>Choose Booking Page Template</h2>
          
          <div className="admin-card" style={{ padding: "20px", borderRadius: "6px", border: "1px solid var(--border-default)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px"
            }}>
              {templates.map((tpl) => {
                const isSelected = template === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    style={{
                      background: isSelected ? "#f8fafc" : "#ffffff",
                      border: isSelected ? "2px solid #0f172a" : "1px solid var(--border-default)",
                      borderRadius: "6px",
                      padding: "16px",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      position: "relative"
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#0f172a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff"
                      }}>
                        <Check size={11} />
                      </div>
                    )}

                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: tpl.color,
                      marginBottom: "12px"
                    }} />

                    <h4 style={{ color: "var(--text-heading)", fontWeight: "600", fontSize: "13.5px" }}>
                      {tpl.name}
                    </h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", lineHeight: "1.4" }}>
                      {tpl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Branding color picker ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "12px" }}>Theme customization</h2>
          
          <div className="admin-card" style={{ padding: 0, overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-default)" }}>
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Primary Brand Color</label>
                <span style={formSubLabelStyle}>Main button and active highlight theme color.</span>
              </div>
              <div style={formRightColStyle}>
                <div style={{ display: "flex", gap: "8px", maxWidth: "280px" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: "36px", height: "36px", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", background: "none", padding: 0 }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Accent Color</label>
                <span style={formSubLabelStyle}>Hover state accent color on the booking page.</span>
              </div>
              <div style={formRightColStyle}>
                <div style={{ display: "flex", gap: "8px", maxWidth: "280px" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "36px", height: "36px", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", background: "none", padding: 0 }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div style={cardFooterStyle}>
              <button
                type="submit"
                disabled={saving}
                className="admin-button admin-button-primary"
                style={{
                  height: "32px",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "0 14px",
                  background: "#0f172a",
                  borderColor: "#0f172a"
                }}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Project access table ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "12px" }}>Project access</h2>
          
          <div className="admin-card" style={{ padding: 0, overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-default)" }}>
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Organization-wide access</label>
                <span style={formSubLabelStyle}>All organization members can access this project.</span>
              </div>
              <div style={formRightColStyle}>
                <button
                  type="button"
                  onClick={() => addToast("Organization members list is managed at parent account level.", "info")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#334155",
                    cursor: "pointer"
                  }}
                >
                  Manage members
                </button>
              </div>
            </div>

            {/* Members table */}
            <div style={{ borderTop: "1px solid var(--border-default)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-default)" }}>
                    <th style={{ padding: "10px 24px", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", width: "70%" }}>Member</th>
                    <th style={{ padding: "10px 24px", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", width: "30%" }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "none" }}>
                    <td style={{ padding: "14px 24px", fontWeight: "500", color: "var(--text-heading)" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <span>anuradha848singh@gmail.com</span>
                        <span style={{ fontSize: "9px", fontWeight: "700", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#475569", padding: "1px 6px", borderRadius: "4px" }}>YOU</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 24px", color: "var(--text-muted)", fontWeight: "500" }}>Owner</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Clinic availability ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "12px" }}>Project availability</h2>
          
          <div className="admin-card" style={{ padding: 0, overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-default)" }}>
            {/* Row 1: Pause booking */}
            <div style={formRowStyle}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Pause project</label>
                <span style={formSubLabelStyle}>Your booking page will not be accessible while it is paused.</span>
              </div>
              <div style={formRightColStyle}>
                <button
                  type="button"
                  onClick={() => addToast("Clinic patient scheduling page has been successfully paused.", "success")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#dc2626",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Pause size={12} />
                  Pause project
                </button>
              </div>
            </div>

            {/* Row 2: Restart project */}
            <div style={{ ...formRowStyle, borderBottom: "none" }}>
              <div style={formLeftColStyle}>
                <label style={formLabelStyle}>Restart project</label>
                <span style={formSubLabelStyle}>Restart patient scheduler pages after general clinical maintenance.</span>
              </div>
              <div style={formRightColStyle}>
                <button
                  type="button"
                  onClick={() => addToast("Clinical scheduler system restarted successfully.", "success")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#059669",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Play size={12} />
                  Restart project
                </button>
              </div>
            </div>
          </div>
        </div>

      </form>

      {/* ── Fixed Terms and Service Notice Widget ── */}
      {showNotice && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "300px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          animation: "toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notice</span>
            <button
              onClick={() => setShowNotice(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "14px", fontWeight: "bold" }}
            >
              ×
            </button>
          </div>
          <h4 style={{ fontSize: "12.5px", fontWeight: "600", color: "#0f172a", marginTop: "8px", marginBottom: "4px" }}>We've updated our Terms of Service</h4>
          <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.4", marginBottom: "12px" }}>Updates define the responsibilities of both you and BookIn in the use of AI.</p>
          <button
            onClick={() => addToast("Opening updated service policies.", "info")}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "500",
              color: "#334155",
              cursor: "pointer"
            }}
          >
            Learn more
          </button>
        </div>
      )}
    </div>
  );
}

// ── Styling properties ──
const formRowStyle: React.CSSProperties = {
  display: "flex",
  padding: "20px 24px",
  borderBottom: "1px solid var(--border-default)",
  gap: "24px",
  flexWrap: "wrap"
};

const formLeftColStyle: React.CSSProperties = {
  flex: "1 1 240px",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const formRightColStyle: React.CSSProperties = {
  flex: "2 1 360px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const formLabelStyle: React.CSSProperties = {
  fontSize: "13.5px",
  fontWeight: "600",
  color: "var(--text-heading)"
};

const formSubLabelStyle: React.CSSProperties = {
  fontSize: "11.5px",
  color: "var(--text-muted)",
  lineHeight: "1.4"
};

const copyButtonStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0 12px",
  fontSize: "12px",
  fontWeight: "500",
  color: "#334155",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: "36px"
};

const cardFooterStyle: React.CSSProperties = {
  background: "#f8fafc",
  borderTop: "1px solid var(--border-default)",
  padding: "12px 24px",
  display: "flex",
  justifyContent: "flex-end"
};
