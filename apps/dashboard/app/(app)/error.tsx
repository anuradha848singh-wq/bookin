"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 120px)",
      width: "100%",
      padding: "20px"
    }}>
      <div style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "480px",
        width: "100%",
        textAlign: "center",
        boxShadow: "var(--card-shadow)"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--accent-rose-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px"
        }}>
          <AlertTriangle size={28} style={{ color: "var(--accent-rose)" }} />
        </div>
        
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text-heading)",
          marginBottom: "8px"
        }}>
          Something went wrong
        </h2>
        
        <p style={{
          color: "var(--text-muted)",
          fontSize: "14px",
          marginBottom: "24px",
          lineHeight: 1.6
        }}>
          An error occurred while loading this dashboard view. Don&apos;t worry, your data is perfectly safe.
        </p>

        {error.message && (
          <div style={{
            background: "var(--surface-input)",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontFamily: "var(--font-family-mono, monospace)",
            fontSize: "12px",
            color: "var(--accent-rose)",
            textAlign: "left",
            wordBreak: "break-all",
            marginBottom: "24px",
            maxHeight: "100px",
            overflowY: "auto"
          }}>
            {error.message}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            className="admin-button admin-button-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            Reload Page
          </button>
          
          <button
            onClick={reset}
            className="admin-button admin-button-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
