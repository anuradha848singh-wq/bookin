"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, X, CheckCircle } from "lucide-react";

interface Service { id: string; name: string; price: string; duration: number; }
interface Slot { id: string; starts_at: string; ends_at: string; status: string; service: Service; }
interface Booking { id: string; slot_id: string; patient_phone: string; status: string; slot: Slot; }

interface CalendarClientProps {
  initialSlots: Slot[];
  initialBookings: Booking[];
  services: Service[];
  clinicName: string;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CalendarClient({ initialSlots, initialBookings, services, clinicName }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedEvent, setSelectedEvent] = useState<{ type: "slot" | "booking", data: any } | null>(null);

  // Helper to get dates for the current week view
  const weekDates = useMemo(() => {
    const dates = [];
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); 
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      dates.push(day);
    }
    // reset curr
    curr.setDate(curr.getDate() - 7);
    return dates;
  }, [currentDate]);

  // Navigate calendar
  const nextWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
  const prevWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
  const goToday = () => setCurrentDate(new Date());

  // Filter slots and bookings to current week
  const visibleBookings = useMemo(() => {
    return initialBookings.filter(b => {
      const d = new Date(b.slot.starts_at);
      return d >= weekDates[0]! && d <= new Date(weekDates[6]!.getTime() + 86400000);
    });
  }, [initialBookings, weekDates]);

  const visibleSlots = useMemo(() => {
    return initialSlots.filter(s => {
      const d = new Date(s.starts_at);
      return d >= weekDates[0]! && d <= new Date(weekDates[6]!.getTime() + 86400000) && s.status === "available";
    });
  }, [initialSlots, weekDates]);

  // Calculate CSS top/height based on time (8 AM to 8 PM)
  const getGridPosition = (dateStr: string, durationMins: number) => {
    const d = new Date(dateStr);
    const hour = d.getHours();
    const min = d.getMinutes();
    
    // Grid starts at 8 AM (hour 8)
    if (hour < 8 || hour > 20) return { display: "none" };
    
    const minutesFrom8AM = (hour - 8) * 60 + min;
    const pxPerMinute = 80 / 60; // 80px per hour row
    
    return {
      top: `${minutesFrom8AM * pxPerMinute}px`,
      height: `${durationMins * pxPerMinute}px`
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      
      {/* ── Toolbar ── */}
      <div style={{
        padding: "20px 32px", borderBottom: "1px solid #f0f0f0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>
            {weekDates[0]?.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h1>
          
          <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <button onClick={prevWeek} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#6b7280" }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={goToday} style={{ background: "none", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "#374151" }}>
              Today
            </button>
            <button onClick={nextWeek} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#6b7280" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", background: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
            <button style={{ background: viewMode === "week" ? "#fff" : "none", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: viewMode === "week" ? "#111827" : "#6b7280", boxShadow: viewMode === "week" ? "0 1px 2px rgba(0,0,0,0.05)" : "none", cursor: "pointer" }} onClick={() => setViewMode("week")}>Week</button>
            <button style={{ background: viewMode === "day" ? "#fff" : "none", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: viewMode === "day" ? "#111827" : "#6b7280", boxShadow: viewMode === "day" ? "0 1px 2px rgba(0,0,0,0.05)" : "none", cursor: "pointer" }} onClick={() => setViewMode("day")}>Day</button>
          </div>
          <button style={{ background: "#111827", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer" }}>
            + Create Block
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        
        {/* ── CSS Grid Calendar Area ── */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }} className="main-scroll">
          
          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", borderBottom: "1px solid #f0f0f0", background: "#fdfdfd", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ padding: "16px 8px", borderRight: "1px solid #f0f0f0" }} /> {/* Time column header */}
            {weekDates.map((date, i) => {
              const isToday = date?.toDateString() === new Date().toDateString();
              return (
                <div key={i} style={{ padding: "16px 12px", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: isToday ? "#e8334a" : "#6b7280", textTransform: "uppercase" }}>{DAYS[i]?.slice(0, 3)}</span>
                  <span style={{ fontSize: "22px", fontWeight: "700", color: isToday ? "#e8334a" : "#111827", marginTop: "4px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: isToday ? "#ffe4e6" : "transparent" }}>
                    {date?.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Grid Body */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", flex: 1, position: "relative" }}>
            
            {/* Background Grid Lines & Times */}
            <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "subgrid" }}>
              {HOURS.map(hour => (
                <React.Fragment key={hour}>
                  {/* Time label */}
                  <div style={{ gridColumn: "1 / 2", height: "80px", borderRight: "1px solid #f0f0f0", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "flex-end", paddingRight: "8px", paddingTop: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "500", color: "#9ca3af" }}>
                      {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                    </span>
                  </div>
                  {/* Day cells */}
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <div key={`${hour}-${day}`} style={{ gridColumn: `${day + 2} / ${day + 3}`, height: "80px", borderRight: "1px solid #f0f0f0", borderBottom: "1px solid #f9fafb" }} />
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Events Overlay (Absolute Positioning within Columns) */}
            {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
              const currentDayDate = weekDates[dayIdx]?.toDateString();
              
              const daySlots = visibleSlots.filter(s => new Date(s.starts_at).toDateString() === currentDayDate);
              const dayBookings = visibleBookings.filter(b => new Date(b.slot.starts_at).toDateString() === currentDayDate);

              return (
                <div key={`col-${dayIdx}`} style={{ gridColumn: `${dayIdx + 2} / ${dayIdx + 3}`, gridRow: "1 / -1", position: "relative", pointerEvents: "none" }}>
                  
                  {/* Render Available Slots */}
                  {daySlots.map(slot => {
                    const pos = getGridPosition(slot.starts_at, slot.service.duration);
                    return (
                      <div key={`slot-${slot.id}`} 
                        onClick={() => setSelectedEvent({ type: "slot", data: slot })}
                        style={{
                          position: "absolute", left: "4px", right: "4px", ...pos,
                          background: "#f0fdf4", border: "1px dashed #86efac", borderRadius: "6px",
                          pointerEvents: "auto", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 150ms"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
                      >
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#166534" }}>Available</span>
                      </div>
                    );
                  })}

                  {/* Render Bookings */}
                  {dayBookings.map(booking => {
                    const pos = getGridPosition(booking.slot.starts_at, booking.slot.service.duration);
                    const bgColor = booking.status === "confirmed" ? "#eff6ff" : booking.status === "pending" ? "#fef3c7" : "#f3f4f6";
                    const borderColor = booking.status === "confirmed" ? "#93c5fd" : booking.status === "pending" ? "#fcd34d" : "#d1d5db";
                    const textColor = booking.status === "confirmed" ? "#1e40af" : booking.status === "pending" ? "#92400e" : "#4b5563";
                    
                    return (
                      <div key={`booking-${booking.id}`} 
                        onClick={() => setSelectedEvent({ type: "booking", data: booking })}
                        style={{
                          position: "absolute", left: "4px", right: "4px", ...pos,
                          background: bgColor, border: `1px solid ${borderColor}`, borderRadius: "6px",
                          padding: "6px 8px", pointerEvents: "auto", cursor: "pointer",
                          display: "flex", flexDirection: "column", overflow: "hidden",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)", zIndex: 5,
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "700", color: textColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {booking.patient_phone || "Anonymous"}
                        </span>
                        <span style={{ fontSize: "10px", fontWeight: "500", color: textColor, opacity: 0.8, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {booking.slot.service.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}

          </div>
        </div>

        {/* ── Slide-Out Dossier Panel ── */}
        {selectedEvent && (
          <div style={{
            width: "340px", flexShrink: 0, borderLeft: "1px solid #f0f0f0", background: "#fff",
            display: "flex", flexDirection: "column", boxShadow: "-4px 0 15px rgba(0,0,0,0.02)",
            animation: "slideInRight 200ms ease-out"
          }}>
            {/* Dossier Header */}
            <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>
                {selectedEvent.type === "booking" ? "Booking Dossier" : "Slot Details"}
              </h2>
              <button onClick={() => setSelectedEvent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                <X size={18} />
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
              {selectedEvent.type === "booking" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Patient Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700" }}>
                      {(selectedEvent.data.patient_phone || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>{selectedEvent.data.patient_phone || "Anonymous"}</div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Patient • 4 Past Visits</div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>Service</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{selectedEvent.data.slot.service.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>Time</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>
                        {new Date(selectedEvent.data.slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>Price</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>${selectedEvent.data.slot.service.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button style={{ width: "100%", padding: "10px", background: "#111827", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      Mark as Completed
                    </button>
                    <button style={{ width: "100%", padding: "10px", background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      Reschedule
                    </button>
                    <button style={{ width: "100%", padding: "10px", background: "#fff", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              )}

              {selectedEvent.type === "slot" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "16px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#166534", margin: "0 0 4px 0" }}>Available Slot</h3>
                    <p style={{ fontSize: "13px", color: "#15803d", margin: 0 }}>This time block is open for online booking.</p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Clock size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                        {new Date(selectedEvent.data.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CalendarIcon size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                        {new Date(selectedEvent.data.starts_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button style={{ width: "100%", padding: "10px", background: "#e8334a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "16px" }}>
                    Manual Booking (Override)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      <style>{`
        .main-scroll::-webkit-scrollbar { width: 4px; }
        .main-scroll::-webkit-scrollbar-track { background: transparent; }
        .main-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
