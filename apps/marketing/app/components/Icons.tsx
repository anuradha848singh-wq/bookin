import React from "react";
import { T } from "../theme";

export const Chk = ({ size = 14, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <polyline points="2,7.5 5.5,11 12,3" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Arr = ({ size = 13, color = "#fff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5h9M7.5 2.5l4 4-4 4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Chev = ({ size = 11, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 11 11" fill="none">
    <polyline points="2,3.5 5.5,7 9,3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Cal = ({ size = 15, color = T.body }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <rect x="1" y="2.5" width="13" height="11.5" rx="2" stroke={color} strokeWidth="1.3" />
    <path d="M1 6.5h13" stroke={color} strokeWidth="1.3" />
    <path d="M4.5 1v3M10.5 1v3" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const Bell = ({ size = 15, color = T.muted }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1a4.5 4.5 0 0 1 4.5 4.5v2.5L13.5 11H1.5L3 8V5.5A4.5 4.5 0 0 1 7.5 1z" stroke={color} strokeWidth="1.2" />
    <path d="M5.9 12.5a1.6 1.6 0 0 0 3.2 0" stroke={color} strokeWidth="1.2" />
  </svg>
);

export const TrendUp = ({ color = "#10B981" }: { color?: string }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1 8.5L4 5l2.5 2.5L10 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 2H10v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrendDown = ({ color = T.red }: { color?: string }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1 2.5L4 6l2.5-2.5L10 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 9H10V6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarFill = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 13 13" fill="#F59E0B">
    <path d="M6.5 1.5L7.9 4.6l3.3.5-2.4 2.3.6 3.3L6.5 9.2 3.6 10.7l.6-3.3L1.8 5.1l3.3-.5z" />
  </svg>
);

export const Avatar = ({ initials, size = 32, bg = T.redLight, color = T.red }: { initials: string; size?: number; bg?: string; color?: string }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color, flexShrink: 0 }}>
    {initials}
  </div>
);

export const HomeIcon = ({ size = 13, color = T.muted }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const BookingsIcon = ({ size = 13, color = T.muted }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

export const UsersIcon = ({ size = 13, color = T.muted }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const MoreIcon = ({ size = 13, color = T.muted }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const MoneyIcon = ({ size = 13, color = "#10B981" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="16" />
    <path d="M16 10h-4a2 2 0 0 0 0 4h4" />
  </svg>
);

export const WarningIcon = ({ size = 13, color = T.red }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const ScissorsIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="9.8" x2="20" y1="8.2" y2="18.4" />
    <line x1="9.8" x2="20" y1="15.8" y2="5.6" />
  </svg>
);

export const CrossIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const FitIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h3.5v5H3zM17.5 9.5H21v5h-3.5zM6.5 12h11" />
  </svg>
);

export const ToothIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3C4.5 3.5 3 5.5 3 8c0 3 2 5.5 2 9.5v2.5c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-4.5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4.5c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2.5c0-4 2-6.5 2-9.5 0-2.5-1.5-4.5-4-5-2-.4-3 .5-4 .5s-2-.9-4-.5Z" />
  </svg>
);

export const CombIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h18v4H3zM4 9v10M8 9v10M12 9v10M16 9v10M20 9v10" />
  </svg>
);

export const LeafIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.25 0 8.5C17 15 15 20 11 20Z" />
    <path d="M19 2L9.8 12.8" />
  </svg>
);

export const PawIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
    <circle cx="12" cy="14" r="4" stroke={color} />
    <circle cx="6.5" cy="8.5" r="2" stroke={color} />
    <circle cx="10" cy="5.5" r="2" stroke={color} />
    <circle cx="14" cy="5.5" r="2" stroke={color} />
    <circle cx="17.5" cy="8.5" r="2" stroke={color} />
  </svg>
);

export const CarIcon = ({ size = 16, color = "#9CA3AF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13v3c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export const Logo = ({ dark = false }: { dark?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 30, height: 30, background: T.red, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Chk size={15} color="#fff" />
    </div>
    <span style={{ fontSize: 19, fontWeight: 800, color: dark ? "#fff" : T.dark, letterSpacing: "-.4px" }}>Bookin</span>
  </div>
);
