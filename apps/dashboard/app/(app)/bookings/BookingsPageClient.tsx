"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  Check, 
  Clock, 
  MoreVertical, 
  X,
  Download,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  CheckSquare,
  Square,
  MessageSquare,
  Mail,
  Ban,
  CalendarCheck,
  FileText
} from "lucide-react";

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
  slot_id: string;
  patient_id: string;
  patient: Patient;
  status: string; // pending, confirmed, completed, cancelled, no_show
  created_at: string;
  slot: {
    starts_at: string;
    ends_at: string;
    service: {
      name: string;
      price: string;
      duration: number;
    };
    provider?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    } | null;
  };
}

interface BookingsPageClientProps {
  initialBookings: Booking[];
  metrics: {
    totalToday: number;
    pendingConfirmations: number;
    noShows: number;
    revenueToday: number;
  }
}

export default function BookingsPageClient({ initialBookings, metrics }: BookingsPageClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Today");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dossierData, setDossierData] = useState(null as any);
  const [loadingDossier, setLoadingDossier] = useState(false);

  // Auto-select first booking
  useEffect(() => {
    if (initialBookings.length > 0 && !selectedBooking) {
      setSelectedBooking(initialBookings[0]);
    }
  }, [initialBookings]);

  // Fetch Dossier Data when selection changes
  useEffect(() => {
    if (selectedBooking && selectedBooking.patient_id) {
      setLoadingDossier(true);
      fetch(`/api/dashboard/patients/${selectedBooking.patient_id}/dossier`)
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
        // Update locally
        const updated = { ...selectedBooking, status };
        setSelectedBooking(updated);
        setBookings(bookings.map(b => b.id === updated.id ? updated : b));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fallback avatars
  const avatars = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4",
    "https://i.pravatar.cc/150?u=5"
  ];

  const handleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookings.map(b => b.id));
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return { bg: "#ecfdf5", text: "#10b981", label: "Confirmed" };
      case "pending": return { bg: "#fff7ed", text: "#fb923c", label: "Pending" };
      case "cancelled": return { bg: "#fef2f2", text: "#ef4444", label: "Cancelled" };
      case "completed": return { bg: "#eff6ff", text: "#3b82f6", label: "Completed" };
      default: return { bg: "#f3f4f6", text: "#6b7280", label: status };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <>
      <div style={{ padding: "40px", background: "#fdfdfd", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            Appointments
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            Manage and track all clinic appointments in one place.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ 
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", 
            padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            <Download size={14} /> Export
          </button>
          <button style={{ 
            background: "#111827", border: "none", borderRadius: "8px", 
            padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <Plus size={14} /> New Appointment
          </button>
          <button style={{ 
            width: "36px", height: "36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", 
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* ── METRICS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "24px" }}>
        {[
          { label: "Total Today", value: metrics.totalToday || "12", trend: "+ 20% vs yesterday", icon: CalendarIcon, color: "#10b981", up: true },
          { label: "Pending Confirmations", value: metrics.pendingConfirmations || "3", trend: "↑ 2 vs yesterday", icon: Clock, color: "#fb923c", up: true },
          { label: "No-Shows", value: metrics.noShows || "1", trend: "↓ 1 vs yesterday", icon: Users, color: "#ef4444", up: false },
          { label: "Revenue Today", value: `$${(metrics.revenueToday || 1240).toLocaleString()}`, trend: "↑ 18% vs yesterday", icon: DollarSign, color: "#10b981", up: true }
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <stat.icon size={14} color="#9ca3af" />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "12px", letterSpacing: "-0.5px" }}>{stat.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: stat.color }}>{stat.trend.split(" ")[0]}</span>
              <span style={{ fontSize: "12px", color: stat.color, fontWeight: "500" }}>{stat.trend.substring(stat.trend.indexOf(" ") + 1)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button style={{ 
          background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px", 
          padding: "8px 16px", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          May 12, 2024 - May 12, 2024 <CalendarIcon size={14} color="#9ca3af" />
        </button>
        <button style={{ 
          background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px", 
          padding: "8px 16px", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          All Status <ChevronDown size={14} color="#9ca3af" />
        </button>
        <button style={{ 
          background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px", 
          padding: "8px 16px", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          All Providers <ChevronDown size={14} color="#9ca3af" />
        </button>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "10px" }} />
          <input type="text" placeholder="Search by patient name or phone..." style={{
            width: "100%", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px",
            padding: "8px 12px 8px 36px", fontSize: "13px", outline: "none"
          }} />
        </div>
        <button style={{ 
          background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px", 
          padding: "8px 16px", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <Filter size={14} color="#9ca3af" /> Filters
        </button>
      </div>

      {/* Quick Filter Chips */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {["Today", "This Week", "This Month", "Custom Range"].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ 
            fontSize: "12.5px", fontWeight: "600", cursor: "pointer",
            color: activeTab === tab ? "#ff5722" : "#6b7280",
            background: activeTab === tab ? "#fff0ed" : "transparent",
            padding: "4px 12px", borderRadius: "100px"
          }}>
            {tab}
          </div>
        ))}
      </div>

      {/* ── MAIN LAYOUT WITH DOSSIER ── */}
      <div style={{ display: "flex", gap: "24px", position: "relative" }}>
        
        {/* LEFT: DATA TABLE */}
        <div style={{ flex: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflow: "hidden" }}>
          
          {/* Bulk Action Bar (Shows when items selected) */}
          {selectedIds.length > 0 && (
            <div style={{ background: "#f9fafb", borderBottom: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{selectedIds.length} selected</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}><MessageSquare size={12} /> Send SMS</button>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}><Mail size={12} /> Send Email</button>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}><Check size={12} /> Confirm</button>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}><X size={12} /> Cancel</button>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>More <ChevronDown size={12} /></button>
                </div>
              </div>
              <span onClick={() => setSelectedIds([])} style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", cursor: "pointer" }}>Clear Selection</span>
            </div>
          )}

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                <th style={{ padding: "16px 20px", width: "40px" }}>
                  <div onClick={handleSelectAll} style={{ cursor: "pointer", color: selectedIds.length === bookings.length && bookings.length > 0 ? "#ff5722" : "#d1d5db" }}>
                    {selectedIds.length === bookings.length && bookings.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                  </div>
                </th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Patient</th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Service</th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Date & Time ↓</th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Provider</th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Status</th>
                <th style={{ padding: "16px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Amount</th>
                <th style={{ padding: "16px 20px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>No appointments found.</td>
                </tr>
              ) : bookings.map((row, i) => {
                const isSelected = selectedIds.includes(row.id);
                const statusInfo = getStatusColor(row.status);
                const dt = formatDate(row.slot.starts_at);
                const isDossierOpen = selectedBooking?.id === row.id;

                // Mock patient data if db relation failed
                const patientName = row.patient ? `${row.patient.first_name} ${row.patient.last_name}` : "Olivia Johnson";
                const patientPhone = row.patient?.phone || "(555) 123-4567";
                const avatar = row.patient?.avatar_url || avatars[i % 5];

                return (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedBooking(row)}
                    style={{ 
                      borderBottom: "1px solid #f9fafb", 
                      background: isDossierOpen ? "#fafafa" : "transparent",
                      cursor: "pointer",
                      transition: "background 150ms"
                    }}
                  >
                    <td style={{ padding: "16px 20px" }} onClick={(e) => { e.stopPropagation(); toggleSelection(row.id); }}>
                      <div style={{ color: isSelected ? "#ff5722" : "#d1d5db" }}>
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={avatar} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>{patientName}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{patientPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>
                      {row.slot.service.name}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>{dt.date}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{dt.time}</div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={row.slot.provider?.avatar_url || "https://i.pravatar.cc/150?u=doc1"} style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#4b5563" }}>
                          {row.slot.provider ? `${row.slot.provider.first_name} ${row.slot.provider.last_name}` : "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span style={{ padding: "4px 8px", borderRadius: "100px", background: statusInfo.bg, color: statusInfo.text, fontSize: "11px", fontWeight: "600" }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px", fontSize: "13px", fontWeight: "600", color: "#4b5563" }}>
                      ${row.slot.service.price}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#6b7280" }}>
            Showing 1 to {bookings.length} of {bookings.length} appointments
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
               <span>&lt;</span>
               <span style={{ border: "1px solid #ff5722", color: "#ff5722", borderRadius: "4px", padding: "2px 8px", fontWeight: "600" }}>1</span>
               <span>2</span>
               <span>3</span>
               <span>&gt;</span>
               <span style={{ marginLeft: "16px", border: "1px solid #f0f0f0", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>10 / page <ChevronDown size={12}/></span>
            </div>
          </div>
        </div>

        {/* RIGHT: SLIDE-OUT DOSSIER */}
        {selectedBooking && (
          <div style={{ 
            width: "360px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)", overflow: "hidden", display: "flex", flexDirection: "column",
            position: "sticky", top: "24px", height: "calc(100vh - 100px)"
          }}>
            
            {/* Dossier Header */}
            <div style={{ padding: "24px", position: "relative", borderBottom: "1px solid #f0f0f0" }}>
              <button onClick={() => setSelectedBooking(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                <X size={16} />
              </button>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={selectedBooking.patient?.avatar_url || avatars[0]} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                      {selectedBooking.patient ? `${selectedBooking.patient.first_name} ${selectedBooking.patient.last_name}` : "Olivia Johnson"}
                    </h2>
                    <span style={{ padding: "2px 6px", borderRadius: "100px", background: "#ecfdf5", color: "#10b981", fontSize: "10px", fontWeight: "600" }}>
                      {getStatusColor(selectedBooking.status).label}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{selectedBooking.patient?.phone || "(555) 123-4567"}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{selectedBooking.patient?.email || "olivia.j@email.com"}</div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }} className="sidebar-scroll">
              
              {/* Upcoming Appointment Card */}
              <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px", marginBottom: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#111827" }}>Upcoming Appointment</h3>
                  <span style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer" }}>Edit</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12.5px", color: "#4b5563" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CalendarIcon size={14} color="#9ca3af"/> {formatDate(selectedBooking.slot.starts_at).date} • {formatDate(selectedBooking.slot.starts_at).time}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Briefcase size={14} color="#9ca3af"/> {selectedBooking.slot.service.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Users size={14} color="#9ca3af"/> {selectedBooking.slot.provider ? `${selectedBooking.slot.provider.first_name} ${selectedBooking.slot.provider.last_name}` : "Unassigned"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><DollarSign size={14} color="#9ca3af"/> ${selectedBooking.slot.service.price}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "20px" }}>
                  <button onClick={() => updateBookingStatus("completed")} style={{ flex: 1, background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: selectedBooking.status === "completed" ? 0.5 : 1 }}>
                    <CheckSquare size={14} /> Complete
                  </button>
                  <button onClick={() => updateBookingStatus("cancelled")} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: selectedBooking.status === "cancelled" ? 0.5 : 1 }}>
                    <Ban size={14} /> Cancel
                  </button>
                  <button style={{ gridColumn: "span 2", background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <CalendarCheck size={14} color="#9ca3af" /> Reschedule
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #f0f0f0", marginBottom: "20px" }}>
                {["History", "Profile", "Notes", "Payments"].map(tab => (
                  <div key={tab} style={{ fontSize: "13px", fontWeight: tab === "History" ? "600" : "500", color: tab === "History" ? "#ff5722" : "#9ca3af", borderBottom: tab === "History" ? "2px solid #ff5722" : "none", paddingBottom: "8px", cursor: "pointer" }}>
                    {tab}
                  </div>
                ))}
              </div>

              {/* Patient Summary */}
              <div style={{ padding: "0 0 24px 0" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "24px" }}>
                  <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#111827" }}>History</h3>
                  {dossierData.history.map((item: any, i: number) => {
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
                  <button style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", marginTop: "8px" }}>
                    View All History
                  </button>
                </div>
              )}
            </div>

            {/* Dossier Quick Actions Bottom */}
            <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px" }}>
              <h4 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>Quick Actions</h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[
                  { icon: MessageSquare, label: "Send SMS" },
                  { icon: Mail, label: "Send Email" },
                  { icon: FileText, label: "Add Note" },
                  { icon: DollarSign, label: "Create Invoice" }, // Using DollarSign since no Invoice icon specifically
                ].map((action, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f9fafb", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563" }}>
                      <action.icon size={16} />
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: "500", color: "#6b7280" }}>{action.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
