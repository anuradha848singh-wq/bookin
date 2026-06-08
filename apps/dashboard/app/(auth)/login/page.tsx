"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Eye, EyeOff, Check, UserPlus
} from "lucide-react";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      const authError = params.get("error");
      if (authError) {
        setMessage({ type: "error", text: authError });
      }

      if (params.get("signup") === "true" || params.get("mode") === "signup") {
        setIsSignUp(true);
      }
    }
  }, []);

  const ensureSessionReady = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      throw new Error(error?.message || "Sign in completed, but the session was not saved. Please try again.");
    }
    return session;
  };

  const autoProvisionGuestClinic = async () => {
    // 1. Provision default clinic
    const provRes = await fetch("/api/internal/provision-clinic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicName: "Apex Diagnostics Clinic" }),
    });

    const provData = await provRes.json();
    if (!provRes.ok) throw new Error(provData.error || "Guest clinic provisioning failed.");
    if (!provData.success) return;
    
    // 2. Set default working hours
    const availRes = await fetch("/api/dashboard/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: "09:00",
        end: "18:00",
        days: [1, 2, 3, 4, 5, 6],
        breaks: [{ start: "13:00", end: "14:00" }],
        advanceWindow: 30,
        minimumNotice: 1
      }),
    });
    if (!availRes.ok) throw new Error("Failed to set default availability hours.");

    // 3. Set a default service offering
    const sRes = await fetch("/api/dashboard/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "General Consultation",
        price: "500",
        duration: 30
      }),
    });
    const sData = await sRes.json();
    if (!sRes.ok) throw new Error(sData.error || "Failed to create default service.");
    
    // 4. Slots are now generated dynamically at query time, no pre-generation needed.
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      setMessage({ type: "success", text: "Initializing secure guest session..." });
      
      // 1. Trigger server-side guest user creation and auto-confirmation
      const initRes = await fetch("/api/auth/guest-init", { method: "POST" });
      const initData = await initRes.json();
      if (!initRes.ok || !initData.success) {
        throw new Error(initData.error || "Failed to initialize guest account on server.");
      }

      const { email: guestEmail, password: guestPassword } = initData;

      // 2. Sign in using confirmed guest credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });

      if (signInError) throw signInError;
      await ensureSessionReady();

      setMessage({ type: "success", text: "Guest signed in successfully! Preparing your clinical dashboard..." });
      
      // 3. Auto-provision clinic data if not already provisioned
      await autoProvisionGuestClinic();
      
      router.refresh();
      router.push('/');
    } catch (err: any) {
      console.error("Guest login flow error:", err);
      setMessage({ type: "error", text: err.message || "Guest sign in failed." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUp && !acceptedTerms) {
      setMessage({ type: "error", text: "You must accept the terms and policies to sign up." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else if (data.session) {
          await ensureSessionReady();
          setMessage({ type: "success", text: "Account created successfully! Logging you in..." });
          router.refresh();
          router.push('/');
        } else {
          setMessage({ type: "success", text: "Sign up successful! Please check your email inbox to confirm your account." });
        }
      } else {
        console.log("[Login] Attempting sign-in for:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log("[Login] signInWithPassword response data:", data);
        console.log("[Login] signInWithPassword response error:", error);

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          await ensureSessionReady();
          setMessage({ type: "success", text: "Welcome back! Redirecting to dashboard..." });
          router.refresh();
          router.push('/');
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get("next") || "/";
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextParam)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (error) setMessage({ type: "error", text: error.message });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "OAuth login failed." });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      backgroundColor: "#ffffff",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Include Fonts & Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        .auth-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .auth-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #ffffff;
        }

        .auth-right {
          flex: 1.1;
          background: linear-gradient(135deg, #FFF5F6 0%, #FFFFFF 100%);
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          border-left: 1px solid #F1F5F9;
        }
        
        @media (min-width: 960px) {
          .auth-right { display: flex; }
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .auth-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
          text-align: center;
          letter-spacing: -0.8px;
        }

        .auth-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #6B7280;
          margin-bottom: 32px;
          text-align: center;
          font-weight: 500;
        }

        .auth-provider-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .provider-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #ffffff;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .provider-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: #94A3B8;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1.5px;
          background: #F1F5F9;
        }
        .auth-divider span {
          padding: 0 14px;
        }

        .auth-input-group {
          margin-bottom: 16px;
        }
        
        .auth-input-row {
          display: flex;
          gap: 16px;
        }
        
        .auth-input-row > div {
          flex: 1;
        }

        .auth-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          text-align: left;
        }

        .auth-input {
          width: 100%;
          padding: 10px 14px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #111827;
          transition: all 0.2s ease;
          outline: none;
        }

        .auth-input:focus {
          background: #ffffff;
          border-color: #E8334A;
          box-shadow: 0 0 0 3px rgba(232, 51, 74, 0.1);
        }

        .auth-input-icon-wrapper {
          position: relative;
        }

        .auth-input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .auth-checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 20px 0 24px 0;
          text-align: left;
        }

        .auth-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1.5px solid #CBD5E1;
          border-radius: 4px;
          background: #ffffff;
          margin-top: 2px;
          cursor: pointer;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          outline: none;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        
        .auth-checkbox:checked {
          background: #E8334A;
          border-color: #E8334A;
        }

        .auth-checkbox:checked::after {
          content: '';
          width: 8px;
          height: 4px;
          border-left: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(-45deg) translate(1px, -1px);
        }

        .auth-checkbox-label {
          font-size: 12px;
          color: #64748B;
          line-height: 1.5;
          user-select: none;
        }
        
        .auth-checkbox-label b {
          color: #111827;
          font-weight: 700;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #E8334A 0%, #C53030 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(232, 51, 74, 0.2);
        }

        .auth-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232, 51, 74, 0.3);
        }
        
        .auth-submit-btn:active {
          transform: translateY(0);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #E8334A;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          transition: color 0.15s ease;
        }
        
        .auth-footer button:hover {
          text-decoration: underline;
          color: #C53030;
        }

        .message-box {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          text-align: left;
        }
        
        .message-success { background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0; }
        .message-error { background: #FEF2F2; color: #9F1239; border: 1.5px solid #FECDD3; }

        /* Illustration Styles */
        .illustration-img {
          width: 100%;
          max-width: 640px;
          height: auto;
          max-height: 92vh;
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        .illustration-img:hover {
          transform: scale(1.01);
        }

        .spinner-mini {
          width: 14px;
          height: 14px;
          border: 2px solid #E2E8F0;
          border-top-color: #E8334A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />

      <div className="auth-container">
        
        {/* Left Form Section */}
        <div className="auth-left">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">
              {isSignUp ? "Sign Up to BookIn" : "Sign In to BookIn"}
            </h1>
            <p className="auth-subtitle">Welcome back, you&apos;ve been missed!</p>

            {message && (
              <div className={`message-box message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="auth-provider-buttons">
              <button type="button" onClick={handleGoogleLogin} className="provider-btn" disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#ea4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.74 14.97.65 12 .65c-4.3 0-8.01 2.47-9.82 6.06l3.66 2.84C6.71 6.95 9.14 5.04 12 5.04z" />
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#34a853" d="M12 23.35c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84c1.81 3.59 5.52 6.06 9.82 6.06z" />
                </svg>
                Sign In with Google
              </button>
              
              <button type="button" onClick={handleGuestLogin} className="provider-btn" disabled={loading} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {loading ? (
                  <>
                    <span className="spinner-mini" />
                    <span>Preparing Demo...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} style={{ color: "#374151", flexShrink: 0 }} />
                    <span>Sign In with Guest</span>
                  </>
                )}
              </button>
            </div>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <form onSubmit={handlePasswordAuth}>
              {isSignUp && (
                <div className="auth-input-row auth-input-group">
                  <div>
                    <label className="auth-label">First Name</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                  <div>
                    <label className="auth-label">Last Name</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Parker"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-label">Email Address</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="johnparker@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-icon-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="auth-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="auth-input-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              {isSignUp && (
                <div className="auth-checkbox-group">
                  <input 
                    type="checkbox" 
                    id="terms-checkbox"
                    className="auth-checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label htmlFor="terms-checkbox" className="auth-checkbox-label">
                    By creating an account, you agree to our <b>Privacy Policy</b> and <b>Electronic Communications Policy</b>.
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
                style={{ marginTop: !isSignUp ? "24px" : "0" }}
              >
                {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            </form>

            <div className="auth-footer">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Illustration Section */}
        <div className="auth-right">
          <img 
            src="/login-illustration.png" 
            alt="BookIn Dashboard Preview" 
            className="illustration-img"
          />
        </div>

      </div>
    </div>
  );
}
