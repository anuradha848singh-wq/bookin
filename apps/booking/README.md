# BookIn — Patient Booking Frontend

Beautiful, modern booking interface with multiple templates and full backend integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# From workspace root
pnpm install
```

### 2. Start Development Server

```bash
# From workspace root
pnpm --filter @book-in/booking dev
```

The booking app will run on **http://localhost:3003**

### 3. Preview Pages (No Backend Required)

#### UI Components Preview
Visit: **http://localhost:3003/preview**

See all UI components:
- Buttons (all variants and sizes)
- Input fields (with icons, errors, states)
- Cards (elevated, hoverable, interactive)
- Badges (all variants)
- Spinners
- Color palette
- Typography scale
- Spacing system

#### Templates Preview
Visit: **http://localhost:3003/templates-preview**

Interactive template showcase:
- Switch between Minimal, Medical, and Modern templates
- Customize primary and accent colors in real-time
- Quick color presets
- See how templates adapt to different themes

### 4. Test with Real Clinic (Backend Required)

#### Prerequisites
- PostgreSQL database running
- Redis running
- At least one clinic created in the database

#### Access Clinic Booking Page

**Format:** `http://[clinic-slug].localhost:3003`

**Example:** `http://demo-clinic.localhost:3003`

The subdomain routing will:
1. Extract the clinic slug from the subdomain
2. Fetch clinic data from the database
3. Load the appropriate template (minimal/medical/modern)
4. Render the full booking flow

---

## 📁 Project Structure

```
apps/booking/
├── app/
│   ├── [clinic]/                    # Dynamic clinic route
│   │   ├── page.tsx                 # Server component (fetches data)
│   │   └── BookingPageClient.tsx   # Client component (renders template)
│   ├── api/                         # API routes
│   │   ├── auth/
│   │   │   ├── send-otp/           # POST - Send OTP
│   │   │   └── verify-otp/         # POST - Verify OTP & create booking
│   │   └── clinic/[slug]/
│   │       ├── services/           # GET - Fetch services
│   │       ├── slots/              # GET - Fetch available slots
│   │       └── lock-slot/          # POST/DELETE - Lock/unlock slot
│   ├── preview/                     # UI components showcase
│   ├── templates-preview/           # Templates showcase
│   ├── globals.css                  # Global styles + design tokens
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── components/
│   ├── steps/                       # Shared step components
│   │   ├── ServiceSelect.tsx       # Step 1: Select service
│   │   ├── SlotPicker.tsx          # Step 2: Pick date & time
│   │   ├── PatientForm.tsx         # Step 3: Enter details
│   │   ├── OTPVerify.tsx           # Step 4: Verify OTP
│   │   └── BookingConfirmed.tsx    # Step 5: Confirmation
│   └── ui/
│       └── StepIndicator.tsx       # Progress indicator
├── hooks/
│   └── useBookingFlow.ts           # Core booking state management
├── templates/
│   ├── index.ts                    # Template registry
│   ├── minimal/                    # Minimal template
│   ├── medical/                    # Medical template
│   └── modern/                     # Modern template
├── types/
│   └── booking.ts                  # TypeScript types
└── package.json
```

---

## 🎨 Templates

### 1. Minimal Template
**Style:** Clean, professional, distraction-free  
**Best for:** Modern clinics, professional services  
**Features:**
- Gradient background
- Centered card layout
- Smooth animations
- Mobile-first responsive

### 2. Medical Template
**Style:** Professional healthcare with trust signals  
**Best for:** Hospitals, clinics, medical practices  
**Features:**
- Trust badges (Secure, Verified)
- Sidebar with booking process
- Information cards
- Clean white background

### 3. Modern Template
**Style:** Bold, vibrant, contemporary  
**Best for:** Salons, spas, lifestyle services  
**Features:**
- Animated gradient background
- Floating decorative blobs
- Vibrant colors
- Smooth animations

---

## 🔄 Booking Flow

### Step 1: Select Service
- Displays all available services
- Shows price and duration
- Click to select

### Step 2: Select Date & Time
- Date tabs for next 7 days
- Time slots grid
- **Acquires Redis lock** when slot selected
- Back button releases lock

### Step 3: Enter Details
- Phone number input
- Sends OTP via MSG91
- Validates phone format

### Step 4: Verify OTP
- 6-digit OTP input
- Auto-focus and paste support
- Resend with countdown
- Max 3 attempts
- **Creates booking** on success

### Step 5: Confirmation
- Success animation
- Booking details
- WhatsApp contact button
- **Releases Redis lock**

---

## 🎯 Key Features

### UI Components (`@book-in/ui`)
- ✅ Button (5 variants, 3 sizes, loading states)
- ✅ Input (icons, errors, validation)
- ✅ Card (elevated, hoverable, interactive)
- ✅ Badge (5 variants, 3 sizes)
- ✅ Spinner (3 sizes)

### Design System
- ✅ CSS design tokens
- ✅ 8px spacing grid
- ✅ System fonts (no external downloads)
- ✅ Smooth transitions
- ✅ Soft shadows
- ✅ Rounded corners

### Accessibility
- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Color contrast ratios

### Performance
- ✅ Lazy-loaded templates
- ✅ Code splitting
- ✅ Optimized bundle size
- ✅ System fonts (zero download)
- ✅ CSS modules (scoped styles)

### State Management
- ✅ Single `useBookingFlow` hook
- ✅ Session ID generation
- ✅ Redis slot locking
- ✅ beforeunload cleanup
- ✅ Error handling
- ✅ Loading states

---

## 🧪 Testing

### 1. Test UI Components
```bash
# Visit preview page
http://localhost:3003/preview
```

### 2. Test Templates
```bash
# Visit templates preview
http://localhost:3003/templates-preview
```

### 3. Test Full Booking Flow

**Prerequisites:**
1. Create a clinic in the database
2. Add services to the clinic
3. Ensure Redis is running

**Steps:**
1. Visit `http://[clinic-slug].localhost:3003`
2. Select a service
3. Pick a date and time slot
4. Enter phone number
5. Verify OTP (check console for OTP in development)
6. See confirmation

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in workspace root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bookin"

# Redis
REDIS_URL="redis://localhost:6379"

# MSG91 (for OTP)
MSG91_AUTH_KEY="your-msg91-auth-key"
MSG91_TEMPLATE_ID="your-template-id"
```

### Next.js Config

The `next.config.js` is already configured to:
- Transpile workspace packages
- Enable React strict mode
- Support CSS modules

---

## 🎨 Customization

### Change Template Colors

Templates use CSS variables from `clinic.theme`:

```typescript
{
  primary_color: '#4F46E5',  // Main brand color
  accent_color: '#6366F1',   // Secondary color
  template: 'minimal'        // Template name
}
```

### Add New Template

1. Create `templates/[name]/index.tsx`
2. Create `templates/[name]/[name].module.css`
3. Add to `templates/index.ts`:
   ```typescript
   export const templates = {
     // ...existing
     [name]: lazy(() => import('./[name]'))
   };
   ```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** 375px (base)
- **Tablet:** 768px
- **Desktop:** 1280px

### Mobile-First Approach
All styles are mobile-first, with progressive enhancement for larger screens.

---

## 🐛 Troubleshooting

### Subdomain Not Working
- Ensure you're using `.localhost` (not `.local`)
- Check clinic slug exists in database
- Verify DNS/hosts file if using custom domain

### Slots Not Loading
- Check Redis connection
- Verify clinic has working days configured
- Check service duration is valid

### OTP Not Sending
- Verify MSG91 credentials
- Check phone number format
- Review rate limiting (max 3 per 10 min)

### Template Not Loading
- Check `clinic.theme.template` value
- Verify template name matches registry
- Check browser console for errors

---

## 📚 Documentation

- [Design Showcase](../../DESIGN_SHOWCASE.md) - Visual design system guide
- [Frontend UI System](../../FRONTEND_UI_SYSTEM.md) - Architecture documentation
- [API Documentation](../../../docs/API.md) - Backend API reference

---

## 🚢 Deployment

### Build for Production

```bash
# From workspace root
pnpm --filter @book-in/booking build
```

### Start Production Server

```bash
pnpm --filter @book-in/booking start
```

### Environment
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

---

## 📄 License

Private - BookIn Platform

---

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write accessible components
4. Test on mobile devices
5. Keep bundle size small

---

**Built with ❤️ using Next.js 14, React 18, and TypeScript**
