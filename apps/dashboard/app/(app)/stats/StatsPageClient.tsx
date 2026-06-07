"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Award, Activity, IndianRupee, ChevronDown, ArrowUpRight, Calendar } from "lucide-react";

interface TooltipPayload {
  value: number;
}

interface ChartTipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function ChartTip({ active, payload, label }: ChartTipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-md px-3.5 py-2.5 shadow-md border border-slate-100 text-xs animate-in fade-in-50 duration-150">
      <div className="text-slate-400 font-medium mb-1">{label}</div>
      <div className="flex items-center gap-2 text-[#0f172a] font-bold">
        <span className="w-2 h-2 rounded-full bg-[#0f172a]" />
        Bookings: {payload[0].value}
      </div>
    </div>
  );
}

interface StatsPageClientProps {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  servicesCount: number;
  totalRevenue: number;
  popularService: string;
  popularServiceCount: number;
  areaData: Array<{ x: string; v: number }>;
  xTicks: string[];
  donutData: Array<{ name: string; v: number; pct: string; c: string }>;
  popularServicesList: Array<{ name: string; n: number; pct: number }>;
  weeklyDistribution: Array<{ day: string; count: number; heightPercent: number }>;
}

export default function StatsPageClient({
  totalBookings,
  confirmedBookings,
  pendingBookings,
  cancelledBookings,
  servicesCount,
  totalRevenue,
  popularService,
  popularServiceCount,
  areaData,
  xTicks,
  donutData,
  popularServicesList,
  weeklyDistribution
}: StatsPageClientProps) {
  return (
    <div style={{ position: "relative" }}>
      {/* ── Page Header ── */}
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="page-heading">Analytics &amp; Insights</h1>
          <p className="page-subheading">Real-time metrics, revenue estimation, and appointment distributions.</p>
        </div>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className="stat-card-grid" style={{ marginBottom: "24px" }}>
        {/* Estimated Revenue */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <IndianRupee size={18} />
          </div>
          <p className="stat-card-label">Estimated Revenue</p>
          <p className="stat-card-value">₹{totalRevenue.toLocaleString("en-IN")}</p>
          <div className="stat-card-trend up">
            <TrendingUp size={10} style={{ marginRight: "3px" }} />
            Active earnings
          </div>
        </div>

        {/* Most Popular Service */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <Award size={18} />
          </div>
          <p className="stat-card-label">Popular Service</p>
          <p className="stat-card-value" style={{ fontSize: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={popularService}>
            {popularService}
          </p>
          <div className="stat-card-trend up">
            <TrendingUp size={10} style={{ marginRight: "3px" }} />
            {popularServiceCount} booking{popularServiceCount === 1 ? "" : "s"}
          </div>
        </div>

        {/* Active Offerings */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <Activity size={18} />
          </div>
          <p className="stat-card-label">Active Catalog</p>
          <p className="stat-card-value">{servicesCount} Services</p>
          <div className="stat-card-trend up">
            <TrendingUp size={10} style={{ marginRight: "3px" }} />
            Active offerings
          </div>
        </div>

        {/* Total Appointments */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <Calendar size={18} />
          </div>
          <p className="stat-card-label">Total Bookings</p>
          <p className="stat-card-value">{totalBookings} slots</p>
          <div className="stat-card-trend up">
            <TrendingUp size={10} style={{ marginRight: "3px" }} />
            Total scheduled
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px", marginBottom: "24px" }}>
        {/* Appointments Overview Area Chart */}
        <div className="admin-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 className="section-heading" style={{ margin: 0 }}>
                <Activity size={16} style={{ color: "var(--brand-violet)", marginRight: "6px" }} />
                Appointments Overview
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--text-muted)" }}>Frequency count of successfully scheduled sessions.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, border: "1.5px solid var(--border-default)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "var(--text-body)", fontWeight: 600, background: "var(--surface-input)", cursor: "pointer" }}>
              This Month
              <ChevronDown size={11} />
            </div>
          </div>
          <div style={{ flex: 1, width: "100%", minHeight: "190px" }}>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="livePremiumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="x" ticks={xTicks} tick={{ fontSize: 10, fill: "var(--text-subtle)", fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-subtle)", fontWeight: 600 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="v" stroke="#0f172a" strokeWidth={2} fill="url(#livePremiumGrad)"
                  dot={{ r: 3, fill: "#0f172a", stroke: "#fff", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: "#0f172a", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 className="section-heading" style={{ margin: 0 }}>
              <TrendingUp size={16} style={{ color: "var(--brand-violet)", marginRight: "6px" }} />
              Appointments by Status
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--text-muted)" }}>Booking status aggregate breakdown.</p>
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", margin: "14px 0" }}>
            <PieChart width={144} height={144}>
              <Pie data={donutData.map(d => ({ name: d.name, value: d.v }))} cx={72} cy={72} innerRadius={48} outerRadius={68} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                {donutData.map((d, i) => <Cell key={i} fill={d.c} />)}
              </Pie>
            </PieChart>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1 }}>{totalBookings}</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 3 }}>Total</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {donutData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.c, flexShrink: 0 }} />
                  <span style={{ color: "var(--text-body)", fontWeight: 500 }}>{d.name}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>{d.v}</span>
                  <span style={{ color: "var(--border-default)", fontWeight: 600 }}>|</span>
                  <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: 34, textAlign: "right" }}>{d.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px" }}>
        {/* Weekly appointment distribution */}
        <div className="admin-card">
          <h3 className="section-heading" style={{ marginBottom: "20px" }}>
            <Activity size={16} style={{ color: "var(--brand-violet)", marginRight: "6px" }} />
            Weekly Appointment Distribution
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", padding: "0 10px" }}>
            {weeklyDistribution.map(({ day, count, heightPercent }) => (
              <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%", gap: "8px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-heading)", fontWeight: 600 }}>{count}</span>
                <div style={{
                  width: "100%",
                  height: `${Math.max(heightPercent, 4)}px`,
                  background: count > 0 ? "#475569" : "#e2e8f0",
                  borderRadius: "2px",
                  transition: "height 0.3s ease"
                }} />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services visual bar chart */}
        <div className="admin-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h3 className="section-heading" style={{ margin: 0 }}>
                  <Award size={16} style={{ color: "var(--brand-violet)", marginRight: "6px" }} />
                  Top Service Categories
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--text-muted)" }}>Most demanded clinical offering sessions.</p>
              </div>
              <span style={{ fontSize: "12px", color: "var(--brand-violet)", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
                View All
                <ArrowUpRight size={13} />
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {popularServicesList.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, background: "#f1f5f9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Award size={16} style={{ color: "#475569" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-heading)" }}>{s.name}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-subtle)", fontWeight: 600 }}>{s.n} ({s.pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border-default)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.pct}%`, background: "#0f172a", borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              ))}
              {popularServicesList.length === 0 && (
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>No services catalog logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
