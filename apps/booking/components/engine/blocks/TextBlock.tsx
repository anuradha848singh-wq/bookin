import React from "react";

export interface TextBlockProps {
  text: string;
  fontSize?: number;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  margin?: number;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  text,
  fontSize = 16,
  color = "var(--text-body, #1f2937)",
  textAlign = "left",
  fontWeight = "normal",
  margin = 0,
}) => {
  return (
    <p
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign,
        fontWeight,
        margin: `${margin}px 0`,
        fontFamily: "var(--font-body, sans-serif)",
        lineHeight: "1.5",
      }}
    >
      {text}
    </p>
  );
};
