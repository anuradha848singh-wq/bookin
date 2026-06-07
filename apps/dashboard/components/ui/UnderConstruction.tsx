"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Hammer, ArrowLeft, Construction } from "lucide-react";

export function UnderConstruction({ title = "Coming Soon", description = "We are currently building this feature. It will be available in an upcoming release." }: { title?: string, description?: string }) {
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      padding: "40px",
      background: "var(--surface-page, #020817)",
      fontFamily: "var(--font-body)",
    }}>
      <div style={{
        maxWidth: "480px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        {/* Premium Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--brand-violet-soft)",
          border: "1px solid var(--brand-violet-mid)",
          color: "var(--brand-indigo)",
          padding: "6px 12px",
          borderRadius: "100px",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "24px"
        }}>
          <Hammer size={14} />
          <span>Under Construction</span>
        </div>

        {/* Premium Graphic Placeholder */}
        <div style={{
          width: "160px",
          height: "160px",
          background: "var(--surface-card)",
          borderRadius: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
          border: "1px solid var(--border-default)",
          marginBottom: "32px",
          transform: "rotate(-3deg)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "var(--brand-violet)", opacity: 0.05, borderRadius: "32px" }} />
          <Construction size={64} color="var(--brand-violet)" style={{ opacity: 0.8 }} />
        </div>

        <h1 style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "var(--text-heading)",
          marginBottom: "16px",
          fontFamily: "var(--font-display)",
          lineHeight: "1.2"
        }}>
          {title}
        </h1>
        
        <p style={{
          fontSize: "16px",
          color: "var(--text-muted)",
          marginBottom: "40px",
          lineHeight: "1.6",
          fontWeight: "500"
        }}>
          {description}
        </p>

        <button 
          onClick={() => router.push("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--surface-card)",
            color: "var(--text-heading)",
            border: "1px solid var(--border-default)",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--surface-page)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "var(--surface-card)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <ArrowLeft size={18} />
          Return to Overview
        </button>
      </div>
    </div>
  );
}
