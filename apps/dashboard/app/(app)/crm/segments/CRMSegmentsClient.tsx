"use client";

import React, { useState, useEffect } from "react";
import { Search, Edit2, History, X, User, Filter, Layers, ListFilter } from "lucide-react";
import { Badge, Spinner, useToast } from "@book-in/ui";

interface Booking {
  id: string;
  status: string;
  created_at: string;
  slot: {
    starts_at: string;
    service: { name: string; price: string };
    provider?: { first_name: string; last_name: string };
  };
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  tags?: string[];
  bookings?: Booking[];
}

export default function CRMSegmentsClient({ clinicName }: { clinicName: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchLogic, setMatchLogic] = useState<"any" | "all">("any");

  // Dossier State (to view/edit patient details directly from Segments page)
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selected patient bookings for history view
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  const { addToast } = useToast();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/patients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load patients");
      setPatients(data.patients || []);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Compute all unique tags and their frequencies from current patients
  const tagCounts: { [tag: string]: number } = {};
  patients.forEach(p => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    }
  });

  const uniqueTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Toggle selected tag for filtering
  const handleToggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // Open edit dossier
  const openEditDossier = (patient: Patient) => {
    setEditingPatientId(patient.id);
    setFirstName(patient.first_name);
    setLastName(patient.last_name);
    setEmail(patient.email || "");
    setPhone(patient.phone || "");
    setTags(patient.tags || []);
    setNewTag("");
    setSelectedBookings(patient.bookings || []);
    setActiveTab("profile");
    setIsDossierOpen(true);
  };

  // Add custom tag during editing
  const handleAddCustomTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTag("");
  };

  // Save changes
  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      addToast("First Name, Last Name, and Phone are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id: editingPatientId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        tags: tags
      };

      const res = await fetch("/api/dashboard/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save patient");

      setPatients(prev => prev.map(p => p.id === editingPatientId ? { ...p, ...data.patient } : p));
      addToast("Patient profile and tags updated!", "success");
      setIsDossierOpen(false);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering Logic
  const filteredPatients = patients.filter(p => {
    // 1. Text Search matching name, email, phone
    const term = searchQuery.toLowerCase();
    const matchesSearch = !term || (
      p.first_name.toLowerCase().includes(term) ||
      p.last_name.toLowerCase().includes(term) ||
      (p.phone && p.phone.includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term))
    );

    if (!matchesSearch) return false;

    // 2. Tag Matching logic
    if (selectedTags.length === 0) return true;

    const patientTags = p.tags || [];
    if (matchLogic === "any") {
      // At least one selected tag must match (OR logic)
      return selectedTags.some(t => patientTags.includes(t));
    } else {
      // ALL selected tags must match (AND logic)
      return selectedTags.every(t => patientTags.includes(t));
    }
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Header Panel */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "var(--space-6)"
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--text-heading)",
            marginBottom: "4px"
          }}>
            Patient Segments
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Create custom segments by combining multiple tags, visit counts, or status criteria.
          </p>
        </div>
      </div>

      {/* Tags Directory Overview Card Grid */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "12px" }}>
          Active Tags in {clinicName}
        </h2>
        {loading ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Spinner />
          </div>
        ) : uniqueTags.length === 0 ? (
          <div style={{
            background: "var(--surface-hover)",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-color)",
            padding: "24px",
            textAlign: "center",
            color: "var(--text-muted)"
          }}>
            No tags found. Go to the Patients Directory to tag your first patient!
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "12px"
          }}>
            {uniqueTags.map(tag => {
              const count = tagCounts[tag];
              const isSelected = selectedTags.includes(tag);
              
              // Curated harmonious badge variant colors
              let variantStyle: React.CSSProperties = {
                border: "1px solid var(--border-color)",
                background: "var(--surface-overlay)",
                color: "var(--text-body)"
              };
              
              if (isSelected) {
                variantStyle = {
                  border: "1px solid var(--text-heading)",
                  background: "var(--text-heading)",
                  color: "#fff",
                  boxShadow: "var(--shadow-sm)"
                };
              }

              return (
                <div
                  key={tag}
                  onClick={() => handleToggleTagFilter(tag)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    ...variantStyle
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--text-heading)";
                      e.currentTarget.style.background = "var(--surface-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "var(--surface-overlay)";
                    }
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>{tag}</span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    background: isSelected ? "rgba(255,255,255,0.25)" : "var(--surface-hover)",
                    color: isSelected ? "#fff" : "var(--text-muted)",
                    padding: "2px 8px",
                    borderRadius: "12px"
                  }}>{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter and Segment Controls */}
      <div style={{
        background: "var(--surface-overlay)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "24px"
      }}>
        {/* Filters Toolbar */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Left search & filter criteria */}
          <div style={{ display: "flex", gap: "16px", flex: 1, minWidth: "300px" }}>
            <div style={{
              background: "var(--surface-hover)", borderRadius: "8px", height: "38px",
              display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", flex: 1,
              border: "1px solid var(--border-color)"
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search segment patients..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  background: "transparent", border: "none", outline: "none", 
                  fontSize: "13px", color: "var(--text-heading)", width: "100%" 
                }} 
              />
            </div>

            {/* AND/OR Logic Filter toggle */}
            {selectedTags.length > 1 && (
              <div style={{
                display: "flex",
                background: "var(--surface-hover)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "2px",
                alignItems: "center"
              }}>
                <button
                  type="button"
                  onClick={() => setMatchLogic("any")}
                  style={{
                    border: "none",
                    background: matchLogic === "any" ? "var(--surface-overlay)" : "transparent",
                    color: matchLogic === "any" ? "var(--text-heading)" : "var(--text-muted)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  Match Any (OR)
                </button>
                <button
                  type="button"
                  onClick={() => setMatchLogic("all")}
                  style={{
                    border: "none",
                    background: matchLogic === "all" ? "var(--surface-overlay)" : "transparent",
                    color: matchLogic === "all" ? "var(--text-heading)" : "var(--text-muted)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  Match All (AND)
                </button>
              </div>
            )}
          </div>

          {/* Right Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {(selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={handleClearFilters}
                style={{
                  background: "none", border: "none", color: "red", fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "4px"
                }}
              >
                ✕ Reset Filters
              </button>
            )}
            <Badge variant="primary" size="md">
              {filteredPatients.length} Patients Matched
            </Badge>
          </div>
        </div>

        {/* Selected Tags list visualizer */}
        {selectedTags.length > 0 && (
          <div style={{
            background: "var(--surface-hover)",
            padding: "12px 24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap"
          }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500", marginRight: "4px" }}>
              Active Filter:
            </span>
            {selectedTags.map(t => (
              <Badge key={t} variant="primary" size="sm">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {t}
                  <span
                    onClick={() => handleToggleTagFilter(t)}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    ✕
                  </span>
                </span>
              </Badge>
            ))}
          </div>
        )}

        {/* Patients Table */}
        {loading ? (
          <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <Spinner />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Filter size={20} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "8px" }}>No Patients Match this Segment</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Try selecting different tags or clearing search terms.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--surface-hover)" }}>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Patient</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Contact Info</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Segment Tags</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Total Visits</th>
                <th style={{ padding: "14px 24px", width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => {
                const completedBookings = p.bookings?.filter(b => b.status === "completed" || b.status === "confirmed") || [];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.15s" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", flexShrink: 0 }}>
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)" }}>{p.first_name} {p.last_name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Joined {new Date(p.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-body)" }}>{p.phone || "—"}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.email || "—"}</div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {p.tags && p.tags.length > 0 ? (
                          p.tags.map(t => {
                            let variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
                            const lower = t.toLowerCase();
                            if (lower.includes('vip')) variant = 'warning';
                            else if (lower.includes('new')) variant = 'success';
                            else if (lower.includes('regular') || lower.includes('loyal')) variant = 'primary';
                            else if (lower.includes('risk') || lower.includes('no-show')) variant = 'error';
                            
                            return (
                              <Badge key={t} variant={variant} size="sm">
                                {t}
                              </Badge>
                            );
                          })
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No tags</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <Badge variant="default">{p.bookings?.length || 0} Bookings</Badge>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => openEditDossier(p)}
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--text-muted)",
                          display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "600"
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "var(--text-heading)"}
                        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-out Dossier Overlay */}
      {isDossierOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          zIndex: 100, display: "flex", justifyContent: "flex-end"
        }}>
          {/* Dossier Panel */}
          <div style={{
            width: "500px", background: "#fff", height: "100%",
            boxShadow: "-4px 0 24px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
            animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* Dossier Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "600" }}>
                  {firstName?.[0] || ""}{lastName?.[0] || ""}
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-heading)", margin: 0 }}>
                    {editingPatientId ? `${firstName} ${lastName}` : "New Patient"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Patient Dossier</p>
                </div>
              </div>
              <button onClick={() => setIsDossierOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Dossier Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", padding: "0 24px" }}>
              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  padding: "16px 0", background: "none", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: "600", marginRight: "24px",
                  color: activeTab === "profile" ? "var(--text-heading)" : "var(--text-muted)",
                  borderBottom: activeTab === "profile" ? "2px solid var(--text-heading)" : "2px solid transparent"
                }}
              >
                Profile Info & Tags
              </button>
              <button
                onClick={() => setActiveTab("history")}
                disabled={!editingPatientId}
                style={{
                  padding: "16px 0", background: "none", border: "none", cursor: editingPatientId ? "pointer" : "not-allowed",
                  fontSize: "13px", fontWeight: "600", opacity: editingPatientId ? 1 : 0.5,
                  color: activeTab === "history" ? "var(--text-heading)" : "var(--text-muted)",
                  borderBottom: activeTab === "history" ? "2px solid var(--text-heading)" : "2px solid transparent"
                }}
              >
                Booking History
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {activeTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>First Name <span style={{color:"red"}}>*</span></label>
                      <input 
                        type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }}
                        placeholder="e.g. John"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Last Name <span style={{color:"red"}}>*</span></label>
                      <input 
                        type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }}
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Phone Number <span style={{color:"red"}}>*</span></label>
                    <input 
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Email</label>
                    <input 
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px" }}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Patient Tags</label>
                    {/* Predefined Tags Suggestions */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {["VIP", "New Patient", "Regular", "Chronic", "Follow-up", "No-show Risk"].map(suggestedTag => {
                        const isSelected = tags.includes(suggestedTag);
                        return (
                          <button
                            key={suggestedTag}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setTags(tags.filter(t => t !== suggestedTag));
                              } else {
                                setTags([...tags, suggestedTag]);
                              }
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "500",
                              cursor: "pointer",
                              border: isSelected ? "1px solid var(--text-heading)" : "1px solid var(--border-color)",
                              background: isSelected ? "var(--text-heading)" : "var(--surface-hover)",
                              color: isSelected ? "#fff" : "var(--text-muted)",
                              transition: "all 0.15s ease"
                            }}
                          >
                            {isSelected ? `✓ ${suggestedTag}` : `+ ${suggestedTag}`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Tag Input */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="text"
                        placeholder="Add custom tag (press Enter)..."
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "13px" }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        style={{
                          background: "var(--surface-hover)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-heading)",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Tags list */}
                    {tags.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                        {tags.map(t => {
                          let badgeVariant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
                          const lower = t.toLowerCase();
                          if (lower.includes('vip')) badgeVariant = 'warning';
                          else if (lower.includes('new')) badgeVariant = 'success';
                          else if (lower.includes('regular') || lower.includes('loyal')) badgeVariant = 'primary';
                          else if (lower.includes('risk') || lower.includes('no-show')) badgeVariant = 'error';

                          return (
                            <span
                              key={t}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              <Badge variant={badgeVariant} size="sm">
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  {t}
                                  <span
                                    onClick={() => setTags(tags.filter(item => item !== t))}
                                    style={{
                                      cursor: "pointer",
                                      fontWeight: "bold",
                                      fontSize: "10px",
                                      opacity: 0.7,
                                      padding: "0 2px"
                                    }}
                                  >
                                    ✕
                                  </span>
                                </span>
                              </Badge>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {selectedBookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <History size={24} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No booking history found for this patient.</p>
                    </div>
                  ) : (
                    selectedBookings.map(b => {
                      const d = new Date(b.slot.starts_at);
                      return (
                        <div key={b.id} style={{ padding: "16px", border: "1px solid var(--border-color)", borderRadius: "8px", background: "var(--surface-overlay)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-heading)" }}>{d.toLocaleDateString()} at {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <Badge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "error" : "default"}>
                              {b.status}
                            </Badge>
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-body)" }}>{b.slot.service.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {b.slot.provider ? `Provider: Dr. ${b.slot.provider.last_name}` : "Any Provider"} • ${b.slot.service.price}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Dossier Footer */}
            {activeTab === "profile" && (
              <div style={{ padding: "24px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button 
                  onClick={() => setIsDossierOpen(false)}
                  style={{
                    background: "#fff", border: "1px solid var(--border-color)", color: "var(--text-heading)",
                    padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={submitting}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "var(--text-heading)", color: "#fff", border: "none",
                    padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                  }}
                >
                  {submitting ? <Spinner /> : "Save Profile"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
