# 🚀 Quick Start Guide

## View the Frontend (No Backend Required)

The easiest way to see the beautiful UI without setting up the backend:

### 1. Start the Development Server

```bash
cd "c:\Users\dextop\Downloads\book in"
pnpm --filter @book-in/booking dev
```

### 2. Open Your Browser

Visit any of these URLs:

#### 🏠 Home Page
```
http://localhost:3003
```
Landing page with links to all preview pages

#### 🎨 UI Components Preview
```
http://localhost:3003/preview
```
See all design system components:
- Buttons (all variants)
- Inputs (all states)
- Cards
- Badges
- Spinners
- Colors
- Typography
- Spacing

#### 🎭 Templates Preview
```
http://localhost:3003/templates-preview
```
Interactive template showcase:
- Switch between 3 templates (Minimal, Medical, Modern)
- Customize colors in real-time
- Try quick color presets
- See responsive design

---

## Test Full Booking Flow (Backend Required)

To test the complete booking experience with a real clinic:

### Prerequisites

1. **PostgreSQL** - Running on default port
2. **Redis** - Running on default port
3. **Environment Variables** - `.env` file configured

### Steps

1. **Create a Test Clinic**

Use the dashboard API or insert directly into the database:

```sql
-- In public schema
INSERT INTO clinics (id, name, slug, tenant_schema, created_at, updated_at)
VALUES (
  'test-clinic-id',
  'Demo Clinic',
  'demo',
  'tenant_demo',
  NOW(),
  NOW()
);

-- Create tenant schema
CREATE SCHEMA tenant_demo;

-- Run migrations for tenant schema
-- (Use Prisma migrate or manual SQL)
```

2. **Add Services**

```sql
-- In tenant_demo schema
INSERT INTO services (id, clinic_id, name, duration, price, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'test-clinic-id', 'General Consultation', 30, 500.00, NOW(), NOW()),
  (gen_random_uuid(), 'test-clinic-id', 'Dental Checkup', 45, 800.00, NOW(), NOW());
```

3. **Configure Working Days**

```sql
-- In tenant_demo schema
INSERT INTO working_days (clinic_id, day_of_week, start_time, end_time)
VALUES
  ('test-clinic-id', 1, '09:00', '17:00'), -- Monday
  ('test-clinic-id', 2, '09:00', '17:00'), -- Tuesday
  ('test-clinic-id', 3, '09:00', '17:00'), -- Wednesday
  ('test-clinic-id', 4, '09:00', '17:00'), -- Thursday
  ('test-clinic-id', 5, '09:00', '17:00'); -- Friday
```

4. **Visit the Booking Page**

```
http://demo.localhost:3003
```

5. **Complete the Booking Flow**

- Select a service
- Pick a date and time
- Enter phone number
- Verify OTP (check console logs for OTP in development)
- See confirmation

---

## Troubleshooting

### Port Already in Use

If port 3003 is busy:

```bash
# Kill the process using port 3003
# Windows:
netstat -ano | findstr :3003
taskkill /PID <PID> /F

# Or change the port in package.json
"dev": "next dev -p 3004"
```

### Subdomain Not Working

Make sure you're using `.localhost` (not `.local`):
- ✅ `http://demo.localhost:3003`
- ❌ `http://demo.local:3003`

### Preview Pages Not Loading

Check that you're on the correct port:
- Default: `http://localhost:3003`
- If changed: `http://localhost:[YOUR_PORT]`

---

## What to Look For

### UI Components Preview (`/preview`)

✅ **Buttons**
- 5 variants (primary, secondary, outline, ghost, danger)
- 3 sizes (sm, md, lg)
- Loading states
- With icons

✅ **Inputs**
- With labels and helper text
- Error states
- Left/right icons
- Different sizes
- Disabled state

✅ **Cards**
- Default, elevated, hoverable, interactive
- Different padding options

✅ **Badges**
- 5 variants (default, primary, success, error, warning)
- 3 sizes
- With dot indicator

✅ **Design Tokens**
- Color palette
- Typography scale
- Spacing system

### Templates Preview (`/templates-preview`)

✅ **Minimal Template**
- Clean, professional design
- Gradient background
- Centered card layout

✅ **Medical Template**
- Trust badges
- Sidebar with process steps
- Information cards

✅ **Modern Template**
- Animated gradient background
- Floating decorative blobs
- Vibrant colors

✅ **Customization**
- Change primary color
- Change accent color
- Quick presets (Indigo, Sky Blue, Pink, Green, Amber)

---

## Next Steps

1. **Explore the Code**
   - Check `apps/booking/components/steps/` for step components
   - Look at `apps/booking/templates/` for template implementations
   - Review `packages/ui/` for shared UI components

2. **Customize**
   - Modify colors in templates preview
   - Try different template combinations
   - Experiment with component variants

3. **Integrate Backend**
   - Set up PostgreSQL and Redis
   - Create test clinics
   - Test the full booking flow

4. **Deploy**
   - Build for production: `pnpm --filter @book-in/booking build`
   - Start production server: `pnpm --filter @book-in/booking start`

---

## Documentation

- **[README.md](apps/booking/README.md)** - Complete documentation
- **[DESIGN_SHOWCASE.md](DESIGN_SHOWCASE.md)** - Design system guide
- **[FRONTEND_UI_SYSTEM.md](FRONTEND_UI_SYSTEM.md)** - Architecture docs
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Integration summary

---

**🎉 Enjoy exploring the beautiful BookIn UI!**
