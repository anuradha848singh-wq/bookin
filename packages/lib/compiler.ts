/**
 * Compiler Engine
 * Parses CraftJS JSON and generates static HTML and CSS.
 */

export interface CompilerMeta {
  title?: string;
  description?: string;
  favicon_url?: string;
  og_image?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  jsonLd?: string;
  gaId?: string;
  gtmId?: string;
  fbPixelId?: string;
  customHead?: string;
  customBody?: string;
}

export function generateHTML(jsonString: string, meta: CompilerMeta = {}): string {
  try {
    const nodes = JSON.parse(jsonString);
    const rootId = 'ROOT';
    
    function renderNode(id: string): string {
      const node = nodes[id];
      if (!node) return '';

      const type = node.type?.resolvedName || 'Unknown';
      const props = node.props || {};
      const childrenIds = node.nodes || [];
      // Also check linkedNodes for things like HeroSection's predefined areas
      const linkedNodeIds = Object.values(node.linkedNodes || {}) as string[];
      
      const allChildren = [...childrenIds, ...linkedNodeIds];
      const childrenHtml = allChildren.map(renderNode).join('\n');

      const animationProps = props.animation || {};
      const aosAttrs = animationProps.type && animationProps.type !== 'none'
        ? `data-aos="${animationProps.type}" ${animationProps.duration ? `data-aos-duration="${animationProps.duration}" ` : ''}${animationProps.delay ? `data-aos-delay="${animationProps.delay}" ` : ''}`
        : '';
        
      const isSticky = animationProps.sticky;
      const stickyOffset = animationProps.stickyOffset || 0;
      let combinedClasses = [];
      if (animationProps.hover && animationProps.hover !== 'none') combinedClasses.push(animationProps.hover);
      if (animationProps.customHover) combinedClasses.push(animationProps.customHover);
      if (animationProps.cursor && animationProps.cursor !== 'auto') combinedClasses.push(`cursor-${animationProps.cursor}`);
      
      const hoverClass = combinedClasses.length > 0 ? `transition-all duration-300 ease-in-out ${combinedClasses.join(' ')}` : '';

      function applyAOS(html: string): string {
        let modifiedHtml = html;
        if (aosAttrs) {
          modifiedHtml = modifiedHtml.replace(/^(<[a-zA-Z0-9]+ )/, `$1${aosAttrs} `);
        }
        if (isSticky) {
           modifiedHtml = modifiedHtml.replace(/^(<[a-zA-Z0-9]+ )/, `$1style="position: sticky; top: ${stickyOffset}px; z-index: 50;" `);
        }
        if (hoverClass) {
          // If the element already has a class attribute, inject into it.
          // Otherwise, add a class attribute.
          if (modifiedHtml.match(/^(<[a-zA-Z0-9]+ [^>]*class=")/)) {
             modifiedHtml = modifiedHtml.replace(/^(<[a-zA-Z0-9]+ [^>]*class=")/, `$1${hoverClass} `);
          } else {
             modifiedHtml = modifiedHtml.replace(/^(<[a-zA-Z0-9]+ )/, `$1class="${hoverClass}" `);
          }
        }
        return modifiedHtml;
      }

      let elementHtml = '';
      switch (type) {
        case 'Text':
          elementHtml = `<div class="${props.className || ''}" style="font-size: ${props.fontSize || 16}px; text-align: ${props.textAlign || 'left'}; font-weight: ${props.fontWeight || '400'}; color: ${props.color || '#111827'};">${props.text || ''}</div>`;
          break;
        
        case 'Button':
          elementHtml = `<button class="${props.className || ''}" style="background-color: ${props.background || '#111827'}; color: ${props.color || '#ffffff'}; padding: ${props.paddingY || 12}px ${props.paddingX || 24}px; font-size: ${props.fontSize || 14}px; border-radius: ${props.borderRadius || 4}px; border: none; cursor: pointer;">${props.text || 'Button'}</button>`;
          break;
        
        case 'Container':
          elementHtml = `<div class="${props.className || ''} ${props.parallax ? 'bg-fixed' : ''}" style="background-color: ${props.background || 'transparent'}; padding: ${props.padding || 0}px; border-radius: ${props.borderRadius || 0}px; ${props.direction ? `display: flex; flex-direction: ${props.direction};` : ''} ${props.justify ? `justify-content: ${props.justify};` : ''} ${props.align ? `align-items: ${props.align};` : ''} ${props.parallax ? 'background-attachment: fixed; background-position: center; background-size: cover;' : ''}">${childrenHtml}</div>`;
          break;
        
        case 'Image':
          elementHtml = `<img src="${props.src || 'https://via.placeholder.com/400x300'}" alt="${props.alt || 'Image'}" class="${props.className || ''}" style="width: ${props.width || '100%'}; height: ${props.height || 'auto'}; object-fit: ${props.objectFit || 'cover'}; border-radius: ${props.borderRadius || 0}px;" />`;
          break;
        
        case 'HeroSection':
          elementHtml = `
            <section class="flex flex-col items-center justify-center text-center w-full relative border-b border-[#E5E5E5] ${props.className || ''} ${props.parallax ? 'bg-fixed' : ''}" style="background: ${props.background || '#ffffff'}; padding: ${props.paddingY || 100}px 20px; ${props.parallax ? 'background-attachment: fixed; background-position: center; background-size: cover;' : ''}">
              <div class="max-w-3xl w-full mx-auto flex flex-col items-center gap-6">
                ${childrenHtml}
              </div>
            </section>`;
          break;
            
        case 'Divider':
          elementHtml = `<hr style="margin: ${props.marginY || 20}px 0; border-color: ${props.color || '#E5E5E5'}; border-top-width: 1px; width: ${props.width || '100%'};" class="${props.className || ''}" />`;
          break;
          
        case 'Spacer':
          elementHtml = `<div style="height: ${props.height || 40}px; width: 100%;" class="${props.className || ''}"></div>`;
          break;
        
        case 'ServicesGrid':
          elementHtml = `
            <section class="w-full py-16 px-4 ${props.className || ''}" style="background: ${props.background || '#ffffff'};">
              <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                  <h2 style="font-size: 32px; font-weight: 600; color: #111827; margin-bottom: 12px;">Our Services</h2>
                  <p style="font-size: 16px; color: #6B7280;">Choose from our range of professional services.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  ${childrenHtml}
                </div>
              </div>
            </section>`;
          break;

        case 'Accordion':
          elementHtml = `
            <details class="group border border-gray-200 rounded-lg overflow-hidden bg-white ${props.className || ''}" style="margin-bottom: 10px;">
              <summary class="cursor-pointer font-semibold p-4 bg-gray-50 select-none flex justify-between items-center hover:bg-gray-100 transition-colors">
                <span>${props.title || 'Accordion Title'}</span>
                <span class="transform transition-transform duration-200 group-open:rotate-180">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </summary>
              <div class="p-4 border-t border-gray-200 bg-white min-h-[50px]">
                ${childrenHtml}
              </div>
            </details>
          `;
          break;

        case 'Modal':
          const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
          elementHtml = `
            <div class="${props.className || ''}">
              <button onclick="document.getElementById('${modalId}').showModal()" class="bg-blue-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition-colors ${props.buttonClassName || ''}">
                ${props.buttonText || 'Open Modal'}
              </button>
              <dialog id="${modalId}" class="backdrop:bg-black/50 p-0 rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 m-auto">
                <div class="flex flex-col max-h-[90vh]">
                  <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
                    <h3 class="font-bold text-lg text-gray-800">${props.modalTitle || 'Modal Title'}</h3>
                    <button onclick="document.getElementById('${modalId}').close()" class="text-gray-400 hover:text-gray-700 p-1 bg-white rounded-md border border-gray-200 focus:outline-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  <div class="p-6 overflow-y-auto">
                    ${childrenHtml}
                  </div>
                </div>
              </dialog>
            </div>
          `;
          break;

        case 'Toggle':
          elementHtml = `
            <div class="inline-flex items-center gap-3 cursor-pointer select-none ${props.className || ''}" onclick="this.querySelector('.toggle-track').classList.toggle('bg-blue-600'); this.querySelector('.toggle-track').classList.toggle('bg-gray-200'); this.querySelector('.toggle-thumb').classList.toggle('translate-x-6'); this.querySelector('.toggle-thumb').classList.toggle('translate-x-1');">
              <div class="toggle-track relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${props.defaultChecked ? 'bg-blue-600' : 'bg-gray-200'}">
                <span class="toggle-thumb inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${props.defaultChecked ? 'translate-x-6' : 'translate-x-1'}"></span>
              </div>
              <span class="text-sm font-medium text-gray-900">${props.label || 'Toggle'}</span>
            </div>
          `;
          break;

        case 'Dropdown':
          elementHtml = `
            <details class="relative inline-block text-left group ${props.className || ''}">
              <summary class="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors cursor-pointer list-none" style="list-style: none;">
                ${props.buttonText || 'Options'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </summary>
              <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden min-h-[40px]">
                <div class="py-1">
                  ${childrenHtml}
                </div>
              </div>
            </details>
            <style>details > summary::-webkit-details-marker { display: none; }</style>
          `;
          break;

        case 'Tabs':
          const tabs = props.tabs || [{id: 'tab1', label: 'Tab 1'}];
          const tabsHtml = tabs.map((t: any, i: number) => `
            <button onclick="
              const container = this.closest('.tabs-container');
              container.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('text-blue-600', 'border-blue-600', 'bg-white');
                btn.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100', 'border-transparent');
              });
              this.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:bg-gray-100', 'border-transparent');
              this.classList.add('text-blue-600', 'border-blue-600', 'bg-white');
            " class="tab-btn px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${i === 0 ? 'text-blue-600 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-transparent'}">
              ${t.label}
            </button>
          `).join('');

          elementHtml = `
            <div class="tabs-container border border-gray-200 rounded-lg overflow-hidden bg-white ${props.className || ''}">
              <div class="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                ${tabsHtml}
              </div>
              <div class="p-4 bg-white relative">
                ${childrenHtml}
              </div>
            </div>
          `;
          break;

        case 'ServiceShowcase':
        case 'StaffShowcase':
        case 'BookingWidgetConnector':
        case 'CRMFormConnector':
          // These are complex components, we'll wrap them in a generic container for now
          elementHtml = `<div class="component-wrapper ${type.toLowerCase()} ${props.className || ''}">${childrenHtml}</div>`;
          break;

        default:
          // Generic fallback
          elementHtml = `<div class="${props.className || ''}">${childrenHtml}</div>`;
          break;
      }
      
      return applyAOS(elementHtml);
    }

    const htmlBody = renderNode(rootId);
    
    // Performance: Find first image for LCP Preload
    let firstImageSrc = "";
    Object.values(nodes).forEach((node: any) => {
      if (node.type?.resolvedName === 'Image' && node.props?.src && !firstImageSrc) {
        firstImageSrc = node.props.src;
        if (node.props.optimizeFormat !== false && !firstImageSrc.includes('format=webp')) {
           firstImageSrc = `${firstImageSrc}${firstImageSrc.includes('?') ? '&' : '?'}format=webp`;
        }
      }
    });

    // Inject Tailwind CDN for utility classes support
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title || 'Published Website'}</title>
    ${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
    ${meta.favicon_url ? `<link rel="icon" href="${meta.favicon_url}">` : ''}
    
    <!-- Open Graph for Social Media -->
    <meta property="og:title" content="${meta.title || 'Published Website'}">
    ${meta.description ? `<meta property="og:description" content="${meta.description}">` : ''}
    ${meta.og_image || meta.ogImage ? `<meta property="og:image" content="${meta.og_image || meta.ogImage}">` : ''}
    <meta property="og:type" content="website">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="${meta.twitterCard || 'summary_large_image'}">
    <meta name="twitter:title" content="${meta.title || 'Published Website'}">
    ${meta.description ? `<meta name="twitter:description" content="${meta.description}">` : ''}
    ${meta.og_image || meta.ogImage ? `<meta name="twitter:image" content="${meta.og_image || meta.ogImage}">` : ''}

    ${meta.canonicalUrl ? `<link rel="canonical" href="${meta.canonicalUrl}">` : ''}

    ${meta.jsonLd ? `<script type="application/ld+json">\n${meta.jsonLd}\n</script>` : ''}

    <!-- Analytics & Tracking -->
    ${meta.gaId ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${meta.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${meta.gaId}');</script>
    ` : ''}
    ${meta.gtmId ? `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${meta.gtmId}');</script>
    ` : ''}
    ${meta.fbPixelId ? `
    <!-- Facebook Pixel -->
    <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta.fbPixelId}');fbq('track','PageView');</script>
    ` : ''}
    ${meta.customHead ? `\n    <!-- Custom Head Code -->\n    ${meta.customHead}\n` : ''}

    <!-- Performance Optimizations -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${firstImageSrc ? `<link rel="preload" as="image" href="${firstImageSrc}">` : ''}

    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- INJECT_CRITICAL_CSS -->
    <!-- Note: In a production pipeline, Tailwind CDN would be replaced by critical extracted CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{margin:0;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;}#page-loader{position:fixed;inset:0;background:#fff;z-index:99999;display:flex;align-items:center;justify-content:center;transition:opacity .5s ease;pointer-events:none;}.loader-spinner{border:3px solid #f3f3f3;border-top:3px solid #3b82f6;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;}@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}#scroll-progress{position:fixed;top:0;left:0;height:3px;background:#3b82f6;z-index:99998;width:0%;transition:width .1s;pointer-events:none;}</style>
</head>
<body>
    ${meta.gtmId ? `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${meta.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
    ${meta.fbPixelId ? `<!-- Facebook Pixel (noscript) --><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${meta.fbPixelId}&ev=PageView&noscript=1"/></noscript>` : ''}
    ${meta.customBody ? `<!-- Custom Body Code -->\n${meta.customBody}\n` : ''}
    <div id="page-loader"><div class="loader-spinner"></div></div>
    <div id="scroll-progress"></div>
    ${htmlBody}
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init({once:!0,duration:800});window.addEventListener('load',()=>{const e=document.getElementById('page-loader');if(e){e.style.opacity='0';setTimeout(()=>e.remove(),500)}});window.addEventListener('scroll',()=>{const e=document.body.scrollTop||document.documentElement.scrollTop;const t=document.documentElement.scrollHeight-document.documentElement.clientHeight;const n=(e/t)*100;const o=document.getElementById('scroll-progress');if(o)o.style.width=n+'%'});</script>
</body>
</html>`;
  } catch (err) {
    console.error("HTML Generation failed", err);
    return "<h1>Failed to generate HTML</h1>";
  }
}

/**
 * Extracts all unique CSS classes from the JSON
 */
export function generateCSS(jsonString: string): string {
  try {
    const nodes = JSON.parse(jsonString);
    const classes = new Set<string>();

    Object.values(nodes).forEach((node: any) => {
      if (node.props && typeof node.props.className === 'string') {
        node.props.className.split(' ').forEach((cls: string) => {
          if (cls.trim()) classes.add(cls.trim());
        });
      }
    });

    return Array.from(classes).join(' ');
  } catch (err) {
    return "";
  }
}

/**
 * Generate sitemap.xml
 */
export function generateSitemap(domain: string, pages: { slug: string; updated_at: string }[]): string {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  
  const urls = pages.map(page => {
    const loc = page.slug === 'home' || page.slug === '/' ? baseUrl : `${baseUrl}/${page.slug}`;
    const date = new Date(page.updated_at).toISOString();
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === 'home' || page.slug === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(domain: string): string {
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
