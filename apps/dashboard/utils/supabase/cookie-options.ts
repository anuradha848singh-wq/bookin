export const cookieOptions = {
  maxAge: 60 * 60 * 24 * 365,  // 1 year in seconds
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
