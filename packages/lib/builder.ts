// packages/lib/builder.ts

export type CraftNodeId = string;

export interface CraftNodeProps {
  // Container block props
  flexDirection?: "row" | "column";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  width?: string;
  height?: string;

  // Text block props
  text?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "semibold" | "light";
  color?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;

  // Button block props
  label?: string;
  href?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";

  // Generic
  [key: string]: unknown; // Allow extension but typed as unknown, not any
}

export interface CraftSerializedNode {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: CraftNodeProps;
  displayName: string;
  custom: Record<string, unknown>;
  parent: CraftNodeId | null;
  hidden: boolean;
  nodes: CraftNodeId[];
  linkedNodes: Record<string, CraftNodeId>;
}

export type CraftSerializedTree = Record<CraftNodeId, CraftSerializedNode>;

export interface PageLayout {
  craftTree: CraftSerializedTree;
  version: number; // increment when tree shape changes for migration support
}

export interface SavedPage {
  id: string;
  slug: string;
  title: string;
  content: {
    layout: string; // lz-string compressed JSON of PageLayout
    seo_meta?: {
      title?: string;
      description?: string;
      og_image?: string;
    };
  };
  published: boolean;
  created_at: string;
  updated_at: string;
}
