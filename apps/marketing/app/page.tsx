"use client";

/**
 * Bookin Landing Page — pixel-perfect reference match
 * Single-file JSX, zero external dependencies beyond React.
 * Drop into any React / Next.js project as a page component.
 */
import { useState } from "react";
import Link from "next/link";
import { T } from "./theme";
import { 
  Chk, Arr, Chev, Cal, Bell, TrendUp, TrendDown, StarFill, Avatar, Logo, 
  HomeIcon, BookingsIcon, UsersIcon, MoreIcon, MoneyIcon, WarningIcon, 
  ScissorsIcon, CrossIcon, FitIcon, ToothIcon, CombIcon, LeafIcon, PawIcon, CarIcon 
} from "./components/Icons";


/* ══════════════════════════════════════════
   HERO MOCKUPS
══════════════════════════════════════════ */
const PhoneMockup = () => {
  const appts = [
    { name: "Sarah Johnson", type: "Consultation", time: "10:30 AM", status: "Confirmed", statusColor: "#10B981", bg: "#D1FAE5", initials: "SJ" },
    { name: "Michael Brown", type: "Tech Cleaning", time: "11:00 AM", status: "Pending", statusColor: "#F59E0B", bg: "#FEF3C7", initials: "MB" },
    { name: "Emily Davis", type: "Consultation", time: "01:00 PM", status: "Confirmed", statusColor: "#10B981", bg: "#D1FAE5", initials: "ED" },
  ];
  return (
    <div className="bk-phone-card">
      {/* Header */}
      <div className="bk-flex-between" style={{ marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: T.muted }}>Good morning,</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: T.dark, display: "flex", alignItems: "center", gap: 3 }}>
            Sarah <StarFill size={10} />
          </div>
        </div>
        <Chev />
      </div>

      {/* Date strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 12 }}>
        {["Su","Mo","Tu","We","Th"].map((d, i) => (
          <div key={d} style={{ textAlign: "center", padding: "5px 0", borderRadius: 7, background: i === 0 ? T.red : "#F8FAFC" }}>
            <div style={{ fontSize: 7.5, color: i === 0 ? "rgba(255,255,255,.75)" : T.muted }}>{d}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "#fff" : T.dark }}>{15 + i}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, fontWeight: 600, color: T.dark, marginBottom: 8 }}>Today's Schedule</div>

      {appts.map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
          <Avatar initials={a.initials} size={24} bg={a.bg} color={a.statusColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9.5, fontWeight: 600, color: T.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
            <div style={{ fontSize: 8.5, color: T.muted }}>{a.time} · {a.type}</div>
          </div>
          <span style={{ fontSize: 7.5, fontWeight: 600, color: a.statusColor, background: a.statusColor + "20", borderRadius: 4, padding: "2px 5px", whiteSpace: "nowrap" }}>{a.status}</span>
        </div>
      ))}

      <button style={{ width: "100%", background: T.red, color: "#fff", border: "none", borderRadius: 7, padding: "9px 0", marginTop: 10, fontSize: 10.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        + New Booking
      </button>

      {/* Bottom tab bar */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 11, paddingTop: 9, borderTop: `1px solid ${T.border}` }}>
        {[
          { icon: <HomeIcon size={12} color={T.red} />, label: "Home", active: true },
          { icon: <BookingsIcon size={12} color={T.muted} />, label: "Bookings", active: false },
          { icon: <Cal size={12} color={T.muted} />, label: "Calendar", active: false },
          { icon: <UsersIcon size={12} color={T.muted} />, label: "Customers", active: false },
          { icon: <MoreIcon size={12} color={T.muted} />, label: "More", active: false }
        ].map((tab, idx) => (
          <div key={idx} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{tab.icon}</div>
            <div style={{ marginTop: 2, fontSize: 7, fontWeight: tab.active ? 700 : 500, color: tab.active ? T.red : T.muted }}>{tab.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashMockup = () => (
  <div className="bk-dash-card">
    {/* App bar */}
    <div className="bk-flex-between" style={{ marginBottom: 12 }}>
      <div className="bk-flex-center" style={{ gap: 8 }}>
        <div style={{ width: 24, height: 24, background: T.red, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Chk size={12} color="#fff" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.dark }}>Bookin</span>
      </div>
      <div className="bk-flex-center" style={{ gap: 10 }}>
        <div style={{ background: "#F1F5F9", borderRadius: 6, padding: "4px 10px", fontSize: 9.5, color: T.muted }}>🔍 Search appointments...</div>
        <Bell size={14} />
        <Avatar initials="S" size={26} />
      </div>
    </div>

    {/* Sidebar + content */}
    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 10 }}>
      {/* Mini sidebar */}
      <div style={{ fontSize: 8.5 }}>
        {["Overview","Appointments","Calendar","Customers","Services","Analytics","Marketing","Settings"].map((item, i) => (
          <div key={item} style={{ padding: "5px 7px", borderRadius: 5, marginBottom: 2, background: i === 0 ? T.redLight : "transparent", color: i === 0 ? T.red : T.muted, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div>
        <div className="bk-flex-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.dark }}>Overview</span>
          <div className="bk-flex-center" style={{ gap: 6 }}>
            <div style={{ background: "#F1F5F9", borderRadius: 5, padding: "3px 8px", fontSize: 8, color: T.muted }}>Download Report ↓</div>
            <div style={{ background: "#F1F5F9", borderRadius: 5, padding: "3px 8px", fontSize: 8, color: T.muted }}>May 15–21 ▾</div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
          {[
            { label: "Total Bookings", val: "248", trend: "+18%", up: true, icon: <Cal size={12} color={T.red} /> },
            { label: "Confirmed",      val: "184", trend: "+7%",  up: true, icon: <Chk size={12} color="#10B981" /> },
            { label: "Revenue",        val: "$12,590", trend: "+23%", up: true, icon: <MoneyIcon size={12} color="#F59E0B" /> },
            { label: "No-shows",       val: "12",  trend: "-4%", up: false, icon: <WarningIcon size={12} color={T.red} /> },
          ].map((s, idx) => (
            <div key={idx} style={{ background: "#FAFAFA", borderRadius: 7, padding: "7px 8px" }}>
              <div style={{ height: 16, display: "flex", alignItems: "center" }}>{s.icon}</div>
              <div style={{ fontSize: 7, color: T.muted, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.dark, margin: "2px 0" }}>{s.val}</div>
              <div style={{ fontSize: 7, color: s.up ? "#10B981" : T.red, display: "flex", alignItems: "center", gap: 2 }}>
                {s.up ? "↑" : "↓"} {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {/* Line chart */}
          <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "8px" }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: T.dark, marginBottom: 6 }}>Bookings Overview</div>
            <svg viewBox="0 0 140 52" style={{ width: "100%", height: 52 }}>
              <defs>
                <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.red} stopOpacity=".15" />
                  <stop offset="100%" stopColor={T.red} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[8,18,28,38,48].map(y => <line key={y} x1="0" y1={y} x2="140" y2={y} stroke={T.border} strokeWidth=".5" />)}
              <path d="M0,44 L20,38 L40,30 L60,36 L80,22 L100,28 L120,14 L140,8 L140,52 L0,52Z" fill="url(#dg1)" />
              <path d="M0,44 L20,38 L40,30 L60,36 L80,22 L100,28 L120,14 L140,8" fill="none" stroke={T.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="120" cy="14" r="2.5" fill={T.red} />
              <text x="112" y="10" style={{ fontSize: 6, fill: T.red, fontWeight: 700 }}>62</text>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["May 15","May 17","May 19","May 21"].map(d => (
                <span key={d} style={{ fontSize: 6.5, color: T.muted }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Donut chart */}
          <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "8px" }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: T.dark, marginBottom: 6 }}>Top Services</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="#F1F5F9" strokeWidth="9" />
                <circle cx="26" cy="26" r="20" fill="none" stroke={T.red} strokeWidth="9"
                  strokeDasharray={`${2*Math.PI*20*.42} ${2*Math.PI*20*.58}`}
                  strokeDashoffset={2*Math.PI*20*.25} transform="rotate(-90 26 26)" />
                <circle cx="26" cy="26" r="20" fill="none" stroke="#FBBF24" strokeWidth="9"
                  strokeDasharray={`${2*Math.PI*20*.28} ${2*Math.PI*20*.72}`}
                  strokeDashoffset={-2*Math.PI*20*.17} transform="rotate(-90 26 26)" />
                <circle cx="26" cy="26" r="20" fill="none" stroke="#60A5FA" strokeWidth="9"
                  strokeDasharray={`${2*Math.PI*20*.20} ${2*Math.PI*20*.80}`}
                  strokeDashoffset={-2*Math.PI*20*.45} transform="rotate(-90 26 26)" />
              </svg>
              <div>
                {[{l:"Consultation",p:"42%",c:T.red},{l:"Teeth Cleaning",p:"28%",c:"#FBBF24"},{l:"Haircut",p:"20%",c:"#60A5FA"},{l:"Other",p:"10%",c:"#E5E7EB"}].map(s => (
                  <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: s.c, flexShrink: 0 }} />
                    <span style={{ fontSize: 7, color: T.muted }}>{s.l}</span>
                    <span style={{ fontSize: 7, fontWeight: 700, color: T.dark, marginLeft: "auto" }}>{s.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div style={{ marginTop: 8 }}>
          <div className="bk-flex-between" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 8.5, fontWeight: 600, color: T.dark }}>Recent Bookings</span>
            <span style={{ fontSize: 7.5, color: T.red, cursor: "pointer" }}>View all</span>
          </div>
          {[{n:"Sarah Johnson",d:"May 25, 10:30 AM",t:"Consultation"},{n:"Michael Brown",d:"May 25, 11:00 AM",t:"Teeth Cleaning"},{n:"Emily Davis",d:"May 25, 01:00 PM",t:"Consultation"}].map((b,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: i<2 ? `1px solid ${T.border}` : "none" }}>
              <Avatar initials={b.n[0]} size={20} />
              <div>
                <div style={{ fontSize: 8, fontWeight: 600, color: T.dark }}>{b.n}</div>
                <div style={{ fontSize: 7, color: T.muted }}>{b.d} · {b.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════ */
const Hero = () => (
  <section className="bk-hero">
    {/* Left */}
    <div className="bk-animate-fade-up">
      <div className="bk-hero-badge">
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.red }} />
        All-in-one Booking &amp; Analytics Platform
        <Arr size={12} color={T.red} />
      </div>

      <h1 className="bk-hero-h1">
        The smarter way to book{" "}
        <span style={{ color: T.red }}>appointments</span>{" "}
        and grow your business.
      </h1>

      <p className="bk-hero-desc">
        Bookin helps businesses simplify scheduling, reduce no-shows, and gain powerful insights with built-in website analytics and performance tracking.
      </p>

      <div className="bk-hero-btns">
        <a href="http://localhost:3002/login" className="bk-btn-red" style={{ padding: "11px 22px", fontSize: 15 }}>
          Start Free Trial <Arr />
        </a>
        <Link href="/pricing" className="bk-btn-outline" style={{ padding: "11px 22px", fontSize: 15 }}>
          View Pricing <Cal size={15} color={T.dark} />
        </Link>
      </div>

      <div className="bk-hero-trust">
        {["No credit card required", "Setup in minutes", "Cancel anytime"].map(t => (
          <div key={t} className="bk-hero-trust-item">
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: T.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Chk size={8} color="#fff" />
            </div>
            {t}
          </div>
        ))}
      </div>
    </div>

    {/* Right — floating mockups with entrance animation */}
    <div className="bk-hero-right bk-animate-fade bk-delay-1">
      <PhoneMockup />
      <DashMockup />
    </div>
  </section>
);

/* ══════════════════════════════════════════
   TRUSTED BY
══════════════════════════════════════════ */
const TrustedBy = () => (
  <div className="bk-trust-bar">
    <p style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>Trusted by 10,000+ businesses worldwide</p>
    <div className="bk-trust-logos">
      {[
        { icon: <ScissorsIcon size={14} color="#9CA3AF" />, label: "BeautyCo." },
        { icon: <CrossIcon size={14} color="#9CA3AF" />, label: "HealthPlus" },
        { icon: <FitIcon size={14} color="#9CA3AF" />, label: "FitLife" },
        { icon: <ToothIcon size={14} color="#9CA3AF" />, label: "DentalCare" },
        { icon: <CombIcon size={14} color="#9CA3AF" />, label: "Hair Studio" },
        { icon: <LeafIcon size={14} color="#9CA3AF" />, label: "Wellness Hub" },
        { icon: <PawIcon size={14} color="#9CA3AF" />, label: "PetCare" },
        { icon: <CarIcon size={14} color="#9CA3AF" />, label: "AutoHub" }
      ].map((trust, idx) => (
        <div key={idx} className="bk-trust-logo">
          {trust.icon}
          <span>{trust.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   ANALYTICS WIDGET (inside Features)
══════════════════════════════════════════ */
const AnalyticsWidget = () => (
  <div className="bk-analytics-card">
    <div className="bk-flex-between" style={{ marginBottom: 16 }}>
      <h4 style={{ fontSize: 15, fontWeight: 800, color: T.dark }}>Website Analytics</h4>
      <select style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11.5, color: T.muted, fontFamily: "inherit", background: T.white, cursor: "pointer" }}>
        <option>This Week</option>
      </select>
    </div>

    <div className="bk-stats-row">
      {[
        { label: "Visitors", val: "12,846", trend: "+23%", up: true },
        { label: "Page Views", val: "32,721", trend: "+18%", up: true },
        { label: "Bookings", val: "248", trend: "+30%", up: true },
        { label: "Conversion Rate", val: "2.35%", trend: "+12%", up: true },
      ].map(s => (
        <div key={s.label}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.dark, letterSpacing: "-.5px" }}>{s.val}</div>
          <div style={{ fontSize: 11, color: s.up ? "#10B981" : T.red, display: "flex", alignItems: "center", gap: 3, marginTop: 3 }}>
            <TrendUp color="#10B981" /> {s.trend} vs last week
          </div>
        </div>
      ))}
    </div>

    {/* Chart + side stats */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 16 }}>
      <div>
        <svg viewBox="0 0 280 76" style={{ width: "100%", height: 76 }}>
          <defs>
            <linearGradient id="awGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.red} stopOpacity=".16" />
              <stop offset="100%" stopColor={T.red} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[10,26,42,58,74].map(y => <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#F1F5F9" strokeWidth=".8" />)}
          <path d="M0,62 L37,52 L75,42 L112,58 L150,32 L188,46 L225,20 L262,26 L280,16 L280,76 L0,76Z" fill="url(#awGrad)" />
          <path d="M0,62 L37,52 L75,42 L112,58 L150,32 L188,46 L225,20 L262,26 L280,16" fill="none" stroke={T.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="225" cy="20" r="4" fill={T.red} />
          <circle cx="225" cy="20" r="7" fill={T.red} fillOpacity=".2" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {["May 15","May 16","May 17","May 18","May 19","May 20","May 21"].map(d => (
            <span key={d} style={{ fontSize: 9.5, color: T.muted }}>{d}</span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.dark, marginBottom: 8 }}>Top Traffic Sources</div>
        {[{src:"Google",val:"6,582",c:T.red},{src:"Facebook",val:"2,846",c:"#3B82F6"},{src:"Instagram",val:"1,664",c:"#EC4899"},{src:"Direct",val:"1,034",c:T.muted},{src:"Others",val:"1,110",c:"#E5E7EB"}].map(t => (
          <div key={t.src} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 16, height: 3, borderRadius: 2, background: t.c }} />
              <span style={{ fontSize: 10.5 }}>{t.src}</span>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.val}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, fontWeight: 600, color: T.dark, margin: "10px 0 6px" }}>Top Pages</div>
        {[{page:"/booking",val:"8,246"},{page:"/services",val:"4,321"},{page:"/about",val:"2,401"}].map(p => (
          <div key={p.page} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 16, height: 3, borderRadius: 2, background: T.red }} />
              <span style={{ fontSize: 10.5 }}>{p.page}</span>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{p.val}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: T.red, cursor: "pointer", fontWeight: 500 }}>
          View full report <Arr size={11} color={T.red} />
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════ */
const featIcons: Record<string, React.ReactNode> = {
  "Smart Booking": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="1" y="3" width="17" height="14" rx="3" stroke={T.red} strokeWidth="1.4" />
      <path d="M1 7.5h17" stroke={T.red} strokeWidth="1.4" />
      <path d="M5.5 1v4M13.5 1v4" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  "Website Analytics": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M2 14L6 9l4 4 3.5-7 3.5 2.5" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Automated Reminders": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M9.5 1.5A5.5 5.5 0 0 1 15 7v4l2 3.5H2L4 11V7A5.5 5.5 0 0 1 9.5 1.5z" stroke={T.red} strokeWidth="1.4" />
      <path d="M7 16.5a2.5 2.5 0 0 0 5 0" stroke={T.red} strokeWidth="1.4" />
    </svg>
  ),
  "Performance Insights": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="2" y="12" width="4" height="5" rx="1.5" fill={T.red} />
      <rect x="7.5" y="8" width="4" height="9" rx="1.5" fill={T.red} />
      <rect x="13" y="4" width="4" height="13" rx="1.5" fill={T.red} fillOpacity=".5" />
    </svg>
  ),
  "Customer Management": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <circle cx="8" cy="7" r="3.5" stroke={T.red} strokeWidth="1.4" />
      <path d="M2 18c0-3.87 2.686-7 6-7s6 3.13 6 7" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 12l2 2 2.5-2.5" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Marketing Tools": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M17.5 2L4 8.5l6.5 3.5" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 12L14 16.5 17.5 2" stroke={T.red} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Visual Page Builder": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="1.5" y="1.5" width="16" height="16" rx="2" stroke={T.red} strokeWidth="1.4" />
      <path d="M1.5 5.5h16M5.5 17.5v-12M13.5 1.5v4" stroke={T.red} strokeWidth="1.4" />
      <circle cx="9.5" cy="11.5" r="2" fill={T.red} />
    </svg>
  ),
  "Islands Speed Engine": (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M13.5 1.5l-9 10.5h6l-3.5 5.5 10.5-8.5h-7l3-7.5z" fill={T.red} />
    </svg>
  ),
};

const Features = () => (
  <section className="bk-section">
    <div className="bk-features-top">
      <div>
        <div className="bk-label">Powerful Features</div>
        <h2 className="bk-h2" style={{ marginBottom: 16, maxWidth: 400 }}>
          Everything you need to manage bookings and build your website.
        </h2>
        <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.65, maxWidth: 380, fontWeight: 500 }}>
          From visual drag-and-drop page builders to custom scheduling analytics, Bookin gives you the ultimate engine to run your business online.
        </p>
      </div>
      <AnalyticsWidget />
    </div>

    {/* IMAGE PLACEHOLDER: If you want to use a dashboard builder preview image here: 
        e.g., <img src={process.env.NEXT_PUBLIC_BUILDER_PREVIEW_IMG || "/builder-preview.png"} className="bk-feature-preview-img" alt="Visual Builder" />
    */}

    <div className="bk-feature-grid">
      {[
        { name: "Visual Page Builder", desc: "Craft stunning business sites in minutes. Drag containers, typography, and buttons, pick styles, and publish instantly." },
        { name: "Smart Booking", desc: "Allow customers to book appointments 24/7 with a highly polished, responsive scheduling workflow." },
        { name: "Islands Speed Engine", desc: "Layouts decompress server-side and render directly to pure HTML. Zero LCP loading lags on mobile 4G." },
        { name: "Website Analytics", desc: "Track visitor traffic, landing page conversion rates, and client behaviour with native data dashboards." },
        { name: "Customer Management", desc: "Auto-create client profiles on their very first booking. View appointment histories, preferences, and custom tags." },
        { name: "Marketing Tools", desc: "Reduce appointment no-shows, run campaigns, customize intake forms, and trigger automated emails." },
      ].map((f, idx) => (
        <div key={f.name} className="bk-feature-card bk-animate-fade-up" style={{ animationDelay: `${0.1 * idx}s` }}>
          <div className="bk-feature-icon">{featIcons[f.name]}</div>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: T.dark, marginBottom: 6 }}>{f.name}</h4>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.62, fontWeight: 500 }}>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════
   BOOKING FLOW SECTION
══════════════════════════════════════════ */
const BookingWidget = () => {
  const [selTime, setSelTime] = useState("10:00 AM");
  const [selDay, setSelDay] = useState(15);
  const days = [null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"];

  return (
    <div className="bk-booking-widget">
      <div style={{ fontSize: 14.5, fontWeight: 800, color: T.dark, marginBottom: 16 }}>Book Your Appointment</div>

      {/* Progress steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 18 }}>
        {[["1. Service",true],["2. Time",false],["3. Details",false],["4. Confirm",false]].map(([step,active]) => (
          <div key={step as string}>
            <div style={{ height: 3, background: active ? T.red : T.border, borderRadius: 2, marginBottom: 4 }} />
            <span style={{ fontSize: 9, color: active ? T.red : T.muted, fontWeight: active ? 700 : 500 }}>{step as string}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: T.dark, marginBottom: 8 }}>Select a Service</div>
      {[
        { name: "Consultation", dur: "30 min", price: "$50" },
        { name: "Teeth Cleaning", dur: "45 min", price: "$80" },
        { name: "Haircut", dur: "30 min", price: "$40" },
        { name: "Other Services", dur: "60 min", price: "$120+" },
      ].map(s => (
        <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 6, cursor: "pointer", transition: "border-color .15s" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.dark }}>{s.name}</div>
            <div style={{ fontSize: 10.5, color: T.muted, fontWeight: 500 }}>{s.dur} · {s.price}</div>
          </div>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M4.5 2.5l4.5 4-4.5 4" stroke={T.muted} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {/* Calendar */}
      <div style={{ marginTop: 14 }}>
        <div className="bk-flex-between" style={{ marginBottom: 8 }}>
          <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: 15, color: T.muted, padding: "0 4px" }}>&lsaquo;</button>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.dark }}>May 2024</span>
          <button style={{ border: "none", background: "none", cursor: "pointer", fontSize: 15, color: T.muted, padding: "0 4px" }}>&rsaquo;</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 9, color: T.muted, fontWeight: 700, padding: "3px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {days.map((d, i) => (
            <div key={i} onClick={() => d && setSelDay(d)}
              style={{ textAlign: "center", fontSize: 10.5, padding: "4px 0", borderRadius: 6,
                background: d === selDay ? T.red : "transparent",
                color: !d ? "transparent" : d === selDay ? "#fff" : i < 3 ? T.muted : T.dark,
                cursor: d ? "pointer" : "default", fontWeight: d === selDay ? 700 : 500,
                transition: "background .15s" }}>
              {d || "·"}
            </div>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
        {times.map(t => (
          <button key={t} onClick={() => setSelTime(t)}
            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${t === selTime ? T.red : T.border}`,
              background: t === selTime ? T.red : T.white, color: t === selTime ? "#fff" : T.dark,
              fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: t === selTime ? 700 : 500,
              transition: "all .15s" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 9.5, color: T.muted, marginTop: 8, fontWeight: 500 }}>Timezone: UTC-05:30</div>
    </div>
  );
};

const BookingSection = () => (
  <section className="bk-full-section" style={{ background: T.bg }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="bk-booking-section">
        <BookingWidget />
        <div className="bk-animate-fade-up">
          <div className="bk-label">Custom Booking Experience</div>
          <h2 className="bk-h2" style={{ marginBottom: 24 }}>
            A booking experience your customers will love.
          </h2>
          {[
            "Beautiful, customizable booking pages",
            "Mobile-friendly and easy to use",
            "Accept payments securely",
            "Works 24/7 while you focus on the business",
          ].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
              <div style={{ width: 21, height: 21, borderRadius: "50%", background: T.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Chk size={10} color="#fff" />
              </div>
              <span style={{ fontSize: 15, color: T.body, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
          <a href="http://localhost:3002/login" className="bk-btn-red" style={{ marginTop: 28, padding: "12px 22px", fontSize: 14.5 }}>
            View Booking Page Demo <Arr />
          </a>
          {/* Calendar illustration */}
          <div style={{ marginTop: 36, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 90, height: 90, background: T.red, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 48px rgba(232,40,31,.28)` }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="8" width="40" height="34" rx="6" fill="white" fillOpacity=".9" />
                <path d="M4 17h40" stroke={T.red} strokeWidth="2" />
                <path d="M13 5v8M35 5v8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="24" cy="30" r="7" fill={T.red} />
                <polyline points="20.5,30 23,32.5 27.5,27.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   INSIGHTS SECTION
══════════════════════════════════════════ */
const Insights = () => (
  <section className="bk-section">
    <div className="bk-insights-section">
      <div className="bk-animate-fade-up">
        <div className="bk-label">Built for Growth</div>
        <h2 className="bk-h2" style={{ marginBottom: 16, maxWidth: 280 }}>
          Insights that help you grow your business.
        </h2>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.68, fontWeight: 500 }}>
          Make data-driven decisions with powerful analytics and reports built specifically for service businesses.
        </p>
      </div>

      <div className="bk-insights-grid">
        {/* Booking Trends */}
        <div className="bk-insight-card bk-animate-fade-up bk-delay-1">
          <div style={{ fontSize: 13, fontWeight: 800, color: T.dark, marginBottom: 14 }}>Booking Trends</div>
          <svg viewBox="0 0 120 50" style={{ width: "100%", height: 50 }}>
            {[8,15,22,30,38,28,35,40,28,38].map((h, i) => (
              <rect key={i} x={i * 12} y={50 - h} width={10} height={h} rx="2.5"
                fill={i === 9 ? T.red : T.red + "55"} />
            ))}
          </svg>
          <div style={{ fontSize: 11, color: "#10B981", display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontWeight: 700 }}>
            <TrendUp /> +20% vs last month
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bk-insight-card bk-animate-fade-up bk-delay-2">
          <div style={{ fontSize: 13, fontWeight: 800, color: T.dark, marginBottom: 14 }}>Peak Hours</div>
          <svg viewBox="0 0 120 50" style={{ width: "100%", height: 50 }}>
            {[5,7,12,20,42,46,44,36,26,18,12,7].map((h, i) => {
              const isPeak = i >= 4 && i <= 6;
              return <rect key={i} x={i * 10} y={50 - h} width={8} height={h} rx="2"
                fill={isPeak ? "#6366F1" : "#E5E7EB"} />;
            })}
          </svg>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 10, fontWeight: 500 }}>Most busy time: <strong style={{ color: T.dark }}>10 AM – 12 PM</strong></div>
        </div>

        {/* Customer Retention */}
        <div className="bk-insight-card bk-animate-fade-up bk-delay-1" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.dark, marginBottom: 10 }}>Customer Retention</div>
            <svg viewBox="0 0 70 70" width="70" height="70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="#F1F5F9" strokeWidth="10" />
              <circle cx="35" cy="35" r="28" fill="none" stroke={T.red} strokeWidth="10"
                strokeDasharray={`${2*Math.PI*28*.72} ${2*Math.PI*28*.28}`}
                strokeDashoffset={2*Math.PI*28*.25}
                transform="rotate(-90 35 35)" />
              <text x="35" y="39" textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: T.dark, fontFamily: "Outfit, sans-serif" }}>72%</text>
            </svg>
          </div>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Returning customers</div>
        </div>

        {/* Revenue Overview */}
        <div className="bk-insight-card bk-animate-fade-up bk-delay-2">
          <div style={{ fontSize: 13, fontWeight: 800, color: T.dark, marginBottom: 14 }}>Revenue Overview</div>
          <svg viewBox="0 0 120 50" style={{ width: "100%", height: 50 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity=".2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,42 L20,36 L40,30 L60,26 L80,18 L100,12 L120,5 L120,50 L0,50Z" fill="url(#revGrad)" />
            <path d="M0,42 L20,36 L40,30 L60,26 L80,18 L100,12 L120,5" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 11, color: "#10B981", display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontWeight: 700 }}>
            <TrendUp color="#10B981" /> +22% vs last month
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   TESTIMONIALS SECTION
══════════════════════════════════════════ */
const Testimonials = () => {
  const testimonials = [
    { text: "Bookin has transformed the way we manage appointments. No more double bookings and no-shows have reduced drastically.", name: "Sarah Johnson", role: "Beauty Studio", initials: "SJ", bg: "#FFF0EF" },
    { text: "The analytics help us understand our customers better and grow our business month after month.", name: "Michael Brown", role: "Dental Clinic", initials: "MB", bg: "#DBEAFE" },
    { text: "Super easy to set up and use. Our customers love the booking experience!", name: "Emily Davis", role: "Wellness Center", initials: "ED", bg: "#D1FAE5" },
  ];

  return (
    <section className="bk-full-section" style={{ background: T.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <div className="bk-label">What Our Customers Say</div>
        <h2 className="bk-h2" style={{ marginBottom: 48 }}>Loved by businesses like yours.</h2>

        <div className="bk-testimonial-grid">
          {testimonials.map((t, idx) => (
            <div key={t.name} className="bk-testimonial-card bk-animate-fade-up" style={{ animationDelay: `${0.15 * idx}s` }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(s => <StarFill key={s} />)}
              </div>
              <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={t.initials} bg={t.bg} size={40} color={t.bg === "#FFF0EF" ? T.red : t.bg === "#DBEAFE" ? "#2563EB" : "#059669"} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.dark }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════
   CTA BANNER SECTION
══════════════════════════════════════════ */
const CTABanner = () => (
  <section className="bk-cta">
    <div className="bk-cta-inner bk-animate-fade-up">
      <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Cal size={28} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 280, textAlign: "left" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8 }}>Ready to grow your business with smarter bookings?</h2>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontWeight: 500 }}>Join thousands of businesses using Bookin to save time, reduce no-shows and grow revenue.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="http://localhost:3002/login" className="bk-btn-outline" style={{ background: "#fff", color: T.red, border: "none", padding: "13px 24px", fontSize: 14.5, fontWeight: 700 }}>
            Start Free Trial <Arr color={T.red} />
          </a>
          <button className="bk-btn-outline" style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", padding: "13px 24px", fontSize: 14.5 }}>
            Book a Demo <Cal size={16} color="#fff" />
          </button>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["No credit card required", "Cancel anytime"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              <Chk color="rgba(255,255,255,0.85)" size={12} /> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);



/* ══════════════════════════════════════════
   MAIN EXPORT PAGE COMPONENT
══════════════════════════════════════════ */
export default function MarketingPage() {
  return (
    <main style={{ background: T.white, minHeight: "100vh" }}>
      <Hero />
      <TrustedBy />
      <Features />
      <BookingSection />
      <Insights />
      <Testimonials />
      <CTABanner />
    </main>
  );
}
