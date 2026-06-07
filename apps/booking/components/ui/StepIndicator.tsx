import React from 'react';
import type { BookingStep } from '../../types/booking';
import styles from './StepIndicator.module.css';

export interface StepIndicatorProps {
  currentStep: BookingStep;
  labels?: string[];
}

const defaultLabels = ['Service', 'Time', 'Details', 'Verify'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  labels = defaultLabels,
}) => {
  const totalSteps = 4;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={styles.container} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className={styles.progressLine}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className={styles.steps}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={stepNumber}
              className={`${styles.step} ${isActive ? styles.active : ''} ${
                isCompleted ? styles.completed : ''
              }`}
            >
              <div className={styles.stepCircle} aria-label={`Step ${stepNumber}: ${labels[i]}`}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={styles.stepLabel}>{labels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
