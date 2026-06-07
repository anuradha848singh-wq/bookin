"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useBookingStore } from "../../lib/store";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserIcon,
  StarIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "lucide-react";

export type LiveBookingWidgetProps = {
  clinicSlug?: string;
  initialServices?: any[];
  themeColor?: string;
  defaultCategory?: string;
};

type BookingStep = 1 | 2 | 3 | 4 | 5; // 1=Service, 2=Date, 3=Time, 4=Details, 5=Confirmed

export const LiveBookingWidget = ({
  clinicSlug = "",
  initialServices,
  themeColor = "#3b82f6",
  defaultCategory,
}: LiveBookingWidgetProps) => {
  const [step, setStep] = useState<BookingStep>(1);
  const [services, setServices] = useState<any[]>(initialServices || []);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialServices?.length);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const { service, setService, date, setDate, timeSlot, setTimeSlot, customer, setCustomer, reset } = useBookingStore();

  // Fetch services on mount if not pre-loaded
  useEffect(() => {
    if (initialServices?.length) {
      setServices(initialServices);
      setLoading(false);
      return;
    }
    if (!clinicSlug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/services?clinicSlug=${clinicSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services || []);
        else setError("Could not load services.");
      })
      .catch(() => setError("Failed to connect. Please refresh."))
      .finally(() => setLoading(false));
  }, [clinicSlug, initialServices]);

  // Fetch real availability slots
  const fetchSlots = useCallback(
    (selectedDate: string) => {
      if (!service || !clinicSlug) return;
      setLoading(true);
      setError(null);
      setSlots([]);
      fetch(`/api/slots?clinicSlug=${clinicSlug}&serviceId=${service.id}&date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setSlots(data.slots || []);
          else setError(data.error || "Failed to load availability.");
        })
        .catch(() => setError("Network error. Please try again."))
        .finally(() => setLoading(false));
    },
    [service, clinicSlug]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    setTimeSlot(null);
    if (newDate) fetchSlots(newDate);
  };

  // Get today's date string for min date constraint
  const today = new Date().toISOString().split("T")[0];

  // Submit booking to real API
  const submitBooking = async () => {
    if (!service || !date || !timeSlot || !customer.firstName || !customer.email) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          serviceId: service.id,
          date,
          time: timeSlot,
          customer: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
          },
          notes: "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setConfirmedBooking(data.booking);
        setStep(5);
      } else {
        setError(data.error || "Booking failed. Please try another time.");
        if (res.status === 409) {
          // Conflict — refresh slots
          setTimeSlot(null);
          if (date) fetchSlots(date);
          setStep(3);
        }
      }
    } catch {
      setError("Network error. Your booking was not created. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    reset();
    setSlots([]);
    setConfirmedBooking(null);
    setError(null);
    setStep(1);
  };

  // Colour helpers
  const accent = themeColor;
  const accentLight = themeColor + "15";

  const stepNames = ["Service", "Date", "Time", "Your Details"];
  const currentStepIdx = Math.min(step - 1, 3);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "760px",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 4px 40px rgba(0,0,0,0.10)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        fontFamily: "'Inter', 'Outfit', system-ui, sans-serif",
      }}
    >
      {/* ─── Progress Header ─── */}
      {step < 5 && (
        <div style={{ display: "flex", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          {stepNames.map((name, i) => {
            const isActive = i === currentStepIdx;
            const isDone = i < currentStepIdx;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "14px 8px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: isActive ? accent : isDone ? "#10b981" : "#9ca3af",
                  borderBottom: isActive ? `3px solid ${accent}` : isDone ? "3px solid #10b981" : "3px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {isDone ? "✓ " : `${i + 1}. `}{name}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ padding: "32px" }}>
        {/* ─── Error Banner ─── */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#991b1b",
              fontSize: "14px",
            }}
          >
            <AlertCircleIcon size={16} />
            {error}
          </div>
        )}

        {/* ─── STEP 1: SELECT SERVICE ─── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>
              What can we help with?
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
              Select a service to check availability and book your appointment.
            </p>

            {loading ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                <LoaderIcon size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                <p>Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                <p>No services are currently available for booking.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setService(s);
                      setStep(2);
                    }}
                    style={{
                      padding: "18px",
                      border: "2px solid",
                      borderColor: service?.id === s.id ? accent : "#e5e7eb",
                      borderRadius: "14px",
                      background: service?.id === s.id ? accentLight : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: s.color || accent,
                        marginBottom: "4px",
                      }}
                    />
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{s.name}</div>
                    {s.category_name && (
                      <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{s.category_name}</div>
                    )}
                    {s.short_description && (
                      <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>{s.short_description}</div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "#f3f4f6",
                          color: "#374151",
                          padding: "3px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        ⏱ {s.duration_minutes} min
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: accent }}>
                        ${Number(s.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: SELECT DATE ─── */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}
            >
              <ArrowLeftIcon size={14} /> Back
            </button>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
              Choose a Date
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
              Booking: <strong>{service?.name}</strong>
            </p>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px",
                maxWidth: "360px",
              }}
            >
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                Select Appointment Date
              </label>
              <input
                type="date"
                min={today}
                value={date || ""}
                onChange={handleDateChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setStep(3)}
                disabled={!date}
                style={{
                  background: date ? accent : "#e5e7eb",
                  color: date ? "#fff" : "#9ca3af",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: date ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                View Available Times <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: SELECT TIME ─── */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}
            >
              <ArrowLeftIcon size={14} /> Back
            </button>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
              Pick a Time
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
              <CalendarIcon size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              {date} — {service?.name}
            </p>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <LoaderIcon size={28} style={{ animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
                <p style={{ fontSize: "14px" }}>Checking availability...</p>
              </div>
            ) : slots.length === 0 ? (
              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  color: "#92400e",
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: "6px" }}>No slots available</p>
                <p style={{ fontSize: "13px" }}>
                  No availability on {date}. Please{" "}
                  <button onClick={() => setStep(2)} style={{ color: accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
                    choose another date
                  </button>
                  .
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "10px" }}>
                {slots.map((slot, i) => {
                  const isSelected = timeSlot === slot.time;
                  return (
                    <button
                      key={i}
                      onClick={() => setTimeSlot(slot.time)}
                      style={{
                        padding: "10px 6px",
                        border: "2px solid",
                        borderColor: isSelected ? accent : "#e5e7eb",
                        borderRadius: "10px",
                        background: isSelected ? accent : "#fff",
                        color: isSelected ? "#fff" : "#374151",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setStep(4)}
                disabled={!timeSlot}
                style={{
                  background: timeSlot ? accent : "#e5e7eb",
                  color: timeSlot ? "#fff" : "#9ca3af",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: timeSlot ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Continue <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: CUSTOMER DETAILS ─── */}
        {step === 4 && (
          <div>
            <button
              onClick={() => setStep(3)}
              style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", marginBottom: "20px" }}
            >
              <ArrowLeftIcon size={14} /> Back
            </button>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "20px" }}>
              Your Details
            </h2>

            {/* Booking summary card */}
            <div
              style={{
                background: accentLight,
                border: `1px solid ${accent}40`,
                borderRadius: "14px",
                padding: "16px 20px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "15px", color: "#111827" }}>{service?.name}</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                  <CalendarIcon size={13} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {date}
                  <span style={{ margin: "0 8px" }}>•</span>
                  <ClockIcon size={13} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  {timeSlot}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: "18px", color: accent }}>
                ${Number(service?.price || 0).toFixed(2)}
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={customer.firstName}
                  onChange={(e) => setCustomer("firstName", e.target.value)}
                  placeholder="Jane"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={customer.lastName}
                  onChange={(e) => setCustomer("lastName", e.target.value)}
                  placeholder="Doe"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer("email", e.target.value)}
                  placeholder="jane@example.com"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer("phone", e.target.value)}
                  placeholder="+1 555 000 0000"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={submitBooking}
                disabled={!customer.firstName || !customer.email || submitting}
                style={{
                  background: customer.firstName && customer.email && !submitting ? accent : "#e5e7eb",
                  color: customer.firstName && customer.email && !submitting ? "#fff" : "#9ca3af",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: customer.firstName && customer.email && !submitting ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: customer.firstName && customer.email && !submitting ? `0 4px 15px ${accent}50` : "none",
                }}
              >
                {submitting ? (
                  <>
                    <LoaderIcon size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon size={16} />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 5: CONFIRMATION ─── */}
        {step === 5 && confirmedBooking && (
          <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "#d1fae5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircleIcon size={40} color="#059669" />
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
              Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
            </p>

            {/* Booking card */}
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px 24px",
                maxWidth: "400px",
                margin: "0 auto 28px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Booking Summary
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Service</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{confirmedBooking.service_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Date & Time</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Client</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{confirmedBooking.client_name}</span>
                </div>
                <div style={{ height: "1px", background: "#e5e7eb", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Reference</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: accent,
                      background: accentLight,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                    }}
                  >
                    {confirmedBooking.reference_number}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
              Confirmation sent to <strong>{confirmedBooking.client_email}</strong>
            </p>

            <button
              onClick={handleStartOver}
              style={{
                background: "none",
                border: `2px solid ${accent}`,
                color: accent,
                padding: "10px 24px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
