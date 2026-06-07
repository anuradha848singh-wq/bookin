"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Search, Calendar, Users, Briefcase, CreditCard, 
  Settings, Moon, Sun, Monitor, FileText 
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div 
      className="cmdk-overlay"
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, 
        backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)",
        zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh"
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "640px", 
          background: "var(--surface-card, #fff)",
          border: "1px solid var(--border-default, #e5e7eb)",
          borderRadius: "12px",
          boxShadow: "0 16px 70px rgba(0,0,0,0.2)",
          overflow: "hidden"
        }}
      >
        <Command 
          style={{ width: "100%", background: "transparent" }}
          label="Global Command Menu"
        >
          <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border-default, #e5e7eb)" }}>
            <Search size={18} color="var(--text-muted, #9ca3af)" style={{ marginRight: "12px" }} />
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..." 
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: "16px", color: "var(--text-heading, #111827)",
                width: "100%"
              }}
            />
          </div>

          <Command.List style={{ maxHeight: "350px", overflowY: "auto", padding: "8px" }}>
            <Command.Empty style={{ padding: "32px", textAlign: "center", color: "var(--text-muted, #9ca3af)", fontSize: "14px" }}>
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" style={{ padding: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #9ca3af)" }}>
              <Item icon={<Calendar size={15} />} label="Calendar" onSelect={() => runCommand(() => router.push("/bookings/calendar"))} />
              <Item icon={<Users size={15} />} label="Patients (CRM)" onSelect={() => runCommand(() => router.push("/crm"))} />
              <Item icon={<Briefcase size={15} />} label="Services" onSelect={() => runCommand(() => router.push("/services"))} />
              <Item icon={<FileText size={15} />} label="Site Builder" onSelect={() => runCommand(() => router.push("/builder"))} />
              <Item icon={<CreditCard size={15} />} label="Payments" onSelect={() => runCommand(() => router.push("/ecommerce/orders"))} />
              <Item icon={<Settings size={15} />} label="Settings" onSelect={() => runCommand(() => router.push("/settings/general"))} />
            </Command.Group>

            <Command.Group heading="Theme" style={{ padding: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #9ca3af)", marginTop: "12px" }}>
              <Item icon={<Sun size={15} />} label="Light Mode" onSelect={() => runCommand(() => setTheme("light"))} />
              <Item icon={<Moon size={15} />} label="Dark Mode" onSelect={() => runCommand(() => setTheme("dark"))} />
              <Item icon={<Monitor size={15} />} label="System Theme" onSelect={() => runCommand(() => setTheme("system"))} />
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      
      <style>{`
        [cmdk-item] {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-body, #374151);
          cursor: pointer;
          transition: background 150ms;
        }
        [cmdk-item][aria-selected="true"] {
          background: var(--nav-active-bg, #f1f5f9);
          color: var(--text-heading, #111827);
        }
        [cmdk-group-heading] {
          padding-bottom: 6px;
          padding-left: 6px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}

function Item({ icon, label, onSelect }: { icon: React.ReactNode, label: string, onSelect: () => void }) {
  return (
    <Command.Item onSelect={onSelect} style={{}}>
      <div style={{ color: "var(--text-muted, #9ca3af)" }}>{icon}</div>
      {label}
    </Command.Item>
  );
}
