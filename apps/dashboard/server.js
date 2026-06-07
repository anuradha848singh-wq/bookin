const http = require("http");
const url = require("url");
const { validateEnv } = require("@book-in/config");
const { 
  registerClinicAndCreateTenantSchema, 
  getTenantClient, 
  generateSlotsForService 
} = require("@book-in/db");

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const jsonResponse = (status, payload) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  };

  // 1. Clinic signup and tenant database provisioning
  if (req.method === "POST" && parsedUrl.pathname === "/api/signup") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { name, ownerId } = JSON.parse(body);
        if (!name || !ownerId) {
          return jsonResponse(400, { success: false, error: "Missing name or ownerId" });
        }

        console.log(`[Dashboard] Registering clinic "${name}" for owner ${ownerId}...`);
        const clinic = await registerClinicAndCreateTenantSchema({ name, ownerId });
        
        console.log(`[Dashboard] Checking tenant database connection for schema ${clinic.tenant_schema}...`);
        const tenantClient = getTenantClient(`tenant_${clinic.slug}`);
        const servicesCount = await tenantClient.service.count();
        
        return jsonResponse(200, { 
          success: true, 
          message: "Clinic registered and tenant schema provisioned successfully!",
          clinic,
          verification: {
            tenant_schema: clinic.tenant_schema,
            empty_services_verified: servicesCount === 0
          }
        });
      } catch (err) {
        console.error("[Dashboard] Registration failed:", err);
        return jsonResponse(500, { success: false, error: err.message || "Internal registration error" });
      }
    });
    return;
  }

  // 2. Manual slot generation for service in tenant schema
  if (req.method === "POST" && parsedUrl.pathname === "/api/dashboard/slots/generate") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { clinicId, serviceId } = JSON.parse(body);
        if (!clinicId || !serviceId) {
          return jsonResponse(400, { success: false, error: "Missing clinicId or serviceId" });
        }

        console.log(`[Dashboard] Triggering manual slot generation for clinic ${clinicId}, service ${serviceId}...`);
        const count = await generateSlotsForService(clinicId, serviceId);

        return jsonResponse(200, {
          success: true,
          message: "Slots generated successfully!",
          count
        });
      } catch (err) {
        console.error("[Dashboard] Slot generation failed:", err);
        return jsonResponse(500, { success: false, error: err.message || "Slot generation error" });
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <h1>BookIn - Dashboard App API</h1>
    <ul>
      <li>POST <code>/api/signup</code> - Register clinic & provision schema</li>
      <li>POST <code>/api/dashboard/slots/generate</code> - Trigger 30-day slot generation</li>
    </ul>
  `);
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Dashboard app listening at http://localhost:${PORT}`);
});
