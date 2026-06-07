import React from "react";
import type { CraftSerializedTree } from "@book-in/lib";
import { ContainerBlock } from "./blocks/ContainerBlock";
import { TextBlock } from "./blocks/TextBlock";
import { ButtonBlock } from "./blocks/ButtonBlock";
import { HeroSectionBlock } from "./blocks/HeroSectionBlock";
import { ServicesGridBlock } from "./blocks/ServicesGridBlock";
import { ServiceShowcaseBlock } from "./blocks/ServiceShowcaseBlock";
import { StaffShowcaseBlock } from "./blocks/StaffShowcaseBlock";
import { FormEmbedBlock } from "./blocks/FormEmbedBlock";

interface JsonCompilerProps {
  tree: CraftSerializedTree;
  bookingWidget?: React.ReactNode;
  tenantData?: any;
}

/**
 * The core engine that takes a raw JSON AST from the database
 * and compiles it into a pure React/HTML tree.
 */
export const JsonCompiler = ({ tree, bookingWidget, tenantData }: JsonCompilerProps) => {
  const rootNode = tree["ROOT"];
  if (!rootNode) return null;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <BlockResolver nodeId="ROOT" tree={tree} bookingWidget={bookingWidget} tenantData={tenantData} />
    </div>
  );
};

const BlockResolver = ({
  nodeId,
  tree,
  bookingWidget,
  tenantData,
}: {
  nodeId: string;
  tree: CraftSerializedTree;
  bookingWidget?: React.ReactNode;
  tenantData?: any;
}) => {
  const node = tree[nodeId];
  if (!node) return null;

  const { type, props, nodes = [] } = node;
  const resolvedName = type.resolvedName;

  // Resolve children recursively
  const children = nodes.map((childId) => (
    <BlockResolver
      key={childId}
      nodeId={childId}
      tree={tree}
      bookingWidget={bookingWidget}
      tenantData={tenantData}
    />
  ));

  const resolvedLinkedNodes: Record<string, React.ReactNode> = {};
  if (node.linkedNodes) {
    Object.entries(node.linkedNodes).forEach(([key, id]) => {
      resolvedLinkedNodes[key] = (
        <BlockResolver key={id} nodeId={id} tree={tree} bookingWidget={bookingWidget} tenantData={tenantData} />
      );
    });
  }

  // Map to totally decoupled dumb blocks
  if (resolvedName === "Container") {
    return <ContainerBlock {...props as any}>{children}</ContainerBlock>;
  }

  if (resolvedName === "Text") {
    return <TextBlock {...props as any} />;
  }

  if (resolvedName === "Button") {
    return <ButtonBlock {...props as any} />;
  }

  if (resolvedName === "HeroSection") {
    return <HeroSectionBlock {...props as any} linkedNodes={resolvedLinkedNodes} />;
  }

  if (resolvedName === "ServicesGrid") {
    return <ServicesGridBlock {...props as any} linkedNodes={resolvedLinkedNodes} />;
  }

  if (resolvedName === "ServiceShowcase") {
    return <ServiceShowcaseBlock {...props as any} linkedNodes={resolvedLinkedNodes} tenantData={tenantData} />;
  }

  if (resolvedName === "StaffShowcase") {
    return <StaffShowcaseBlock {...props as any} linkedNodes={resolvedLinkedNodes} tenantData={tenantData} />;
  }

  if (resolvedName === "FormEmbed") {
    return <FormEmbedBlock {...props as any} linkedNodes={resolvedLinkedNodes} />;
  }

  if (resolvedName === "BookingWidgetBlock" && bookingWidget) {
    return <div style={{ width: "100%", margin: "24px 0" }}>{bookingWidget}</div>;
  }

  if (resolvedName === "BookingWidgetConnector" && bookingWidget) {
    return <div style={{ width: "100%", margin: "24px 0" }}>{bookingWidget}</div>;
  }

  if (resolvedName === "CRMFormConnector") {
    return <FormEmbedBlock {...props as any} />;
  }

  return <>{children}</>;
};
