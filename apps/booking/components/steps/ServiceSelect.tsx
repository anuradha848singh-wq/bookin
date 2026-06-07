import React from 'react';
import { Card } from '@book-in/ui';
import type { Service } from '../../types/booking';
import styles from './ServiceSelect.module.css';

export interface ServiceSelectProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export const ServiceSelect: React.FC<ServiceSelectProps> = ({
  services,
  selectedService,
  onSelect,
}) => {
  if (services.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Select a Service</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No services available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select a Service</h2>
      <div className={styles.serviceList}>
        {services.map((service) => (
          <Card
            key={service.id}
            className={styles.serviceCard}
            hoverable
            interactive
            onClick={() => onSelect(service)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(service);
              }
            }}
            aria-label={`Select ${service.name} service, ${service.duration} minutes, ₹${service.price}`}
          >
            <div className={styles.serviceInfo}>
              <div className={styles.serviceName}>{service.name}</div>
              <div className={styles.serviceMeta}>
                <span className={styles.duration}>
                  <span aria-hidden="true">⏱</span>
                  <span>{service.duration} mins</span>
                </span>
              </div>
            </div>
            <div className={styles.servicePrice}>₹{parseFloat(service.price).toFixed(2)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
