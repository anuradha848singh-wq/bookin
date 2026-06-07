'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '700px',
        padding: '3rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2rem',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          BookIn
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Patient Booking System
        </p>

        {/* Preview Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <Link
            href="/preview"
            style={{
              padding: '1.5rem',
              background: hoveredLink === 'preview' 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.2s',
              border: '2px solid',
              borderColor: hoveredLink === 'preview' 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'transparent',
              transform: hoveredLink === 'preview' 
                ? 'translateY(-2px)' 
                : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredLink('preview')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>UI Components</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>
              View all design system components
            </div>
          </Link>

          <Link
            href="/templates-preview"
            style={{
              padding: '1.5rem',
              background: hoveredLink === 'templates' 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.2s',
              border: '2px solid',
              borderColor: hoveredLink === 'templates' 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'transparent',
              transform: hoveredLink === 'templates' 
                ? 'translateY(-2px)' 
                : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredLink('templates')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎭</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Templates</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Preview & customize templates
            </div>
          </Link>
        </div>

        {/* Clinic Testing */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Test with Real Clinic</h2>
          <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            To test a clinic booking page, visit a subdomain:
          </p>
          <code style={{
            display: 'block',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.95rem',
            fontFamily: 'monospace',
          }}>
            http://[clinic-slug].localhost:3003
          </code>
        </div>

        <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>
          Create a clinic via the Dashboard API first to test the full booking flow.
        </p>
      </div>
    </div>
  );
}
