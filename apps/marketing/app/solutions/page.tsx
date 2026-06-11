"use client";

import { T } from "../theme";
import { getLoginUrl } from "../utils/env";

export default function SolutionsPage() {
  const solutions = [
    { title: "Beauty & Salons", icon: "💇", desc: "For hair studios, nail salons, spas, and skin clinics. Enable customizable deposit rules and automated calendar sync." },
    { title: "Medical & Dental", icon: "🦷", desc: "For clinics, general practitioners, and specialist healthcare. Includes ARIA compliance, patient notes integration, and secure checkouts." },
    { title: "Wellness & Fitness", icon: "💪", desc: "For personal trainers, gyms, yoga instructors, and physiotherapists. Roster multiple coaches, manage groups, and track client metrics." },
    { title: "Consultants & Advisory", icon: "👔", desc: "For financial advisors, tech consultants, designers, and accountants. Custom timezone support, Zoom links generation, and upfront deposits." }
  ];

  return (
    <main style={{ background: T.white, minHeight: "100vh" }}>
      {/* LOCAL CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bk-hero-section {
          max-width: 1280px; margin: 0 auto;
          padding: 80px 40px; text-align: center;
        }
        .bk-solutions-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 24px; max-width: 1280px; margin: 0 auto; padding: 40px;
        }
        .bk-sol-card {
          border: 1px solid ${T.border}; border-radius: 18px; padding: 32px;
          background: #fff; transition: transform 0.2s, box-shadow 0.2s;
        }
        .bk-sol-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.06);
        }
        @media (max-width: 768px) {
          .bk-solutions-grid { grid-template-columns: 1fr; padding: 20px; }
        }
      ` }} />

      {/* Hero Section */}
      <section className="bk-hero-section">
        <div style={{ display: "inline-block", background: T.redLight, borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Tailored Workflows</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", letterSpacing: "-1.5px", marginBottom: 20 }}>
          Designed for your specific <span style={{ color: T.red }}>industry</span> workflows.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 640, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 500 }}>
          Whether you run a medical clinic, a beauty studio, or a consultancy firm, Bookin delivers optimization tools tailored to your operational needs.
        </p>
      </section>

      {/* Solutions Cards */}
      <section style={{ background: T.bg, padding: "40px 0" }}>
        <div className="bk-solutions-grid">
          {solutions.map((s, idx) => (
            <div key={idx} className="bk-sol-card">
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.7, fontWeight: 500, marginBottom: 24 }}>{s.desc}</p>
              <a href={getLoginUrl()} className="bk-btn-outline" style={{ padding: "8px 16px", fontSize: 13, border: `1.5px solid ${T.red}`, color: T.red }}>
                Launch Solution Page &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Case Section */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 16 }}>Proven to Save 15+ Hours Every Week</h2>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 600, margin: "0 auto 36px auto", lineHeight: 1.7, fontWeight: 500 }}>
          Clinic and Salon owners save an average of 15 hours per week in manual scheduling, client support followups, and rescheduling admin.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }}>
          {[
            { metric: "-72%", label: "Reduction in No-Shows" },
            { metric: "4.9/5", label: "Patient Booking Rating" },
            { metric: "+23%", label: "Average Revenue Growth" }
          ].map((m, i) => (
            <div key={i} style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: T.red, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>{m.metric}</div>
              <div style={{ fontSize: 13.5, color: T.body, fontWeight: 600 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
