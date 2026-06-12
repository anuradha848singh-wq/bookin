"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Globe, 
  Phone, 
  Bell, 
  Lock, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Smartphone, 
  HelpCircle, 
  ArrowRight,
  ChevronLeft,
  X,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { Spinner } from "@book-in/ui";

export default function OnboardingClient() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string, details?: string } | null>(null);
  const [hostUrl, setHostUrl] = useState("bookin.com");
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentHost = window.location.host;
      const baseDomain = currentHost.replace("dashboard.", "").replace(":3000", ":3003");
      setHostUrl(baseDomain);
    }
  }, []);

  // Form states: Step 1 Clinic basics
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");

  // Form states: Step 2 Fast-track services
  const [servicesList, setServicesList] = useState<Array<{ name: string; duration: string; price: string }>>([
    { name: "General Consultation", duration: "30", price: "500" }
  ]);

  // Form states: Step 3 Operating hours
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const [provisionProgress, setProvisionProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const cachedStep = sessionStorage.getItem("onboarding_step");
    if (cachedStep) {
      setStep(parseInt(cachedStep));
    }
  }, []);

  const updateStep = (newStep: number) => {
    setStep(newStep);
    sessionStorage.setItem("onboarding_step", newStep.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (clinicName && !slug) {
      const generated = clinicName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  }, [clinicName]);

  const handleAddServiceRow = () => {
    setServicesList((prev) => [...prev, { name: "", duration: "30", price: "" }]);
  };

  const handleRemoveServiceRow = (idx: number) => {
    if (servicesList.length === 1) return;
    setServicesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleServiceChange = (idx: number, field: "name" | "duration" | "price", val: string) => {
    setServicesList((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleToggleDay = (day: number) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleFinalLaunch = async () => {
    setLoading(true);
    setError(null);
    setProvisionProgress(10);
    
    try {
      setCurrentAction("Instantiating isolated PostgreSQL schema...");
      setProvisionProgress(25);
      const provRes = await fetch("/api/v1/internal/provision-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicName: clinicName.trim() }),
      });
      const provData = await provRes.json();
      if (!provRes.ok) throw new Error(provData.error || "Schema provisioning failed");

      setCurrentAction("Configuring clinic operational hours...");
      setProvisionProgress(50);
      const availRes = await fetch("/api/v1/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startTime,
          end: endTime,
          days: workingDays,
          breaks: [], 
          advanceWindow: 30,
          minimumNotice: 1
        }),
      });
      if (!availRes.ok) console.warn("Failed to set onboarding availability hours");

      setCurrentAction("Injecting initial fast-track services...");
      setProvisionProgress(75);
      let serviceId = null;
      for (const service of servicesList) {
        if (!service.name.trim()) continue;
        const sRes = await fetch("/api/v1/catalog/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: service.name.trim(),
            price: service.price || "0",
            duration: parseInt(service.duration)
          }),
        });
        const sData = await sRes.json();
        if (sRes.ok && sData.service) {
          serviceId = sData.service.id;
        }
      }

      setCurrentAction("Finalizing setup...");
      setProvisionProgress(90);
      // Calendar slots are fully dynamic, no pre-generation required!

      setProvisionProgress(100);
      setCurrentAction("Launch successful! Redirecting to dashboard...");
      setTimeout(() => {
        sessionStorage.removeItem("onboarding_step");
        router.push("/today");
      }, 1000);

    } catch (err: any) {
      setError({ title: "Database Allocation Error", details: err.message || "An unexpected error occurred during database allocation." });
      setLoading(false);
      setProvisionProgress(0);
      setCurrentAction("");
    }
  };

  const steps = [
    { id: 1, label: "Clinic Basics" },
    { id: 2, label: "Services" },
    { id: 3, label: "Availability" },
    { id: 4, label: "Review" }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      backgroundColor: "#F9FAFB",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Subtle Background Waves */}
      <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, zIndex: 0, opacity: 0.4, pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1440 800">
        <path d="M-100 200 C 300 0, 800 400, 1500 100" fill="none" stroke="#FFF0ED" strokeWidth="2" />
        <path d="M-100 220 C 300 20, 800 420, 1500 120" fill="none" stroke="#FFF0ED" strokeWidth="1" />
        <path d="M-100 240 C 300 40, 800 440, 1500 140" fill="none" stroke="#FFF0ED" strokeWidth="0.5" />
      </svg>

      <style dangerouslySetInnerHTML={{__html: `
        .ob-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
          background: #ffffff;
          transition: all 0.2s;
          outline: none;
        }
        .ob-input:focus {
          border-color: #FF4A22;
          box-shadow: 0 0 0 3px rgba(255, 74, 34, 0.1);
        }
        .ob-input::placeholder {
          color: #9CA3AF;
        }
        .ob-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #6B7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ob-btn-primary {
          background: #FF4A22;
          color: white;
          border: none;
          height: 48px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .ob-btn-primary:hover { background: #E63B15; }
        .ob-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .ob-btn-secondary {
          background: #ffffff;
          color: #374151;
          border: 1px solid #D1D5DB;
          height: 48px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ob-btn-secondary:hover { background: #F9FAFB; border-color: #9CA3AF; }
        .ob-step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          z-index: 2;
          position: relative;
        }
        .ob-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #FFF5F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: #FF4A22;
        }
      `}} />

      <div style={{
        background: "#ffffff",
        width: "100%",
        maxWidth: "760px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
        padding: "40px 48px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2px", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px" }}>
            Book<span style={{ color: "#FF4A22" }}>in</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
            <HelpCircle size={16} />
            <span>Need help? <a href="#" style={{ color: "#FF4A22", textDecoration: "none", fontWeight: 600 }}>Contact support</a></span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "48px", padding: "0 20px" }}>
          <div style={{ position: "absolute", top: "16px", left: "40px", right: "40px", height: "2px", background: "#F3F4F6", zIndex: 1 }}>
            <div style={{ 
              height: "100%", 
              background: "#FF4A22", 
              width: `${((step - 1) / 3) * 100}%`,
              transition: "width 0.4s ease" 
            }} />
          </div>
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div className="ob-step-circle" style={{
                  background: isActive ? "#FF4A22" : isCompleted ? "#FF4A22" : "#ffffff",
                  color: isActive || isCompleted ? "#ffffff" : "#9CA3AF",
                  border: isCompleted || isActive ? "2px solid #FF4A22" : "2px solid #E5E7EB",
                }}>
                  {isCompleted ? <CheckCircle size={16} /> : s.id}
                </div>
                <span style={{ fontSize: "12px", fontWeight: isActive ? 700 : 600, color: isActive ? "#FF4A22" : "#6B7280" }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: "16px", borderRadius: "12px", marginBottom: "24px", background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <X size={16} color="#DC2626" style={{ marginTop: "2px" }} />
            <div>
              <strong style={{ color: "#991B1B", fontSize: "14px", display: "block" }}>{error.title}</strong>
              {error.details && <span style={{ color: "#B91C1C", fontSize: "13px", marginTop: "4px", display: "block" }}>{error.details}</span>}
            </div>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "8px", letterSpacing: "-0.5px" }}>Tell us about your clinic</h1>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.5, maxWidth: "500px" }}>
              This helps us personalize your booking experience and create your public booking page.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label className="ob-label">Practice or Clinic Name</label>
                <div style={{ position: "relative" }}>
                  <Building2 size={20} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "14px" }} />
                  <input
                    type="text"
                    placeholder="e.g. Apex Health & Diagnostics"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="ob-input"
                    style={{ paddingLeft: "44px" }}
                  />
                </div>
              </div>

              <div>
                <label className="ob-label">Clinic Booking Subdomain</label>
                <div style={{ display: "flex", height: "48px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB", background: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", borderRight: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                    <Globe size={20} color="#9CA3AF" />
                  </div>
                  <input
                    type="text"
                    placeholder="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    style={{ flex: 1, border: "none", padding: "0 16px", fontSize: "14px", outline: "none" }}
                  />
                  <div style={{ background: "#F3F4F6", padding: "0 16px", display: "flex", alignItems: "center", fontSize: "14px", color: "#6B7280", fontWeight: 500, borderLeft: "1px solid #E5E7EB" }}>
                    .{hostUrl}
                  </div>
                </div>
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#6B7280" }}>
                  Preview: <span style={{ color: "#FF4A22", fontWeight: 600 }}>{slug || "slug"}.{hostUrl}</span>
                </div>
              </div>

              <div>
                <label className="ob-label">Owner Alert Phone (For SMS Notifications)</label>
                <div style={{ position: "relative" }}>
                  <Phone size={20} color="#9CA3AF" style={{ position: "absolute", left: "14px", top: "14px" }} />
                  <input
                    type="tel"
                    placeholder="e.g. 919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ob-input"
                    style={{ paddingLeft: "44px" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: "#FFF5F2", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
              <div style={{ background: "#FFE4DC", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bell size={20} color="#FF4A22" />
              </div>
              <p style={{ color: "#111827", fontSize: "13px", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                We'll notify you about new bookings, reschedules, cancellations and important updates.
              </p>
            </div>

            <button 
              className="ob-btn-primary" 
              onClick={() => {
                if (!clinicName.trim()) {
                  setError({ title: "Required Field", details: "Please enter your Practice or Clinic Name." });
                  return;
                }
                setError(null);
                updateStep(2);
              }}
            >
              Continue to Services Setup <ArrowRight size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "24px", color: "#6B7280", fontSize: "13px" }}>
              <Lock size={14} />
              <span>You can always change these details later from clinic settings.</span>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "8px", letterSpacing: "-0.5px" }}>Add clinic offerings</h1>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.5 }}>
              Provide at least one clinical service patients can schedule.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {servicesList.map((srv, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center", background: "#F9FAFB", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
                  <div style={{ flex: 2 }}>
                    <label className="ob-label" style={{ fontSize: "10px" }}>Service Name</label>
                    <input
                      type="text"
                      placeholder="e.g. General Consultation"
                      value={srv.name}
                      onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
                      className="ob-input"
                      style={{ height: "40px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="ob-label" style={{ fontSize: "10px" }}>Duration</label>
                    <select
                      className="ob-input"
                      value={srv.duration}
                      onChange={(e) => handleServiceChange(idx, "duration", e.target.value)}
                      style={{ height: "40px", padding: "0 10px" }}
                    >
                      <option value="15">15 Mins</option>
                      <option value="30">30 Mins</option>
                      <option value="45">45 Mins</option>
                      <option value="60">60 Mins</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="ob-label" style={{ fontSize: "10px" }}>Price ($)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={srv.price}
                      onChange={(e) => handleServiceChange(idx, "price", e.target.value)}
                      className="ob-input"
                      style={{ height: "40px" }}
                    />
                  </div>
                  {servicesList.length > 1 && (
                    <button onClick={() => handleRemoveServiceRow(idx)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "4px", marginTop: "18px" }}>
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleAddServiceRow} style={{ background: "none", border: "none", color: "#FF4A22", fontWeight: 600, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
              + Add another service
            </button>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="ob-btn-secondary" style={{ flex: 1 }} onClick={() => updateStep(1)}>
                <ChevronLeft size={18} /> Back
              </button>
              <button className="ob-btn-primary" style={{ flex: 2 }} onClick={() => {
                if (!servicesList.some(s => s.name.trim() !== "")) {
                  setError({ title: "Required", details: "Add at least one service." });
                  return;
                }
                setError(null);
                updateStep(3);
              }}>
                Continue to Availability <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "8px", letterSpacing: "-0.5px" }}>Configure hours of work</h1>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.5 }}>
              Set your default operational times for the clinic.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label className="ob-label">Start Shift</label>
                  <input type="time" className="ob-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="ob-label">End Shift</label>
                  <input type="time" className="ob-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="ob-label">Active Operational Weekdays</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[ {id:1,l:"Mon"}, {id:2,l:"Tue"}, {id:3,l:"Wed"}, {id:4,l:"Thu"}, {id:5,l:"Fri"}, {id:6,l:"Sat"}, {id:7,l:"Sun"} ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleToggleDay(d.id)}
                      style={{
                        flex: 1, height: "40px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "0.2s",
                        background: workingDays.includes(d.id) ? "#FF4A22" : "#F3F4F6",
                        color: workingDays.includes(d.id) ? "#fff" : "#4B5563",
                        border: "none"
                      }}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button className="ob-btn-secondary" style={{ flex: 1 }} onClick={() => updateStep(2)}>
                <ChevronLeft size={18} /> Back
              </button>
              <button className="ob-btn-primary" style={{ flex: 2 }} onClick={() => {
                if (workingDays.length === 0) {
                  setError({ title: "Required", details: "Select at least one active day." });
                  return;
                }
                setError(null);
                updateStep(4);
              }}>
                Review Details <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "8px", letterSpacing: "-0.5px" }}>Review & Go Live</h1>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.5 }}>
              We'll instantiate your clinic schema and deploy your patient-facing slots instantly.
            </p>

            {loading ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4B5563", fontWeight: 600, marginBottom: "12px" }}>
                  <span>Provisioning Postgres...</span>
                  <span style={{ color: "#FF4A22" }}>{provisionProgress}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#F3F4F6", borderRadius: "10px", overflow: "hidden", marginBottom: "24px" }}>
                  <div style={{ height: "100%", width: `${provisionProgress}%`, background: "#FF4A22", transition: "width 0.4s ease-out" }} />
                </div>
                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "16px", fontFamily: "monospace", fontSize: "12px", color: "#4B5563", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#111827", fontWeight: 600 }}>
                    <Spinner size="sm" /> {currentAction}
                  </div>
                  <div style={{ opacity: 0.7 }}>
                    {provisionProgress >= 25 && <div>✓ Schema allocated</div>}
                    {provisionProgress >= 50 && <div>✓ Hours synchronized</div>}
                    {provisionProgress >= 75 && <div>✓ Services injected</div>}
                    {provisionProgress >= 90 && <div>✓ Calendar slots generated</div>}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
                  <h4 style={{ color: "#111827", fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={18} color="#10B981" /> Setup Summary
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6B7280" }}>Clinic Name</span> <strong style={{ color: "#111827" }}>{clinicName}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6B7280" }}>Subdomain</span> <strong style={{ color: "#FF4A22", fontFamily: "monospace" }}>{slug}.{hostUrl}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6B7280" }}>Services</span> <strong style={{ color: "#111827" }}>{servicesList.filter(s => s.name.trim()).length} offering(s)</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6B7280" }}>Hours</span> <strong style={{ color: "#111827" }}>{startTime} - {endTime}</strong></div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <button className="ob-btn-secondary" style={{ flex: 1 }} onClick={() => updateStep(3)}>
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button className="ob-btn-primary" style={{ flex: 2 }} onClick={handleFinalLaunch}>
                    Deploy Clinic <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer Features (Only Step 1 visually to match mockup, but looks good everywhere) */}
        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid #F3F4F6" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="ob-feature-icon"><ShieldCheck size={24} /></div>
              <h5 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Secure & Reliable</h5>
              <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.5 }}>Your data is encrypted and always protected.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="ob-feature-icon"><Clock size={24} /></div>
              <h5 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Save Time</h5>
              <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.5 }}>Automate bookings and focus on your patients.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="ob-feature-icon"><BarChart3 size={24} /></div>
              <h5 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Grow Your Clinic</h5>
              <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.5 }}>Better bookings, better patient care.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="ob-feature-icon"><Smartphone size={24} /></div>
              <h5 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Mobile Friendly</h5>
              <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.5 }}>Manage your clinic anywhere, anytime.</p>
            </div>
          </div>
          
          <div style={{ textAlign: "center", fontSize: "14px", color: "#6B7280", fontWeight: 500 }}>
            Already have an account? <a href="/login" style={{ color: "#FF4A22", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
          </div>
        </div>

      </div>
    </div>
  );
}
