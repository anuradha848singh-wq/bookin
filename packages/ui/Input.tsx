import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      required,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const wrapperClasses = [
      styles.wrapper,
      hasError && styles.error,
      styles[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      styles.input,
      leftIcon && styles.withLeftIcon,
      rightIcon && styles.withRightIcon,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-label="required">*</span>}
          </label>
        )}
        <div className={styles.inputContainer}>
          {leftIcon && <span className={styles.leftIcon} aria-hidden="true">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            required={required}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon} aria-hidden="true">{rightIcon}</span>}
        </div>
        {error && (
          <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
            ⚠ {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
