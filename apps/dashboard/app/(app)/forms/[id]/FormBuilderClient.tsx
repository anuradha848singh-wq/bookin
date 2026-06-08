"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Settings } from "lucide-react";
import { Badge, Spinner, useToast } from "@book-in/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface FormField {
  id: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
  label: string;
  required: boolean;
  options?: string[]; // for select type
}

interface Form {
  id: string;
  name: string;
  fields: FormField[];
}

export default function FormBuilderClient({ formId, clinicName }: { formId: string, clinicName: string }) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  // Selected field for the properties panel
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/forms/${formId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load form");
      setForm({
        ...data.form,
        fields: Array.isArray(data.form.fields) ? data.form.fields : []
      });
    } catch (err: any) {
      addToast(err.message, "error");
      router.push("/forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, fields: form.fields })
      });
      if (!res.ok) throw new Error("Failed to save form");
      addToast("Form saved successfully!", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const addField = (type: FormField["type"]) => {
    if (!form) return;
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type} field`,
      required: false,
      ...(type === "select" ? { options: ["Option 1", "Option 2"] } : {})
    };
    setForm({ ...form, fields: [...form.fields, newField] });
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (!form) return;
    setForm({
      ...form,
      fields: form.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const deleteField = (id: string) => {
    if (!form) return;
    setForm({ ...form, fields: form.fields.filter(f => f.id !== id) });
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const moveField = (index: number, direction: -1 | 1) => {
    if (!form) return;
    const newFields = [...form.fields];
    if (index + direction >= 0 && index + direction < newFields.length) {
      const temp = newFields[index];
      const target = newFields[index + direction];
      if (temp && target) {
        newFields[index] = target;
        newFields[index + direction] = temp;
        setForm({ ...form, fields: newFields });
      }
    }
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><Spinner /></div>;
  }

  if (!form) return null;

  const selectedField = form.fields.find(f => f.id === selectedFieldId);

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", background: "var(--surface-overlay)", padding: "16px 24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/forms" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "var(--surface-hover)", color: "var(--text-heading)", textDecoration: "none" }}>
            <ChevronLeft size={18} />
          </Link>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-heading)", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-family-display)" }}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--text-heading)", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
        >
          {saving ? <Spinner /> : <><Save size={16} /> Save Form</>}
        </button>
      </div>

      {/* Builder Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 300px", gap: "24px", flex: 1 }}>
        
        {/* Left: Toolbox */}
        <div style={{ background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Add Fields</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { type: "text", label: "Short Text" },
              { type: "textarea", label: "Long Text" },
              { type: "email", label: "Email Address" },
              { type: "phone", label: "Phone Number" },
              { type: "select", label: "Dropdown Select" },
              { type: "checkbox", label: "Checkbox" }
            ].map(f => (
              <button 
                key={f.type}
                onClick={() => addField(f.type as any)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px 12px",
                  background: "var(--surface-hover)", border: "1px solid var(--border-color)", borderRadius: "8px",
                  color: "var(--text-heading)", fontSize: "13px", fontWeight: "500", cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text-heading)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}
              >
                <Plus size={14} color="var(--text-muted)" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Canvas */}
        <div style={{ background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", padding: "40px", overflowY: "auto", minHeight: "500px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {form.fields.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", border: "2px dashed var(--border-color)", borderRadius: "var(--radius-lg)" }}>
                <p style={{ fontSize: "14px", marginBottom: "8px" }}>Your form is empty.</p>
                <p style={{ fontSize: "12px" }}>Click fields on the left to add them to your form.</p>
              </div>
            ) : (
              form.fields.map((f, i) => (
                <div 
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  style={{
                    padding: "16px", borderRadius: "8px", border: selectedFieldId === f.id ? "2px solid var(--text-heading)" : "1px solid var(--border-color)",
                    background: selectedFieldId === f.id ? "var(--surface-hover)" : "transparent",
                    cursor: "pointer", transition: "all 0.15s ease", position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "4px" }}>
                      {f.label} {f.required && <span style={{ color: "red" }}>*</span>}
                    </label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={(e) => { e.stopPropagation(); moveField(i, -1); }} disabled={i === 0} style={{ padding: "4px", background: "none", border: "none", cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={14} color="var(--text-muted)" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveField(i, 1); }} disabled={i === form.fields.length - 1} style={{ padding: "4px", background: "none", border: "none", cursor: i === form.fields.length - 1 ? "not-allowed" : "pointer", opacity: i === form.fields.length - 1 ? 0.3 : 1 }}><ArrowDown size={14} color="var(--text-muted)" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteField(f.id); }} style={{ padding: "4px", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} color="var(--error-color)" /></button>
                    </div>
                  </div>

                  {/* Field Preview */}
                  <div style={{ opacity: 0.8, pointerEvents: "none" }}>
                    {f.type === "text" && <input type="text" placeholder="Short answer text" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} readOnly />}
                    {f.type === "email" && <input type="email" placeholder="Email address" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} readOnly />}
                    {f.type === "phone" && <input type="tel" placeholder="Phone number" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} readOnly />}
                    {f.type === "textarea" && <textarea placeholder="Long answer text" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", minHeight: "60px" }} readOnly />}
                    {f.type === "select" && (
                      <select style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }} disabled>
                        <option>Select an option...</option>
                        {f.options?.map((opt, idx) => <option key={idx}>{opt}</option>)}
                      </select>
                    )}
                    {f.type === "checkbox" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="checkbox" readOnly /> <span>Yes / No</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div style={{ background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
            <Settings size={14} /> Field Settings
          </h3>

          {!selectedField ? (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>Select a field on the canvas to edit its properties.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Field Label</label>
                <input 
                  type="text" 
                  value={selectedField.label}
                  onChange={e => updateField(selectedField.id, { label: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "13px" }}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-heading)", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={selectedField.required}
                  onChange={e => updateField(selectedField.id, { required: e.target.checked })}
                />
                Required Field
              </label>

              {selectedField.type === "select" && (
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Options (comma separated)</label>
                  <textarea 
                    value={selectedField.options?.join(", ")}
                    onChange={e => {
                      const opts = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                      updateField(selectedField.id, { options: opts });
                    }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "13px", minHeight: "80px", resize: "vertical" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
