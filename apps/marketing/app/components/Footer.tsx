"use client";

import React from "react";
import Link from "next/link";
import { T } from "../theme";
import { Logo, Arr } from "./Icons";

export const Footer = () => {
  return (
    <footer className="bk-footer">
      <div className="bk-footer-grid">
        {/* Brand block */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <Logo dark={true} />
          </div>
          <p style={{ fontSize: 13, color: T.darkMuted, lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
            The all-in-one platform to schedule, manage, and grow your service business.
          </p>
        </div>

        {/* Product Column */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Product</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Features", "Pricing", "Integrations", "Changelog"].map(l => (
              <li key={l}>
                <Link href={l === "Pricing" ? "/pricing" : "/product"} style={{ fontSize: 13.5, color: T.darkMuted, textDecoration: "none", transition: "color .15s", fontWeight: 500 }}
                   onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                   onMouseLeave={e => e.currentTarget.style.color = T.darkMuted as string}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions Column */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Solutions</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["For Salons", "For Clinics", "For Consultants", "For Fitness"].map(l => (
              <li key={l}>
                <Link href="/solutions" style={{ fontSize: 13.5, color: T.darkMuted, textDecoration: "none", transition: "color .15s", fontWeight: 500 }}
                   onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                   onMouseLeave={e => e.currentTarget.style.color = T.darkMuted as string}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Resources</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Blog", "Guides", "Help Center", "Webinars"].map(l => (
              <li key={l}>
                <Link href="/resources" style={{ fontSize: 13.5, color: T.darkMuted, textDecoration: "none", transition: "color .15s", fontWeight: 500 }}
                   onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                   onMouseLeave={e => e.currentTarget.style.color = T.darkMuted as string}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Company</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {["About Us", "Careers", "Contact", "Privacy Policy"].map(l => (
              <li key={l}>
                <Link href="/company" style={{ fontSize: 13.5, color: T.darkMuted, textDecoration: "none", transition: "color .15s", fontWeight: 500 }}
                   onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                   onMouseLeave={e => e.currentTarget.style.color = T.darkMuted as string}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter/Contact block */}
        <div>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>Newsletter</h4>
          <p style={{ fontSize: 13, color: T.darkMuted, lineHeight: 1.6, marginBottom: 12, fontWeight: 500 }}>
            Stay updated with our latest features, guides and tips.
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="email" placeholder="Email address" style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: `1px solid ${T.darkBorder}`, background: T.mid, color: "#fff", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            <button style={{ background: T.red, color: "#fff", border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Arr size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom copyright block */}
      <div className="bk-footer-bottom">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontWeight: 500 }}>&copy; 2026 Bookin Inc. All rights reserved.</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Service", "Security"].map(link => (
              <a key={link} href="#" style={{ color: "#4B5563", textDecoration: "none", transition: "color .15s", fontSize: 13.5, fontWeight: 500 }}
                 onMouseEnter={e => e.currentTarget.style.color = T.darkMuted as string}
                 onMouseLeave={e => e.currentTarget.style.color = "#4B5563"}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
