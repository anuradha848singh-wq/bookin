import React from "react";
import { Spinner } from "@book-in/ui";

export default function Loading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 120px)",
      width: "100%",
    }}>
      <div style={{ textAlign: "center" }}>
        <Spinner size="lg" />
        <p style={{
          marginTop: "16px",
          color: "var(--text-muted)",
          fontSize: "14px",
          fontWeight: 500
        }}>
          Loading dashboard content...
        </p>
      </div>
    </div>
  );
}
