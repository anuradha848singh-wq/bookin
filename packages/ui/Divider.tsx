import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  className = '',
}) => {
  const classNames = [
    styles.divider,
    styles[orientation],
    label ? styles.hasLabel : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="separator" aria-orientation={orientation}>
      {label && orientation === 'horizontal' && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
};

Divider.displayName = 'Divider';
