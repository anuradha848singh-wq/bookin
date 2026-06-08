# Bookin Website Builder - Features Guide

## 🎨 Interface Overview

The builder interface consists of 4 main areas:

```
┌─────────────────────────────────────────────────────────────┐
│                         TOPBAR                               │
│  [Page ▼] | [↶ ↷] | [🖥 📱] | [- 100% +] | [Saved] [▶] [Publish] │
├──┬────────┬──────────────────────────────────────┬──────────┤
│  │        │                                      │          │
│R │  LEFT  │           CANVAS AREA                │ SETTINGS │
│A │  PANEL │                                      │  PANEL   │
│I │        │  ┌────────────────────────────┐     │          │
│L │        │  │                            │     │          │
│  │        │  │    Your Website Design     │     │          │
│  │        │  │                            │     │          │
│  │        │  └────────────────────────────┘     │          │
│  │        │                                      │          │
└──┴────────┴──────────────────────────────────────┴──────────┘
```

## 🧭 Navigation Rail (Far Left)

**Width**: 60px

### Tabs Available:
1. **📄 Pages** - Manage multiple pages
2. **🎨 Sections** - Drag & drop components
3. **🎨 Theme** - Brand colors & typography
4. **🖼️ Media** - Image library
5. **📝 Forms** - Form builder
6. **📅 Bookings** - Booking widgets
7. **🛍️ Store** - E-commerce (coming soon)
8. **🔍 SEO** - Meta tags & optimization
9. **⚙️ Settings** - Global settings

## 📋 Left Panel (Context-Aware)

**Width**: 240px

Changes content based on active rail tab:

### 1. Sections Panel
Drag-and-drop component library organized by category:

#### Basic Elements
- **Text** - Editable text with styling
- **Button** - Clickable buttons with actions
- **Image** - Images with alt text

#### Structure
- **Hero** - Full-width hero sections
- **Grid** - Multi-column content grids
- **Footer** - Website footer with links

#### Bookin Showcases
- **Services Layout** - Display your services
- **Staff Cards** - Show team members

#### Bookin Integrations
- **Booking Flow** - Appointment booking widget
- **Lead Form** - CRM lead capture form

### 2. Theme Panel
Customize your brand identity:

#### Brand Colors
- Primary color picker
- Secondary color picker
- Live preview swatches

#### Typography
- Font family selector
- 5 professional fonts included

#### Layout
- Border radius slider (0-24px)
- Affects all components globally

#### Theme Presets
- Modern (Blue & Gray)
- Nature (Green & Teal)
- Vibrant (Purple & Pink)
- Minimal (Gray tones)

### 3. Media Panel
Manage your images and assets:

#### Features
- Drag & drop upload area
- Search functionality
- Grid/List view toggle
- Image preview cards
- Storage usage stats

#### Mock Library Includes
- Hero backgrounds
- Service images
- Staff photos
- Product shots

### 4. Forms Panel
Build custom forms:

#### Form Elements
- Text Input
- Email field
- Phone field
- Text Area
- Checkbox
- Date Picker

#### Form Templates
- Contact Form (4 fields)
- Lead Capture (5 fields)
- Booking Request (6 fields)
- Newsletter (2 fields)

#### Form Settings
- Submit to CRM toggle
- Email notification toggle
- CAPTCHA toggle

### 5. Bookings Panel
Integrate booking functionality:

#### Booking Widgets
- **Inline Calendar** - Full calendar view
- **Book Now Button** - Modal trigger
- **Service Selector** - Choose service first
- **Staff Picker** - Select staff member

#### Booking Settings
- Time slot duration (15/30/45/60 min)
- Buffer time (0/5/10/15 min)
- Require deposit toggle
- Send reminders toggle
- Allow cancellation toggle

#### Quick Stats
- This week's bookings count
- Revenue display

### 6. SEO Panel
Optimize for search engines:

#### SEO Score
- Overall score (0-100)
- Visual progress bar
- Improvement suggestions

#### Meta Tags
- Page title (60 char limit)
- Meta description (160 char limit)
- Keywords (comma-separated)

#### Social Sharing
- Open Graph image upload
- Preview card display

#### SEO Checklist
- ✅ Title tag optimized
- ✅ Meta description present
- ✅ Mobile responsive
- ⚠️ Add alt text to images
- ⚠️ Improve page load speed

#### Advanced Tools
- Generate Sitemap button
- Edit Robots.txt button

## 🎯 Canvas Area (Center)

**Max Width**: 1200px (desktop mode)

### Features
- Drag & drop components from left panel
- Click to select and edit
- Blue outline on selection
- Zoom controls (25% - 200%)
- Device preview (Desktop/Mobile)
- Smooth scaling transitions

### Canvas Controls
Located in floating topbar:
- Page switcher dropdown
- Undo/Redo buttons
- Device toggle (Desktop/Mobile)
- Zoom controls
- Save status
- Preview button
- Publish button

## ⚙️ Settings Panel (Right)

**Width**: 320px

### Tabs
1. **Content** - Edit component content
2. **Design** - Visual styling (global theme)
3. **Advanced** - Component ID, custom code

### Features
- Dynamic based on selected component
- Delete button for removable components
- Real-time preview updates
- Organized by property type

### Example Settings by Component

#### Text Component
- Font size slider
- Font weight dropdown
- Color picker
- Alignment buttons (left/center/right)

#### Button Component
- Label text input
- Background color
- Text color
- Border radius
- Font size
- Padding controls

#### Image Component
- Image URL input
- Alt text input
- Width/Height controls
- Border radius slider
- Object fit dropdown

#### Hero Section
- Background color picker
- Vertical spacing slider

#### Services Grid
- Background color
- Column count (2/3/4)

#### Staff Showcase
- Background color
- Column count (2/3/4)

#### Footer
- Background color
- Text color

## 🎮 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Shift + Z |
| Delete Selected | Delete/Backspace |
| Deselect | Esc |
| Save | Ctrl/Cmd + S |

## 🔄 Workflow Examples

### Creating a Landing Page

1. **Add Hero Section**
   - Click "Sections" in rail
   - Drag "Hero" to canvas
   - Click to select
   - Edit text in settings panel
   - Adjust background color

2. **Add Services Grid**
   - Drag "Grid" below hero
   - Select grid
   - Change column count to 3
   - Customize service cards

3. **Add Staff Showcase**
   - Drag "Staff Cards" below services
   - Adjust column count
   - Staff data auto-populated

4. **Add Footer**
   - Drag "Footer" to bottom
   - Customize colors
   - Edit company info

5. **Customize Theme**
   - Click "Theme" in rail
   - Set primary color
   - Choose font family
   - Apply preset if desired

6. **Optimize SEO**
   - Click "SEO" in rail
   - Enter page title
   - Write meta description
   - Upload OG image

7. **Publish**
   - Click "Publish" in topbar
   - Website goes live

### Adding a Booking Widget

1. Click "Bookings" in rail
2. Drag "Inline Calendar" to desired location
3. Configure settings:
   - Set time slot duration
   - Add buffer time
   - Enable reminders
4. Widget connects to booking API automatically

### Creating a Contact Form

1. Click "Forms" in rail
2. Choose "Contact Form" template
3. Drag to canvas
4. Enable "Submit to CRM" toggle
5. Enable "Email Notification"
6. Form ready to collect leads

## 🎨 Design Best Practices

### Color Usage
- Use primary color for CTAs
- Use secondary for text/headings
- Maintain contrast ratios (WCAG AA)
- Limit to 2-3 brand colors

### Typography
- Use consistent font family
- Hierarchy: 48px (H1) → 32px (H2) → 18px (Body)
- Line height: 1.5x font size
- Max line length: 60-80 characters

### Spacing
- Use consistent padding (20px, 40px, 60px)
- Maintain vertical rhythm
- White space is your friend
- Mobile: reduce spacing by 30-50%

### Components
- Hero: Keep text concise, strong CTA
- Services: 3 columns on desktop, 1 on mobile
- Staff: Include photos and credentials
- Footer: Essential links only

## 🚀 Performance Tips

1. **Images**
   - Use WebP format
   - Compress before upload
   - Add alt text for SEO
   - Lazy load below fold

2. **Components**
   - Limit to 10-15 per page
   - Reuse containers
   - Avoid deep nesting

3. **Theme**
   - Use system fonts when possible
   - Minimize custom CSS
   - Test on multiple devices

## 📱 Mobile Optimization

### Automatic Adjustments
- Canvas scales to 375px width
- Components stack vertically
- Touch-friendly button sizes
- Readable font sizes

### Manual Adjustments
- Use mobile preview toggle
- Test all interactions
- Verify text readability
- Check image scaling

## 🔗 Integration Points

### Booking System
- Connects to `@book-in/db`
- Real-time availability
- Automatic confirmations
- Calendar sync

### CRM
- Lead capture forms
- Auto-routing to dashboard
- Email notifications
- Data validation

### Analytics
- Page view tracking
- Conversion tracking
- Heatmaps (coming soon)
- A/B testing (coming soon)

## 💡 Pro Tips

1. **Start with a preset** - Use theme presets as starting point
2. **Mobile-first** - Design for mobile, scale up
3. **Test early** - Preview frequently during design
4. **Save often** - Auto-save coming, manual save for now
5. **Use templates** - Form/section templates save time
6. **Optimize images** - Compress before upload
7. **SEO from start** - Add meta tags early
8. **Consistent spacing** - Use theme settings
9. **Limit fonts** - Stick to 1-2 font families
10. **Test bookings** - Verify booking flow works

## 🆘 Troubleshooting

### Component won't drag
- Ensure you're in "Sections" tab
- Check if canvas is scrolled to top
- Try refreshing the page

### Settings not updating
- Click component to select first
- Check if component supports that setting
- Try undo/redo to refresh

### Undo not working
- Some operations can't be undone
- Try manual revert
- Save frequently to avoid data loss

### Mobile preview looks wrong
- Some components need manual adjustment
- Use responsive settings (coming soon)
- Test on real device

### Publish not working
- Check console for errors
- Verify all required fields filled
- Contact support if persists

---

**Need Help?** Check the implementation summary or contact the development team.
