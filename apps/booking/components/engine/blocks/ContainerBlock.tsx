import React from "react";

export interface ContainerBlockProps {
  background?: string;
  padding?: number;
  flexDirection?: "row" | "column";
  alignItems?: string;
  justifyContent?: string;
  borderRadius?: number;
  children?: React.ReactNode;
}

export const ContainerBlock: React.FC<ContainerBlockProps> = ({
  background,
  padding,
  flexDirection = "column",
  alignItems = "stretch",
  justifyContent = "flex-start",
  borderRadius = 0,
  children,
}) => {
  return (
    <div
      style={{
        background: background || "transparent",
        padding: padding ? `${padding}px` : "0px",
        display: "flex",
        flexDirection,
        alignItems,
        justifyContent,
        borderRadius: borderRadius ? `${borderRadius}px` : "0px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};
