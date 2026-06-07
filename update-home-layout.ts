import { getTenantClient } from "./packages/db/src/index.ts";

async function run() {
  const tenantDb = getTenantClient("tenant_76837f");
  
  const layout = {
    ROOT: {
      type: { resolvedName: "Container" },
      isCanvas: true,
      props: { background: "#ffffff", padding: 0 },
      displayName: "Container",
      custom: {},
      hidden: false,
      nodes: ["hero-node", "services-node", "staff-node"],
      linkedNodes: {}
    },
    "hero-node": {
      type: { resolvedName: "HeroSection" },
      isCanvas: false,
      props: { background: "#ffffff", paddingY: 80 },
      displayName: "Hero Section",
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    "services-node": {
      type: { resolvedName: "ServicesGrid" },
      isCanvas: false,
      props: { backgroundColor: "#FAFAFA", columns: 4 },
      displayName: "Services Grid",
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {}
    },
    "staff-node": {
      type: { resolvedName: "StaffShowcase" },
      isCanvas: false,
      props: { backgroundColor: "#ffffff", columns: 3 },
      displayName: "Staff Showcase",
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {}
    }
  };

  const page = await tenantDb.page.upsert({
    where: { slug: "home" },
    create: {
      slug: "home",
      title: "Homepage",
      content: { layout: JSON.stringify(layout) },
      is_home: true,
    },
    update: {
      content: { layout: JSON.stringify(layout) },
      updated_at: new Date(),
    }
  });

  console.log("HOMEPAGE LAYOUT UPDATED IN DATABASE SUCCESSFULLY!");
  console.log(JSON.stringify(page, null, 2));
}

run().catch(console.error);
