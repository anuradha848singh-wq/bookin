import React from "react";

export interface HeroSectionBlockProps {
  background?: string;
  paddingY?: number;
  linkedNodes?: Record<string, React.ReactNode>;
}

export const HeroSectionBlock: React.FC<HeroSectionBlockProps> = ({
  background = "#ffffff",
  paddingY = 100,
  linkedNodes = {},
}) => {
  return (
    <div
      style={{
        background,
        padding: `${paddingY}px 20px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        position: "relative",
        borderBottom: "1px solid #E5E5E5",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "768px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        {linkedNodes["hero-text"]}
        {linkedNodes["hero-actions"]}
      </div>
    </div>
  );
};
