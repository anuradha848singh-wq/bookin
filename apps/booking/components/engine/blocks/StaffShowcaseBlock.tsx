import React from "react";

export interface StaffShowcaseBlockProps {
  backgroundColor?: string;
  columns?: number;
  linkedNodes?: Record<string, React.ReactNode>;
  tenantData?: any;
}

export const StaffShowcaseBlock: React.FC<StaffShowcaseBlockProps> = ({
  backgroundColor = "#FAFAFA",
  columns = 3,
  linkedNodes = {},
  tenantData = {},
}) => {
  const staff = tenantData.staff || [];

  return (
    <div
      style={{
        backgroundColor,
        padding: "96px 32px",
        width: "100%",
        position: "relative",
        borderTop: "1px solid #E5E5E5",
        borderBottom: "1px solid #E5E5E5",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: "64px", textAlign: "center" }}>
          {linkedNodes["staff-showcase-header"]}
        </div>

        {staff.length === 0 ? (
          <div style={{ color: "#9CA3AF", fontSize: "14px", padding: "40px 0" }}>No staff members found. Add some in the dashboard.</div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "grid",
              gap: "24px",
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {staff.slice(0, columns).map((s: any, idx: number) => (
              <div key={idx} style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                padding: "24px", 
                background: "#fff", 
                borderRadius: "16px", 
                border: "1px solid #E5E5E5",
                transition: "all 0.2s"
              }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", marginBottom: "16px", border: "4px solid #F9FAFB" }}>
                  <img src={s.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"} alt={`${s.first_name} ${s.last_name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>{s.first_name} {s.last_name}</h3>
                <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 24px 0" }}>{s.role || "Provider"}</p>
                
                <div style={{ width: "100%", background: "#F9FAFB", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", fontWeight: "500", color: "#374151" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Next available: Contact for availability
                </div>

                <button style={{ width: "100%", padding: "10px", background: "#111827", color: "#fff", fontSize: "14px", fontWeight: "600", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                  Book {s.first_name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
