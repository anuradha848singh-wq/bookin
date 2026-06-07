import React from 'react';

export const LoadingSlots: React.FC = () => {
  // Render 8 placeholder items
  const placeholders = Array.from({ length: 8 });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--space-3)',
        width: '100%',
      }}
    >
      {placeholders.map((_, i) => (
        <div
          key={i}
          style={{
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(90deg, var(--color-background-tertiary) 25%, var(--color-border) 50%, var(--color-background-tertiary) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
