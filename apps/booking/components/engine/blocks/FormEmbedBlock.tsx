import React from "react";

export interface FormEmbedBlockProps {
  margin?: number;
  themeColor?: string;
  borderRadius?: number;
  formId?: string;
}

export const FormEmbedBlock: React.FC<FormEmbedBlockProps> = ({
  margin = 24,
  themeColor = "#4F46E5",
  borderRadius = 12,
  formId,
}) => {
  if (!formId) {
    return null; // Don't render anything if no form is selected
  }

  return (
    <div
      style={{
        margin: `${margin}px auto`,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          border: `1px solid #E5E5E5`,
          background: "#ffffff",
          borderRadius: `${borderRadius}px`,
          padding: "32px",
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>Please fill out this form</h3>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>This form is required before proceeding.</p>
        </div>
        
        {/* Placeholder for actual form rendering logic */}
        <div style={{ background: "#F9FAFB", padding: "40px", borderRadius: "8px", border: "1px dashed #D1D5DB", textAlign: "center" }}>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>[Form {formId} will render here]</p>
        </div>

        <button style={{ width: "100%", padding: "12px", background: themeColor, color: "#fff", fontSize: "15px", fontWeight: "600", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "24px" }}>
          Submit Form
        </button>
      </div>
    </div>
  );
};
