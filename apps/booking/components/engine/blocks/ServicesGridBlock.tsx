import React from "react";

export interface ServicesGridBlockProps {
  backgroundColor?: string;
  columns?: number;
  linkedNodes?: Record<string, React.ReactNode>;
}

export const ServicesGridBlock: React.FC<ServicesGridBlockProps> = ({
  backgroundColor = "#ffffff",
  columns = 3,
  linkedNodes = {},
}) => {
  return (
    <div
      style={{
        backgroundColor,
        padding: "96px 32px",
        width: "100%",
        position: "relative",
        borderBottom: "1px solid #E5E5E5",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {linkedNodes["services-header"]}

        <div
          style={{
            width: "100%",
            display: "grid",
            gap: "24px",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            marginTop: "64px"
          }}
        >
          {/* We render exactly 3 static cards as designed in the wireframe editor */}
          {[1, 2, 3].map((num) => (
            <div key={num} style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #E5E5E5", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "4px", background: "#F3F4F6", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              {linkedNodes[`card-title-Card-Feature-${num}`]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
