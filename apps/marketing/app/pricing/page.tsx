"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "../theme";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      desc: "Perfect to get started scheduling clinic appointments.",
      price: 0,
      features: [
        "1 Staff Calendar roster",
        "Up to 100 bookings / mo",
        "Standard Booking widget",
        "Email notifications support",
        "Google calendar sync"
      ]
    },
    {
      name: "Growth",
      desc: "Ideal for growing clinics and salons with multi-doctors.",
      price: annual ? 24 : 29,
      recommended: true,
      features: [
        "Up to 5 Staff Calendar rosters",
        "Unlimited appointment bookings",
        "Custom branded booking widgets",
        "SMS Alerts & Email automation",
        "Advanced Analytics & reports",
        "Google & Outlook roster sync"
      ]
    },
    {
      name: "Pro Enterprise",
      desc: "For premium multi-location healthcare and salons complexes.",
      price: annual ? 63 : 79,
      features: [
        "Unlimited Staff Calendar rosters",
        "Multi-location support",
        "Dedicated widget branding settings",
        "Stripe payment gateway locks",
        "Dedicated priority API integration",
        "24/7 Phone & Email support"
      ]
    }
  ];

  return (
    <main style={{ background: T.white, minHeight: "100vh" }}>
      {/* LOCAL CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bk-hero-section {
          max-width: 1280px; margin: 0 auto;
          padding: 80px 40px; text-align: center;
        }
        .bk-toggle-bar {
          display: inline-flex; align-items: center; gap: 12px;
          background: ${T.divider}; padding: 6px; border-radius: 99px;
          margin-bottom: 48px;
        }
        .bk-toggle-btn {
          border: none; background: none; cursor: pointer; padding: 8px 18px;
          border-radius: 99px; font-size: 13.5px; font-weight: 700;
          font-family: inherit; transition: all 0.2s;
        }
        .bk-toggle-btn.active {
          background: #fff; color: ${T.dark}; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .bk-pricing-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 40px 60px 40px;
        }
        .bk-pricing-card {
          border: 1px solid ${T.border}; border-radius: 20px; padding: 40px 32px;
          background: #fff; text-align: left; display: flex; flex-direction: column;
          position: relative; transition: transform 0.2s, box-shadow 0.2s;
        }
        .bk-pricing-card:hover {
          transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .bk-pricing-card.recommended {
          border-color: ${T.red}; box-shadow: 0 12px 36px rgba(232,40,31,0.07);
        }
        .bk-badge-rec {
          position: absolute; top: -14px; left: 32px; background: ${T.red};
          color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.8px; padding: 4px 12px; border-radius: 99px;
        }
        @media (max-width: 1024px) {
          .bk-pricing-grid { grid-template-columns: 1fr; max-width: 540px; }
        }
      ` }} />

      {/* Hero Section */}
      <section className="bk-hero-section">
        <div style={{ display: "inline-block", background: T.redLight, borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Pricing Plans</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", letterSpacing: "-1.5px", marginBottom: 20 }}>
          Smarter booking at a <span style={{ color: T.red }}>sensible</span> price.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 600, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 500 }}>
          Select the optimal plan to scale availability rosters, manage patients, automate SMS notifications, and track convert rates.
        </p>

        {/* Annual billing toggle */}
        <div className="bk-toggle-bar">
          <button className={`bk-toggle-btn ${!annual ? "active" : ""}`} onClick={() => setAnnual(false)}>Monthly billing</button>
          <button className={`bk-toggle-btn ${annual ? "active" : ""}`} onClick={() => setAnnual(true)}>
            Yearly billing <span style={{ color: T.red, fontSize: 10.5 }}>-20%</span>
          </button>
        </div>
      </section>

      {/* Pricing Grid */}
      <section style={{ background: T.bg, padding: "60px 0" }}>
        <div className="bk-pricing-grid">
          {plans.map((p, idx) => (
            <div key={idx} className={`bk-pricing-card ${p.recommended ? "recommended" : ""}`}>
              {p.recommended && <div className="bk-badge-rec">Most Popular</div>}
              
              <h3 style={{ fontSize: 22, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>{p.name}</h3>
              <p style={{ fontSize: 13.5, color: T.muted, fontWeight: 500, minHeight: 40, marginBottom: 20 }}>{p.desc}</p>
              
              {/* Pricing details */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif" }}>${p.price}</span>
                <span style={{ fontSize: 14, color: T.muted, fontWeight: 600 }}>/ month</span>
              </div>

              {/* Action Button */}
              <a href="http://localhost:3002/login" className="bk-btn-red" style={{ width: "100%", padding: "12px 0", textAlign: "center", justifyContent: "center", display: "flex", background: p.recommended ? T.red : T.dark, marginBottom: 32 }}>
                Get Started with {p.name}
              </a>

              {/* Features list */}
              <h4 style={{ fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: T.dark, marginBottom: 16 }}>Features Included:</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "start", gap: 8, fontSize: 13.5, color: T.body, fontWeight: 500 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
