import React from "react";
import type { CraftSerializedTree, CraftSerializedNode } from "@book-in/lib";

interface CustomPageRendererProps {
  tree: CraftSerializedTree;
  bookingWidget?: React.ReactNode; // Inject the native booking flow if they embed it
}

export const CustomPageRenderer = ({ tree, bookingWidget }: CustomPageRendererProps) => {
  // Safe base check
  const rootNode = tree["ROOT"];
  if (!rootNode) return null;

  return (
    <div style={{ width: "100%" }}>
      <RenderNode nodeId="ROOT" tree={tree} bookingWidget={bookingWidget} />
    </div>
  );
};

const RenderNode = ({
  nodeId,
  tree,
  bookingWidget,
}: {
  nodeId: string;
  tree: CraftSerializedTree;
  bookingWidget?: React.ReactNode;
}) => {
  const node = tree[nodeId];
  if (!node) return null;

  const { type, props, nodes = [] } = node;
  const resolvedName = type.resolvedName;

  // Render children recursively
  const children = nodes.map((childId) => (
    <RenderNode
      key={childId}
      nodeId={childId}
      tree={tree}
      bookingWidget={bookingWidget}
    />
  ));

  // Render Container block
  if (resolvedName === "Container") {
    const {
      background = "#ffffff",
      padding = 16,
      margin = 0,
      flexDirection = "column",
      alignItems = "stretch",
      justifyContent = "flex-start",
    } = props;

    return (
      <div
        style={{
          background: background as string,
          padding: `${padding}px`,
          margin: `${margin}px`,
          display: "flex",
          flexDirection: flexDirection as any,
          alignItems: alignItems as any,
          justifyContent: justifyContent as any,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
  }

  // Render Text block
  if (resolvedName === "Text") {
    const {
      text = "",
      fontSize = 16,
      color = "#1f2937",
      fontWeight = "normal",
      textAlign = "left",
      margin = 0,
    } = props;

    return (
      <p
        style={{
          fontSize: `${fontSize}px`,
          color: color as string,
          fontWeight: fontWeight as any,
          textAlign: textAlign as any,
          margin: `${margin}px 0`,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        {text as string}
      </p>
    );
  }

  // Render Button block
  if (resolvedName === "Button") {
    const {
      text = "Button",
      size = "medium",
      href = "#",
      background = "#3b82f6",
      color = "#ffffff",
      borderRadius = 4,
      margin = 8,
    } = props;

    const paddingStyle =
      (size as string) === "small" || (size as string) === "sm"
        ? "6px 12px"
        : (size as string) === "large" || (size as string) === "lg"
        ? "12px 24px"
        : "8px 16px";

    const fontStyle =
      (size as string) === "small" || (size as string) === "sm" ? "12px" : (size as string) === "large" || (size as string) === "lg" ? "18px" : "14px";

    return (
      <div
        style={{
          margin: `${margin}px`,
          display: "inline-block",
        }}
      >
        <a
          href={href as string}
          style={{
            display: "inline-block",
            padding: paddingStyle,
            fontSize: fontStyle,
            background: background as string,
            color: color as string,
            borderRadius: `${borderRadius}px`,
            textDecoration: "none",
            fontWeight: "600",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          {text as string}
        </a>
      </div>
    );
  }

  // Fallback or custom module block (e.g. BookingWidgetBlock)
  if (resolvedName === "BookingWidgetBlock" && bookingWidget) {
    return (
      <div style={{ width: "100%", margin: "24px 0" }}>
        {bookingWidget}
      </div>
    );
  }

  // If there's an unrecognized wrapper, just render children
  return <>{children}</>;
};
