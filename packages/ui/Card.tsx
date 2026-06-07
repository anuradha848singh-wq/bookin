import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  hoverable?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = 'md',
      elevated = false,
      hoverable = false,
      interactive = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.card,
      styles[padding],
      elevated && styles.elevated,
      hoverable && styles.hoverable,
      interactive && styles.interactive,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
