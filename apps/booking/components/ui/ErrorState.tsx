import React from 'react';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-error-500)',
        backgroundColor: 'var(--color-error-50, rgba(239, 68, 68, 0.04))',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-error-500)',
          fontWeight: 'bold',
          fontSize: 'var(--font-size-xl)',
        }}
      >
        !
      </div>
      <div>
        <h4
          style={{
            margin: 0,
            color: 'var(--color-error-600)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-base)',
          }}
        >
          Something went wrong
        </h4>
        <p
          style={{
            margin: 'var(--space-1) 0 0 0',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: 'var(--primary, var(--color-primary-600))',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-dark, var(--color-primary-700))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary, var(--color-primary-600))';
          }}
        >
          Retry Request
        </button>
      )}
    </div>
  );
};
