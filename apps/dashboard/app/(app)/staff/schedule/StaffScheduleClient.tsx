"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Bell, Plus, MoreHorizontal, Filter, Mail, Phone, MapPin, Briefcase, Award, 
  ChevronDown, Clock, Calendar, AlertCircle, Edit, Trash2, CheckCircle2, AlertTriangle, UserPlus, FileText, Activity, Save
} from "lucide-react";

export default function StaffScheduleClient() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>("Monday");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Active staff object
  const activeStaff = staffList.find(s => s.id === selectedStaffId) || null;

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/staff");
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.staff || []).map((s: any) => ({
          ...s,
          name: `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Unnamed",
          status: s.deleted_at ? "Inactive" : "Active"
        }));
        setStaffList(mapped);
        if (mapped.length > 0 && !selectedStaffId) {
          setSelectedStaffId(mapped[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch staff", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeStaff) return;
    setIsSaving(true);
    try {
      // Split name into first and last
      const nameParts = activeStaff.name.split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";
      
      const payload = {
        ...activeStaff,
        first_name,
        last_name
      };
      
      // If it's a new staff member and still has the temp "new-" ID, remove the ID so the DB creates it
      if (payload.id && payload.id.startsWith("new-")) {
        delete payload.id;
      }

      const res = await fetch("/api/dashboard/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Refresh or show success toast
        await fetchStaff();
      }
    } catch (e) {
      console.error("Failed to save", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = () => {
    const newId = "new-" + Date.now();
    const newStaff = {
      id: newId,
      name: "New Staff Member",
      role: "Provider",
      status: "Active",
      email: "",
      phone: "",
      schedules: [
        { day_of_week: 1, is_active: true, start_time: "09:00", end_time: "17:00" },
        { day_of_week: 2, is_active: true, start_time: "09:00", end_time: "17:00" },
        { day_of_week: 3, is_active: true, start_time: "09:00", end_time: "17:00" },
        { day_of_week: 4, is_active: true, start_time: "09:00", end_time: "17:00" },
        { day_of_week: 5, is_active: true, start_time: "09:00", end_time: "17:00" },
      ]
    };
    setStaffList([...staffList, newStaff]);
    setSelectedStaffId(newId);
  };

  // Convert raw DB schedules into UI format
  const getWeeklyScheduleUI = (staff: any) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    return days.map((dayName, idx) => {
      // Find schedule for this day (DB day_of_week might be 0=Sunday)
      const sched = staff?.schedules?.find((s: any) => s.day_of_week === idx);
      
      if (!sched || !sched.is_active) {
        return { day: dayName, active: false, start: "-", end: "-", breaks: "0 break", interval: "-", max: 0, dbId: sched?.id };
      }
      
      return { 
        day: dayName, 
        active: true, 
        start: sched.start_time || "09:00 AM", 
        end: sched.end_time || "05:00 PM", 
        breaks: "0 break", 
        interval: "30 min", 
        max: 16,
        dbId: sched.id
      };
    });
  };

  const weeklySchedule = getWeeklyScheduleUI(activeStaff);

  const toggleDayActive = (dayIdx: number) => {
    if (!activeStaff) return;
    
    // Create deep copy
    const updatedStaffList = [...staffList];
    const staffIndex = updatedStaffList.findIndex(s => s.id === activeStaff.id);
    const staff = updatedStaffList[staffIndex];
    
    if (!staff.schedules) staff.schedules = [];
    
    const schedIndex = staff.schedules.findIndex((s: any) => s.day_of_week === dayIdx);
    
    if (schedIndex >= 0) {
      staff.schedules[schedIndex].is_active = !staff.schedules[schedIndex].is_active;
    } else {
      staff.schedules.push({
        day_of_week: dayIdx,
        is_active: true,
        start_time: "09:00",
        end_time: "17:00"
      });
    }
    
    setStaffList(updatedStaffList);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fdfdfd", fontFamily: "var(--font-body)" }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ padding: "32px 40px 24px 40px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Staff & Provider Scheduling</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Manage provider availability, services, time off and scheduling preferences.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ position: "relative", width: "280px" }}>
            <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              type="text" 
              placeholder="Search patients, appointments, staff..." 
              style={{ width: "100%", padding: "8px 12px 8px 36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", outline: "none" }}
            />
            <div style={{ position: "absolute", right: "8px", top: "8px", fontSize: "10px", fontWeight: "600", color: "#9ca3af", background: "#f3f4f6", padding: "2px 4px", borderRadius: "4px" }}>⌘K</div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || !activeStaff}
            style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={handleCreateNew} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} /> Add Staff Member
          </button>
          <button style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <MoreHorizontal size={16} color="#4b5563" />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT (3 COLUMNS) ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* COLUMN 1: Staff List */}
        <div style={{ width: "280px", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", background: "#fff", flexShrink: 0 }}>
          <div style={{ padding: "24px 20px 16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>All Staff</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>{staffList.length}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "10px" }} />
                <input type="text" placeholder="Search staff..." style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "13px", outline: "none" }} />
              </div>
              <button style={{ width: "36px", height: "36px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Filter size={14} color="#4b5563" />
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px 12px" }} className="sidebar-scroll">
            {isLoading ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Loading staff...</div>
            ) : staffList.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>No staff found.</div>
            ) : staffList.map((staff) => (
              <div 
                key={staff.id} 
                onClick={() => setSelectedStaffId(staff.id)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", cursor: "pointer",
                  background: selectedStaffId === staff.id ? "#f5f3ff" : "transparent",
                  border: selectedStaffId === staff.id ? "1px solid #ede9fe" : "1px solid transparent",
                  transition: "0.2s"
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontWeight: "bold" }}>
                  {staff.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: selectedStaffId === staff.id ? "#111827" : "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{staff.name}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{staff.role}</div>
                </div>
                <div style={{ 
                  fontSize: "9px", fontWeight: "700", padding: "2px 6px", borderRadius: "100px",
                  background: staff.status === "Active" ? "#ecfdf5" : "#fff7ed",
                  color: staff.status === "Active" ? "#10b981" : "#ff5722",
                }}>
                  {staff.status || "Active"}
                </div>
              </div>
            ))}
            
            <button onClick={handleCreateNew} style={{ width: "100%", background: "#fff", border: "1px dashed #d1d5db", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: "600", color: "#4b5563", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px", cursor: "pointer" }}>
              <Plus size={16} /> Add Staff Member
            </button>
          </div>
        </div>

        {/* COLUMN 2: Staff Details & Settings */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fdfdfd" }} className="sidebar-scroll">
          {activeStaff ? (
            <div style={{ padding: "32px 40px" }}>
              
              {/* Profile Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: "24px", fontWeight: "bold", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    {activeStaff.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <input 
                        type="text" 
                        value={activeStaff.name} 
                        onChange={(e) => {
                          const updated = [...staffList];
                          const idx = updated.findIndex(s => s.id === activeStaff.id);
                          updated[idx].name = e.target.value;
                          setStaffList(updated);
                        }}
                        style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#111827", border: "1px dashed transparent", background: "transparent", outline: "none", width: "250px" }} 
                      />
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "100px", background: activeStaff.status === "Active" ? "#ecfdf5" : "#f3f4f6", color: activeStaff.status === "Active" ? "#10b981" : "#4b5563" }}>
                        {activeStaff.status || "Active"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#4b5563", marginBottom: "8px", fontWeight: "500" }}>
                      <input 
                        type="text" 
                        value={activeStaff.role} 
                        placeholder="Role (e.g. Dentist)"
                        onChange={(e) => {
                          const updated = [...staffList];
                          const idx = updated.findIndex(s => s.id === activeStaff.id);
                          updated[idx].role = e.target.value;
                          setStaffList(updated);
                        }}
                        style={{ background: "transparent", border: "none", outline: "none", color: "#4b5563", fontWeight: "500", width: "120px" }}
                      />
                      <span style={{ color: "#d1d5db" }}>•</span>
                      <span>License: {activeStaff.license_number || "Not set"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#6b7280" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {activeStaff.email || "No email"}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {activeStaff.phone || "No phone"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>View Profile</button>
                  <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>More Actions <ChevronDown size={14} /></button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #f0f0f0", marginBottom: "32px" }}>
                {["Schedule & Availability", "Services & Skills", "Time Off", "Preferences", "Notes", "Performance", "Activity Log"].map(tab => (
                  <div key={tab} style={{ fontSize: "13px", fontWeight: tab === "Schedule & Availability" ? "600" : "500", color: tab === "Schedule & Availability" ? "#ff5722" : "#6b7280", borderBottom: tab === "Schedule & Availability" ? "2px solid #ff5722" : "none", paddingBottom: "12px", cursor: "pointer" }}>
                    {tab}
                  </div>
                ))}
              </div>

              {/* Weekly Schedule Section */}
              <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>Weekly Schedule</h3>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>Copy from template <ChevronDown size={14} /></button>
                    <button style={{ background: "#fff0ed", color: "#ff5722", border: "1px solid #ffdcd3", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><Plus size={14} /> Add Custom Hours</button>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 20px 0" }}>Set regular weekly availability for this staff member.</p>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "100px" }}>Day</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "80px" }}>Available</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "130px" }}>Start Time</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "130px" }}>End Time</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "120px" }}>Breaks</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "110px" }}>Slot Interval</th>
                      <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "140px", textAlign: "center" }}>Max Daily Bookings</th>
                      <th style={{ padding: "12px 8px", width: "40px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySchedule.map((row, i) => {
                      const dayIdx = i; // 0=Sunday
                      return (
                        <React.Fragment key={i}>
                          <tr style={{ borderBottom: expandedDay === row.day ? "none" : "1px solid #f9fafb", opacity: row.active ? 1 : 0.6 }}>
                            <td style={{ padding: "16px 8px", fontSize: "13px", fontWeight: "600", color: "#111827" }}>{row.day}</td>
                            <td style={{ padding: "16px 8px" }}>
                              <div onClick={() => toggleDayActive(dayIdx)} style={{ width: "36px", height: "20px", borderRadius: "100px", background: row.active ? "#ff5722" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "0.2s" }}>
                                <div style={{ position: "absolute", top: "2px", left: row.active ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
                              </div>
                            </td>
                            <td style={{ padding: "16px 8px" }}>
                              {row.active ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "8px 10px", fontSize: "13px", color: "#111827", fontWeight: "500", width: "95px" }}>
                                  {row.start} <Clock size={12} color="#9ca3af" />
                                </div>
                              ) : <span style={{ color: "#9ca3af" }}>-</span>}
                            </td>
                            <td style={{ padding: "16px 8px" }}>
                              {row.active ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "8px 10px", fontSize: "13px", color: "#111827", fontWeight: "500", width: "95px" }}>
                                  {row.end} <Clock size={12} color="#9ca3af" />
                                </div>
                              ) : <span style={{ color: "#9ca3af" }}>-</span>}
                            </td>
                            <td style={{ padding: "16px 8px" }}>
                              {row.active ? (
                                <div onClick={() => setExpandedDay(expandedDay === row.day ? null : row.day)} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563", cursor: "pointer" }}>
                                  {row.breaks} <ChevronDown size={14} color="#9ca3af" style={{ transform: expandedDay === row.day ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
                                </div>
                              ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>{row.breaks}</span>}
                            </td>
                            <td style={{ padding: "16px 8px" }}>
                              {row.active ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563" }}>
                                  {row.interval} <ChevronDown size={14} color="#9ca3af" />
                                </div>
                              ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>-</span>}
                            </td>
                            <td style={{ padding: "16px 8px", textAlign: "center" }}>
                              {row.active ? (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#111827", fontWeight: "500" }}>
                                  {row.max}
                                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "4px solid #9ca3af", cursor: "pointer" }} />
                                    <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #9ca3af", cursor: "pointer" }} />
                                  </div>
                                </div>
                              ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>0</span>}
                            </td>
                            <td style={{ padding: "16px 8px", textAlign: "right" }}>
                              <MoreHorizontal size={16} color="#d1d5db" style={{ cursor: "pointer" }} />
                            </td>
                          </tr>
                          {expandedDay === row.day && row.active && (
                            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td colSpan={8} style={{ padding: "0 8px 24px 8px" }}>
                                <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#4b5563", display: "flex", alignItems: "center", gap: "8px" }}>
                                      <ChevronDown size={14} /> Breaks for {row.day}
                                    </div>
                                    <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "11px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><Plus size={12} /> Add Break</button>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "12px 16px", borderRadius: "6px", border: "1px solid #f0f0f0" }}>
                                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>01:00 PM - 02:00 PM</div>
                                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff5722" }} /> Lunch Break</div>
                                      <Trash2 size={14} color="#d1d5db" style={{ cursor: "pointer" }} />
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Split Bottom Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                
                {/* Services Assigned */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111827" }}>Services Assigned</h3>
                    <button style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>Manage Services</button>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#6b7280", margin: "0 0 16px 0" }}>Select the services this provider can perform.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "4px 0" }}>
                    {[
                      { name: "General Consultation", min: "30 min", checked: true },
                      { name: "Follow-up Visit", min: "15 min", checked: true },
                      { name: "Physiotherapy Session", min: "60 min", checked: false },
                      { name: "Dental Checkup", min: "45 min", checked: true },
                    ].map((service, i) => (
                      <label key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: service.checked ? "#111827" : "#6b7280", fontWeight: service.checked ? "500" : "400" }}>
                          <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: service.checked ? "#ff5722" : "#fff", border: service.checked ? "none" : "1px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {service.checked && <CheckCircle2 size={12} color="#fff" />}
                          </div>
                          {service.name}
                        </div>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{service.min}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scheduling Preferences */}
                <div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>Scheduling Preferences</h3>
                  <p style={{ fontSize: "12.5px", color: "#6b7280", margin: "0 0 20px 0" }}>Configure how appointments are booked for this staff.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>Booking Mode</div>
                      <div style={{ width: "160px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", fontWeight: "500", color: "#111827", cursor: "pointer" }}>Round Robin <ChevronDown size={14} color="#9ca3af" /></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>Buffer Before</div>
                      <div style={{ width: "160px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", fontWeight: "500", color: "#111827", cursor: "pointer" }}>15 min <ChevronDown size={14} color="#9ca3af" /></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af", fontSize: "14px" }}>
              Select a staff member from the left panel.
            </div>
          )}
        </div>

        {/* COLUMN 3: Time Off & Overview */}
        <div style={{ width: "320px", borderLeft: "1px solid #f0f0f0", display: "flex", flexDirection: "column", background: "#fff", flexShrink: 0, overflowY: "auto" }} className="sidebar-scroll">
          <div style={{ padding: "32px 24px" }}>
            
            {/* Time Off / Vacations */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700", color: "#111827" }}>Time Off / Vacations</h3>
              <p style={{ margin: "0 0 20px 0", fontSize: "11px", color: "#6b7280" }}>Block dates when this staff is unavailable.</p>
              
              <button style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Plus size={16} /> Add Time Off
              </button>
            </div>

            {/* Availability Overview */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Availability Overview</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "600", color: "#4b5563", background: "#f9fafb", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e5e7eb", cursor: "pointer" }}>
                  This Month <ChevronDown size={12} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Total Working Days</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>20 <span style={{ fontSize: "10px", fontWeight: "600", color: "#9ca3af" }}>days</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Total Available Hours</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>160h</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Total Appointments</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>128</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Utilization Rate</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>80%</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#10b981", background: "#ecfdf5", padding: "2px 6px", borderRadius: "100px" }}>↑ 6%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
