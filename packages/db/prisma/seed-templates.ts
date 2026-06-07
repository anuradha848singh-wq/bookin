import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Extended Builder Templates and Themes...")

  // --- Seed Themes (10+) ---
  const themes = [
    { name: "Ocean Blue", slug: "ocean-blue", colors: { primary: "#0ea5e9", secondary: "#0284c7", background: "#ffffff", text: "#0f172a", accent: "#38bdf8" }, fonts: { heading: "Inter", body: "Inter" }, styles: { borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" } },
    { name: "Rose Gold", slug: "rose-gold", colors: { primary: "#f43f5e", secondary: "#e11d48", background: "#fff1f2", text: "#4c0519", accent: "#fb7185" }, fonts: { heading: "Playfair Display", body: "Lato" }, styles: { borderRadius: "16px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" } },
    { name: "Midnight", slug: "midnight", colors: { primary: "#6366f1", secondary: "#4f46e5", background: "#0f172a", text: "#f8fafc", accent: "#818cf8" }, fonts: { heading: "Outfit", body: "Inter" }, styles: { borderRadius: "4px", boxShadow: "none" } },
    { name: "Forest Green", slug: "forest-green", colors: { primary: "#22c55e", secondary: "#16a34a", background: "#f0fdf4", text: "#14532d", accent: "#4ade80" }, fonts: { heading: "Merriweather", body: "Open Sans" }, styles: { borderRadius: "0px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" } },
    { name: "Sunset Orange", slug: "sunset-orange", colors: { primary: "#f97316", secondary: "#ea580c", background: "#fff7ed", text: "#7c2d12", accent: "#fb923c" }, fonts: { heading: "Poppins", body: "Roboto" }, styles: { borderRadius: "12px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" } },
    { name: "Royal Purple", slug: "royal-purple", colors: { primary: "#a855f7", secondary: "#9333ea", background: "#faf5ff", text: "#581c87", accent: "#c084fc" }, fonts: { heading: "Lora", body: "Source Sans Pro" }, styles: { borderRadius: "24px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" } },
    { name: "Slate Minimal", slug: "slate-minimal", colors: { primary: "#64748b", secondary: "#475569", background: "#f8fafc", text: "#0f172a", accent: "#94a3b8" }, fonts: { heading: "Inter", body: "Inter" }, styles: { borderRadius: "4px", boxShadow: "none" } },
    { name: "Vibrant Yellow", slug: "vibrant-yellow", colors: { primary: "#eab308", secondary: "#ca8a04", background: "#fefce8", text: "#713f12", accent: "#fde047" }, fonts: { heading: "Montserrat", body: "Open Sans" }, styles: { borderRadius: "8px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" } },
    { name: "Cyberpunk", slug: "cyberpunk", colors: { primary: "#06b6d4", secondary: "#db2777", background: "#000000", text: "#22d3ee", accent: "#f43f5e" }, fonts: { heading: "Orbitron", body: "Roboto Mono" }, styles: { borderRadius: "0px", boxShadow: "0 0 10px #06b6d4" } },
    { name: "Earthy Brown", slug: "earthy-brown", colors: { primary: "#b45309", secondary: "#92400e", background: "#fffbeb", text: "#451a03", accent: "#d97706" }, fonts: { heading: "PT Serif", body: "PT Sans" }, styles: { borderRadius: "6px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" } },
  ];

  const createdThemes = [];
  for (const theme of themes) {
    const t = await prisma.builderTheme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
    createdThemes.push(t);
  }
  console.log(`Created ${createdThemes.length} themes.`);

  // --- Seed Categories ---
  const categories = [
    { name: "Business", slug: "business" },
    { name: "Service", slug: "service" },
    { name: "Creative", slug: "creative" },
    { name: "E-commerce", slug: "ecommerce" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.builderCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories.push(c);
  }
  console.log(`Created ${createdCategories.length} categories.`);

  // --- Seed Templates (20+) ---
  const templateDefinitions = [
    // Business
    { name: "Corporate Website", category: "business", thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    { name: "Agency Portfolio", category: "business", thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" },
    { name: "Consulting Firm", category: "business", thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" },
    { name: "Law Firm", category: "business", thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80" },
    { name: "Accounting Firm", category: "business", thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80" },
    { name: "Tech Startup", category: "business", thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" },

    // Service
    { name: "Salon/Spa", category: "service", thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
    { name: "Restaurant", category: "service", thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" },
    { name: "Gym/Fitness", category: "service", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
    { name: "Medical Clinic", category: "service", thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" },
    { name: "Dental Practice", category: "service", thumbnail: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80" },
    { name: "Yoga Studio", category: "service", thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80" },

    // Creative
    { name: "Photography Portfolio", category: "creative", thumbnail: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80" },
    { name: "Designer Portfolio", category: "creative", thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80" },
    { name: "Artist Portfolio", category: "creative", thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80" },
    { name: "Musician Website", category: "creative", thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80" },
    { name: "Writer/Author Site", category: "creative", thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80" },

    // E-commerce
    { name: "Online Store", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80" },
    { name: "Product Showcase", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
    { name: "Fashion Store", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80" },
    { name: "Electronics Store", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf6d07b469?w=800&q=80" },
  ];

  const templates = templateDefinitions.map((td, index) => {
    return {
      name: td.name,
      slug: td.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Premium ${td.name} template for professional businesses.`,
      thumbnail: td.thumbnail,
      categoryId: createdCategories.find(c => c.slug === td.category)!.id,
      themeId: createdThemes[index % createdThemes.length].id,
      isPremium: index % 3 === 0, // 1/3 of templates are premium
      design: { ROOT: { type: "div", isCanvas: true, props: {}, nodes: [] } },
      pages: [
        { name: "Home", slug: "/", isHome: true, design: {} },
        { name: "About", slug: "/about", isHome: false, design: {} },
        { name: "Contact", slug: "/contact", isHome: false, design: {} },
      ]
    };
  });

  for (const template of templates) {
    await prisma.builderTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }
  console.log(`Created ${templates.length} templates.`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
