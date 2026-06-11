"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TokenCategory = 'colors' | 'typography' | 'spacing' | 'radius' | 'shadows';

export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  category: TokenCategory;
  isDefault?: boolean;
}

interface ThemeTokenContextType {
  tokens: ThemeToken[];
  addToken: (token: Omit<ThemeToken, 'id'>) => void;
  updateToken: (id: string, value: string, name?: string) => void;
  deleteToken: (id: string) => void;
  getTokenValue: (name: string) => string | undefined;
}

export const defaultTokens: ThemeToken[] = [
  { id: 't-col-1', name: 'Primary', value: '#4F46E5', category: 'colors', isDefault: true },
  { id: 't-col-2', name: 'Secondary', value: '#7C3AED', category: 'colors', isDefault: true },
  { id: 't-col-3', name: 'Accent', value: '#F59E0B', category: 'colors', isDefault: true },
  { id: 't-col-4', name: 'Background', value: '#FFFFFF', category: 'colors', isDefault: true },
  { id: 't-col-5', name: 'Surface', value: '#F9FAFB', category: 'colors', isDefault: true },
  { id: 't-col-6', name: 'Text Primary', value: '#111827', category: 'colors', isDefault: true },
  { id: 't-col-7', name: 'Text Secondary', value: '#6B7280', category: 'colors', isDefault: true },
  { id: 't-col-8', name: 'Border', value: '#E5E7EB', category: 'colors', isDefault: true },
  { id: 't-col-9', name: 'Error', value: '#EF4444', category: 'colors', isDefault: true },
  { id: 't-col-10', name: 'Success', value: '#10B981', category: 'colors', isDefault: true },
  
  { id: 't-font-1', name: 'Body Font', value: 'Inter, sans-serif', category: 'typography', isDefault: true },
  { id: 't-font-2', name: 'Heading Font', value: 'Inter, sans-serif', category: 'typography', isDefault: true },
  
  { id: 't-space-1', name: 'SM', value: '8px', category: 'spacing', isDefault: true },
  { id: 't-space-2', name: 'MD', value: '16px', category: 'spacing', isDefault: true },
  { id: 't-space-3', name: 'LG', value: '24px', category: 'spacing', isDefault: true },
  
  { id: 't-rad-1', name: 'SM', value: '4px', category: 'radius', isDefault: true },
  { id: 't-rad-2', name: 'MD', value: '8px', category: 'radius', isDefault: true },
  { id: 't-rad-3', name: 'LG', value: '12px', category: 'radius', isDefault: true },
];

const ThemeTokenContext = createContext<ThemeTokenContextType | undefined>(undefined);

export const ThemeTokenProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<ThemeToken[]>(defaultTokens);

  const addToken = (token: Omit<ThemeToken, 'id'>) => {
    const id = `t-${Date.now()}`;
    setTokens([...tokens, { ...token, id }]);
  };

  const updateToken = (id: string, value: string, name?: string) => {
    setTokens(tokens.map(t => t.id === id ? { ...t, value, name: name || t.name } : t));
  };

  const deleteToken = (id: string) => {
    setTokens(tokens.filter(t => t.id !== id || t.isDefault));
  };

  const getTokenValue = (name: string) => {
    return tokens.find(t => t.name === name)?.value;
  };

  return (
    <ThemeTokenContext.Provider value={{ tokens, addToken, updateToken, deleteToken, getTokenValue }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root, .craft-editor {
            ${tokens.map(t => `--token-${t.name.toLowerCase().replace(/\s+/g, '-')}: ${t.value};`).join('\n            ')}
          }
        `
      }} />
      {children}
    </ThemeTokenContext.Provider>
  );
};

export const useThemeTokens = () => {
  const context = useContext(ThemeTokenContext);
  if (!context) {
    throw new Error('useThemeTokens must be used within a ThemeTokenProvider');
  }
  return context;
};
