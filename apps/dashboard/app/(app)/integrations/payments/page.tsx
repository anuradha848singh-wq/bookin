"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard, Shield, Save, CheckCircle, AlertCircle, Eye, EyeOff,
  RefreshCw, DollarSign, Percent, Hash, ToggleLeft, ToggleRight,
  ChevronRight, ExternalLink
} from "lucide-react";

interface PaymentConfig {
  id?: string;
  stripe_account_id?: string;
  stripe_live_key_status?: string;
  stripe_test_key_status?: string;
  is_test_mode: boolean;
  payment_methods: string[];
  deposit_required: boolean;
  deposit_percent: number;
  currency: string;
  tax_rate: number;
  invoice_prefix: string;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "SGD", "AED", "MXN"];
const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { id: "cash", label: "Cash (In-Clinic)", icon: "💵" },
  { id: "voucher", label: "Gift Vouchers", icon: "🎁" },
];

export default function PaymentSettingsPage() {
  const [config, setConfig] = useState<PaymentConfig>({
    is_test_mode: true,
    payment_methods: ["card"],
    deposit_required: false,
    deposit_percent: 20,
    currency: "USD",
    tax_rate: 0,
    invoice_prefix: "INV",
  });

  const [stripeLiveKey, setStripeLiveKey] = useState("");
  const [stripeTestKey, setStripeTestKey] = useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/payments")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const togglePaymentMethod = (method: string) => {
    setConfig(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          stripe_live_key: stripeLiveKey || undefined,
          stripe_test_key: stripeTestKey || undefined,
          stripe_webhook_secret: stripeWebhookSecret || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "6px",
    display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
  };

  const sectionHeaderStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "#9ca3af" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "80px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#111827", margin: 0 }}>Payment Settings</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
          Configure Stripe integration, deposit rules, and payment collection preferences.
        </p>
      </div>

      {/* Status messages */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#991b1b" }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {saved && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#166534" }}>
          <CheckCircle size={16} />
          Payment settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Stripe Connection ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={{ width: "36px", height: "36px", background: "#f0f4ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={18} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Stripe Integration</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Connect your Stripe account to accept online payments</div>
            </div>
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}
            >
              Get API Keys <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Test / Live Mode Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", borderRadius: "12px", padding: "14px 18px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>
                  {config.is_test_mode ? "🧪 Test Mode" : "🚀 Live Mode"}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                  {config.is_test_mode ? "Use test keys — no real charges" : "Use live keys — real payments active"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, is_test_mode: !prev.is_test_mode }))}
                style={{
                  width: "48px", height: "26px", borderRadius: "999px", border: "none", cursor: "pointer",
                  background: config.is_test_mode ? "#e5e7eb" : "#3b82f6",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
                  position: "absolute", top: "3px",
                  left: config.is_test_mode ? "3px" : "25px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {/* Stripe Keys */}
            <div>
              <label style={labelStyle}>
                {config.is_test_mode ? "Stripe Test Secret Key" : "Stripe Live Secret Key"}
                {config[config.is_test_mode ? "stripe_test_key_status" : "stripe_live_key_status"] === "configured" && (
                  <span style={{ marginLeft: "8px", color: "#10b981", fontWeight: 700 }}>✓ Configured</span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={config.is_test_mode ? (showTestKey ? "text" : "password") : (showLiveKey ? "text" : "password")}
                  value={config.is_test_mode ? stripeTestKey : stripeLiveKey}
                  onChange={e => config.is_test_mode ? setStripeTestKey(e.target.value) : setStripeLiveKey(e.target.value)}
                  placeholder={config.is_test_mode ? "sk_test_..." : "sk_live_..."}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => config.is_test_mode ? setShowTestKey(v => !v) : setShowLiveKey(v => !v)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                >
                  {(config.is_test_mode ? showTestKey : showLiveKey) ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                Leave blank to keep existing key. Never expose secret keys in client-side code.
              </p>
            </div>

            <div>
              <label style={labelStyle}>
                Stripe Webhook Secret
                {config.stripe_live_key_status === "configured" && (
                  <span style={{ marginLeft: "8px", color: "#10b981" }}>✓ Set</span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showWebhookSecret ? "text" : "password"}
                  value={stripeWebhookSecret}
                  onChange={e => setStripeWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  style={{ ...inputStyle, paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(v => !v)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                >
                  {showWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                Set your Stripe webhook endpoint to: <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: "4px" }}>/api/webhooks/stripe</code>
              </p>
            </div>
          </div>
        </div>

        {/* ── Payment Methods ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={{ width: "36px", height: "36px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Accepted Payment Methods</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Select which methods clients can use</div>
            </div>
          </div>

          <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PAYMENT_METHODS.map(({ id, label, icon }) => {
              const isEnabled = config.payment_methods.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePaymentMethod(id)}
                  style={{
                    padding: "14px",
                    border: `2px solid ${isEnabled ? "#3b82f6" : "#e5e7eb"}`,
                    borderRadius: "12px",
                    background: isEnabled ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{icon}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: isEnabled ? "#1d4ed8" : "#374151" }}>{label}</span>
                  {isEnabled && <CheckCircle size={16} color="#3b82f6" style={{ marginLeft: "auto" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Deposit & Pricing ── */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={{ width: "36px", height: "36px", background: "#fef9f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Percent size={18} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>Deposits & Pricing Rules</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Configure booking deposits and tax settings</div>
            </div>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Deposit Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>Require Deposit</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Clients must pay a deposit when booking</div>
              </div>
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, deposit_required: !prev.deposit_required }))}
                style={{
                  width: "48px", height: "26px", borderRadius: "999px", border: "none", cursor: "pointer",
                  background: config.deposit_required ? "#3b82f6" : "#e5e7eb",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
                  position: "absolute", top: "3px",
                  left: config.deposit_required ? "25px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {config.deposit_required && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Deposit Percentage</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={config.deposit_percent}
                    onChange={e => setConfig(prev => ({ ...prev, deposit_percent: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 800, fontSize: "18px", color: "#3b82f6", minWidth: "48px" }}>
                    {config.deposit_percent}%
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                  For a $100 booking, clients will pay ${config.deposit_percent} upfront.
                </p>
              </div>
            )}

            {/* Currency & Tax */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  value={config.currency}
                  onChange={e => setConfig(prev => ({ ...prev, currency: e.target.value }))}
                  style={{ ...inputStyle }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tax Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  step={0.5}
                  value={config.tax_rate}
                  onChange={e => setConfig(prev => ({ ...prev, tax_rate: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Invoice Prefix</label>
                <input
                  type="text"
                  value={config.invoice_prefix}
                  onChange={e => setConfig(prev => ({ ...prev, invoice_prefix: e.target.value.toUpperCase() }))}
                  placeholder="INV"
                  maxLength={6}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <Shield size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#0c4a6e" }}>Payment Security</div>
            <p style={{ fontSize: "12px", color: "#0369a1", marginTop: "2px", lineHeight: 1.5 }}>
              All API keys are stored encrypted. We use Stripe's industry-standard PCI DSS compliant infrastructure. 
              Card data never passes through our servers.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "12px", border: "none",
              background: saving ? "#9ca3af" : "#111827",
              color: "#fff", fontWeight: 700, fontSize: "14px",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saving ? "none" : "0 4px 15px rgba(0,0,0,0.15)",
            }}
          >
            {saving ? (
              <><RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</>
            ) : saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> Save Payment Settings</>
            )}
          </button>
        </div>

      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="range"] { accent-color: #3b82f6; }
        select:focus, input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      `}</style>
    </div>
  );
}
