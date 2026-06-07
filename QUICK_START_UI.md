# 🚀 Quick Start — UI System Integration

Get the beautiful UI system running in your BookIn project.

---

## 📦 Installation

The UI system is already in your monorepo! No external dependencies needed.

### Verify Structure
```
✅ packages/ui/          — UI component library
✅ apps/booking/         — Booking app with templates
✅ Design tokens ready   — CSS variables defined
```

---

## 🎨 Step 1: Import Design Tokens

Add to your app's global CSS or root layout:

```css
/* apps/booking/app/globals.css */
@import '@book-in/ui/styles/design-tokens.css';
```

Or in your HTML head:

```html
<link rel="stylesheet" href="/path/to/design-tokens.css">
```

---

## 🧩 Step 2: Use UI Components

Import components from the UI package:

```typescript
import { Button, Input, Card, Badge, Spinner } from '@book-in/ui';

function MyComponent() {
  return (
    <Card padding="lg" elevated>
      <Input
        label="Name"
        placeholder="Enter your name"
        leftIcon={<span>👤</span>}
      />
      <Button variant="primary" size="lg" fullWidth>
        Submit
      </Button>
    </Card>
  );
}
```

---

## 📋 Step 3: Implement Booking Flow

### Create a Booking Page

```typescript
// apps/booking/app/[slug]/page.tsx

import { useBookingFlow } from '../../hooks/useBookingFlow';
import { MinimalTemplate } from '../../templates/minimal';

interface BookingPageProps {
  params: { slug: string };
}

export default async function BookingPage({ params }: BookingPageProps) {
  // Fetch clinic and services (SSR)
  const clinic = await getClinicBySlug(params.slug);
  const services = await getServicesByClinic(clinic.id);

  return (
    <BookingPageClient
      clinic={clinic}
      services={services}
    />
  );
}

// Client component
'use client';

function BookingPageClient({ clinic, services }) {
  const bookingFlow = useBookingFlow({ clinicSlug: clinic.slug });

  return (
    <MinimalTemplate
      clinic={clinic}
      services={services}
      bookingFlow={bookingFlow}
    />
  );
}
```

---

## 🎭 Step 4: Choose a Template

### Available Templates

**Minimal** — Clean and professional
```typescript
import { MinimalTemplate } from './templates/minimal';
```

**Medical** — Healthcare-focused
```typescript
import { MedicalTemplate } from './templates/medical';
```

**Modern** — Bold and vibrant
```typescript
import { ModernTemplate } from './templates/modern';
```

### Dynamic Template Selection

```typescript
import { templates } from './templates';
import { Suspense } from 'react';

function BookingPage({ clinic, services }) {
  const bookingFlow = useBookingFlow({ clinicSlug: clinic.slug });
  
  // Get template based on clinic settings
  const templateId = clinic.template_id || 'minimal';
  const Template = templates[templateId];

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Template
        clinic={clinic}
        services={services}
        bookingFlow={bookingFlow}
      />
    </Suspense>
  );
}
```

---

## 🎨 Step 5: Customize Theme

### Set Clinic Theme

```typescript
const clinic = {
  name: 'Dr. Sharma Clinic',
  slug: 'dr-sharma',
  template_id: 'minimal',
  theme: {
    primary_color: '#4F46E5',    // Indigo
    accent_color: '#4338CA',     // Darker indigo
    background_color: '#FFFFFF',
    text_color: '#111827',
  },
  logo_url: '/logos/dr-sharma.png',
  tagline: 'Your health, our priority',
  whatsapp_number: '+919876543210',
  show_powered_by: true,
};
```

Templates automatically apply these colors via CSS variables!

---

## 🔧 Step 6: Configure API Routes

Ensure these routes exist (already implemented in Phase 2):

```
GET  /api/clinic/[slug]
GET  /api/clinic/[slug]/services
GET  /api/clinic/[slug]/slots
POST /api/clinic/[slug]/lock-slot
DELETE /api/clinic/[slug]/lock-slot
POST /api/auth/send-otp
POST /api/auth/verify-otp
```

The `useBookingFlow` hook calls these automatically.

---

## 📱 Step 7: Test Responsive Design

### Test on Multiple Devices

**Mobile (375px):**
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" or custom 375px
```

**Tablet (768px):**
```bash
# Select "iPad Mini" or custom 768px
```

**Desktop (1280px+):**
```bash
# Default browser width
```

---

## 🎯 Step 8: Verify Accessibility

### Keyboard Navigation Test

1. Tab through all interactive elements
2. Verify focus rings are visible
3. Press Enter/Space to activate buttons
4. Ensure logical tab order

### Screen Reader Test

**Windows:** NVDA (free)
**Mac:** VoiceOver (built-in, Cmd+F5)

Verify:
- ✅ All inputs have labels
- ✅ Errors are announced
- ✅ Loading states are announced
- ✅ Buttons have clear names

---

## 🚀 Step 9: Performance Check

### Lighthouse Audit

```bash
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Performance" + "Accessibility"
4. Click "Generate report"
```

**Targets:**
- Performance: > 90
- Accessibility: 100
- Best Practices: > 90

### Bundle Size Check

```bash
# Build the app
pnpm build

# Check bundle sizes
# Booking page should be < 150kb gzipped
```

---

## 🎨 Customization Examples

### Custom Button Styles

```typescript
// Extend with className
<Button
  variant="primary"
  className="my-custom-button"
>
  Click Me
</Button>
```

```css
/* Your CSS */
.my-custom-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
```

### Custom Theme Colors

```typescript
// In your template or page
<div style={{
  '--primary': '#EC4899',
  '--primary-light': '#FCE7F3',
  '--primary-dark': '#DB2777',
}}>
  {/* Components use these colors */}
</div>
```

---

## 🐛 Troubleshooting

### Issue: Components not styled

**Solution:** Import design tokens CSS
```css
@import '@book-in/ui/styles/design-tokens.css';
```

### Issue: Template not loading

**Solution:** Check lazy loading and Suspense
```typescript
import { Suspense } from 'react';

<Suspense fallback={<div>Loading...</div>}>
  <Template {...props} />
</Suspense>
```

### Issue: Theme colors not applying

**Solution:** Verify CSS variable names
```css
/* Correct */
background: var(--primary);

/* Wrong */
background: var(--primary-color);
```

### Issue: Booking flow not working

**Solution:** Check API routes are accessible
```bash
# Test in browser console
fetch('/api/clinic/your-slug/services')
  .then(r => r.json())
  .then(console.log)
```

---

## 📚 Next Steps

### Learn More
- Read `FRONTEND_UI_SYSTEM.md` for complete documentation
- Check `DESIGN_SHOWCASE.md` for design details
- Review `PHASE_6_FRONTEND_ARCHITECTURE.md` for architecture

### Extend the System
- Add new UI components to `packages/ui/`
- Create new templates in `apps/booking/templates/`
- Customize step components for specific needs

### Production Checklist
- [ ] Design tokens imported globally
- [ ] All API routes working
- [ ] Templates loading correctly
- [ ] Theme colors applied
- [ ] Responsive on all devices
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Performance targets met
- [ ] Error handling tested
- [ ] Loading states working

---

## 🎉 You're Ready!

Your beautiful, modern UI system is now integrated and ready for production.

**Key Features:**
- ✨ 3 premium templates
- 🎨 Customizable themes
- ♿ Fully accessible
- 📱 Mobile-first responsive
- 🚀 Performance optimized
- 🧩 Modular and maintainable

**Need Help?**
- Check documentation files
- Review component examples
- Test with different clinics
- Experiment with themes

**Happy Building!** 🚀
