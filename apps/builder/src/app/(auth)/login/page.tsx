"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Layout } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const ensureSessionReady = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      throw new Error(error?.message || "Sign in completed, but session was not saved.");
    }
    return session;
  };

  const handleSimpleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Attempt to Sign In directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Step 2: If invalid credentials, they might not have an account. Let's automatically sign them up!
        if (error.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            if (signUpError.message.includes("already registered")) {
              setMessage({ type: "error", text: "Invalid login credentials. Please check your password." });
            } else {
              setMessage({ type: "error", text: signUpError.message });
            }
          } else if (signUpData.session) {
            // Auto sign-up succeeded and logged them in
            await ensureSessionReady();
            setMessage({ type: "success", text: "Account created! Redirecting..." });
            router.push('/dashboard');
          } else {
             // Sign up succeeded but needs email confirmation (or some other setting)
             setMessage({ type: "success", text: "Sign up successful! Please check your email to confirm." });
          }
        } else {
          // Other sign-in error
          setMessage({ type: "error", text: error.message });
        }
      } else {
        // Sign In successful
        await ensureSessionReady();
        setMessage({ type: "success", text: "Welcome back! Redirecting..." });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        /* Animated Mesh Gradient Background */
        .login-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 50% 50%, rgba(232, 51, 74, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 30%);
          animation: rotateBg 20s linear infinite;
          z-index: 0;
        }

        @keyframes rotateBg {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 
            0 4px 24px -1px rgba(0, 0, 0, 0.05),
            0 20px 40px -8px rgba(232, 51, 74, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          position: relative;
          z-index: 1;
        }

        .auth-logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #E8334A 0%, #C53030 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          box-shadow: 0 8px 16px rgba(232, 51, 74, 0.2);
        }

        .auth-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          text-align: center;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #64748B;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .auth-input-group {
          margin-bottom: 20px;
        }

        .auth-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }

        .auth-input-wrapper {
          position: relative;
        }

        .auth-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(248, 250, 252, 0.8);
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #0F172A;
          transition: all 0.2s ease;
          outline: none;
        }

        .auth-input:focus {
          background: #ffffff;
          border-color: #E8334A;
          box-shadow: 0 0 0 4px rgba(232, 51, 74, 0.1);
        }

        .auth-input::placeholder {
          color: #94A3B8;
        }

        .auth-icon-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .auth-icon-btn:hover {
          color: #64748B;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          margin-top: 12px;
          background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(17, 24, 39, 0.2);
        }

        .auth-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .message-box {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .message-success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
        .message-error { background: #FEF2F2; color: #9F1239; border: 1px solid #FECDD3; }
      `}} />

      <div className="auth-card">
        <div className="auth-logo">
          <Layout size={24} className="text-white" />
        </div>
        <h1 className="auth-title">Welcome to Builder</h1>
        <p className="auth-subtitle">
          Sign in to your account.<br/>If you don&apos;t have one, we&apos;ll create it automatically.
        </p>

        {message && (
          <div className={`message-box message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSimpleAuth}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <input 
                type="email" 
                className="auth-input" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="auth-icon-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
