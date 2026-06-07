import React from "react";

export interface ServiceShowcaseBlockProps {
  backgroundColor?: string;
  linkedNodes?: Record<string, React.ReactNode>;
  tenantData?: any;
}

export const ServiceShowcaseBlock: React.FC<ServiceShowcaseBlockProps> = ({
  backgroundColor = "#ffffff",
  linkedNodes = {},
  tenantData = {},
}) => {
  const services = tenantData.services || [];

  return (
    <div
      style={{
        backgroundColor,
        padding: "96px 32px",
        width: "100%",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "896px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "48px" }}>
          {linkedNodes["service-showcase-header"]}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {services.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: "14px", padding: "40px 0" }}>No services found. Add some in the dashboard.</div>
          ) : (
            services.map((service: any, idx: number) => (
              <div key={idx} style={{ 
                display: "flex", 
                flexDirection: "row", 
                gap: "24px", 
                padding: "16px", 
                borderRadius: "12px", 
                border: "1px solid #E5E5E5",
                background: "#fff",
                transition: "all 0.2s"
              }}>
                <div style={{ width: "192px", height: "128px", borderRadius: "8px", background: "#E5E7EB", overflow: "hidden", flexShrink: 0 }}>
                  {/* Using a placeholder since image uploads aren't built out fully */}
                  <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400" alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>{service.name}</h3>
                    <span style={{ fontWeight: "600", color: "#111827", display: "flex", alignItems: "center" }}>₹{Number(service.price)}</span>
                  </div>
                  {/* Service Description goes here (when added to schema) */}
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "16px", flex: 1 }}>Service description currently unavailable.</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <span style={{ fontSize: "12px", fontWeight: "500", color: "#9CA3AF" }}>
                      {service.duration} min
                    </span>
                    <button style={{ fontSize: "14px", fontWeight: "500", color: "#0066FF", background: "none", border: "none", cursor: "pointer" }}>
                      Book Now &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
