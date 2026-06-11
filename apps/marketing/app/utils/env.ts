export const getDashboardUrl = () => {
  if (process.env.NEXT_PUBLIC_DASHBOARD_URL) {
    return process.env.NEXT_PUBLIC_DASHBOARD_URL;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // In development, the dashboard runs on port 3002
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3002";
  }

  // In production monorepo deployment (single domain), use relative paths
  return "";
};

export const getLoginUrl = () => {
  return `${getDashboardUrl()}/login`;
};
