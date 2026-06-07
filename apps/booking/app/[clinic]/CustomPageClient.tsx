"use client";

import React, { useState, useEffect } from "react";
import lz from "lz-string";
import { CustomPageRenderer } from "../../components/CustomPageRenderer";

interface CustomPageClientProps {
  compressedLayout: string;
  bookingWidget: React.ReactNode;
}

export const CustomPageClient = ({ compressedLayout, bookingWidget }: CustomPageClientProps) => {
  const [layoutData, setLayoutData] = useState<any>(null);

  useEffect(() => {
    try {
      if (compressedLayout) {
        const decompressed = lz.decompressFromEncodedURIComponent(compressedLayout);
        if (decompressed) {
          setLayoutData(JSON.parse(decompressed));
        }
      }
    } catch (err) {
      console.error("Failed to parse custom page layout:", err);
    }
  }, [compressedLayout]);

  if (!layoutData) {
    // Render the booking widget directly as fallback while decompressing
    return <div style={{ width: "100%" }}>{bookingWidget}</div>;
  }

  return (
    <CustomPageRenderer tree={layoutData} bookingWidget={bookingWidget} />
  );
};
