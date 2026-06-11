export const getDashboardUrl = () => {
  if (process.env.NEXT_PUBLIC_DASHBOARD_URL) {
    return process.env.NEXT_PUBLIC_DASHBOARD_URL;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    // If deployed on Vercel without env vars, guess the dashboard URL
    // This is a fallback to prevent localhost links in production
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3002";
};

export const getLoginUrl = () => {
  return `${getDashboardUrl()}/login`;
};
