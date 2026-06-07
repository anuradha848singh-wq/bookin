"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingDown,
  MoreVertical,
  ChevronRight,
  Plus,
  ChevronDown,
  FileText,
  Clock,
  BarChart2
} from "lucide-react";

interface TodayPageClientProps {
  initialBookings: any[];
  clinicName: string;
  clinicSlug: string;
  userEmail: string;
  totalBookings: number;
  totalPatients: number;
  todaySessions: number;
  grossRevenue: number;
  areaData: { x: string; v: number }[];
  xTicks: string[];
  donutData: { name: string; v: number; pct: string; c: string }[];
  recentAppts: { id: string; name: string; svc: string; time: string; status: string; ac: string }[];
  topServices: { name: string; n: number; pct: number }[];
  upcomingAppts: { patient: string; svc: string; time: string; ac: string }[];
}

export default function TodayPageClient({
  clinicName,
  userEmail,
  totalBookings,
  totalPatients,
  todaySessions,
  grossRevenue,
  donutData,
  recentAppts,
  topServices,
  upcomingAppts,
  initialBookings,
}: TodayPageClientProps) {

  const displayName = userEmail ? userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1) : "Doctor";
  
  // Custom Donut Chart component for "Appointments Status"
  const DonutChart = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff5722" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="40" style={{ transition: "all 1s ease" }} />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fb923c" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="220" style={{ transition: "all 1s ease", transformOrigin: "center", transform: "rotate(280deg)" }} />
          </svg>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#111827", lineHeight: "1" }}>12</span>
            <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", marginTop: "2px" }}>Total</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff5722" }} /><span style={{ fontSize: "12px", color: "#4b5563" }}>Confirmed</span></div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>10</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fb923c" }} /><span style={{ fontSize: "12px", color: "#4b5563" }}>Pending</span></div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>1</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d1d5db" }} /><span style={{ fontSize: "12px", color: "#4b5563" }}>Cancelled</span></div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>1</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} /><span style={{ fontSize: "12px", color: "#4b5563" }}>Completed</span></div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>0</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#fdfdfd", fontFamily: "var(--font-body)" }}>
      
      {/* ── TOP BAR (Instant Toolbar) ── */}
      <div style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", 
        padding: "16px 40px", background: "#fff", borderBottom: "1px solid #f0f0f0",
        position: "sticky", top: 0, zIndex: 10, flexShrink: 0
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>
            Good morning, Dr. {displayName} 👋
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Here's what's happening with your clinic today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ 
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", 
            padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            Customize
          </button>
          <button style={{ 
            background: "#111827", border: "none", borderRadius: "8px", 
            padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <Plus size={14} /> New Appointment <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>
          <button style={{ 
            width: "36px", height: "36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", 
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            <Calendar size={16} color="#4b5563" />
          </button>
        </div>
      </div>

      <div style={{ padding: "40px", overflowY: "auto", flex: 1 }} className="main-scroll">

      {/* ── METRICS ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "24px" }}>
        {[
          { label: "Today's Appointments", value: todaySessions || "12", trend: "+ 20% vs yesterday", icon: Calendar, color: "#10b981", trendUp: true },
          { label: "Total Patients", value: totalPatients || "328", trend: "+ 18 this month", icon: Users, color: "#10b981", trendUp: true },
          { label: "Revenue This Month", value: `$${grossRevenue.toLocaleString() || "4,280"}`, trend: "+ 12% vs last month", icon: DollarSign, color: "#10b981", trendUp: true },
          { label: "No-Show Rate", value: "3.2%", trend: "↓ 1.4% vs last month", icon: TrendingDown, color: "#10b981", trendUp: true } // Image shows green down arrow
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

      {/* ── MIDDLE ROW (3 Columns) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: "24px", marginBottom: "24px" }}>
        
        {/* Col 1: Upcoming Schedule */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: 0 }}>Upcoming Schedule</h3>
            <Link href="/bookings/calendar" style={{ fontSize: "12px", fontWeight: "600", color: "#111827", textDecoration: "none", cursor: "pointer" }}>View Calendar</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {upcomingAppts.length === 0 ? (
              <div style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No upcoming appointments today.</div>
            ) : upcomingAppts.map((appt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "13px", color: "#6b7280", width: "65px", fontWeight: "500" }}>{appt.time}</div>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff5722" }} />
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#4b5563", fontSize: "12px" }}>
                    {appt.patient.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>{appt.patient}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>{appt.svc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ecfdf5", padding: "4px 8px", borderRadius: "100px", color: "#10b981", fontSize: "11px", fontWeight: "600" }}>
                  Confirmed <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
          {upcomingAppts.length > 5 && <div style={{ marginTop: "24px", fontSize: "13px", fontWeight: "600", color: "#ff5722", cursor: "pointer" }}>+ {upcomingAppts.length - 5} more appointments</div>}
        </div>

        {/* Col 2: Recent Activity */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: 0 }}>Recent Activity</h3>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>View All</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {recentAppts.length === 0 ? (
              <div style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No recent activity.</div>
            ) : recentAppts.slice(0, 5).map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>New appointment</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{act.name} • {act.time}</div>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{act.ac}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Status, Services, Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Appointments Status */}
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 20px 0" }}>Appointments Status</h3>
            <DonutChart />
          </div>

          {/* Top Services */}
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>Top Services</h3>
              <Link href="/services" style={{ fontSize: "11px", fontWeight: "600", color: "#111827", textDecoration: "none", cursor: "pointer" }}>View All</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {topServices.length === 0 ? (
                <div style={{ fontSize: "12px", color: "#6b7280" }}>No services booked yet.</div>
              ) : topServices.slice(0, 5).map((svc, i) => {
                // Determine a color based on index
                const colors = ["#ff5722", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];
                const color = colors[i % colors.length];
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{svc.name}</span>
                      <span>{Math.round(svc.pct)}%</span>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${svc.pct}%`, height: "100%", background: color, borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                { icon: Users, label: "Add New Patient" },
                { icon: FileText, label: "Create Invoice" },
                { icon: Calendar, label: "Send Message" }, // Re-using icons for simplicity
                { icon: Clock, label: "Add Block Time" },
                { icon: FileText, label: "Create Form" },
                { icon: BarChart2, label: "View Reports" },
              ].map((action, i) => (
                <button key={i} style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between", 
                  width: "100%", padding: "10px", background: "transparent", border: "none", 
                  borderRadius: "8px", cursor: "pointer" 
                }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4b5563" }}>
                    <action.icon size={16} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{action.label}</span>
                  </div>
                  <ChevronRight size={14} color="#9ca3af" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM ROW: Today's Appointments Table ── */}
      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: 0 }}>Today's Appointments</h3>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", fontWeight: "600" }}>
            <span style={{ color: "#4b5563" }}>12 Total</span>
            <span style={{ color: "#10b981" }}>10 Confirmed</span>
            <span style={{ color: "#fb923c" }}>1 Pending</span>
            <span style={{ color: "#9ca3af" }}>1 Cancelled</span>
          </div>
        </div>
        
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Time</th>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Patient</th>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Service</th>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Provider</th>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Status</th>
              <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Amount</th>
              <th style={{ padding: "12px 8px", width: "40px" }}></th>
            </tr>
          </thead>
          <tbody>
            {initialBookings.length === 0 ? (
              <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                <td colSpan={7} style={{ padding: "30px", textAlign: "center", fontSize: "13px", color: "#6b7280" }}>No appointments for today.</td>
              </tr>
            ) : initialBookings.map((row: any, i: number) => {
              const d = new Date(row.slot.starts_at);
              const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "16px 8px", fontSize: "13px", color: "#6b7280" }}>{timeStr}</td>
                  <td style={{ padding: "16px 8px", fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>{row.patient_phone || "Anonymous"}</td>
                  <td style={{ padding: "16px 8px", fontSize: "13px", color: "#4b5563" }}>{row.slot.service.name}</td>
                  <td style={{ padding: "16px 8px", fontSize: "13px", color: "#6b7280" }}>{"Dr. Emily"}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "100px", background: row.status === "confirmed" ? "#ecfdf5" : "#fef3c7", color: row.status === "confirmed" ? "#10b981" : "#d97706", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>{row.status}</span>
                  </td>
                  <td style={{ padding: "16px 8px", fontSize: "13px", fontWeight: "500", color: "#4b5563" }}>${row.slot.service.price}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      </div>
    </div>
  );
};
