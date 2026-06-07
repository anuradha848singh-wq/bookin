import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'current';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
}) => {
  const classNames = [styles.spinner, styles[size], styles[color]]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container} role="status" aria-label={label}>
      <svg className={classNames} viewBox="0 0 24 24" fill="none">
        <circle
          className={styles.track}
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
        />
        <circle
          className={styles.progress}
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';
