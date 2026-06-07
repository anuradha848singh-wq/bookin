"use client";

import React, { useState, useEffect } from "react";
import { Badge, Spinner, useToast } from "@book-in/ui";
import { ChevronLeft, Calendar, Mail, Phone, MapPin, User, Activity, Edit2, History, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

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

interface PatientNote {
  id: string;
  content: string;
  created_at: string;
  staff?: { first_name: string; last_name: string };
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
  created_at: string;
  tags?: string[];
  bookings?: Booking[];
  notes?: PatientNote[];
}

export default function PatientOverviewClient({ patientId, clinicName }: { patientId: string, clinicName: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const { addToast } = useToast();

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/patients/${patientId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load patient");
      setPatient(data.patient);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/dashboard/patients/${patientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add note");
      
      setPatient(prev => prev ? {
        ...prev,
        notes: [data.note, ...(prev.notes || [])]
      } : null);
      setNewNote("");
      addToast("Note added successfully", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Patient not found</h2>
        <Link href="/crm" style={{ color: "var(--text-heading)", textDecoration: "underline" }}>Back to Directory</Link>
      </div>
    );
  }

  // Combine notes and bookings into a single timeline
  type TimelineItem = 
    | { type: "booking"; date: Date; data: Booking }
    | { type: "note"; date: Date; data: PatientNote };

  const timelineItems: TimelineItem[] = [
    ...(patient.bookings || []).map(b => ({ type: "booking" as const, date: new Date(b.created_at), data: b })),
    ...(patient.notes || []).map(n => ({ type: "note" as const, date: new Date(n.created_at), data: n }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Back Button */}
      <Link href="/crm" style={{ 
        display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", 
        textDecoration: "none", fontSize: "13px", fontWeight: "600", marginBottom: "20px" 
      }}>
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ 
            background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", padding: "24px",
            border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)",
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
          }}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", color: "#fff",
              marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-heading)", margin: "0 0 4px 0" }}>
              {patient.first_name} {patient.last_name}
            </h1>
            
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
              <Badge variant={patient.status === "active" ? "success" : patient.status === "lead" ? "warning" : "default"}>
                {patient.status.toUpperCase()}
              </Badge>
              {patient.tags?.map(t => (
                <Badge key={t} variant="primary" size="sm">{t}</Badge>
              ))}
            </div>
            
            <div style={{ width: "100%", height: "1px", background: "var(--border-color)", margin: "16px 0" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-body)", fontSize: "13px" }}>
                <Phone size={16} color="var(--text-muted)" /> {patient.phone || "—"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-body)", fontSize: "13px" }}>
                <Mail size={16} color="var(--text-muted)" /> {patient.email || "—"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-body)", fontSize: "13px" }}>
                <MapPin size={16} color="var(--text-muted)" /> {patient.address || "No address on file"}
              </div>
            </div>
          </div>

          <div style={{ 
            background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", padding: "20px",
            border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-heading)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} /> Demographics
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Date of Birth</div>
                <div style={{ fontSize: "13px", color: "var(--text-heading)", fontWeight: "500" }}>
                  {patient.dob ? new Date(patient.dob).toLocaleDateString() : "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Gender</div>
                <div style={{ fontSize: "13px", color: "var(--text-heading)", fontWeight: "500", textTransform: "capitalize" }}>
                  {patient.gender || "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Patient Since</div>
                <div style={{ fontSize: "13px", color: "var(--text-heading)", fontWeight: "500" }}>
                  {new Date(patient.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Timeline & Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Note Input */}
          <div style={{ 
            background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", padding: "20px",
            border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)"
          }}>
            <form onSubmit={handleAddNote}>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Leave a note about this patient..."
                style={{ 
                  width: "100%", minHeight: "80px", padding: "12px", borderRadius: "8px", 
                  border: "1px solid var(--border-color)", background: "var(--surface-hover)",
                  fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "var(--text-heading)", color: "#fff", border: "none",
                    padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", 
                    cursor: newNote.trim() ? "pointer" : "not-allowed", opacity: newNote.trim() ? 1 : 0.5
                  }}
                >
                  {addingNote ? <Spinner /> : <><Plus size={16} /> Add Note</>}
                </button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-heading)", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} /> Activity Timeline
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {timelineItems.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-lg)" }}>
                  No activity found for this patient yet.
                </div>
              ) : (
                timelineItems.map((item, index) => {
                  if (item.type === "note") {
                    const note = item.data;
                    return (
                      <div key={note.id} style={{ display: "flex", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <MessageSquare size={14} color="#6b7280" />
                          </div>
                          {index !== timelineItems.length - 1 && <div style={{ width: "2px", flex: 1, background: "var(--border-color)", marginTop: "8px" }} />}
                        </div>
                        <div style={{ flex: 1, background: "var(--surface-overlay)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-lg)", marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-heading)" }}>
                              Note left by {note.staff ? `${note.staff.first_name} ${note.staff.last_name}` : "Staff"}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {item.date.toLocaleDateString()} {item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", color: "var(--text-body)", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                            {note.content}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    const booking = item.data;
                    return (
                      <div key={booking.id} style={{ display: "flex", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Calendar size={14} color="#3b82f6" />
                          </div>
                          {index !== timelineItems.length - 1 && <div style={{ width: "2px", flex: 1, background: "var(--border-color)", marginTop: "8px" }} />}
                        </div>
                        <div style={{ flex: 1, background: "var(--surface-overlay)", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-lg)", marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-heading)" }}>
                              Appointment Booked
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {item.date.toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ fontSize: "14px", color: "var(--text-heading)", fontWeight: "500", marginBottom: "4px" }}>
                            {booking.slot.service.name}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {new Date(booking.slot.starts_at).toLocaleDateString()} at {new Date(booking.slot.starts_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {booking.slot.provider ? ` • Dr. ${booking.slot.provider.last_name}` : ""}
                            </div>
                            <Badge variant={booking.status === "confirmed" ? "success" : booking.status === "cancelled" ? "error" : "default"}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
