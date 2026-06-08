"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Lock, Mail, User, Loader2, ArrowRight } from "lucide-react";

export const AuthFormSettings = () => {
  const { actions: { setProp }, defaultMode, buttonColor } = useNode((node) => ({
    defaultMode: node.data.props.defaultMode,
    buttonColor: node.data.props.buttonColor,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Default View</label>
        <select 
          value={defaultMode || "login"} 
          onChange={(e) => setProp((p: any) => { p.defaultMode = e.target.value; })}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        >
          <option value="login">Login</option>
          <option value="register">Register</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Button Color</label>
        <input 
          type="color" 
          value={buttonColor || "#000000"} 
          onChange={(e) => setProp((p: any) => { p.buttonColor = e.target.value; })} 
          className="w-full h-8 border border-gray-200 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

export const AuthForm = ({ defaultMode = "login", buttonColor = "#000000" }: { defaultMode?: "login"|"register", buttonColor?: string }) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [mode, setMode] = useState<"login"|"register">(defaultMode);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // In builder preview, we mock this unless we know the websiteId
      const websiteId = "default"; // In a real published site, this is known
      
      const endpoint = mode === "login" ? "/api/studio/auth/site/login" : "/api/studio/auth/site/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, ...formData })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "An error occurred");
      
      setSuccess(true);
      // Would normally redirect or update global state here
      setTimeout(() => {
        if (mode === "login") alert("Logged in successfully! (Preview)");
        else alert("Registered successfully! (Preview)");
      }, 500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-xl font-sans relative ${isSelected ? 'outline outline-2 outline-indigo-500 outline-offset-2' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold flex items-center gap-1">
          <Lock size={12} /> Auth Form
        </div>
      )}

      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-500">You are now securely authenticated.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "login" ? "Enter your credentials to access your account." : "Sign up to access member-only content."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {mode === "register" && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: buttonColor }}
              className="w-full py-3 mt-2 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {mode === "login" ? "Sign In" : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

AuthForm.craft = {
  displayName: "Auth Form",
  props: { defaultMode: "login", buttonColor: "#000000" },
  rules: { canDrag: () => true },
  related: { settings: AuthFormSettings },
};
