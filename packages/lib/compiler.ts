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
  websiteId?: string;
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

        case 'Heading':
          const fontSizes: Record<string, number> = { h1: 48, h2: 36, h3: 28, h4: 24, h5: 20, h6: 16 };
          const level = props.level || 'h2';
          const fontSize = fontSizes[level as string] || 36;
          elementHtml = `<${level} class="${props.className || ''}" style="font-size: ${fontSize}px; text-align: ${props.textAlign || 'left'}; font-weight: 700; color: ${props.color || '#111827'}; padding: 8px 4px; margin: 0;">${props.text || 'Heading'}</${level}>`;
          break;
        
        case 'Button':
          const buttonStyle = `background-color: ${props.background || '#111827'}; color: ${props.color || '#ffffff'}; padding: ${props.paddingY || 12}px ${props.paddingX || 24}px; font-size: ${props.fontSize || 14}px; border-radius: ${props.borderRadius || 4}px; border: none; cursor: pointer;`;
          if (props.actionType === 'link' && props.linkUrl) {
            elementHtml = `<a href="${props.linkUrl}" class="${props.className || ''}" style="${buttonStyle} text-decoration: none; display: inline-block; text-align: center;">${props.text || 'Button'}</a>`;
          } else if (props.actionType === 'modal' && props.modalId) {
            elementHtml = `<button onclick="document.dispatchEvent(new CustomEvent('open-modal', { detail: { id: '${props.modalId}' } }))" class="${props.className || ''}" style="${buttonStyle}">${props.text || 'Button'}</button>`;
          } else {
            elementHtml = `<button class="${props.className || ''}" style="${buttonStyle}">${props.text || 'Button'}</button>`;
          }
          break;
        
        case 'Container':
          const containerStyle = `background-color: ${props.background || 'transparent'}; padding: ${typeof props.padding === 'number' ? `${props.padding}px` : props.padding || 0}; border-radius: ${props.borderRadius || 0}px; ${props.display ? `display: ${props.display};` : ''} ${props.display === 'grid' ? `grid-template-columns: ${props.gridTemplateColumns || '1fr 1fr'}; grid-template-rows: ${props.gridTemplateRows || 'auto'};` : ''} ${props.flexDirection ? `flex-direction: ${props.flexDirection};` : ''} ${props.alignItems ? `align-items: ${props.alignItems};` : ''} ${props.justifyContent ? `justify-content: ${props.justifyContent};` : ''} ${props.gap ? `gap: ${props.gap}px;` : ''} width: ${props.width || '100%'}; height: ${props.height || 'auto'}; ${props.boxShadow && props.boxShadow !== 'none' ? `box-shadow: ${props.boxShadow};` : ''} ${props.opacity !== undefined ? `opacity: ${props.opacity};` : ''} ${props.zIndex !== undefined ? `z-index: ${props.zIndex};` : ''} ${props.overflow && props.overflow !== 'visible' ? `overflow: ${props.overflow};` : ''} ${props.position ? `position: ${props.position};` : ''}`;
          elementHtml = `<div class="${props.className || ''}" style="${containerStyle}">${childrenHtml}</div>`;
          break;
        
        case 'Image':
          const imageStyle = `width: ${props.width || '100%'}; height: ${props.height || 'auto'}; object-fit: ${props.objectFit || 'cover'}; border-radius: ${props.borderRadius || 0}px; padding: ${props.padding || 0}px; ${props.shadow && props.shadow !== 'none' ? `box-shadow: ${props.shadow};` : ''} ${props.opacity !== undefined ? `opacity: ${props.opacity};` : ''} ${props.zIndex !== undefined ? `z-index: ${props.zIndex};` : ''} ${props.overflow && props.overflow !== 'visible' ? `overflow: ${props.overflow};` : ''} ${props.position ? `position: ${props.position};` : ''} ${props.aspectRatio && props.aspectRatio !== 'auto' ? `aspect-ratio: ${props.aspectRatio};` : ''}`;
          const lazyLoadStr = props.lazyLoad !== false ? 'loading="lazy" decoding="async"' : '';
          elementHtml = `<img src="${props.src || 'https://via.placeholder.com/400x300'}" alt="${props.alt || 'Image'}" class="${props.className || ''}" style="${imageStyle}" ${lazyLoadStr} />`;
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

        case 'Navigation':
          const links = props.links || [];
          const linksHtml = links.map((l: any) => `<a href="${l.href || '#'}" class="nav-link-${id}" style="color: ${props.color || '#374151'}; font-size: ${props.fontSize || 14}px; font-weight: ${props.fontWeight || '500'}; text-decoration: none;">${l.label}</a>`).join('');
          elementHtml = `<nav class="${props.className || ''}" style="display: flex; flex-direction: ${props.direction || 'row'}; gap: ${props.gap || 20}px; justify-content: ${props.justifyContent || 'flex-start'}; width: ${props.width || '100%'}; padding: ${typeof props.padding === 'number' ? props.padding + 'px' : props.padding};"><style>.nav-link-${id} { transition: color 0.2s ease; } .nav-link-${id}:hover { color: ${props.hoverColor || '#2563eb'} !important; }</style>${linksHtml}</nav>`;
          break;

        case 'Video':
          const getEmbedUrl = (link?: string) => {
            if (!link) return "";
            let videoId = "";
            if (link.includes("youtube.com/watch")) {
              const urlParams = new URLSearchParams(new URL(link).search);
              videoId = urlParams.get("v") || "";
            } else if (link.includes("youtu.be/")) {
              videoId = link.split("youtu.be/")[1]?.split("?")[0] || "";
            } else if (link.includes("youtube.com/embed/")) {
              return link;
            }
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            return link;
          };
          const embedUrl = getEmbedUrl(props.url);
          elementHtml = embedUrl 
            ? `<div class="${props.className || ''}" style="padding: ${props.padding || 0}px; width: ${props.width || '100%'}; height: ${props.height || '315px'}; box-sizing: border-box; display: inline-flex; justify-content: center; align-items: center;"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border-radius: ${props.borderRadius || 8}px; box-shadow: ${props.shadow || 'none'};"></iframe></div>`
            : `<div class="${props.className || ''}" style="padding: ${props.padding || 0}px; width: ${props.width || '100%'}; height: ${props.height || '315px'}; box-sizing: border-box; display: inline-flex; justify-content: center; align-items: center;"><div style="width: 100%; height: 100%; background: #F3F4F6; border-radius: ${props.borderRadius || 8}px;"></div></div>`;
          break;

        case 'Icon':
          elementHtml = `<div class="${props.className || ''}" style="display: inline-flex; align-items: center; justify-content: center; padding: ${props.padding || 8}px; background-color: ${props.backgroundColor || '#F0FDFA'}; border-radius: ${props.borderRadius || 8}px; color: ${props.color || '#115E59'}; box-sizing: border-box;"><svg width="${props.size || 24}" height="${props.size || 24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></div>`;
          break;

        case 'FormEmbed':
          elementHtml = `<div class="${props.className || ''}" style="margin: ${props.margin || 24}px 0; border-radius: ${props.borderRadius || 12}px; width: 100%; box-sizing: border-box;">
             <div style="padding: 24px; border: 1px dashed ${props.themeColor || '#4F46E5'}aa; background: ${props.themeColor || '#4F46E5'}04; border-radius: ${props.borderRadius || 12}px; text-align: center; font-family: Inter, sans-serif;">
                <p style="margin: 0; font-weight: 600; color: #111827;">Interactive Form Embedded</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">ID: ${props.formId || 'None'}</p>
             </div>
          </div>`;
          break;

        case 'BookingWidgetBlock':
          elementHtml = `<div class="${props.className || ''}" style="margin: 32px auto; max-width: 48rem; padding: 24px; border: 1px solid #E5E5E5; border-radius: 12px; background: white;">
             <h3 style="text-align: center; font-weight: bold; color: ${props.themeColor || '#3b82f6'};">Booking Engine Loaded</h3>
             <p style="text-align: center; font-size: 14px; color: #6b7280;">Category Filter: ${props.defaultCategory || 'All'}</p>
          </div>`;
          break;

        case 'ContactForm':
          elementHtml = `
            <div class="${props.className || ''}" style="background-color: ${props.backgroundColor || '#ffffff'}; color: ${props.textColor || '#111827'}; border-radius: ${props.borderRadius || 12}px; padding: 32px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #E5E5E5; max-width: 48rem; margin: 0 auto;">
              ${(props.title || props.description) ? `
                <div style="margin-bottom: 32px;">
                  ${props.title ? `<h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${props.title}</h3>` : ''}
                  ${props.description ? `<p style="opacity: 0.7; line-height: 1.625;">${props.description}</p>` : ''}
                </div>
              ` : ''}
              
              <form action="/api/studio/forms/submit" method="POST" style="display: flex; flex-direction: column; gap: 20px;">
                <input type="hidden" name="websiteId" value="${meta.websiteId || ''}" />
                <input type="hidden" name="formName" value="${props.title || 'Contact Form'}" />
                
                <div style="${props.layout === 'horizontal' ? 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;' : 'display: flex; flex-direction: column; gap: 20px;'}">
                  <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; opacity: 0.8;">Full Name</label>
                    <input type="text" name="name" required placeholder="Jane Doe" style="width: 100%; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: ${Math.min(props.borderRadius || 12, 8)}px; font-size: 16px;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; opacity: 0.8;">Email Address</label>
                    <input type="email" name="email" required placeholder="jane@example.com" style="width: 100%; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: ${Math.min(props.borderRadius || 12, 8)}px; font-size: 16px;" />
                  </div>
                </div>

                ${props.showPhoneField ? `
                  <div>
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; opacity: 0.8;">Phone Number (Optional)</label>
                    <input type="tel" name="phone" placeholder="+1 (555) 000-0000" style="width: 100%; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: ${Math.min(props.borderRadius || 12, 8)}px; font-size: 16px;" />
                  </div>
                ` : ''}

                <div>
                  <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px; opacity: 0.8;">Message</label>
                  <textarea name="message" required rows="4" placeholder="How can we help you?" style="width: 100%; padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: ${Math.min(props.borderRadius || 12, 8)}px; font-size: 16px; min-height: 120px; resize: vertical;"></textarea>
                </div>

                <button type="submit" style="margin-top: 8px; padding: 16px 32px; font-weight: 700; color: white; background-color: ${props.buttonColor || '#0066FF'}; border-radius: ${Math.min(props.borderRadius || 12, 8)}px; border: none; cursor: pointer; font-size: 16px;">
                  ${props.buttonText || 'Send Message'}
                </button>
              </form>
            </div>
          `;
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
