---
name: Visualcns Finance
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#1960a3'
  on-secondary: '#ffffff'
  secondary-container: '#7db6ff'
  on-secondary-container: '#00477f'
  tertiary: '#162132'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b3648'
  on-tertiary-container: '#949fb4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a2c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004881'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for the high-stakes environment of private equity and investment banking. It balances the legacy of traditional finance with the efficiency of modern AI-driven analysis. The aesthetic is "New Institutional"—combining the authoritative weight of classic typography with a high-density, hyper-functional application interface.

The design style leans into **Corporate Modern with a Minimalist focus**. It prioritizes clarity, data integrity, and precision. Every element exists to facilitate the rapid ingestion of complex financial data, evoking a sense of calm under pressure through expansive white space in reports and structured density in the analysis dashboard.

## Colors
The palette is rooted in stability and trust. 
- **Primary (Deep Navy):** Used for navigation, headers, and primary actions to anchor the user’s eye.
- **Secondary (Professional Blue):** Utilized for interactive elements, links, and progress indicators.
- **Slate Gray (Tertiary):** Dedicated to data visualization, secondary text, and auxiliary UI components like dividers or inactive icons.
- **Neutral:** A range of cool grays (from #F7FAFC to #EDF2F7) provides the "canvas" for the application, ensuring that content and data remain the focal point without straining the eyes during long sessions.

## Typography
This design system employs a dual-typeface strategy to bridge the gap between "Traditional Trust" and "Modern Precision."

**EB Garamond** is reserved for high-level marketing headers, report titles, and editorial sections. It provides an authoritative, scholarly feel reminiscent of high-end financial journals.

**Inter** handles all UI operations and data presentation. It was chosen for its exceptional legibility at small sizes and its neutral character, which does not distract from numerical data. Tabular numbers should be used for all financial grids to ensure perfect vertical alignment of decimal points.

## Layout & Spacing
The layout follows a strict **8px grid system** for consistent vertical and horizontal rhythm. 

- **App Layout:** Uses a fixed left-hand navigation (240px) with a fluid content area.
- **Data Grids:** Utilize "Compact" and "Standard" density modes. Compact mode reduces vertical cell padding to 4px to maximize data visibility on a single screen.
- **Margins:** Desktop views maintain a 32px safe area from the screen edge. Mobile views contract to 16px.
- **Breakpoints:** 
  - Mobile: < 768px (Single column, hidden sidebar)
  - Tablet: 768px - 1280px (Collapsible sidebar)
  - Desktop: 1280px+ (Permanent sidebar, multi-pane view for QofE analysis)

## Elevation & Depth
Elevation is handled through **Low-Contrast Outlines** and subtle, monochromatic shadows to maintain a professional, flat aesthetic.

- **Level 0 (Base):** Background color #F7FAFC.
- **Level 1 (Cards):** White background with a 1px border (#E2E8F0). No shadow.
- **Level 2 (Modals/Dropdowns):** White background, 1px border (#E2E8F0), and a soft ambient shadow (0px 4px 12px rgba(26, 54, 93, 0.08)).
- **Focus States:** High-contrast 2px ring in Professional Blue (#2B6CB0) with a 2px offset to ensure accessibility and clarity.

## Shapes
The shape language is conservative and architectural. A **Soft (4px)** corner radius is applied to standard components like buttons, input fields, and cards. This slight rounding softens the "brutality" of a pure finance app while remaining much more professional than consumer-oriented "bubbly" designs. Large layout containers and report sheets use a 0px or 4px radius to emphasize structural integrity.

## Components
- **Buttons:** Primary buttons use the Deep Navy (#1A365D) with white text. Secondary buttons use a Slate Gray outline. Tertiary buttons are text-only with a Professional Blue color for actions like "Add Adjustment."
- **Data Tables:** The core of the system. Tables must include sticky headers, zebra-striping on hover, and a distinctive "Adjusted" state (a light blue background tint) for rows modified by AI or user input.
- **Chips/Badges:** Use a "Pastel-on-Dark" approach for status. E.g., "Verified" uses a light green background with dark green text. Shapes are pill-styled but follow the 4px rounding logic for consistency.
- **Input Fields:** Minimalist design with a 1px border. Labels are always "Label-MD" in Slate Gray, placed strictly above the input.
- **QofE Cards:** Specialized summary cards that display a metric, a trend sparkline (using Slate Gray), and a "Confidence Score" indicator.
- **Document Lens:** A unique UI element for the AI feature—a hover-state or modal overlay that highlights specific text in a source PDF and links it directly to a cell in the financial model.