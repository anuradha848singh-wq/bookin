"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "../theme";

export default function CompanyPage() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.msg) {
      setSubmitted(true);
    }
  };

  const values = [
    { title: "Customer Obsession", desc: "We design every feature focusing completely on the clinic owners' and patients' booking experience." },
    { title: "Security & Trust", desc: "Data protection is built into our architecture. All schedules, patient notes, and Stripe transactions are fully protected." },
    { title: "Continuous Iteration", desc: "We deploy improvements daily to ensure 100% reliability, faster widgets speed, and WCAG AA accessibility compliance." }
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
          gap: 60px; align-items: start; max-width: 1280px; margin: 0 auto;
          padding: 60px 40px;
        }
        .bk-value-card {
          border-left: 3px solid ${T.red}; padding-left: 20px; margin-bottom: 32px;
        }
        .bk-form {
          border: 1px solid ${T.border}; border-radius: 18px; padding: 32px;
          background: #fff; box-shadow: 0 12px 36px rgba(0,0,0,0.06);
        }
        .bk-form-group {
          margin-bottom: 20px; display: flex; flexDirection: column; gap: 6px;
        }
        .bk-input-field {
          padding: 12px 16px; border-radius: 8px; border: 1.5px solid ${T.border};
          font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .bk-input-field:focus {
          border-color: ${T.red};
        }
        @media (max-width: 1024px) {
          .bk-grid-2col { grid-template-columns: 1fr; }
        }
      ` }} />

      {/* Hero Section */}
      <section className="bk-hero-section">
        <div style={{ display: "inline-block", background: T.redLight, borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Our Mission</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", letterSpacing: "-1.5px", marginBottom: 20 }}>
          Empowering service businesses to <span style={{ color: T.red }}>thrive</span> online.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 640, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 500 }}>
          At Bookin, we are on a mission to simplify roster availability scheduling, eradicate administrative friction, and deliver beautiful patient and customer experiences.
        </p>
      </section>

      {/* Company Values and Contact Form Grid */}
      <section style={{ background: T.bg, padding: "40px 0" }}>
        <div className="bk-grid-2col">
          {/* Left Column: Values */}
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 32 }}>What Guides Us Every Single Day</h2>
            {values.map(v => (
              <div key={v.title} className="bk-value-card">
                <h3 style={{ fontSize: 17, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, fontWeight: 500 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Interactive support contact form */}
          <div className="bk-form">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>Contact Our Team</h3>
            <p style={{ fontSize: 13.5, color: T.muted, fontWeight: 500, marginBottom: 24 }}>Have any clinic rostering queries or customization issues? Let us know!</p>
            
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 48, height: 48, background: T.redLight, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>Inquiry Submitted Successfully</h4>
                <p style={{ fontSize: 14, color: T.muted, fontWeight: 500 }}>Thank you for reaching out! A clinic scheduling representative will reply within 4 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bk-form-group">
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.dark }}>Your Name</label>
                  <input
                    type="text"
                    required
                    className="bk-input-field"
                    placeholder="Sarah Johnson"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="bk-form-group">
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.dark }}>Email Address</label>
                  <input
                    type="email"
                    required
                    className="bk-input-field"
                    placeholder="sarah@beautyco.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="bk-form-group">
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.dark }}>How can we help your business?</label>
                  <textarea
                    required
                    rows={4}
                    style={{ resize: "none" }}
                    className="bk-input-field"
                    placeholder="Let us know what clinical or scheduling requirements you have..."
                    value={form.msg}
                    onChange={e => setForm({ ...form, msg: e.target.value })}
                  />
                </div>
                <button type="submit" className="bk-btn-red" style={{ width: "100%", justifyContent: "center", display: "flex", padding: "12px 0", marginTop: 12 }}>
                  Submit Inquiry Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
