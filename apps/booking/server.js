const http = require("http");
const url = require("url");
const crypto = require("crypto");
const { getPublicClient, getTenantClient, generateSlots } = require("@book-in/db");
const { 
  getCachedClinicConfig, 
  cacheClinicConfig, 
  acquireSlotLock, 
  releaseSlotLock,
  stashOTP,
  getStashedOTP,
  clearOTP,
  incrementOtpAttempt,
  getOtpSendRate,
  incrementOtpSendRate
} = require("@book-in/lib");
const { sendOtpViaMSG91 } = require("@book-in/lib");

// List of reserved subdomains to skip clinic matching
const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin", "status", "mail", "cdn"]);

// Helper to hash OTP using native SHA-256
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// Extract subdomain/slug from Host header
function getSubdomainSlug(hostHeader) {
  if (!hostHeader) return null;
  // Strip port if present
  const host = hostHeader.split(":")[0];
  const parts = host.split(".");
  
  // If it's a localhost address like slug.localhost
  if (host.endsWith("localhost") || host.endsWith("127.0.0.1")) {
    if (parts.length > 1) {
      const sub = parts[0];
      if (!RESERVED_SUBDOMAINS.has(sub)) return sub;
    }
    return null;
  }

  // Handle standard domains e.g., clinic.bookin.com or vercel previews
  if (parts.length > 2) {
    const sub = parts[0];
    if (!RESERVED_SUBDOMAINS.has(sub)) return sub;
  }

  return null;
}

// 404 HTML Page
function render404Page(slug) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clinic Not Found — BookIn</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Outfit', sans-serif;
          background: #0B0F19;
          color: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          max-width: 500px;
          padding: 2.5rem;
          background: rgba(17, 24, 39, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        h1 {
          font-size: 5rem;
          margin: 0;
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        h2 {
          font-size: 1.8rem;
          margin-top: 0.5rem;
          color: #E5E7EB;
        }
        p {
          color: #9CA3AF;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .btn {
          display: inline-block;
          padding: 0.8rem 2rem;
          font-weight: 600;
          text-decoration: none;
          color: #FFFFFF;
          background: linear-gradient(135deg, #4F46E5, #3B82F6);
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <h2>Clinic Not Found</h2>
        <p>We couldn't find a registered clinic at the address <strong>"${slug || "unknown"}"</strong>. Please verify the URL and try again.</p>
        <a href="http://localhost:3001" class="btn">Go Home</a>
      </div>
    </body>
    </html>
  `;
}

// Beautiful Patient Booking UI
function renderBookingPage(clinic) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Appointment — ${clinic.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #4F46E5;
          --primary-hover: #4338CA;
          --bg-dark: #0B0F19;
          --card-bg: rgba(17, 24, 39, 0.7);
          --card-border: rgba(255, 255, 255, 0.08);
          --text-main: #F3F4F6;
          --text-muted: #9CA3AF;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Outfit', sans-serif;
          background-color: var(--bg-dark);
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }
        header {
          width: 100%;
          max-width: 650px;
          margin-top: 3rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        header h1 {
          font-size: 2.2rem;
          margin: 0;
          background: linear-gradient(135deg, #A5B4FC, #818CF8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
        header p {
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        .booking-card {
          width: 90%;
          max-width: 650px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
          margin-bottom: 3rem;
        }
        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          position: relative;
        }
        .progress-bar::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
        }
        .progress-line {
          position: absolute;
          top: 15px;
          left: 0;
          height: 3px;
          background: var(--primary);
          z-index: 2;
          width: 0%;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1F2937;
          border: 2px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
          z-index: 3;
          transition: all 0.3s ease;
        }
        .step-dot.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.6);
        }
        .step-dot.completed {
          background: #10B981;
          border-color: #10B981;
          color: white;
        }
        .step-panel {
          display: none;
        }
        .step-panel.active {
          display: block;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .service-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .service-card {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .service-card:hover {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.3);
        }
        .service-name {
          font-weight: 600;
          font-size: 1.1rem;
        }
        .service-meta {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        .service-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #818CF8;
        }
        .slot-container {
          margin-top: 1.5rem;
        }
        .date-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .date-tab {
          padding: 0.6rem 1rem;
          background: #1F2937;
          border-radius: 12px;
          cursor: pointer;
          white-space: nowrap;
          text-align: center;
          min-width: 70px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .date-tab:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .date-tab.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .date-tab-day {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .date-tab.active .date-tab-day {
          color: #E0E7FF;
        }
        .date-tab-num {
          font-weight: 700;
          font-size: 1.1rem;
          margin-top: 2px;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 0.75rem;
        }
        .slot-button {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .slot-button:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .input-group input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #111827;
          border: 1px solid var(--card-border);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          box-sizing: border-box;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .btn-submit {
          width: 100%;
          padding: 0.9rem;
          background: var(--primary);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .btn-submit:hover {
          background: var(--primary-hover);
        }
        .btn-submit:disabled {
          background: #374151;
          color: #9CA3AF;
          cursor: not-allowed;
          box-shadow: none;
        }
        .back-button {
          margin-top: 1.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
        }
        .back-button:hover {
          color: white;
        }
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.1);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border-left-color: var(--primary);
          animation: spin 1s linear infinite;
          margin: 2rem auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .success-box {
          text-align: center;
          padding: 1.5rem;
        }
        .success-icon {
          width: 64px;
          height: 64px;
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>${clinic.name}</h1>
        <p>Schedule your booking in a few simple steps</p>
      </header>

      <div class="booking-card">
        <!-- Progress Steps -->
        <div class="progress-bar">
          <div class="progress-line" id="progress-line"></div>
          <div class="step-dot active" id="dot-1">1</div>
          <div class="step-dot" id="dot-2">2</div>
          <div class="step-dot" id="dot-3">3</div>
          <div class="step-dot" id="dot-4">4</div>
        </div>

        <!-- Step 1: Select Service -->
        <div class="step-panel active" id="step-1">
          <div class="step-title">Select a Service</div>
          <div id="service-loading" class="spinner"></div>
          <div class="service-list" id="services-target"></div>
        </div>

        <!-- Step 2: Select Date & Slot -->
        <div class="step-panel" id="step-2">
          <div class="step-title">Select Date & Time</div>
          <div class="date-tabs" id="date-tabs-target"></div>
          <div class="slot-container">
            <div id="slots-loading" class="spinner" style="display:none;"></div>
            <div class="slots-grid" id="slots-target"></div>
          </div>
          <button class="back-button" onclick="goToStep(1)">← Back to services</button>
        </div>

        <!-- Step 3: Patient Info -->
        <div class="step-panel" id="step-3">
          <div class="step-title">Your Details</div>
          <div class="input-group">
            <label for="patient-phone">Mobile Phone Number</label>
            <input type="tel" id="patient-phone" placeholder="e.g. +919876543210" required>
          </div>
          <div id="otp-send-error" style="color: #EF4444; margin-bottom: 1rem; font-size: 0.95rem;"></div>
          <button class="btn-submit" id="btn-send-otp" onclick="sendOtp()">Send Verification OTP</button>
          <button class="back-button" onclick="goToStep(2)">← Back to timeslot</button>
        </div>

        <!-- Step 4: OTP Verification -->
        <div class="step-panel" id="step-4">
          <div class="step-title">Verify Phone Number</div>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            We've sent a 6-digit verification code to <strong id="display-phone"></strong>. Please check your messages.
          </p>
          <div class="input-group">
            <label for="otp-code">Enter 6-Digit OTP</label>
            <input type="text" id="otp-code" placeholder="e.g. 123456" maxLength="6" style="text-align: center; letter-spacing: 0.5rem; font-size: 1.5rem; font-weight: 700;" required>
          </div>
          <div id="otp-verify-error" style="color: #EF4444; margin-bottom: 1rem; font-size: 0.95rem;"></div>
          <button class="btn-submit" id="btn-verify-otp" onclick="verifyOtp()">Confirm Appointment</button>
          <button class="back-button" onclick="cancelSlotAndBack()">← Go back & release lock</button>
        </div>

        <!-- Step 5: Booking Confirmed -->
        <div class="step-panel" id="step-5">
          <div class="success-box">
            <div class="success-icon">✓</div>
            <h2 style="margin: 0; font-size: 1.8rem; font-weight: 700;">Booking Confirmed!</h2>
            <p style="color: var(--text-muted); margin-top: 1rem; line-height: 1.6;">
              Thank you! Your appointment has been scheduled successfully. You will receive SMS confirmation shortly.
            </p>
          </div>
        </div>
      </div>

      <script>
        const clinicSlug = "${clinic.slug}";
        let selectedServiceId = null;
        let selectedSlotId = null;
        let bookingSessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        
        let currentStep = 1;
        let services = [];
        let slotsByDate = {};
        let activeDateKey = null;

        // Fetch Services on load
        async function fetchServices() {
          try {
            const res = await fetch(\`/api/clinic/\${clinicSlug}/services\`);
            const json = await res.json();
            if (json.success) {
              services = json.data;
              renderServices();
            }
          } catch(e) {
            console.error(e);
          } finally {
            document.getElementById("service-loading").style.display = "none";
          }
        }

        function renderServices() {
          const target = document.getElementById("services-target");
          target.innerHTML = services.map(s => \`
            <div class="service-card" onclick="selectService('\${s.id}')">
              <div>
                <div class="service-name">\${s.name}</div>
                <div class="service-meta">\${s.duration} mins</div>
              </div>
              <div class="service-price">₹\${parseFloat(s.price).toFixed(2)}</div>
            </div>
          \`).join('');
        }

        function selectService(serviceId) {
          selectedServiceId = serviceId;
          goToStep(2);
          fetchSlots();
        }

        async function fetchSlots() {
          document.getElementById("slots-loading").style.display = "block";
          document.getElementById("slots-target").innerHTML = "";
          try {
            const res = await fetch(\`/api/clinic/\${clinicSlug}/slots?serviceId=\${selectedServiceId}\`);
            const json = await res.json();
            if (json.success) {
              slotsByDate = json.data;
              renderDateTabs();
            }
          } catch(e) {
            console.error(e);
          } finally {
            document.getElementById("slots-loading").style.display = "none";
          }
        }

        function renderDateTabs() {
          const tabsTarget = document.getElementById("date-tabs-target");
          const dates = Object.keys(slotsByDate);
          if (dates.length === 0) {
            tabsTarget.innerHTML = "<p style='color: var(--text-muted)'>No timeslots available for the next 7 days.</p>";
            return;
          }
          
          tabsTarget.innerHTML = dates.map((dateStr, idx) => {
            const dateObj = new Date(dateStr);
            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            return \`
              <div class="date-tab \${idx === 0 ? 'active' : ''}" onclick="setActiveDate('\${dateStr}', this)">
                <div class="date-tab-day">\${weekday}</div>
                <div class="date-tab-num">\${dayNum}</div>
              </div>
            \`;
          }).join('');

          setActiveDate(dates[0]);
        }

        function setActiveDate(dateStr, tabEl = null) {
          activeDateKey = dateStr;
          if (tabEl) {
            document.querySelectorAll(".date-tab").forEach(t => t.classList.remove("active"));
            tabEl.classList.add("active");
          }
          renderSlots();
        }

        function renderSlots() {
          const target = document.getElementById("slots-target");
          const slots = slotsByDate[activeDateKey] || [];
          
          target.innerHTML = slots.map(s => {
            const timeStr = new Date(s.starts_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            const vId = encodeURIComponent([s.starts_at, s.ends_at, s.staff_id || 'no-staff', s.service_id || selectedServiceId].join('|'));
            return \`
              <div class="slot-button" onclick="lockSlot('\${vId}')">\${timeStr}</div>
            \`;
          }).join('');
        }

        async function lockSlot(slotId) {
          try {
            const res = await fetch(\`/api/clinic/\${clinicSlug}/lock-slot\`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slotId, sessionId: bookingSessionId })
            });
            const json = await res.json();
            if (json.success) {
              selectedSlotId = slotId;
              goToStep(3);
            } else {
              alert(json.error || "Could not lock timeslot. It might have been taken.");
            }
          } catch(e) {
            alert("Error locking slot. Try again.");
          }
        }

        async function cancelSlotAndBack() {
          if (selectedSlotId) {
            await fetch(\`/api/clinic/\${clinicSlug}/lock-slot\`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slotId: selectedSlotId, sessionId: bookingSessionId })
            });
            selectedSlotId = null;
          }
          goToStep(2);
        }

        async function sendOtp() {
          const phoneInput = document.getElementById("patient-phone");
          const phone = phoneInput.value.trim();
          if (!phone) {
            alert("Please enter phone number");
            return;
          }

          document.getElementById("btn-send-otp").disabled = true;
          document.getElementById("otp-send-error").innerText = "";

          try {
            const res = await fetch("/api/auth/send-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone })
            });
            const json = await res.json();
            if (json.success) {
              document.getElementById("display-phone").innerText = phone;
              goToStep(4);
            } else {
              document.getElementById("otp-send-error").innerText = json.error || "Failed to send OTP.";
            }
          } catch(e) {
            document.getElementById("otp-send-error").innerText = "Network error. Try again.";
          } finally {
            document.getElementById("btn-send-otp").disabled = false;
          }
        }

        async function verifyOtp() {
          const phone = document.getElementById("patient-phone").value.trim();
          const otp = document.getElementById("otp-code").value.trim();
          
          if (otp.length !== 6) {
            alert("Enter valid 6-digit OTP code");
            return;
          }

          document.getElementById("btn-verify-otp").disabled = true;
          document.getElementById("otp-verify-error").innerText = "";

          try {
            const res = await fetch("/api/auth/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone, otp, slotId: selectedSlotId, clinicSlug })
            });
            const json = await res.json();
            if (json.success) {
              goToStep(5);
            } else {
              document.getElementById("otp-verify-error").innerText = json.error || "Invalid OTP code.";
            }
          } catch(e) {
            document.getElementById("otp-verify-error").innerText = "Network error. Try again.";
          } finally {
            document.getElementById("btn-verify-otp").disabled = false;
          }
        }

        // Release slot lock if user leaves
        window.addEventListener("beforeunload", () => {
          if (selectedSlotId) {
            navigator.sendBeacon(
              \`/api/clinic/\${clinicSlug}/lock-slot\`,
              JSON.stringify({ slotId: selectedSlotId, sessionId: bookingSessionId })
            );
          }
        });

        function goToStep(step) {
          currentStep = step;
          document.querySelectorAll(".step-panel").forEach(p => p.classList.remove("active"));
          document.getElementById(\`step-\${step}\`).classList.add("active");

          // Update Progress Indicator dots
          for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(\`dot-\${i}\`);
            if (i < step) {
              dot.className = "step-dot completed";
              dot.innerHTML = "✓";
            } else if (i === step) {
              dot.className = "step-dot active";
              dot.innerHTML = i;
            } else {
              dot.className = "step-dot";
              dot.innerHTML = i;
            }
          }

          const progressLine = document.getElementById("progress-line");
          progressLine.style.width = \`\${((step - 1) / 3) * 100}%\`;
        }

        // Init
        fetchServices();
      </script>
    </body>
    </html>
  `;
}

// REST HTTP Server App
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const host = req.headers.host;

  // Global Wildcard Subdomain Middleware Check
  const clinicSlug = getSubdomainSlug(host);

  // Setup response utilities
  const jsonResponse = (status, payload) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  };

  const htmlResponse = (status, html) => {
    res.writeHead(status, { "Content-Type": "text/html" });
    res.end(html);
  };

  // If no clinic subdomain, show default splash
  if (!clinicSlug) {
    if (parsedUrl.pathname === "/api/auth/send-otp" && req.method === "POST") {
      // 1. Generate & Send OTP
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const { phone } = JSON.parse(body);
          if (!phone) return jsonResponse(400, { success: false, error: "Missing phone number" });

          // Rate Limit Check: max 3 OTP requests per phone per 10 minutes
          const currentRate = await getOtpSendRate(phone);
          if (currentRate >= 3) {
            return jsonResponse(429, { success: false, error: "Too many attempts. Try after 10 minutes." });
          }

          await incrementOtpSendRate(phone);

          // Generate 6-digit numeric OTP
          const otpVal = Math.floor(100000 + Math.random() * 900000).toString();
          const hashedOtp = hashOtp(otpVal);

          // Save OTP hash in Redis
          await stashOTP(phone, hashedOtp);

          // Send OTP (fire and forget)
          sendOtpViaMSG91({ phone, otp: otpVal });

          return jsonResponse(200, { success: true, message: "OTP sent successfully" });
        } catch(err) {
          console.error(err);
          return jsonResponse(500, { success: false, error: "Internal OTP server error" });
        }
      });
      return;
    }

    if (parsedUrl.pathname === "/api/auth/verify-otp" && req.method === "POST") {
      // 2. Verify OTP & create booking
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const { phone, otp, slotId, clinicSlug: cSlug } = JSON.parse(body);
          if (!phone || !otp || !slotId || !cSlug) {
            return jsonResponse(400, { success: false, error: "Missing verification parameters" });
          }

          const decoded = decodeURIComponent(slotId).split('|');
          const [startsAt, endsAt, staffId, serviceId] = decoded;

          // Fetch clinic to get schema
          const publicDb = getPublicClient();
          const clinic = await publicDb.tenant.findUnique({ where: { slug: cSlug } });
          if (!clinic) return jsonResponse(404, { success: false, error: "Clinic not found" });

          const tenantDb = getTenantClient(`tenant_${clinic.slug}`);

          // Check attempts rate limit
          const attempts = await incrementOtpAttempt(phone);
          if (attempts > 3) {
            await clearOTP(phone);
            return jsonResponse(429, { success: false, error: "Too many failed attempts. Request a new OTP." });
          }

          // Verify OTP Hash match
          const savedHash = await getStashedOTP(phone);
          if (!savedHash || savedHash !== hashOtp(otp)) {
            return jsonResponse(400, { success: false, error: `Incorrect OTP. ${3 - attempts} attempts remaining.` });
          }

          // OTP is single-use, clear it
          await clearOTP(phone);

          // Create or find patient by phone using raw SQL
          let clients = await tenantDb.$queryRawUnsafe(`
            SELECT id FROM clients WHERE phone = $1 AND deleted_at IS NULL LIMIT 1
          `, phone);

          let clientId;
          if (clients.length > 0) {
            clientId = clients[0].id;
          } else {
            const newClients = await tenantDb.$queryRawUnsafe(`
              INSERT INTO clients (first_name, last_name, phone)
              VALUES ('Anonymous', 'Client', $1)
              RETURNING id
            `, phone);
            clientId = newClients[0].id;
          }

          // Generate a reference number (e.g. BK-2024-XXXXX)
          const year = new Date().getFullYear();
          const randomPart = Math.floor(10000 + Math.random() * 90000);
          const referenceNumber = `BK-${year}-${randomPart}`;

          // Insert booking and check for overlap in a single statement
          const result = await tenantDb.$queryRawUnsafe(`
            WITH overlapping AS (
              SELECT 1 FROM bookings
              WHERE staff_id = $3
                AND status NOT IN ('CANCELLED', 'NO_SHOW')
                AND starts_at < $2::timestamptz
                AND ends_at > $1::timestamptz
            )
            INSERT INTO bookings (
              reference_number, client_id, service_id, staff_id,
              starts_at, ends_at, duration_minutes, status, created_by, source
            )
            SELECT $4, $5, $6, $3, $1::timestamptz, $2::timestamptz,
                   EXTRACT(EPOCH FROM ($2::timestamptz - $1::timestamptz)) / 60,
                   'CONFIRMED', 'CLIENT', 'BOOKING_PORTAL'
            WHERE NOT EXISTS (SELECT 1 FROM overlapping)
            RETURNING id, reference_number, starts_at, ends_at, status
          `, startsAt, endsAt, staffId === 'no-staff' ? null : staffId, referenceNumber, clientId, serviceId);

          if (result.length === 0) {
            return jsonResponse(409, { success: false, error: "This slot was already booked by another transaction. Please pick another slot." });
          }

          const booking = result[0];
          return jsonResponse(200, { success: true, booking });
        } catch(err) {
          console.error(err);
          return jsonResponse(500, { success: false, error: "Internal verification error" });
        }
      });
      return;
    }

    return htmlResponse(200, "<h1>BookIn Patient Router</h1><p>Visit <code>subdomain.localhost:3003</code> to open a specific clinic's booking site.</p>");
  }

  // Lookup clinic configuration
  let clinicConfig = await getCachedClinicConfig(clinicSlug);
  if (!clinicConfig) {
    const publicDb = getPublicClient();
    const dbClinic = await publicDb.tenant.findFirst({
      where: {
        OR: [
          { slug: clinicSlug },
          { custom_domain: host.split(":")[0] }
        ]
      }
    });

    if (!dbClinic) {
      return htmlResponse(404, render404Page(clinicSlug));
    }
    clinicConfig = dbClinic;
    await cacheClinicConfig(clinicSlug, dbClinic);
  }

  const tenantDb = getTenantClient(clinicConfig.tenant_schema);

  // Endpoint routing for the clinic-scoped endpoints
  if (parsedUrl.pathname === "/" && req.method === "GET") {
    // Render the beautiful booking page HTML
    return htmlResponse(200, renderBookingPage(clinicConfig));
  }

  if (parsedUrl.pathname === `/api/clinic/${clinicSlug}` && req.method === "GET") {
    return jsonResponse(200, { success: true, data: clinicConfig });
  }

  if (parsedUrl.pathname === `/api/clinic/${clinicSlug}/services` && req.method === "GET") {
    try {
      const services = await tenantDb.service.findMany({
        where: { deleted_at: null }
      });
      return jsonResponse(200, { success: true, data: services });
    } catch(err) {
      return jsonResponse(500, { success: false, error: "Could not load services" });
    }
  }

  if (parsedUrl.pathname === `/api/clinic/${clinicSlug}/slots` && req.method === "GET") {
    try {
      const sId = parsedUrl.query.serviceId;
      if (!sId) return jsonResponse(400, { success: false, error: "Missing serviceId" });

      const today = new Date();
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);

      const slots = await generateSlots({
        clinicId: clinicConfig.id,
        serviceId: sId,
        startDate: today,
        endDate: next7Days,
        tenantDb,
      });

      // Group slots by Date (YYYY-MM-DD) on server
      const grouped = {};
      slots.forEach(slot => {
        const dateStr = slot.starts_at.toISOString().split("T")[0];
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(slot);
      });

      return jsonResponse(200, { success: true, data: grouped });
    } catch(err) {
      console.error(err);
      return jsonResponse(500, { success: false, error: "Could not load slots" });
    }
  }

  if (parsedUrl.pathname === `/api/clinic/${clinicSlug}/lock-slot`) {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const { slotId, sessionId } = JSON.parse(body);
        if (!slotId || !sessionId) {
          return jsonResponse(400, { success: false, error: "Missing slotId or sessionId" });
        }

        const decoded = decodeURIComponent(slotId).split('|');
        const [startsAt, endsAt, staffId, serviceId] = decoded;
        const lockId = `${staffId}:${startsAt}:${endsAt}`;

        if (req.method === "POST") {
          // Double-booking check: check DB status is available
          const overlapping = await tenantDb.$queryRawUnsafe(`
            SELECT 1 FROM bookings
            WHERE staff_id = $3
              AND status NOT IN ('CANCELLED', 'NO_SHOW')
              AND starts_at < $2::timestamptz
              AND ends_at > $1::timestamptz
            LIMIT 1
          `, startsAt, endsAt, staffId === 'no-staff' ? null : staffId);

          if (overlapping.length > 0) {
            return jsonResponse(409, { success: false, error: "This slot was just taken. Please pick another." });
          }

          // Acquire Redis lock (SET NX)
          const locked = await acquireSlotLock(lockId, sessionId);
          if (locked) {
            return jsonResponse(200, { success: true, message: "Slot locked for 5 minutes" });
          } else {
            return jsonResponse(409, { success: false, error: "This slot was just taken. Please pick another." });
          }
        }

        if (req.method === "DELETE") {
          // Release Redis lock
          const released = await releaseSlotLock(lockId, sessionId);
          return jsonResponse(200, { success: released });
        }
      } catch(err) {
        console.error(err);
        return jsonResponse(500, { success: false, error: "Internal locking error" });
      }
    });
    return;
  }

  return jsonResponse(404, { success: false, error: "Not Found" });
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Booking app listening at http://localhost:${PORT}`);
});
