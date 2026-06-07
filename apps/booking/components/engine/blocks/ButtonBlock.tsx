import React from "react";

export interface ButtonBlockProps {
  text: string;
  background?: string;
  color?: string;
  borderRadius?: number;
  padding?: number;
  href?: string;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  text,
  background = "#2563eb",
  color = "#ffffff",
  borderRadius = 6,
  padding = 12,
  href,
}) => {
  const Component = href ? "a" : "button";
  
  return (
    <Component
      href={href}
      style={{
        background,
        color,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px ${padding * 2}px`,
        border: "none",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        display: "inline-block",
        textDecoration: "none",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "opacity 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {text}
    </Component>
  );
};
