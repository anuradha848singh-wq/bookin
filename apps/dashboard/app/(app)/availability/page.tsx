"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, ShieldAlert, Check, Save, AlertCircle, HelpCircle, Trash2, CheckCircle, Plus } from "lucide-react";
import { Badge, Spinner, useToast } from "@book-in/ui";
import { parseTimeToMinutes } from "@book-in/lib/time";

interface Break {
  start: string;
  end: string;
}

interface WorkingDaysConfig {
  start: string;
  end: string;
  days: number[]; // 1=Mon, 7=Sun
  breaks: Break[];
  blockedDates: string[]; // "YYYY-MM-DD"
  advanceWindow: number;
  minimumNotice: number;
}

interface Booking {
  id: string;
  slot_id: string;
  patient_phone: string;
  status: string;
  slot: {
    starts_at: string;
  };
}



export default function AvailabilityPage() {
  const [workingDays, setWorkingDays] = useState<WorkingDaysConfig>({
    start: "09:00",
    end: "18:00",
    days: [1, 2, 3, 4, 5, 6],
    breaks: [{ start: "13:00", end: "14:00" }],
    blockedDates: [],
    advanceWindow: 30,
    minimumNotice: 1,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  // Block date warning modal
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [targetBlockDate, setTargetBlockDate] = useState<string | null>(null);
  const [overlappingBookings, setOverlappingBookings] = useState<Booking[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Availability config
      const availRes = await fetch("/api/dashboard/availability");
      const availData = await availRes.json();
      if (!availRes.ok) throw new Error(availData.error || "Failed to load availability settings");
      setWorkingDays(availData.workingDays);

      // 2. Fetch all bookings to perform calendar overlaps
      const bookingsRes = await fetch("/api/dashboard/bookings?status=all");
      const bookingsData = await bookingsRes.json();
      if (bookingsRes.ok) {
        setBookings(bookingsData.bookings || []);
      }
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workingDays),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save availability settings");

      addToast("Availability configurations successfully saved live!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle active weekday
  const handleToggleDay = (day: number) => {
    setWorkingDays((prev) => {
      const days = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day].sort();
      return { ...prev, days };
    });
  };

  // Add/remove weekly breaks
  const handleAddBreak = () => {
    setWorkingDays((prev) => ({
      ...prev,
      breaks: [...prev.breaks, { start: "13:00", end: "14:00" }],
    }));
  };

  const handleRemoveBreak = (idx: number) => {
    setWorkingDays((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== idx),
    }));
  };

  const handleBreakTimeChange = (idx: number, field: "start" | "end", val: string) => {
    setWorkingDays((prev) => {
      const breaks = prev.breaks.map((b, i) =>
        i === idx ? { ...b, [field]: val } : b
      );
      return { ...prev, breaks };
    });
  };

  // Copy Monday's active hours/breaks to all weekdays (Tuesday to Friday)
  const handleCopyMonToWeekdays = () => {
    setWorkingDays((prev) => ({
      ...prev,
      days: Array.from(new Set([...prev.days, 1, 2, 3, 4, 5])), // Enable Mon-Fri
    }));
    addToast("Applied Monday scheduling defaults to Tue-Fri.", "info");
  };

  // Calendar blocked dates helpers
  const handleCalendarDayClick = (dateStr: string) => {
    const isBlocked = workingDays.blockedDates.includes(dateStr);
    
    if (isBlocked) {
      // Unblock directly
      setWorkingDays((prev) => ({
        ...prev,
        blockedDates: prev.blockedDates.filter((d) => d !== dateStr),
      }));
      addToast(`Date ${dateStr} unblocked successfully.`, "info");
    } else {
      // Block date: check if active bookings exist on this date!
      const overlaps = bookings.filter((b: any) => {
        const bDate = new Date(b.slot.starts_at);
        const yyyy = bDate.getFullYear();
        const mm = String(bDate.getMonth() + 1).padStart(2, "0");
        const dd = String(bDate.getDate()).padStart(2, "0");
        const bDateStr = `${yyyy}-${mm}-${dd}`;
        return bDateStr === dateStr && ["pending", "confirmed"].includes(b.status);
      });

      if (overlaps.length > 0) {
        setTargetBlockDate(dateStr);
        setOverlappingBookings(overlaps);
        setWarningModalOpen(true);
      } else {
        // Block directly
        setWorkingDays((prev) => ({
          ...prev,
          blockedDates: [...prev.blockedDates, dateStr],
        }));
        addToast(`Date ${dateStr} is now blocked for bookings.`, "success");
      }
    }
  };

  const confirmBlockAnyway = () => {
    if (!targetBlockDate) return;
    setWorkingDays((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, targetBlockDate],
    }));
    setWarningModalOpen(false);
    addToast(`Blocked date ${targetBlockDate} despite bookings.`, "success");
    setTargetBlockDate(null);
    setOverlappingBookings([]);
  };

  // Calculate calendar dates for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const totalDays = endOfMonth.getDate();
  const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday, 6 = Saturday

  const calendarCells = [];
  // Fill preceding empty cells
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Fill actual dates
  for (let i = 1; i <= totalDays; i++) {
    const cellDate = new Date(year, month, i);
    const yyyy = cellDate.getFullYear();
    const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
    const dd = String(cellDate.getDate()).padStart(2, "0");
    calendarCells.push(`${yyyy}-${mm}-${dd}`);
  }

  // Parse time hours to minutes for the horizontal 24h visual timeline preview
  const startMin = parseTimeToMinutes(workingDays.start);
  const endMin = parseTimeToMinutes(workingDays.end);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-12) 0" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
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
            color: "#fff",
            marginBottom: "4px"
          }}>
            Availability Rules
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
            Manage working shifts, custom lunch breaks, notice times, and blocked dates.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-button admin-button-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px", height: "38px" }}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Grid: 2 columns on desktop (Working Hours & Calendar blockers) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Section 1: Weekly Hours Shift Grid */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} style={{ color: "var(--color-primary-400)" }} />
              Weekly Operating Shifts
            </h3>
            
            <button
              onClick={handleCopyMonToWeekdays}
              className="admin-button admin-button-secondary"
              style={{ height: "30px", fontSize: "11px", padding: "0 10px" }}
            >
              Apply Mon-Fri Defaults
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            {/* Global working hour limits */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                Start Operations
              </label>
              <input
                type="time"
                className="admin-input"
                value={workingDays.start}
                onChange={(e) => setWorkingDays((prev) => ({ ...prev, start: e.target.value }))}
                style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)", height: "36px" }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                End Operations
              </label>
              <input
                type="time"
                className="admin-input"
                value={workingDays.end}
                onChange={(e) => setWorkingDays((prev) => ({ ...prev, end: e.target.value }))}
                style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)", height: "36px" }}
              />
            </div>
          </div>

          {/* Mon-Sun Day Toggles rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {[
              { id: 1, label: "Monday" },
              { id: 2, label: "Tuesday" },
              { id: 3, label: "Wednesday" },
              { id: 4, label: "Thursday" },
              { id: 5, label: "Friday" },
              { id: 6, label: "Saturday" },
              { id: 7, label: "Sunday" }
            ].map((day) => {
              const active = workingDays.days.includes(day.id);
              return (
                <div 
                  key={day.id} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: active ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.1)",
                    border: "0.5px solid rgba(255,255,255,0.04)",
                    borderRadius: "var(--radius-sm)",
                    justifyContent: "space-between"
                  }}
                >
                  <span style={{ fontSize: "13px", color: active ? "#fff" : "var(--color-text-tertiary)", fontWeight: active ? 600 : 400 }}>
                    {day.label}
                  </span>
                  
                  <button
                    onClick={() => handleToggleDay(day.id)}
                    style={{
                      background: active ? "var(--color-primary-600)" : "rgba(255,255,255,0.05)",
                      border: "none",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {active ? "ON" : "OFF"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Lunch Breaks Section */}
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                Shifts Lunch Breaks
              </h4>
              <button
                type="button"
                onClick={handleAddBreak}
                className="admin-button admin-button-secondary"
                style={{ height: "26px", fontSize: "10px", padding: "0 8px", display: "inline-flex", alignItems: "center", gap: "2px" }}
              >
                <Plus size={10} /> Add Break
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {workingDays.breaks.map((brk, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="time"
                    className="admin-input"
                    value={brk.start}
                    onChange={(e) => handleBreakTimeChange(idx, "start", e.target.value)}
                    style={{ height: "32px", fontSize: "12px", width: "110px", background: "none" }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>to</span>
                  <input
                    type="time"
                    className="admin-input"
                    value={brk.end}
                    onChange={(e) => handleBreakTimeChange(idx, "end", e.target.value)}
                    style={{ height: "32px", fontSize: "12px", width: "110px", background: "none" }}
                  />
                  <button
                    onClick={() => handleRemoveBreak(idx)}
                    style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-error-500)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-tertiary)"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              {workingDays.breaks.length === 0 && (
                <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>No lunch breaks configured.</p>
              )}
            </div>
          </div>

          {/* Visual CSS-based horizontal Time timeline Bar */}
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
            <h4 style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
              Visual Shift Timeline (24h Strip)
            </h4>
            
            <div style={{
              width: "100%",
              height: "24px",
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Active Operations highlight segment */}
              <div style={{
                position: "absolute",
                left: `${(startMin / 1440) * 100}%`,
                width: `${((endMin - startMin) / 1440) * 100}%`,
                height: "100%",
                background: "var(--color-primary-600)",
                opacity: 0.8
              }} />

              {/* Break segments overlay */}
              {workingDays.breaks.map((b, i) => {
                const bStart = parseTimeToMinutes(b.start);
                const bEnd = parseTimeToMinutes(b.end);
                return (
                  <div 
                    key={i} 
                    style={{
                      position: "absolute",
                      left: `${(bStart / 1440) * 100}%`,
                      width: `${((bEnd - bStart) / 1440) * 100}%`,
                      height: "100%",
                      background: "rgba(0,0,0,0.55)",
                      borderLeft: "0.5px solid rgba(255,255,255,0.2)",
                      borderRight: "0.5px solid rgba(255,255,255,0.2)"
                    }}
                    title="Lunch Break"
                  />
                );
              })}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--color-text-tertiary)", marginTop: "4px" }}>
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>

        {/* Section 2: Calendar Click Date Blockout tool */}
        <div className="admin-card" style={{ flex: 1 }}>
          <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <Calendar size={16} style={{ color: "var(--color-primary-400)" }} />
            Blocked Operational Calendar ({now.toLocaleString("en-US", { month: "long" })})
          </h3>

          <p style={{ color: "var(--color-text-secondary)", fontSize: "12px", marginBottom: "16px", lineHeight: 1.4 }}>
            Click dates below to block client bookings (e.g. holidays or leaves). Active block dates render with a diagonal red-shaded cross overlay.
          </p>

          {/* 7 columns calendar grid headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px", textAlign: "center" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((h) => (
              <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Calendar dates cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
            {calendarCells.map((cellDateStr, idx) => {
              if (!cellDateStr) {
                return <div key={`empty-${idx}`} style={{ paddingBottom: "100%", background: "none" }} />;
              }

              const isBlocked = workingDays.blockedDates.includes(cellDateStr as string);
              const dayNum = parseInt((cellDateStr as string).split("-")[2] || "0", 10);

              // Check if bookings exist on this day for warning indicators
              const hasBookings = bookings.some((b: any) => {
                const bDate = new Date(b.slot.starts_at);
                const yyyy = bDate.getFullYear();
                const mm = String(bDate.getMonth() + 1).padStart(2, "0");
                const dd = String(bDate.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}` === cellDateStr && ["pending", "confirmed"].includes(b.status);
              });

              return (
                <button
                  key={cellDateStr}
                  onClick={() => handleCalendarDayClick(cellDateStr)}
                  style={{
                    border: "0.5px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    background: isBlocked 
                      ? "repeating-linear-gradient(45deg, rgba(239,68,68,0.2), rgba(239,68,68,0.2) 6px, rgba(239,68,68,0.05) 6px, rgba(239,68,68,0.05) 12px)" 
                      : "rgba(255,255,255,0.02)",
                    paddingBottom: "100%",
                    cursor: "pointer",
                    position: "relative",
                    width: "100%"
                  }}
                  title={isBlocked ? "Blocked date" : "Available date"}
                >
                  <span style={{
                    position: "absolute",
                    top: "6px",
                    left: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isBlocked ? "#f87171" : "#fff"
                  }}>
                    {dayNum}
                  </span>

                  {/* Warning Dot if bookings scheduled */}
                  {hasBookings && !isBlocked && (
                    <span style={{
                      position: "absolute",
                      bottom: "6px",
                      right: "6px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#fbbf24",
                      boxShadow: "0 0 6px #fbbf24"
                    }} title="Bookings Scheduled!" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Booking Advance bounds notice dropdowns */}
        <div className="admin-card" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Advance Booking Window
            </h4>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "11px", marginBottom: "8px" }}>
              Sets the furthest future date patients can schedule (e.g. up to 30 days).
            </p>
            <select
              className="admin-input"
              value={workingDays.advanceWindow}
              onChange={(e) => setWorkingDays((prev) => ({ ...prev, advanceWindow: parseInt(e.target.value) }))}
              style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)", height: "36px" }}
            >
              <option value="7" style={{ background: "#111" }}>7 Days</option>
              <option value="14" style={{ background: "#111" }}>14 Days</option>
              <option value="30" style={{ background: "#111" }}>30 Days</option>
              <option value="60" style={{ background: "#111" }}>60 Days</option>
              <option value="90" style={{ background: "#111" }}>90 Days</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Minimum Cancellation Notice
            </h4>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "11px", marginBottom: "8px" }}>
              Avoid last-minute slots by enforcing notice periods (e.g. minimum 2 hours).
            </p>
            <select
              className="admin-input"
              value={workingDays.minimumNotice}
              onChange={(e) => setWorkingDays((prev) => ({ ...prev, minimumNotice: parseInt(e.target.value) }))}
              style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.06)", height: "36px" }}
            >
              <option value="0" style={{ background: "#111" }}>Immediate / No notice</option>
              <option value="1" style={{ background: "#111" }}>1 Hour Notice</option>
              <option value="2" style={{ background: "#111" }}>2 Hours Notice</option>
              <option value="4" style={{ background: "#111" }}>4 Hours Notice</option>
              <option value="24" style={{ background: "#111" }}>24 Hours Notice</option>
            </select>
          </div>
        </div>
      </div>



      {/* ══════════════════════════════════════════
         WARNING MODAL: DATE OVERLAPS ACTIVE SESSIONS
         ══════════════════════════════════════════ */}
      {warningModalOpen && targetBlockDate && (
        <div className="modal-overlay" onClick={() => setWarningModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldAlert size={24} style={{ color: "#fbbf24" }} />
              <h4 className="modal-title">Active Bookings Exist on {targetBlockDate}</h4>
            </div>
            
            <p className="modal-desc" style={{ fontSize: "13px" }}>
              This date has <strong>{overlappingBookings.length} scheduled appointment(s)</strong> already booked! Blocking this day prevents any future patient bookings, but existing bookings will remain valid. 
            </p>

            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "8px 12px",
              fontSize: "11px",
              maxHeight: "100px",
              overflowY: "auto"
            }}>
              <span style={{ color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>Affected Patients:</span>
              <ul style={{ listStyle: "none", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {overlappingBookings.map((b: any) => (
                  <li key={b.id} style={{ color: "#fff" }}>
                    📞 {b.patient_phone} ({new Date(b.slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                onClick={() => setWarningModalOpen(false)}
                className="admin-button admin-button-secondary"
                style={{ height: "38px" }}
              >
                Go Back
              </button>
              <button
                onClick={confirmBlockAnyway}
                className="admin-button admin-button-primary"
                style={{ height: "38px", background: "var(--color-warning-600)", border: "none" }}
              >
                Block Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation details */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toastIn {
          from { transform: translateY(-20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}



