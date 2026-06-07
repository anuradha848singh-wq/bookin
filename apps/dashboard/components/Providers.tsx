"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@book-in/ui";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryProvider>
    </NextThemesProvider>
  );
}
