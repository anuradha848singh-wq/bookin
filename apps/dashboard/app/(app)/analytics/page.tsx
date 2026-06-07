"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  TrendingUp, TrendingDown, CalendarCheck2, DollarSign, Users, BarChart3,
  Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Download, ChevronRight,
  Minus, ArrowUpRight, ArrowDownRight, Activity, Star, UserCheck, Repeat,
  CreditCard, Target
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPIs {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  pendingBookings: number;
  grossRevenue: number;
  collectedRevenue: number;
  avgBookingValue: number;
  uniqueClients: number;
  completionRate: number;
  trends: { bookings: number; revenue: number; clients: number };
}

interface AnalyticsData {
  kpis: KPIs;
  charts: {
    bookingsByDay: Array<{ date: string; bookings: number; completed: number; cancelled: number }>;
    revenueByDay: Array<{ date: string; gross: number; collected: number }>;
    bookingsByStatus: Array<{ status: string; count: number }>;
    clientAcquisition: Array<{ date: string; newClients: number }>;
  };
  tables: {
    topServices: Array<{ name: string; bookings: number; revenue: number; avgPrice: number; completed: number }>;
    topStaff: Array<{ name: string; bookings: number; revenue: number; completed: number; noShows: number; completionRate: number }>;
    recentBookings: Array<{
      id: string; reference: string; clientName: string; clientEmail: string;
      service: string; duration: number; staffName: string; startsAt: string;
      status: string; paymentStatus: string; price: number; paid: number;
    }>;
  };
  retention: {
    firstTimeClients: number; returningClients: number; loyalClients: number; avgBookingsPerClient: number;
  } | null;
}

// ─── Period Options ──────────────────────────────────────────────────────────

const PERIODS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "12 Months", value: "12m" },
];

// ─── Status Colors ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  CONFIRMED: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
  COMPLETED: { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  NO_SHOW: { bg: "#f3e8ff", text: "#6b21a8", border: "#c4b5fd" },
  RESCHEDULED: { bg: "#f0f9ff", text: "#075985", border: "#7dd3fc" },
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string }> = {
  UNPAID: { bg: "#fef3c7", text: "#92400e" },
  PAID: { bg: "#d1fae5", text: "#065f46" },
  DEPOSIT_PAID: { bg: "#dbeafe", text: "#1e40af" },
  REFUNDED: { bg: "#f3e8ff", text: "#6b21a8" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ─── Mini Sparkline Bar Chart ─────────────────────────────────────────────────

function SparklineChart({ data, valueKey, color = "#3b82f6" }: { data: any[]; valueKey: string; color?: string }) {
  if (!data.length) return <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", color: "#e5e7eb", fontSize: 12 }}>No data</div>;
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "48px", width: "100%" }}>
      {data.map((d, i) => {
        const h = Math.max(4, Math.round((d[valueKey] / max) * 48));
        return (
          <div
            key={i}
            title={`${formatDate(d.date)}: ${d[valueKey]}`}
            style={{
              flex: 1,
              height: `${h}px`,
              background: color,
              borderRadius: "2px 2px 0 0",
              opacity: 0.85,
              transition: "opacity 0.15s",
              cursor: "default",
              minWidth: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Trend Badge ──────────────────────────────────────────────────────────────

function TrendBadge({ value }: { value: number }) {
  if (value === 0) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>
      <Minus size={12} /> 0%
    </span>
  );
  const isUp = value > 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: 700, color: isUp ? "#059669" : "#dc2626" }}>
      {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(value)}%
    </span>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KPICard({
  title, value, subtitle, trend, icon: Icon, color, prefix, suffix, sparkData, sparkKey
}: {
  title: string; value: string | number; subtitle?: string; trend?: number;
  icon: any; color: string; prefix?: string; suffix?: string;
  sparkData?: any[]; sparkKey?: string;
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {title}
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
            {prefix}{value}{suffix}
          </div>
          {subtitle && <div style={{ fontSize: "12px", color: "#9ca3af" }}>{subtitle}</div>}
        </div>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: color + "15",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>

      {sparkData && sparkKey && (
        <SparklineChart data={sparkData} valueKey={sparkKey} color={color} />
      )}

      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <TrendBadge value={trend} />
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>vs previous period</span>
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "#3b82f6" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.5s ease" }} />
    </div>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "clients", label: "Clients", icon: Users },
  { id: "staff", label: "Staff", icon: UserCheck },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/analytics?period=${period}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load analytics");
      setData(json);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = data?.kpis;
  const charts = data?.charts;
  const tables = data?.tables;
  const retention = data?.retention;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px" }}>
      
      {/* ─── Page Header ─── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#111827", margin: 0 }}>Analytics & Reports</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
            Deep insights into your bookings, revenue, and clinic performance
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Period selector */}
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: "7px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  background: period === p.value ? "#111827" : "transparent",
                  color: period === p.value ? "#fff" : "#6b7280",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", fontSize: "12px", fontWeight: 600,
              border: "1px solid #e5e7eb", borderRadius: "10px",
              background: "#fff", color: "#374151", cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>

          {/* Export */}
          <button
            onClick={() => {
              if (!data) return;
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `analytics-${period}-${new Date().toISOString().split("T")[0]}.json`;
              a.click();
            }}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", fontSize: "12px", fontWeight: 600,
              border: "1px solid #e5e7eb", borderRadius: "10px",
              background: "#fff", color: "#374151", cursor: "pointer",
            }}
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px", color: "#991b1b" }}>
          <AlertCircle size={18} />
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>Failed to load analytics</div>
            <div style={{ fontSize: "13px", marginTop: "2px" }}>{error}</div>
          </div>
          <button onClick={fetchAnalytics} style={{ marginLeft: "auto", background: "#fff", border: "1px solid #fca5a5", color: "#991b1b", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {/* ─── Loading skeleton ─── */}
      {loading && !data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ background: "#f3f4f6", borderRadius: "16px", height: "140px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {/* ─── Tab Nav ─── */}
      <div style={{ display: "flex", gap: "2px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "4px", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", fontSize: "13px", fontWeight: 600,
              border: "none", borderRadius: "9px",
              background: activeTab === id ? "#fff" : "transparent",
              color: activeTab === id ? "#111827" : "#6b7280",
              cursor: "pointer",
              boxShadow: activeTab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* OVERVIEW TAB                                                     */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {activeTab === "overview" && kpis && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* KPI Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            <KPICard
              title="Total Bookings" value={kpis.totalBookings} icon={CalendarCheck2} color="#3b82f6"
              trend={kpis.trends.bookings}
              sparkData={charts?.bookingsByDay} sparkKey="bookings"
              subtitle={`${kpis.completedBookings} completed · ${kpis.cancelledBookings} cancelled`}
            />
            <KPICard
              title="Gross Revenue" value={formatCurrency(kpis.grossRevenue)} icon={DollarSign} color="#10b981"
              trend={kpis.trends.revenue}
              sparkData={charts?.revenueByDay} sparkKey="gross"
              subtitle={`${formatCurrency(kpis.collectedRevenue)} collected`}
            />
            <KPICard
              title="Unique Clients" value={kpis.uniqueClients} icon={Users} color="#8b5cf6"
              trend={kpis.trends.clients}
              sparkData={charts?.clientAcquisition} sparkKey="newClients"
            />
            <KPICard
              title="Avg Booking Value" value={formatCurrency(kpis.avgBookingValue)} icon={CreditCard} color="#f59e0b"
            />
            <KPICard
              title="Completion Rate" value={kpis.completionRate} suffix="%" icon={Target} color="#06b6d4"
              subtitle={`${kpis.noShowBookings} no-shows · ${kpis.pendingBookings} pending`}
            />
          </div>

          {/* Status Breakdown + Recent Activity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
            {/* Status Donut */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "16px" }}>Booking Status</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {charts?.bookingsByStatus.map((item) => {
                  const total = charts.bookingsByStatus.reduce((s, b) => s + b.count, 0);
                  const c = STATUS_COLORS[item.status] || { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };
                  return (
                    <div key={item.status}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.text, display: "block" }} />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{item.status}</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: c.text, background: c.bg, padding: "2px 8px", borderRadius: "6px" }}>{item.count}</span>
                      </div>
                      <ProgressBar value={item.count} max={total} color={c.text} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Retention Stats */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "16px" }}>Client Retention</div>
              {retention ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "First-Time Clients", value: retention.firstTimeClients, icon: UserCheck, color: "#3b82f6", desc: "Booking for the first time" },
                    { label: "Returning Clients", value: retention.returningClients, icon: Repeat, color: "#10b981", desc: "2+ bookings in total" },
                    { label: "Loyal Clients", value: retention.loyalClients, icon: Star, color: "#f59e0b", desc: "5+ bookings (VIPs)" },
                    { label: "Avg Bookings / Client", value: retention.avgBookingsPerClient.toFixed(1), icon: Activity, color: "#8b5cf6", desc: "Lifetime average" },
                  ].map(({ label, value, icon: Icon, color, desc }) => (
                    <div key={label} style={{ background: "#f9fafb", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={16} color={color} />
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280" }}>{label}</div>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#111827" }}>{value}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{desc}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "32px 0", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>No client data yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* BOOKINGS TAB                                                     */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {activeTab === "bookings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Bookings Trend Chart */}
          {charts?.bookingsByDay && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "4px" }}>Bookings Over Time</div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Daily breakdown for the selected period</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px", overflowX: "auto", paddingBottom: "8px" }}>
                {charts.bookingsByDay.map((d, i) => {
                  const maxVal = Math.max(...charts.bookingsByDay.map(x => x.bookings)) || 1;
                  const h = Math.max(4, Math.round((d.bookings / maxVal) * 120));
                  const hComp = Math.max(0, Math.round((d.completed / maxVal) * 120));
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", minWidth: "28px", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column-reverse", height: `${h}px`, width: "100%", borderRadius: "4px 4px 0 0", overflow: "hidden", position: "relative" }}>
                        <div style={{ height: `${hComp}px`, background: "#10b981", position: "absolute", bottom: 0, width: "100%" }} />
                        <div style={{ height: `${h - hComp}px`, background: "#bfdbfe", position: "absolute", bottom: `${hComp}px`, width: "100%" }} />
                      </div>
                      <span style={{ fontSize: "9px", color: "#9ca3af", whiteSpace: "nowrap" }}>{formatDate(String(d.date))}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "2px" }} /><span style={{ fontSize: "11px", color: "#6b7280" }}>Completed</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "10px", height: "10px", background: "#bfdbfe", borderRadius: "2px" }} /><span style={{ fontSize: "11px", color: "#6b7280" }}>Other</span></div>
              </div>
            </div>
          )}

          {/* Recent Bookings Table */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Recent Bookings</div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Latest appointments chronologically</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Reference", "Client", "Service", "Staff", "Date & Time", "Status", "Payment", "Amount"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tables?.recentBookings.length ? tables.recentBookings.map((b: any) => {
                    const sc = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING;
                    const pc = PAYMENT_COLORS[b.paymentStatus] || PAYMENT_COLORS.UNPAID;
                    return (
                      <tr key={b.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#3b82f6", fontFamily: "monospace", fontSize: "12px", whiteSpace: "nowrap" }}>
                          {b.reference}
                        </td>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{b.clientName || "—"}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>{b.clientEmail}</div>
                        </td>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 500, color: "#374151" }}>{b.service}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>{b.duration} min</div>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{b.staffName}</td>
                        <td style={{ padding: "12px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDateTime(b.startsAt)}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, background: sc.bg, color: sc.text, padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, background: pc.bg, color: pc.text, padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
                          {formatCurrency(b.price)}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                        No bookings yet in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* REVENUE TAB                                                      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {activeTab === "revenue" && kpis && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Revenue KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            <KPICard title="Gross Revenue" value={formatCurrency(kpis.grossRevenue)} icon={DollarSign} color="#10b981" trend={kpis.trends.revenue} />
            <KPICard title="Collected Revenue" value={formatCurrency(kpis.collectedRevenue)} icon={CreditCard} color="#3b82f6" />
            <KPICard title="Avg Booking Value" value={formatCurrency(kpis.avgBookingValue)} icon={TrendingUp} color="#8b5cf6" />
            <KPICard
              title="Outstanding"
              value={formatCurrency(kpis.grossRevenue - kpis.collectedRevenue)}
              icon={AlertCircle} color="#f59e0b"
              subtitle="Not yet collected"
            />
          </div>

          {/* Revenue Chart */}
          {charts?.revenueByDay && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "4px" }}>Revenue Over Time</div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Daily gross vs collected</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "140px", overflowX: "auto", paddingBottom: "8px" }}>
                {charts.revenueByDay.map((d, i) => {
                  const maxVal = Math.max(...charts.revenueByDay.map(x => x.gross)) || 1;
                  const hGross = Math.max(2, Math.round((d.gross / maxVal) * 140));
                  const hColl = Math.max(0, Math.round((d.collected / maxVal) * 140));
                  return (
                    <div key={i} style={{ display: "flex", gap: "2px", alignItems: "flex-end", flex: 1, minWidth: "20px" }}>
                      <div style={{ flex: 1, height: `${hGross}px`, background: "#d1fae5", borderRadius: "3px 3px 0 0" }} title={`Gross: ${formatCurrency(d.gross)}`} />
                      <div style={{ flex: 1, height: `${hColl}px`, background: "#10b981", borderRadius: "3px 3px 0 0" }} title={`Collected: ${formatCurrency(d.collected)}`} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "2px" }} /><span style={{ fontSize: "11px", color: "#6b7280" }}>Collected</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "10px", height: "10px", background: "#d1fae5", borderRadius: "2px", border: "1px solid #10b981" }} /><span style={{ fontSize: "11px", color: "#6b7280" }}>Gross</span></div>
              </div>
            </div>
          )}

          {/* Top Services by Revenue */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Revenue by Service</div>
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {tables?.topServices.length ? (() => {
                const maxRev = Math.max(...(tables.topServices.map(s => s.revenue))) || 1;
                return tables.topServices
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((s, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{s.name}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{formatCurrency(s.revenue)}</span>
                      </div>
                      <ProgressBar value={s.revenue} max={maxRev} color="#10b981" />
                    </div>
                  ));
              })() : (
                <div style={{ padding: "32px 0", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>No data available.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* CLIENTS TAB                                                      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {activeTab === "clients" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {kpis && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              <KPICard title="Unique Clients" value={kpis.uniqueClients} icon={Users} color="#8b5cf6" trend={kpis.trends.clients} />
              {retention && (
                <>
                  <KPICard title="Returning Clients" value={retention.returningClients} icon={Repeat} color="#10b981" subtitle="Booked 2+ times" />
                  <KPICard title="Loyal Clients" value={retention.loyalClients} icon={Star} color="#f59e0b" subtitle="Booked 5+ times" />
                  <KPICard title="Avg Bookings/Client" value={retention.avgBookingsPerClient.toFixed(1)} icon={Activity} color="#06b6d4" />
                </>
              )}
            </div>
          )}

          {/* Client Acquisition Chart */}
          {charts?.clientAcquisition && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "4px" }}>New Client Acquisition</div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Daily new client registrations</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px", overflowX: "auto", paddingBottom: "8px" }}>
                {charts.clientAcquisition.map((d, i) => {
                  const maxVal = Math.max(...charts.clientAcquisition.map(x => x.newClients)) || 1;
                  const h = Math.max(4, Math.round((d.newClients / maxVal) * 120));
                  return (
                    <div key={i} style={{ flex: 1, minWidth: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <div style={{ width: "100%", height: `${h}px`, background: "#8b5cf6", borderRadius: "3px 3px 0 0" }} title={`${formatDate(String(d.date))}: ${d.newClients} new`} />
                      <span style={{ fontSize: "9px", color: "#9ca3af", whiteSpace: "nowrap" }}>{formatDate(String(d.date))}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Retention breakdown card */}
          {retention && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "16px" }}>Client Loyalty Distribution</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "First-Time (1 booking)", value: retention.firstTimeClients, color: "#3b82f6" },
                  { label: "Returning (2-4 bookings)", value: retention.returningClients, color: "#10b981" },
                  { label: "Loyal (5+ bookings)", value: retention.loyalClients, color: "#f59e0b" },
                ].map(({ label, value, color }) => {
                  const total = retention.firstTimeClients + retention.returningClients + retention.loyalClients;
                  return (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{label}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{value} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({total ? Math.round(value/total*100) : 0}%)</span></span>
                      </div>
                      <ProgressBar value={value} max={total} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* STAFF TAB                                                        */}
      {/* ─────────────────────────────────────────────────────────────── */}
      {activeTab === "staff" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Staff Performance Table */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Staff Performance</div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Ranked by booking count</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Staff Member", "Bookings", "Revenue", "Completed", "No-Shows", "Completion Rate"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tables?.topStaff.length ? tables.topStaff.map((s, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%", background: `hsl(${i * 60}, 60%, 50%)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, fontSize: "12px", flexShrink: 0
                          }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#111827" }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#3b82f6" }}>{s.bookings}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#10b981" }}>{formatCurrency(s.revenue)}</td>
                      <td style={{ padding: "14px 16px", color: "#374151" }}>
                        <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, fontSize: "12px" }}>{s.completed}</span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#374151" }}>
                        {s.noShows > 0 ? (
                          <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, fontSize: "12px" }}>{s.noShows}</span>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>0</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ flex: 1, minWidth: "80px" }}>
                            <ProgressBar value={s.completionRate} max={100} color={s.completionRate >= 80 ? "#10b981" : s.completionRate >= 60 ? "#f59e0b" : "#ef4444"} />
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#374151", minWidth: "36px" }}>{s.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                        No staff data available for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Services */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Service Performance</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Service", "Bookings", "Revenue", "Avg Price", "Completed"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tables?.topServices.length ? tables.topServices.map((s, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{s.name}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#3b82f6" }}>{s.bookings}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#10b981" }}>{formatCurrency(s.revenue)}</td>
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>{formatCurrency(s.avgPrice)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: "6px", fontWeight: 700, fontSize: "12px" }}>{s.completed}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                        No service data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

