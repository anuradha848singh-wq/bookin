"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, History, X, User } from "lucide-react";
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

export default function CRMPageClient({ clinicName }: { clinicName: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Dossier State
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

  // Selected patient data for history view
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  const handleAddCustomTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTag("");
  };

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

  const openNewDossier = () => {
    setEditingPatientId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setTags([]);
    setNewTag("");
    setSelectedBookings([]);
    setActiveTab("profile");
    setIsDossierOpen(true);
  };

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

      if (editingPatientId) {
        setPatients(prev => prev.map(p => p.id === editingPatientId ? { ...p, ...data.patient } : p));
        addToast("Patient profile updated!", "success");
      } else {
        setPatients(prev => [{ ...data.patient, bookings: [] }, ...prev]);
        addToast("Patient created!", "success");
      }

      setIsDossierOpen(false);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const term = searchQuery.toLowerCase();
    return (
      p.first_name.toLowerCase().includes(term) ||
      p.last_name.toLowerCase().includes(term) ||
      (p.phone && p.phone.includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term))
    );
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
            Patients Directory
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            View and manage your patient records and appointment history.
          </p>
        </div>

        <button
          onClick={openNewDossier}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "var(--text-heading)", color: "#fff",
            border: "none", padding: "10px 18px", borderRadius: "var(--radius-md)",
            fontSize: "13px", fontWeight: "600", cursor: "pointer",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        background: "var(--surface-overlay)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)"
      }}>
        {/* Toolbar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", gap: "16px" }}>
          <div style={{
            background: "var(--surface-hover)", borderRadius: "8px", height: "36px",
            display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", flex: 1,
            border: "1px solid var(--border-color)"
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ 
                background: "transparent", border: "none", outline: "none", 
                fontSize: "13px", color: "var(--text-heading)", width: "100%" 
              }} 
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <Spinner />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <User size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "8px" }}>No Patients Found</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Try adjusting your search or add a new patient.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--surface-hover)" }}>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Patient</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Contact Info</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Total Visits</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Last Visit</th>
                <th style={{ padding: "14px 24px", width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => {
                const completedBookings = p.bookings?.filter(b => b.status === "completed" || b.status === "confirmed") || [];
                const lastVisit = completedBookings.length > 0 
                  ? new Date(completedBookings[0].slot.starts_at).toLocaleDateString()
                  : "No visits";

                return (
                  <tr key={p.id} onClick={() => window.location.href = `/crm/${p.id}`} style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--surface-overlay)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", flexShrink: 0 }}>
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span>{p.first_name} {p.last_name}</span>
                          </div>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px", marginBottom: "2px" }}>
                            {p.tags && p.tags.map(t => {
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
                            })}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Added {new Date(p.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-body)" }}>{p.phone || "—"}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.email || "—"}</div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <Badge variant="default">{p.bookings?.length || 0} Bookings</Badge>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontSize: "13px", color: "var(--text-body)" }}>{lastVisit}</div>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button onClick={(e) => { e.stopPropagation(); openEditDossier(p); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--text-muted)" }}>
                        <Edit2 size={16} />
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
                Profile Info
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
                    <p style={{fontSize: "11px", color: "var(--text-muted)", marginTop: "4px"}}>Phone numbers must be unique across all patients.</p>
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
