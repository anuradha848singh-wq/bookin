"use client";

import React, { createContext, useContext, ReactNode } from "react";

type DeviceMode = "desktop" | "tablet" | "mobile";

export type ResponsiveValue<T> = T | { base?: T; desktop?: T; tablet?: T; mobile?: T };

interface DeviceModeContextType {
  mode: DeviceMode;
}

const DeviceModeContext = createContext<DeviceModeContextType>({ mode: "desktop" });

export const DeviceModeProvider = ({ mode, children }: { mode: DeviceMode; children: ReactNode }) => {
  return (
    <DeviceModeContext.Provider value={{ mode }}>
      {children}
    </DeviceModeContext.Provider>
  );
};

export const useDeviceMode = () => {
  return useContext(DeviceModeContext);
};

// Helper to resolve a responsive prop value
export const resolveResponsiveProp = <T,>(propValue: T | { desktop?: T; tablet?: T; mobile?: T; base?: T }, currentMode: DeviceMode): T => {
  if (propValue === undefined || propValue === null) return propValue as any;
  if (typeof propValue !== 'object' || Array.isArray(propValue)) return propValue as T;
  
  const obj = propValue as { desktop?: T; tablet?: T; mobile?: T; base?: T };
  // Check if it's actually a responsive object by looking for known keys
  if (('desktop' in obj) || ('tablet' in obj) || ('mobile' in obj) || ('base' in obj)) {
     if (currentMode === 'mobile' && obj.mobile !== undefined) return obj.mobile;
     if (currentMode === 'mobile' && obj.tablet !== undefined) return obj.tablet;
     
     if (currentMode === 'tablet' && obj.tablet !== undefined) return obj.tablet;
     
     if (obj.desktop !== undefined) return obj.desktop;
     if (obj.base !== undefined) return obj.base;
  }
  
  // Fallback if it's an object but not a responsive wrapper
  return propValue as T;
};

// Helper to mutate a responsive prop safely
export const updateResponsiveProp = <T,>(currentValue: ResponsiveValue<T> | undefined, newValue: T, currentMode: DeviceMode): ResponsiveValue<T> => {
  if (currentValue === undefined || currentValue === null) {
    if (currentMode === "desktop") return newValue;
    return { base: newValue, [currentMode]: newValue };
  }
  
  if (typeof currentValue !== 'object' || Array.isArray(currentValue)) {
    // If it's a scalar value but we are on mobile, we convert it to an object
    if (currentMode === "desktop") return newValue;
    return { base: currentValue as T, [currentMode]: newValue };
  }
  
  // It's already an object
  return { ...currentValue, [currentMode]: newValue };
};
