"use client";

import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { User, LogOut, Settings, Loader2 } from "lucide-react";

export const UserMenuSettings = () => {
  const { actions: { setProp }, style } = useNode((node) => ({
    style: node.data.props.style,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Menu Style</label>
        <select 
          value={style || "avatar"} 
          onChange={(e) => setProp((p: any) => { p.style = e.target.value; })}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        >
          <option value="avatar">Avatar Only</option>
          <option value="button">Text Button</option>
          <option value="pill">Pill (Avatar + Name)</option>
        </select>
      </div>
    </div>
  );
};

export const UserMenu = ({ style = "avatar" }: { style?: "avatar"|"button"|"pill" }) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // In builder preview, we just hit the API with websiteId=default
    fetch("/api/studio/auth/site/me?websiteId=default")
      .then(res => res.json())
      .then(data => {
        setMember(data.member);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/studio/auth/site/logout", { method: "POST" });
    setMember(null);
    setIsOpen(false);
  };

  const renderTrigger = () => {
    if (isLoading) {
      return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><Loader2 size={16} className="animate-spin" /></div>;
    }

    if (!member) {
      return (
        <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          Sign In
        </button>
      );
    }

    const initial = member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase();

    if (style === "button") {
      return (
        <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <User size={16} /> My Account
        </button>
      );
    }

    if (style === "pill") {
      return (
        <button onClick={() => setIsOpen(!isOpen)} className="pr-4 pl-1 py-1 bg-white border border-gray-200 text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {initial}
          </div>
          {member.name || "Account"}
        </button>
      );
    }

    return (
      <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 border-2 border-white shadow-sm flex items-center justify-center font-bold text-sm hover:shadow-md transition-shadow">
        {initial}
      </button>
    );
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`relative inline-block font-sans ${isSelected ? 'outline outline-2 outline-indigo-500 outline-offset-2 rounded' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold flex items-center gap-1 whitespace-nowrap">
          <User size={12} /> User Menu
        </div>
      )}

      {renderTrigger()}

      {isOpen && member && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900 truncate">{member.name || "Member"}</p>
            <p className="text-xs text-gray-500 truncate">{member.email}</p>
          </div>
          <div className="p-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left">
              <User size={16} className="text-gray-400" /> My Profile
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left">
              <Settings size={16} className="text-gray-400" /> Settings
            </button>
            <div className="h-px bg-gray-100 my-2 mx-1"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left font-medium">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

UserMenu.craft = {
  displayName: "User Menu",
  props: { style: "avatar" },
  rules: { canDrag: () => true },
  related: { settings: UserMenuSettings },
};
