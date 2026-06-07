"use client";

import { useState } from "react";
import Link from "next/link";
import { T } from "../theme";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const guides = [
    { cat: "Getting Started", title: "Rostering your first clinic schedule", dur: "5 min read" },
    { cat: "Payments Sync", title: "Integrating Stripe payment gateway inside your booking page", dur: "8 min read" },
    { cat: "Automated Alerts", title: "Configuring SMS alerts & templates", dur: "4 min read" },
    { cat: "Widget Embeds", title: "Embedding widgets on React and Next.js projects", dur: "6 min read" },
    { cat: "Analytics", title: "Understanding peak booking hours & conversions in dashboard", dur: "10 min read" },
    { cat: "Google Sync", title: "Syncing rosters with Google & Microsoft Calendars", dur: "3 min read" }
  ];

  const filteredGuides = guides.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ background: T.white, minHeight: "100vh" }}>
      {/* LOCAL CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bk-hero-section {
          max-width: 1280px; margin: 0 auto;
          padding: 80px 40px; text-align: center;
        }
        .bk-search-container {
          max-width: 600px; margin: 0 auto 40px auto;
          display: flex; gap: 10px;
        }
        .bk-search-input {
          flex: 1; padding: 14px 20px; border-radius: 12px;
          border: 1.5px solid ${T.border}; font-size: 15px;
          font-family: inherit; outline: none; transition: border-color 0.2s;
        }
        .bk-search-input:focus {
          border-color: ${T.red};
        }
        .bk-guides-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; max-width: 1280px; margin: 0 auto; padding: 40px;
        }
        .bk-guide-card {
          border: 1px solid ${T.border}; border-radius: 14px; padding: 24px;
          background: #fff; transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer; text-align: left;
        }
        .bk-guide-card:hover {
          transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        @media (max-width: 1024px) {
          .bk-guides-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .bk-guides-grid { grid-template-columns: 1fr; padding: 20px; }
        }
      ` }} />

      {/* Hero Section */}
      <section className="bk-hero-section">
        <div style={{ display: "inline-block", background: T.redLight, borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit, sans-serif" }}>Guides & Support</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", letterSpacing: "-1.5px", marginBottom: 20 }}>
          Help Center &amp; <span style={{ color: T.red }}>Developer</span> Resources.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, maxWidth: 640, margin: "0 auto 32px auto", lineHeight: 1.7, fontWeight: 500 }}>
          Search guides, read standard release announcements, browse our blogs, and get technical API docs to make the most of Bookin scheduling widgets.
        </p>

        {/* Live Search simulation */}
        <div className="bk-search-container">
          <input
            type="text"
            className="bk-search-input"
            placeholder="Search guides, setup processes, and APIs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Guides Grid */}
      <section style={{ background: T.bg, padding: "40px 0" }}>
        <div className="bk-guides-grid">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((g, idx) => (
              <div key={idx} className="bk-guide-card">
                <span style={{ fontSize: 11, fontWeight: 800, color: T.red, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 8 }}>
                  {g.cat}
                </span>
                <h3 style={{ fontSize: 15.5, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", lineHeight: 1.4, marginBottom: 12 }}>
                  {g.title}
                </h3>
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{g.dur}</span>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0" }}>
              <h3 style={{ fontSize: 18, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>No matching resources found</h3>
              <p style={{ fontSize: 14, color: T.muted }}>Try searching for standard keywords like "Stripe", "Google", or "Roster".</p>
            </div>
          )}
        </div>
      </section>

      {/* Developer API Docs Preview Section */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: T.dark, fontFamily: "Outfit, sans-serif", marginBottom: 16 }}>Developer API Docs Overview</h2>
        <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 32 }}>
          Embed dynamic widgets or pull appointment callbacks using simple JSON API calls.
        </p>
        <div style={{ background: T.dark, borderRadius: 14, padding: 24, textAlign: "left", color: "#60A5FA", fontFamily: "Courier New, monospace", fontSize: 13.5, border: "1px solid #334155", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", overflowX: "auto" }}>
          <div><span style={{ color: "#34D399" }}>GET</span> /api/clinic/<span style={{ color: "#FBBF24" }}>clinic-slug</span>/services</div>
          <div style={{ color: "#94A3B8", marginTop: 8 }}>{"// Retrieve all active clinic services & pricing details"}</div>
          <div style={{ color: "#fff", marginTop: 8 }}>
            {"{"} <br />
            &nbsp;&nbsp;&quot;status&quot;: &quot;success&quot;, <br />
            &nbsp;&nbsp;&quot;data&quot;: [{"{"} <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&quot;name&quot;: &quot;Teeth Cleaning&quot;, <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&quot;duration&quot;: &quot;45 min&quot;, <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&quot;price&quot;: &quot;$80&quot; <br />
            &nbsp;&nbsp;{"}"}] <br />
            {"}"}
          </div>
        </div>
      </section>
    </main>
  );
}
