"use client";

import React, { useState } from "react";
import { 
  Search, Bell, Plus, MoreHorizontal, Calendar as CalendarIcon, Clock, Heart, PlusCircle, Activity,
  ChevronDown, Settings, Play, CheckCircle2, AlertCircle, RefreshCw, Layers, Users
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: string;
  duration: number;
}

interface SlotEngineClientProps {
  initialServices: Service[];
}

export default function SlotEngineClient({ initialServices }: SlotEngineClientProps) {
  const [selectedService, setSelectedService] = useState<string>("general");
  const [generationStep, setGenerationStep] = useState<number>(0);
  // 0: idle, 1: generating, 2: applying buffers, 3: conflicts, 4: finalizing, 5: done
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    
    // Simulate generation process
    setTimeout(() => setGenerationStep(2), 1500);
    setTimeout(() => setGenerationStep(3), 3000);
    setTimeout(() => setGenerationStep(4), 4500);
    setTimeout(() => {
      setGenerationStep(5);
      setIsGenerating(false);
    }, 5500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fdfdfd", fontFamily: "var(--font-body)" }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ padding: "32px 40px 24px 40px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Slot Engine</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Configure availability, breaks, buffers and generate appointment slots automatically.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ position: "relative", width: "280px" }}>
            <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              type="text" 
              placeholder="Search patients, appointments..." 
              style={{ width: "100%", padding: "8px 12px 8px 36px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", outline: "none" }}
            />
            <div style={{ position: "absolute", right: "8px", top: "8px", fontSize: "10px", fontWeight: "600", color: "#9ca3af", background: "#f3f4f6", padding: "2px 4px", borderRadius: "4px" }}>⌘K</div>
          </div>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={16} color="#4b5563" />
            </div>
            <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", background: "#ef4444", borderRadius: "50%", border: "2px solid #fff", color: "#fff", fontSize: "9px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          </div>
          <button style={{ background: "#111827", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={16} /> Generate Slots
          </button>
          <button style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <MoreHorizontal size={16} color="#4b5563" />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* LEFT FORM AREA (Scrollable) */}
        <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }} className="sidebar-scroll">
          
          {/* SECTION 1: Select Service */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Select Service</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
              {/* Card 1 (Selected) */}
              <div onClick={() => setSelectedService("general")} style={{ border: selectedService === "general" ? "1.5px solid #8b5cf6" : "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: selectedService === "general" ? "#f5f3ff" : "#fff", cursor: "pointer", position: "relative", transition: "all 150ms" }}>
                {selectedService === "general" && <div style={{ position: "absolute", top: "12px", right: "12px", width: "16px", height: "16px", borderRadius: "50%", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={10} color="#fff" /></div>}
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: selectedService === "general" ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: selectedService === "general" ? "#8b5cf6" : "#6b7280" }}>
                  <CalendarIcon size={16} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>General Consultation</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>30 min</div>
              </div>
              
              {/* Card 2 */}
              <div onClick={() => setSelectedService("followup")} style={{ border: selectedService === "followup" ? "1.5px solid #8b5cf6" : "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: selectedService === "followup" ? "#f5f3ff" : "#fff", cursor: "pointer", position: "relative", transition: "all 150ms" }}>
                {selectedService === "followup" && <div style={{ position: "absolute", top: "12px", right: "12px", width: "16px", height: "16px", borderRadius: "50%", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={10} color="#fff" /></div>}
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: selectedService === "followup" ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: selectedService === "followup" ? "#8b5cf6" : "#10b981" }}>
                  <Heart size={16} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Follow-up Visit</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>15 min</div>
              </div>

              {/* Card 3 */}
              <div onClick={() => setSelectedService("physio")} style={{ border: selectedService === "physio" ? "1.5px solid #8b5cf6" : "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: selectedService === "physio" ? "#f5f3ff" : "#fff", cursor: "pointer", position: "relative", transition: "all 150ms" }}>
                {selectedService === "physio" && <div style={{ position: "absolute", top: "12px", right: "12px", width: "16px", height: "16px", borderRadius: "50%", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={10} color="#fff" /></div>}
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: selectedService === "physio" ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: selectedService === "physio" ? "#8b5cf6" : "#3b82f6" }}>
                  <Activity size={16} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Physiotherapy Session</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>60 min</div>
              </div>

              {/* Card 4 */}
              <div onClick={() => setSelectedService("dental")} style={{ border: selectedService === "dental" ? "1.5px solid #8b5cf6" : "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: selectedService === "dental" ? "#f5f3ff" : "#fff", cursor: "pointer", position: "relative", transition: "all 150ms" }}>
                {selectedService === "dental" && <div style={{ position: "absolute", top: "12px", right: "12px", width: "16px", height: "16px", borderRadius: "50%", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={10} color="#fff" /></div>}
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: selectedService === "dental" ? "#ede9fe" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: selectedService === "dental" ? "#8b5cf6" : "#f97316" }}>
                  <Layers size={16} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>Dental Checkup</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>45 min</div>
              </div>

              {/* Custom Service */}
              <div style={{ border: "1px dashed #d1d5db", borderRadius: "12px", padding: "16px", background: "#f9fafb", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 150ms" }}>
                <PlusCircle size={20} color="#9ca3af" style={{ marginBottom: "8px" }} />
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563" }}>Custom Service</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>Configure</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Weekly Schedule */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Weekly Schedule</h2>
            </div>
            
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "120px" }}>Day</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "80px" }}>Available</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "130px" }}>Start Time</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "130px" }}>End Time</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", width: "120px" }}>Breaks</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280" }}>Provider / Staff</th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", textAlign: "center", width: "110px" }}>Max Daily Slots</th>
                  <th style={{ padding: "12px 8px", width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { day: "Monday", active: true, start: "09:00 AM", end: "06:00 PM", breaks: "1 break", provider: "Dr. Sarah Davis", avatar: "https://i.pravatar.cc/150?u=doc2", slots: 20 },
                  { day: "Tuesday", active: true, start: "09:00 AM", end: "06:00 PM", breaks: "1 break", provider: "Dr. James Wilson", avatar: "https://i.pravatar.cc/150?u=doc3", slots: 20 },
                  { day: "Wednesday", active: true, start: "09:00 AM", end: "06:00 PM", breaks: "1 break", provider: "Dr. Sarah Davis", avatar: "https://i.pravatar.cc/150?u=doc2", slots: 20 },
                  { day: "Thursday", active: true, start: "09:00 AM", end: "06:00 PM", breaks: "1 break", provider: "Dr. Sarah Davis", avatar: "https://i.pravatar.cc/150?u=doc2", slots: 20 },
                  { day: "Friday", active: true, start: "09:00 AM", end: "06:00 PM", breaks: "1 break", provider: "Dr. James Wilson", avatar: "https://i.pravatar.cc/150?u=doc3", slots: 20 },
                  { day: "Saturday", active: false, start: "-", end: "-", breaks: "0 break", provider: "-", avatar: null, slots: 0 },
                  { day: "Sunday", active: false, start: "-", end: "-", breaks: "0 break", provider: "-", avatar: null, slots: 0 },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f9fafb", opacity: row.active ? 1 : 0.6 }}>
                    <td style={{ padding: "16px 8px", fontSize: "13px", fontWeight: "500", color: "#111827" }}>{row.day}</td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ width: "36px", height: "20px", borderRadius: "100px", background: row.active ? "#ff5722" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "0.2s" }}>
                        <div style={{ position: "absolute", top: "2px", left: row.active ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      {row.active ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#111827", fontWeight: "500", width: "95px" }}>
                          {row.start} <Clock size={12} color="#9ca3af" />
                        </div>
                      ) : <span style={{ color: "#9ca3af" }}>-</span>}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      {row.active ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#111827", fontWeight: "500", width: "95px" }}>
                          {row.end} <Clock size={12} color="#9ca3af" />
                        </div>
                      ) : <span style={{ color: "#9ca3af" }}>-</span>}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      {row.active ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4b5563" }}>
                          {row.breaks} <ChevronDown size={14} color="#9ca3af" />
                        </div>
                      ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>{row.breaks}</span>}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      {row.active ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {row.avatar && <img src={row.avatar} style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />}
                          <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>{row.provider}</span>
                        </div>
                      ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>-</span>}
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "center" }}>
                      {row.active ? (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#111827", fontWeight: "500" }}>
                          {row.slots}
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "4px solid #9ca3af", cursor: "pointer" }} />
                            <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #9ca3af", cursor: "pointer" }} />
                          </div>
                        </div>
                      ) : <span style={{ fontSize: "13px", color: "#9ca3af" }}>0</span>}
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      <MoreHorizontal size={16} color="#d1d5db" style={{ cursor: "pointer" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
            {/* SECTION 3: Breaks & Time Blocks */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Breaks & Time Blocks</h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  Monday <ChevronDown size={14} color="#9ca3af" />
                </div>
              </div>

              {/* Timeline Graphic */}
              <div style={{ padding: "16px", border: "1px solid #f0f0f0", borderRadius: "12px", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontWeight: "700", color: "#9ca3af", marginBottom: "8px", padding: "0 4px" }}>
                  <span>8 AM</span><span>10 AM</span><span>12 PM</span><span>2 PM</span><span>4 PM</span><span>6 PM</span>
                </div>
                
                <div style={{ display: "flex", height: "44px", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>
                  {/* Available 8 AM - 1 PM */}
                  <div style={{ width: "50%", background: "#ecfdf5", borderRight: "1px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: "600", color: "#10b981" }}>Available</span>
                  </div>
                  {/* Lunch Break 1 PM - 2 PM */}
                  <div style={{ width: "10%", background: "#fff7ed", borderRight: "1px solid #fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#ff5722", lineHeight: 1.2 }}>01:00 PM - 02:00 PM</span>
                    <span style={{ fontSize: "9px", fontWeight: "600", color: "#ff5722", lineHeight: 1.2 }}>Lunch Break</span>
                  </div>
                  {/* Available 2 PM - 6 PM */}
                  <div style={{ width: "40%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: "600", color: "#10b981" }}>Available</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <Plus size={14} /> Add Break
                  </button>
                  <div style={{ display: "flex", gap: "16px", fontSize: "11px", fontWeight: "500", color: "#6b7280" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} /> Available</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff5722" }} /> Lunch Break</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }} /> Meeting</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6" }} /> Custom</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Buffer & Slot Rules */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>4</div>
                <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Buffer & Slot Rules</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Rule 1 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Buffer between appointments <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "80px", height: "4px", background: "#e5e7eb", borderRadius: "2px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: "30%", height: "100%", background: "#ff5722", borderRadius: "2px" }} />
                      <div style={{ position: "absolute", left: "30%", top: "-3px", width: "10px", height: "10px", borderRadius: "50%", background: "#fff", border: "2px solid #ff5722", transform: "translateX(-50%)", cursor: "pointer" }} />
                    </div>
                    <div style={{ width: "50px", fontSize: "13px", fontWeight: "600", color: "#111827", textAlign: "right" }}>15 <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>min</span></div>
                  </div>
                </div>
                {/* Rule 2 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Setup time before appointment <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "80px", height: "4px", background: "#e5e7eb", borderRadius: "2px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: "10%", height: "100%", background: "#ff5722", borderRadius: "2px" }} />
                      <div style={{ position: "absolute", left: "10%", top: "-3px", width: "10px", height: "10px", borderRadius: "50%", background: "#fff", border: "2px solid #ff5722", transform: "translateX(-50%)", cursor: "pointer" }} />
                    </div>
                    <div style={{ width: "50px", fontSize: "13px", fontWeight: "600", color: "#111827", textAlign: "right" }}>5 <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>min</span></div>
                  </div>
                </div>
                {/* Rule 3 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Cleanup time after appointment <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "80px", height: "4px", background: "#e5e7eb", borderRadius: "2px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: "10%", height: "100%", background: "#ff5722", borderRadius: "2px" }} />
                      <div style={{ position: "absolute", left: "10%", top: "-3px", width: "10px", height: "10px", borderRadius: "50%", background: "#fff", border: "2px solid #ff5722", transform: "translateX(-50%)", cursor: "pointer" }} />
                    </div>
                    <div style={{ width: "50px", fontSize: "13px", fontWeight: "600", color: "#111827", textAlign: "right" }}>5 <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>min</span></div>
                  </div>
                </div>
                {/* Divider */}
                <div style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }} />
                {/* Minimum notice */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Minimum notice <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>
                    2 hours <ChevronDown size={14} color="#9ca3af" />
                  </div>
                </div>
                {/* Allow overbooking */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Allow overbooking <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ width: "32px", height: "18px", borderRadius: "100px", background: "#e5e7eb", position: "relative", cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: "2px", left: "2px", width: "14px", height: "14px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
                  </div>
                </div>
                {/* Round slot time */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "12.5px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>Round slot time <AlertCircle size={12} color="#9ca3af" /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "6px", padding: "6px 10px", fontSize: "12.5px", fontWeight: "500", color: "#111827", cursor: "pointer" }}>
                    To nearest 5 min <ChevronDown size={14} color="#9ca3af" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
            {/* SECTION 5: Recurring Pattern */}
            <div style={{ flex: 1.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
                <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Recurring Pattern</h2>
              </div>
              
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                {/* Pattern 1 Selected */}
                <div style={{ flex: 1, border: "1.5px solid #ff5722", borderRadius: "12px", padding: "16px", background: "#fff0ed", cursor: "pointer", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", background: "#111827", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={10} color="#fff" /></div>
                  <CalendarIcon size={18} color="#ff5722" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#111827", marginBottom: "2px" }}>Every Weekday</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>Mon - Fri</div>
                </div>
                {/* Pattern 2 */}
                <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <CalendarIcon size={18} color="#9ca3af" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>Every Day</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>Mon - Sun</div>
                </div>
                {/* Pattern 3 */}
                <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <CalendarIcon size={18} color="#9ca3af" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>Custom Days</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>Select days</div>
                </div>
                {/* Pattern 4 */}
                <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <RefreshCw size={18} color="#9ca3af" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>Alternate Weeks</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>Week 1, Week 2</div>
                </div>
                {/* Pattern 5 */}
                <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <CalendarIcon size={18} color="#9ca3af" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>Monthly</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>1st - 5th</div>
                </div>
              </div>

              <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Pattern Summary</div>
                <div style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.5 }}>
                  Every Monday to Friday from <strong style={{ color: "#111827" }}>09:00 AM to 06:00 PM</strong> with 1 break and 15 min buffer.
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* SECTION 6: Advanced Options */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>6</div>
                  <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Advanced Options</h2>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#4b5563", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#ff5722", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={12} color="#fff" /></div>
                    Auto-assign slots to available providers
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#4b5563", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#ff5722", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={12} color="#fff" /></div>
                    Exclude holidays
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#4b5563", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#ff5722", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle2 size={12} color="#fff" /></div>
                    Respect provider's existing appointments
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#4b5563", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: "1px solid #d1d5db", background: "#fff" }} />
                    Stop generating after reaching max bookings
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#4b5563", cursor: "pointer" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: "1px solid #d1d5db", background: "#fff" }} />
                    Send notification when slots are generated
                  </label>
                </div>
              </div>

              {/* SECTION 7: Preview */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f3f4f6", color: "#4b5563", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>7</div>
                  <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Preview <span style={{ color: "#6b7280", fontWeight: "500", fontSize: "12px" }}>(Next 5 Days)</span></h2>
                </div>
                
                <table style={{ width: "100%", fontSize: "12px", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0", color: "#9ca3af" }}>
                      <th style={{ padding: "8px 0", fontWeight: "600" }}>Date</th>
                      <th style={{ padding: "8px 0", fontWeight: "600" }}>Day</th>
                      <th style={{ padding: "8px 0", fontWeight: "600" }}>Slots</th>
                      <th style={{ padding: "8px 0", fontWeight: "600" }}>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Preview rows */}
                    <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>May 12, 2024</td>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>Mon</td>
                      <td style={{ padding: "10px 0", color: "#111827", fontWeight: "600" }}>20</td>
                      <td style={{ padding: "10px 0", color: "#6b7280" }}>Dr. Sarah Davis</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>May 13, 2024</td>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>Tue</td>
                      <td style={{ padding: "10px 0", color: "#111827", fontWeight: "600" }}>20</td>
                      <td style={{ padding: "10px 0", color: "#6b7280" }}>Dr. James Wilson</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>May 14, 2024</td>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>Wed</td>
                      <td style={{ padding: "10px 0", color: "#111827", fontWeight: "600" }}>20</td>
                      <td style={{ padding: "10px 0", color: "#6b7280" }}>Dr. Sarah Davis</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>May 15, 2024</td>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>Thu</td>
                      <td style={{ padding: "10px 0", color: "#111827", fontWeight: "600" }}>20</td>
                      <td style={{ padding: "10px 0", color: "#6b7280" }}>Dr. Sarah Davis</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>May 16, 2024</td>
                      <td style={{ padding: "10px 0", color: "#4b5563" }}>Fri</td>
                      <td style={{ padding: "10px 0", color: "#111827", fontWeight: "600" }}>20</td>
                      <td style={{ padding: "10px 0", color: "#6b7280" }}>Dr. James Wilson</td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ padding: "10px 0", fontWeight: "600", color: "#111827" }}>Total</td>
                      <td colSpan={2} style={{ padding: "10px 0", fontWeight: "700", color: "#111827" }}>100 slots</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR (Generation Summary & Console) */}
        <div style={{ width: "340px", borderLeft: "1px solid #f0f0f0", background: "#fff", display: "flex", flexDirection: "column", padding: "32px", overflowY: "auto" }} className="sidebar-scroll">
          
          {/* SECTION 8: Generation Summary */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#f5f3ff", color: "#8b5cf6", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>8</div>
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Generation Summary</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280" }}>
                <CheckCircle2 size={14} /> <span style={{ fontSize: "12.5px" }}>Selected Service</span>
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", textAlign: "right" }}>General Consultation <span style={{ color: "#9ca3af", fontWeight: "500" }}>(30 min)</span></div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280" }}>
                <CalendarIcon size={14} /> <span style={{ fontSize: "12.5px" }}>Date Range</span>
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", textAlign: "right" }}>May 12 - Jun 10, 2024 <span style={{ color: "#9ca3af", fontWeight: "500" }}>(30 days)</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280" }}>
                <CheckCircle2 size={14} /> <span style={{ fontSize: "12.5px" }}>Working Days</span>
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", textAlign: "right" }}>22 days</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280" }}>
                <Users size={14} /> <span style={{ fontSize: "12.5px" }}>Provider / Staff</span>
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", textAlign: "right" }}>Dr. Sarah Davis, Dr. James Wilson</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280" }}>
                <Clock size={14} /> <span style={{ fontSize: "12.5px" }}>Buffer Time</span>
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#111827", textAlign: "right" }}>15 min</div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "20px 0", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12.5px", color: "#6b7280" }}>Total Slots</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>142</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12.5px", color: "#6b7280" }}>Estimated Bookings</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>118</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12.5px", color: "#6b7280" }}>Utilization Rate</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#10b981" }}>82%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12.5px", color: "#6b7280" }}>Estimated Revenue</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>$8,240</span>
            </div>
          </div>

          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
            <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#065f46", marginBottom: "4px" }}>Ready to Generate</div>
              <div style={{ fontSize: "11px", color: "#064e3b", opacity: 0.8, lineHeight: 1.4 }}>All settings look good. You can now generate slots.</div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || generationStep === 5}
            style={{ 
              width: "100%", background: isGenerating ? "#4b5563" : (generationStep === 5 ? "#10b981" : "#111827"), 
              color: "#fff", border: "none", borderRadius: "8px", padding: "16px", 
              fontSize: "14px", fontWeight: "700", cursor: (isGenerating || generationStep === 5) ? "not-allowed" : "pointer", 
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "0.2s"
            }}>
            {isGenerating ? (
              <><RefreshCw size={18} className="animate-spin" /> Generating...</>
            ) : generationStep === 5 ? (
              <><CheckCircle2 size={18} /> Generated Successfully!</>
            ) : (
              <><Plus size={18} /> Generate Slots</>
            )}
          </button>
          
          <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", margin: "0 0 32px 0" }}>
            This will create 142 slots and add them to the calendar.
          </p>

          {/* SECTION 9: Generation Console */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>9</div>
            <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111827" }}>Generation Console</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: "16px", left: "9px", bottom: "16px", width: "2px", background: "#f0f0f0", zIndex: 0 }} />

            {/* Step 0: Idle */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: generationStep > 0 ? "#10b981" : "#d1d5db", border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              </div>
              <div style={{ paddingTop: "2px" }}>
                <div style={{ fontSize: "13px", fontWeight: generationStep === 0 ? "700" : "500", color: generationStep === 0 ? "#111827" : "#9ca3af" }}>Idle</div>
              </div>
            </div>

            {/* Step 1: Generating slots */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 1, opacity: generationStep >= 1 ? 1 : 0.4 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: generationStep > 1 ? "#10b981" : (generationStep === 1 ? "#3b82f6" : "#fff"), border: generationStep > 1 ? "4px solid #fff" : (generationStep === 1 ? "4px solid #dbeafe" : "4px solid #f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {generationStep === 1 && <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%" }} />}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <div style={{ fontSize: "13px", fontWeight: generationStep === 1 ? "700" : "500", color: generationStep === 1 ? "#111827" : "#6b7280" }}>Generating slots...</div>
                {generationStep === 1 && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Preparing schedule</div>}
              </div>
            </div>

            {/* Step 2: Applying breaks & buffers */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 1, opacity: generationStep >= 2 ? 1 : 0.4 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: generationStep > 2 ? "#10b981" : (generationStep === 2 ? "#3b82f6" : "#fff"), border: generationStep > 2 ? "4px solid #fff" : (generationStep === 2 ? "4px solid #dbeafe" : "4px solid #f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {generationStep === 2 && <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%" }} />}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <div style={{ fontSize: "13px", fontWeight: generationStep === 2 ? "700" : "500", color: generationStep === 2 ? "#111827" : "#6b7280" }}>Applying breaks & buffers</div>
                {generationStep === 2 && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>15 min buffer time</div>}
              </div>
            </div>

            {/* Step 3: Checking conflicts */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 1, opacity: generationStep >= 3 ? 1 : 0.4 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: generationStep > 3 ? "#10b981" : (generationStep === 3 ? "#3b82f6" : "#fff"), border: generationStep > 3 ? "4px solid #fff" : (generationStep === 3 ? "4px solid #dbeafe" : "4px solid #f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {generationStep === 3 && <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%" }} />}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <div style={{ fontSize: "13px", fontWeight: generationStep === 3 ? "700" : "500", color: generationStep === 3 ? "#111827" : "#6b7280" }}>Checking conflicts</div>
                {generationStep === 3 && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Avoiding double bookings</div>}
              </div>
            </div>

            {/* Step 4: Finalizing */}
            <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, opacity: generationStep >= 4 ? 1 : 0.4 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: generationStep > 4 ? "#10b981" : (generationStep === 4 ? "#3b82f6" : "#fff"), border: generationStep > 4 ? "4px solid #fff" : (generationStep === 4 ? "4px solid #dbeafe" : "4px solid #f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {generationStep === 4 && <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%" }} />}
              </div>
              <div style={{ paddingTop: "2px" }}>
                <div style={{ fontSize: "13px", fontWeight: generationStep >= 4 ? "700" : "500", color: generationStep >= 4 ? "#111827" : "#6b7280" }}>Finalizing</div>
                {generationStep === 4 && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Almost done...</div>}
                {generationStep === 5 && <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px", fontWeight: "600" }}>Complete! 142 slots generated.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 0px; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
