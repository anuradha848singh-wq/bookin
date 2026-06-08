"use client";

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    // Dynamically load AOS script
    const script = document.createElement('script');
    script.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
    script.async = true;
    script.onload = () => {
      const aos = (window as typeof window & { AOS?: { init: (options: { once: boolean; duration: number }) => void; refreshHard: () => void } }).AOS;
      if (aos) {
        aos.init({
          once: false, // We want it to animate multiple times in the builder
          duration: 800,
        });
        
        // Setup observer for CraftJS canvas mutations to refresh AOS
        const observer = new MutationObserver(() => {
           aos.refreshHard();
        });
        
        const root = document.getElementById('craft-canvas-root');
        if (root) {
           observer.observe(root, { childList: true, subtree: true });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
