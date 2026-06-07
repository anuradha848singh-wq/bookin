import React from 'react';

export interface SlotButtonProps {
  slot: {
    id: string;
    starts_at: string;
    ends_at: string;
  };
  isSelected?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const SlotButton: React.FC<SlotButtonProps> = ({
  slot,
  isSelected = false,
  isLoading = false,
  onClick,
  disabled = false,
}) => {
  const timeStr = new Date(slot.starts_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        width: '100%',
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        borderRadius: 'var(--radius-md)',
        border: isSelected
          ? '2px solid var(--primary, var(--color-primary-600))'
          : '1px solid var(--color-border)',
        background: isSelected
          ? 'var(--primary-light, rgba(99, 102, 241, 0.1))'
          : 'var(--color-surface)',
        color: isSelected
          ? 'var(--primary, var(--color-primary-700))'
          : 'var(--color-text-primary)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        transition: 'all var(--transition-fast)',
        fontFamily: 'inherit',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected && !disabled && !isLoading) {
          e.currentTarget.style.borderColor = 'var(--primary, var(--color-primary-400))';
          e.currentTarget.style.background = 'var(--color-background-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !disabled && !isLoading) {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.background = 'var(--color-surface)';
        }
      }}
    >
      {isLoading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: 'var(--primary, var(--color-primary-600))',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        <span>{timeStr}</span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
