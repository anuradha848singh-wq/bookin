// Helper to automatically guess cross-app URLs in Vercel Monorepos
export const getUrlForApp = (targetAppName: string, defaultLocalPort: number) => {
  // 1. Check explicit environment variables first
  const envKey = `NEXT_PUBLIC_${targetAppName.toUpperCase()}_URL`;
  if (process.env[envKey]) return process.env[envKey];
  
  // Legacy fallback for dashboard
  if (targetAppName === 'dashboard' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Development localhost fallback
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${defaultLocalPort}`;
  }

  // 3. Dynamic Vercel domain replacement (Client-side)
  const appNames = ['marketing', 'dashboard', 'booking', 'builder'];
  
  if (typeof window !== "undefined") {
    let host = window.location.host;
    if (host.includes("vercel.app")) {
      for (const name of appNames) {
        if (host.includes(`-${name}`)) {
          host = host.replace(`-${name}`, `-${targetAppName}`);
          return `${window.location.protocol}//${host}`;
        }
      }
    }
  }

  // 4. Dynamic Vercel domain replacement (Server-side)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    let host = process.env.NEXT_PUBLIC_VERCEL_URL;
    for (const name of appNames) {
      if (host.includes(`-${name}`)) {
        host = host.replace(`-${name}`, `-${targetAppName}`);
        return `https://${host}`;
      }
    }
  }

  // 5. Absolute relative fallback for single-domain routing
  return "";
};

export const getDashboardUrl = () => getUrlForApp('dashboard', 3002);
export const getMarketingUrl = () => getUrlForApp('marketing', 3004);
export const getBookingUrl = () => getUrlForApp('booking', 3003);
export const getBuilderUrl = () => getUrlForApp('builder', 4000);

export const getLoginUrl = () => {
  return `${getDashboardUrl()}/login`;
};
