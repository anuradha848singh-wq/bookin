"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";
import { Badge, Spinner, useToast } from "@book-in/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Form {
  id: string;
  name: string;
  created_at: string;
  _count?: {
    submissions: number;
  };
}

export default function FormsPageClient({ clinicName }: { clinicName: string }) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/forms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load forms");
      setForms(data.forms || []);
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFormName.trim(), fields: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create form");

      addToast("Form created!", "success");
      router.push(`/forms/${data.form.id}`);
    } catch (err: any) {
      addToast(err.message, "error");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      const res = await fetch(`/api/dashboard/forms/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete form");
      setForms(forms.filter(f => f.id !== id));
      addToast("Form deleted", "success");
    } catch (err: any) {
      addToast(err.message, "error");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)", color: "var(--text-heading)", marginBottom: "4px" }}>
            Forms
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Create custom intake forms and consent agreements.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--text-heading)", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
        >
          <Plus size={16} /> New Form
        </button>
      </div>

      <div style={{ background: "var(--surface-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {loading ? (
          <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}><Spinner /></div>
        ) : forms.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={24} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "8px" }}>No Forms Yet</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Create your first form to start collecting data from patients.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--surface-hover)" }}>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Form Name</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Created At</th>
                <th style={{ padding: "14px 24px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Submissions</th>
                <th style={{ padding: "14px 24px", width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)" }}>{f.name}</div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-body)" }}>{new Date(f.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <Badge variant="default">{f._count?.submissions || 0} Submissions</Badge>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button onClick={() => router.push(`/forms/${f.id}`)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--text-muted)" }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--text-muted)" }}>
                      <Trash2 size={16} color="var(--error-color)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isCreating && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "400px", background: "#fff", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-lg)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "16px" }}>Create New Form</h2>
            <form onSubmit={handleCreateForm}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "6px" }}>Form Name</label>
                <input type="text" value={newFormName} onChange={e => setNewFormName(e.target.value)} placeholder="e.g. New Patient Intake" style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }} autoFocus />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setIsCreating(false)} style={{ background: "transparent", border: "1px solid var(--border-color)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "var(--text-heading)" }}>Cancel</button>
                <button type="submit" disabled={submitting || !newFormName.trim()} style={{ background: "var(--text-heading)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: newFormName.trim() ? 1 : 0.5 }}>
                  {submitting ? <Spinner /> : "Create & Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
