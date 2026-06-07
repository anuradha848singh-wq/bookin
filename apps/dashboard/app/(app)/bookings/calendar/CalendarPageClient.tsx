"use client";

import React, { useState } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  Clock,
  Briefcase,
  Users,
  DollarSign,
  X,
  CalendarCheck,
  CheckSquare,
  Ban,
  MessageSquare,
  Mail,
  FileText,
  CreditCard,
  History,
  User as UserIcon,
  Bell,
  Check
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: string;
  duration: number;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
}

interface Booking {
  id: string;
  status: string;
  patient?: Patient;
  patient_phone?: string;
  slot: {
    starts_at: string;
    ends_at: string;
    service: Service;
    provider?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    } | null;
  };
}

interface CalendarClientProps {
  initialSlots: any[];
  initialBookings: Booking[];
  services: Service[];
  staff?: any[];
  clinicName: string;
}

export default function CalendarClient({ initialBookings, services, staff = [], clinicName }: CalendarClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dossierData, setDossierData] = useState(null as any);
  const [loadingDossier, setLoadingDossier] = useState(false);

  // Auto-select first booking
  React.useEffect(() => {
    if (initialBookings.length > 0 && !selectedBooking) {
      setSelectedBooking(initialBookings[0]);
    }
  }, [initialBookings]);

  // Fetch Dossier Data
  React.useEffect(() => {
    if (selectedBooking && selectedBooking.patient) {
      setLoadingDossier(true);
      fetch(`/api/dashboard/patients/${selectedBooking.patient.id}/dossier`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDossierData(data.dossier);
          setLoadingDossier(false);
        })
        .catch(() => setLoadingDossier(false));
    }
  }, [selectedBooking]);

  const updateBookingStatus = async (status: string) => {
    if (!selectedBooking) return;
    try {
      const res = await fetch("/api/dashboard/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedBooking.id, status })
      });
      const data = await res.json();
      if (data.success) {
        // Here we ideally refetch or lift state up, but we'll manually update selected
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Hardcode hours for the grid (8 AM to 8 PM)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  const days = ["Sun 12", "Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return { bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0", label: "Confirmed" };
      case "pending": return { bg: "#fff7ed", text: "#fb923c", border: "#fed7aa", label: "Pending" };
      case "cancelled": return { bg: "#fef2f2", text: "#ef4444", border: "#fecaca", label: "Cancelled" };
      case "completed": return { bg: "#eff6ff", text: "#3b82f6", border: "#bfdbfe", label: "Completed" };
      default: return { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb", label: status };
    }
  };

  const getProviderColor = (idx: number) => {
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
    return colors[idx % colors.length];
  };

  const avatars = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4",
    "https://i.pravatar.cc/150?u=5"
  ];

  // Helper to place mock blocks in the grid
  // In a real app, this maps `starts_at` to the specific day column and pixel top
  const renderBookingBlock = (col: number, startHour: number, durationHours: number, title: string, sub: string, status: string, providerIdx: number, originalBooking?: Booking) => {
    const top = (startHour - 8) * 80 + 40; // 80px per hour, offset for header
    const height = durationHours * 80;
    
    // Slight background tint based on provider or status
    const isSelected = selectedBooking?.id === originalBooking?.id;

    return (
      <div 
        key={originalBooking?.id || `${col}-${startHour}`}
        onClick={() => originalBooking && setSelectedBooking(originalBooking)}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `calc(${(col / 7) * 100}% + 4px)`,
          width: `calc(${100 / 7}% - 8px)`,
          height: `${height - 4}px`,
          background: isSelected ? "#fff" : `${getProviderColor(providerIdx)}15`,
          border: isSelected ? `2px solid ${getProviderColor(providerIdx)}` : `1px solid ${getProviderColor(providerIdx)}40`,
          borderRadius: "6px",
          padding: "6px 8px",
          cursor: "pointer",
          zIndex: isSelected ? 10 : 1,
          boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
          transition: "all 150ms",
          overflow: "hidden"
        }}
      >
        <div style={{ fontSize: "10px", fontWeight: "600", color: getProviderColor(providerIdx), marginBottom: "2px" }}>
          {Math.floor(startHour)}:{((startHour % 1) * 60).toString().padStart(2, '0')} - {Math.floor(startHour + durationHours)}:{(((startHour + durationHours) % 1) * 60).toString().padStart(2, '0')}
        </div>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#111827", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
          {title}
        </div>
        <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
          {sub}
        </div>
      </div>
    );
  };

  const formatDateStr = (isoString: string) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#fff", fontFamily: "var(--font-body)" }}>
      
      {/* ── TOP NAV BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>Calendar</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>View and manage all appointments.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "10px" }} />
            <input type="text" placeholder="Search patients, appointments..." style={{
              width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px",
              padding: "8px 12px 8px 36px", fontSize: "13px", outline: "none"
            }} />
            <div style={{ position: "absolute", right: "8px", top: "8px", fontSize: "10px", color: "#9ca3af", fontWeight: "600", background: "#e5e7eb", padding: "2px 4px", borderRadius: "4px" }}>
              ⌘K
            </div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", position: "relative" }}>
            <Bell size={20} />
            <div style={{ position: "absolute", top: "0", right: "0", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
          </button>
          <button style={{ 
            background: "#111827", border: "none", borderRadius: "8px", 
            padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <Plus size={14} /> New Appointment <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT (3 COLUMNS) ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* LEFT SIDEBAR (Filters & Team) */}
        <div style={{ width: "240px", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflowY: "auto" }} className="sidebar-scroll">
          
          {/* Mini Calendar */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>May 2024</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <ChevronLeft size={16} color="#9ca3af" style={{ cursor: "pointer" }} />
                <ChevronRight size={16} color="#9ca3af" style={{ cursor: "pointer" }} />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center", fontSize: "11px", fontWeight: "600", color: "#9ca3af", marginBottom: "8px" }}>
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center", fontSize: "12px", color: "#4b5563" }}>
              {[28,29,30,1,2,3,4,5,6,7,8,9,10,11].map((d, i) => (
                <div key={`cal1-${i}`} style={{ padding: "6px 0", color: i < 3 ? "#d1d5db" : "#4b5563" }}>{d}</div>
              ))}
              <div style={{ padding: "6px 0", background: "#ff5722", color: "#fff", borderRadius: "50%", fontWeight: "700" }}>12</div>
              {[13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1].map((d, i) => (
                <div key={`cal2-${i}`} style={{ padding: "6px 0", color: i > 18 ? "#d1d5db" : "#4b5563" }}>{d}</div>
              ))}
            </div>

            <button style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", marginTop: "16px" }}>
              Today
            </button>
          </div>

          <div style={{ height: "1px", background: "#f0f0f0", margin: "0 20px" }} />

          {/* Team Members */}
          <div style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0", letterSpacing: "0.5px" }}>Team Members</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", background: "#fff0ed", borderRadius: "8px", color: "#ff5722", cursor: "pointer" }}>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>All Providers</span>
                <Check size={14} />
              </div>
              {staff.length > 0 ? staff.map((doc, i) => (
                <div key={doc.id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", borderRadius: "8px", cursor: "pointer", transition: "background 150ms" }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={doc.avatar_url || `https://i.pravatar.cc/150?u=doc${i+1}`} style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
                    <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>{doc.first_name} {doc.last_name}</span>
                  </div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getProviderColor(i) }} />
                </div>
              )) : (
                <div style={{ padding: "8px", fontSize: "12px", color: "#9ca3af" }}>No providers found.</div>
              )}
            </div>
          </div>

          <div style={{ height: "1px", background: "#f0f0f0", margin: "0 20px" }} />

          {/* Filters */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#111827", margin: 0, letterSpacing: "0.5px" }}>Filters</h3>
              <span style={{ fontSize: "11px", color: "#6b7280", cursor: "pointer" }}>Clear</span>
            </div>
            
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#ff5722" }} /> <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /> Confirmed
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#ff5722" }} /> <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fb923c" }} /> Pending
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#ff5722" }} /> <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} /> Cancelled
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#ff5722" }} /> <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} /> Completed
              </label>
            </div>

            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Services</div>
            <select style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", marginBottom: "20px", background: "#fff" }}>
              <option>All Services</option>
              {services.map(s => <option key={s.id}>{s.name}</option>)}
            </select>

            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Show</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
               <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#ff5722" }} /> Weekends
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "#ff5722" }} /> Working Hours Only
              </label>
            </div>

          </div>

        </div>

        {/* MIDDLE CALENDAR GRID */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          
          {/* Calendar Toolbar */}
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "4px" }}>
              <button style={{ border: "none", background: "transparent", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#6b7280", cursor: "pointer" }}>Day</button>
              <button style={{ border: "none", background: "#fff", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#111827", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}>Week</button>
              <button style={{ border: "none", background: "transparent", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#6b7280", cursor: "pointer" }}>Provider View</button>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button style={{ width: "36px", height: "36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4b5563" }}><ChevronLeft size={16} /></button>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                <CalendarCheck size={14} color="#9ca3af" /> May 12 – 18, 2024
              </div>
              <button style={{ width: "36px", height: "36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4b5563" }}><ChevronRight size={16} /></button>
              
              <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>
                Today
              </button>
            </div>
          </div>

          {/* Grid Scroll Area */}
          <div style={{ flex: 1, overflow: "auto", position: "relative" }} className="sidebar-scroll">
            
            {/* Header Row (Days) */}
            <div style={{ display: "flex", position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: "60px", flexShrink: 0, borderRight: "1px solid #f0f0f0" }}></div>
              <div style={{ display: "flex", flex: 1 }}>
                {days.map((d, i) => (
                  <div key={d} style={{ flex: 1, padding: "16px 0", textAlign: "center", borderRight: "1px solid #f0f0f0", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: i === 0 ? "#111827" : "#6b7280", fontWeight: "600" }}>{d.split(" ")[0]}</span>
                      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: i === 0 ? "#ff5722" : "transparent", color: i === 0 ? "#fff" : "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>{d.split(" ")[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All-day row */}
            <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: "60px", padding: "8px 0", textAlign: "center", fontSize: "10px", color: "#9ca3af", fontWeight: "600", borderRight: "1px solid #f0f0f0" }}>All-day</div>
              <div style={{ flex: 1, display: "flex" }}>
                {days.map(d => <div key={d} style={{ flex: 1, borderRight: "1px solid #f0f0f0" }}></div>)}
              </div>
            </div>

            {/* Timetable Grid */}
            <div style={{ position: "relative", height: `${hours.length * 80}px` }}>
              {/* Background Lines */}
              {hours.map((h, i) => (
                <div key={h} style={{ position: "absolute", top: `${i * 80}px`, left: 0, width: "100%", height: "80px", display: "flex" }}>
                  <div style={{ width: "60px", textAlign: "center", fontSize: "10px", color: "#9ca3af", fontWeight: "600", borderRight: "1px solid #f0f0f0", transform: "translateY(-6px)" }}>
                    {h > 12 ? h - 12 : h} {h >= 12 ? "PM" : "AM"}
                  </div>
                  <div style={{ flex: 1, display: "flex" }}>
                    {days.map(d => <div key={d} style={{ flex: 1, borderRight: "1px solid #f0f0f0", borderBottom: "1px solid #f9fafb" }}></div>)}
                  </div>
                </div>
              ))}

              {/* Current Time Line (Mocked at 10:15 AM) */}
              <div style={{ position: "absolute", top: `${2.25 * 80}px`, left: "60px", width: "calc(100% - 60px)", height: "1px", background: "#ff5722", zIndex: 15 }} />
              <div style={{ position: "absolute", top: `${2.25 * 80 - 6}px`, left: "15px", fontSize: "10px", color: "#ff5722", fontWeight: "700", background: "#fff", padding: "0 4px", zIndex: 16 }}>
                10:15 AM
              </div>

              {/* Appointment Blocks */}
              <div style={{ position: "absolute", top: 0, left: "60px", width: "calc(100% - 60px)", height: "100%", zIndex: 5 }}>
                
                {initialBookings.map((b, idx) => {
                  const d = new Date(b.slot.starts_at);
                  const dayIdx = d.getDay();
                  const startHour = d.getHours() + (d.getMinutes() / 60);
                  const durationHours = b.slot.service.duration ? (b.slot.service.duration / 60) : 1;
                  
                  if (startHour >= 8 && startHour <= 20) {
                     return renderBookingBlock(dayIdx, startHour, durationHours, b.patient?.first_name ? `${b.patient.first_name} ${b.patient.last_name}` : "Patient", b.slot.service.name, b.status, idx % 4, b);
                  }
                  return null;
                })}

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (DOSSIER) */}
        {selectedBooking && (
          <div style={{ width: "320px", borderLeft: "1px solid #f0f0f0", background: "#fdfdfd", display: "flex", flexDirection: "column", overflowY: "auto" }} className="sidebar-scroll">
            
            {/* Header */}
            <div style={{ padding: "24px", position: "relative", borderBottom: "1px solid #f0f0f0" }}>
              <button onClick={() => setSelectedBooking(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                <X size={16} />
              </button>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img src={selectedBooking.patient?.avatar_url || avatars[0]} style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                    {selectedBooking.patient ? `${selectedBooking.patient.first_name} ${selectedBooking.patient.last_name}` : "Mia Anderson"}
                  </h2>
                  <span style={{ padding: "2px 6px", borderRadius: "100px", background: "#ecfdf5", color: "#10b981", fontSize: "10px", fontWeight: "600" }}>
                    {getStatusColor(selectedBooking.status).label}
                  </span>
                </div>
                
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{selectedBooking.patient?.phone || "(555) 987-6543"} • {selectedBooking.patient?.email || "mia@example.com"}</div>
              </div>
            </div>

            {/* Tabs (Details, History, Notes, Payments, Files) */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
              {[
                { label: "Details", icon: FileText, active: true },
                { label: "History", icon: History, active: false },
                { label: "Notes", icon: MessageSquare, active: false },
                { label: "Payments", icon: CreditCard, active: false },
              ].map(tab => (
                <div key={tab.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: tab.active ? "#ff5722" : "#9ca3af", cursor: "pointer" }}>
                  <tab.icon size={16} />
                  <span style={{ fontSize: "10px", fontWeight: tab.active ? "600" : "500" }}>{tab.label}</span>
                  {tab.active && <div style={{ width: "20px", height: "2px", background: "#ff5722", borderRadius: "2px", marginTop: "4px" }} />}
                </div>
              ))}
            </div>

            {/* Appointment Details */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#111827" }}>Appointment Details</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer" }}>Edit</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px", color: "#4b5563" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CalendarCheck size={14} color="#9ca3af"/> {formatDateStr(selectedBooking.slot.starts_at).date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Clock size={14} color="#9ca3af"/> {formatDateStr(selectedBooking.slot.starts_at).time} ({selectedBooking.slot.service.duration}m)</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Briefcase size={14} color="#9ca3af"/> {selectedBooking.slot.service.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><UserIcon size={14} color="#9ca3af"/> {selectedBooking.slot.provider ? `${selectedBooking.slot.provider.first_name} ${selectedBooking.slot.provider.last_name}` : "Unassigned"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><DollarSign size={14} color="#9ca3af"/> ${selectedBooking.slot.service.price}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getStatusColor(selectedBooking.status).text, marginLeft: "4px" }} />
                  <span style={{ color: getStatusColor(selectedBooking.status).text, fontWeight: "500" }}>{getStatusColor(selectedBooking.status).label}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
                <button onClick={() => updateBookingStatus("completed")} style={{ flex: 1, background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: selectedBooking.status === "completed" ? 0.5 : 1 }}>
                  <CheckSquare size={14} /> Complete
                </button>
                <button onClick={() => updateBookingStatus("cancelled")} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: selectedBooking.status === "cancelled" ? 0.5 : 1 }}>
                  <Ban size={14} /> Cancel
                </button>
              </div>
            </div>

            {/* Patient Summary */}
            <div style={{ padding: "0 24px 24px 24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>Patient Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", background: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px" }}>Total Spent</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>${dossierData?.totalSpent?.toLocaleString() || "0"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px" }}>Total Visits</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>{dossierData?.totalVisits || 0}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px" }}>Last Visit</div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#111827" }}>
                    {dossierData?.lastVisit ? new Date(dossierData.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline (History) */}
            {dossierData?.history && (
              <div style={{ padding: "0 24px 24px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#111827" }}>History</h3>
                {dossierData.history.slice(0, 4).map((item: any, i: number) => {
                  const itemColor = getStatusColor(item.status);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ fontSize: "12px", color: "#6b7280", width: "70px", flexShrink: 0, fontWeight: "500", paddingTop: "2px" }}>
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{item.serviceName}</div>
                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>{item.providerName}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>${item.price}</div>
                        <div style={{ fontSize: "10px", fontWeight: "600", color: itemColor.text, marginTop: "2px", textTransform: "capitalize" }}>{item.status}</div>
                      </div>
                    </div>
                  );
                })}
                <button style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", marginTop: "4px" }}>
                  View All History
                </button>
              </div>
            )}

            {/* Quick Actions Bottom */}
            <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px 24px" }}>
              <h4 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>Quick Actions</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {[
                  { icon: MessageSquare, label: "Send SMS" },
                  { icon: Mail, label: "Send Email" },
                  { icon: FileText, label: "Add Note" },
                  { icon: CalendarCheck, label: "Reschedule" },
                ].map((action, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                      <action.icon size={14} />
                    </div>
                    <span style={{ fontSize: "9px", fontWeight: "500", color: "#6b7280", textAlign: "center", lineHeight: 1.1 }}>{action.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
