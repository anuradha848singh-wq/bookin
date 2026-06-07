import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Uses isomorphic-dompurify to work in both Node.js (SSR/API) and the browser.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'] // Allow target="_blank" for links
  });
}
