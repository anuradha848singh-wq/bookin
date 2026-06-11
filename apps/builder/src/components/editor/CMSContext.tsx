"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface CMSContextType {
  data: Record<string, any>;
  resolvePath: (path: string) => any;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider = ({ children }: { children: ReactNode }) => {
  const mockData = {
    clinic: {
      name: "Apex Health Dermatology",
      phone: "+1 (555) 123-4567",
      email: "hello@apexhealth.com",
    },
    service: {
      title: "Advanced Skin Diagnostics",
      description: "State of the art skin mapping and diagnostic imaging.",
      price: "$199",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000",
    },
    staff: {
      name: "Dr. Sarah Jenkins",
      role: "Lead Dermatologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500",
    }
  };

  const resolvePath = (path: string) => {
    if (!path) return undefined;
    const parts = path.split(".");
    let current: any = mockData;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  };

  return (
    <CMSContext.Provider value={{ data: mockData, resolvePath }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    return { data: {}, resolvePath: () => undefined };
  }
  return context;
};
