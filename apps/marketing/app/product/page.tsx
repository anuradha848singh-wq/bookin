"use client";

import Link from "next/link";
import { T } from "../theme";

export default function ProductPage() {
  const features = [
    { title: "Real-time Slot Locking", desc: "Instantly lock slot selections during booking to eliminate double-bookings." },
    { title: "Custom Widget Editor", desc: "Style, customize, and configure booking pages to fit your brand identity." },
    { title: "SMS & Email Automation", desc: "Automate appointment reminders and confirmations to reduce no-shows by 72%." },
    { title: "Advanced Analytics Dash", desc: "Track conversions, visitors, peak booking hours, and service retention metrics." },
    { title: "Multi-Staff Calendars", desc: "Support separate schedules, sync with Google/Outlook, and allocate rosters." },
    { title: "Secure Pay Elements", desc: "Collect deposit payments or full billing upfront with Stripe element integrations." }
  ];

  return (
    <main style={{ background: T.white, minHeight: "100vh" }}>
      {/* LOCAL CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bk-hero-section {
          max-width: 1280px; margin: 0 auto;
          padding: 80px 40px; text-align: center;
        }
        .bk-grid-2col {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center; max-width: 1280px; margin: 0 auto;
          padding: 60px 40px;
        }
        .bk-feature-grid-sub {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; max-width: 1280px; margin: 0 auto; padding: 60px 40px;
        }
        .bk-product-card {
          border: 1px solid ${T.border}; border-radius: 16px; padding: 24px;
          transition: transform 0.2s, box-shadow 0.2s; background: #fff;
        }
        .bk-product-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.06);
        }
        @media (max-width: 1024px) {
          .bk-grid-2col { grid-template-columns: 1fr; text-align: center; }
          .bk-feature-grid-sub { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .bk-feature-grid-sub { grid-template-columns: 1fr; }
        }
      ` }} />

      {/* Hero Section */}
      <section className="bk-hero-section">
        <div style={{ display: "inline-block", background: T.redLight, borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Robust Features</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", letterSpacing: "-1.5px", marginBottom: 20 }}>
          The all-in-one product for service <span style={{ color: T.red }}>scaling</span>.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 640, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 500 }}>
          Bookin combines patient/customer scheduling, calendar management, and conversion-optimized website analytics in a single drop-in system.
        </p>
        <a href={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : "http://localhost:3002/login"} className="bk-btn-red" style={{ padding: "12px 28px", fontSize: 15 }}>
          Start Using Bookin Free &rarr;
        </a>
      </section>

      {/* Feature Grid */}
      <section style={{ background: T.bg, padding: "40px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 12 }}>Core Capabilities Built to Deliver</h2>
        <p style={{ textAlign: "center", fontSize: 15, color: T.muted, fontWeight: 500, marginBottom: 24 }}>Everything you need to automate workflows and drive customer satisfaction.</p>
        
        <div className="bk-feature-grid-sub">
          {features.map(f => (
            <div key={f.title} className="bk-product-card">
              <div style={{ width: 44, height: 44, background: T.redLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: T.dark, marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.6, fontWeight: 500 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid Highlights */}
      <section className="bk-grid-2col">
        <div>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", lineHeight: 1.2, marginBottom: 20 }}>
            Embed our customized scheduling widget inside any page layout in minutes.
          </h2>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, fontWeight: 500, marginBottom: 20 }}>
            Our widgets are engineered with lazy-loading modules, meaning they won't slow down your website speed metrics. Fully responsive out of the box.
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Compatible with React, Next.js, HTML, and WordPress", "2.5s LCP targeting for India/global mobile networks", "Announced live ARIA regions for WCAG compliance"].map(txt => (
              <li key={txt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, color: T.body, fontWeight: 500 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {txt}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: T.bg, borderRadius: 20, padding: 32, border: `1px solid ${T.border}`, textAlign: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.dark, marginBottom: 12, fontFamily: "Outfit, sans-serif" }}>Live Customizer Simulation</h3>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {["Standard Primary", "Emerald Green", "Royal Blue"].map((c, idx) => (
              <span key={c} style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 99, background: idx === 0 ? T.red : "#fff", color: idx === 0 ? "#fff" : T.body, border: `1px solid ${T.border}` }}>
                {c}
              </span>
            ))}
          </div>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, textAlign: "left" }}>
            <div style={{ width: "100%", height: 8, background: T.divider, borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: "80%", height: 8, background: T.divider, borderRadius: 4, marginBottom: 20 }} />
            <button style={{ width: "100%", background: T.red, color: "#fff", border: "none", padding: "10px 0", borderRadius: 8, fontWeight: 700, fontSize: 13, fontFamily: "Outfit, sans-serif" }}>
              Simulate Appointment Booking
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
