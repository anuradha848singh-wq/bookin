/**
 * Template Registry
 * 
 * All available booking templates.
 * Templates are lazy-loaded to optimize bundle size.
 */

import { lazy } from 'react';

export const templates = {
  minimal: lazy(() =>
    import('./minimal').then((module) => ({ default: module.MinimalTemplate }))
  ),
  medical: lazy(() =>
    import('./medical').then((module) => ({ default: module.MedicalTemplate }))
  ),
  modern: lazy(() =>
    import('./modern').then((module) => ({ default: module.ModernTemplate }))
  ),
  salon: lazy(() =>
    import('./salon').then((module) => ({ default: module.SalonTemplate }))
  ),
};

export type TemplateId = keyof typeof templates;

export const templateMetadata = {
  minimal: {
    name: 'Minimal',
    description: 'Clean and professional design for modern clinics',
    preview: '/templates/minimal-preview.jpg',
  },
  medical: {
    name: 'Medical',
    description: 'Healthcare-focused with trust signals',
    preview: '/templates/medical-preview.jpg',
  },
  modern: {
    name: 'Modern',
    description: 'Bold and vibrant for lifestyle services',
    preview: '/templates/modern-preview.jpg',
  },
  salon: {
    name: 'Salon',
    description: 'Elegant, lifestyle-focused with warm, calming hues',
    preview: '/templates/salon-preview.jpg',
  },
};
