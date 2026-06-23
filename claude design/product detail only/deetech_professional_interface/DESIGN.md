---
name: Deetech Professional Interface
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#414940'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#71796f'
  outline-variant: '#c1c9bd'
  surface-tint: '#34693e'
  primary: '#003714'
  on-primary: '#ffffff'
  primary-container: '#184f27'
  on-primary-container: '#87c08d'
  inverse-primary: '#9ad4a0'
  secondary: '#1f6c35'
  on-secondary: '#ffffff'
  secondary-container: '#a6f5af'
  on-secondary-container: '#27723a'
  tertiary: '#541b29'
  on-tertiary: '#ffffff'
  tertiary-container: '#70313f'
  on-tertiary-container: '#f09bab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5f1ba'
  primary-fixed-dim: '#9ad4a0'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#1a5129'
  secondary-fixed: '#a6f5af'
  secondary-fixed-dim: '#8bd894'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3b0716'
  on-tertiary-fixed-variant: '#723240'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for a high-trust, professional e-commerce experience tailored to the Ghanaian tech market. It balances the authority of a long-standing hardware vendor with the modern efficiency of a digital dashboard. The aesthetic is **Corporate Modern**, prioritizing clarity, data density, and reliability.

The target audience includes enterprise IT procurement officers and high-end consumer tech enthusiasts. The emotional response should be one of "assured precision"—users should feel that their orders, tracking, and account data are managed with institutional rigor. The visual language uses heavy whitespace to offset the deep forest green tones, creating a workspace that feels productive yet premium.

## Colors

This system utilizes a sophisticated palette rooted in "Forest Green" to evoke stability and growth. 

- **Primary (#184f27):** Used for key actions, brand touchpoints, and navigation headers. It conveys the "pro" nature of the hardware.
- **Secondary (#1d6a33):** Reserved for interactive states, hover transitions, and subtle gradients to provide depth without breaking the professional mold.
- **Accent (#f8f2e6):** A warm cream used for section backgrounds and "off-white" surfaces to prevent eye strain and differentiate from the pure white cards.
- **Background (#f5f6f7):** A cool neutral that allows the primary green and white cards to "pop" with high contrast.
- **Semantic Colors:** Success (Vibrant Green), Warning (Amber), and Error (Crimson) are used exclusively for status pills and alerts.

## Typography

The design system employs **Hanken Grotesk** across all roles to ensure a sharp, contemporary feel. The typeface’s geometry is optimized for readability in data-heavy dashboard environments.

- **Headlines:** Use a bold weight and slight negative letter-spacing to create a strong visual anchor for page titles and section headers.
- **Body:** Standardized on 16px for optimal legibility during long sessions of order management or product comparison.
- **Labels:** Uppercase labels with increased letter-spacing are used for categorization and small metadata tags.
- **Data Display:** For serial numbers, tracking IDs, and SKU codes, a secondary monospaced font (Geist) is recommended to ensure character distinction.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width of 1280px for desktop to maintain optimal line lengths. 

- **Grid:** A 12-column grid is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale (with a 4px half-step for tight components) governs all padding and margins to ensure mathematical harmony.
- **Mobile Reflow:** On mobile, side-by-side card layouts collapse into a single vertical stack. Navigation moves from a sidebar (desktop) to a bottom bar or "hamburger" menu to prioritize thumb-reachability.
- **Alignment:** All dashboard widgets and cards must align to the top-left of their grid cell, utilizing `lg` (24px) padding for internal content containers.

## Elevation & Depth

Visual hierarchy is established through a **Tonal Layering** approach combined with soft ambient shadows.

1.  **Floor (Level 0):** Background (#f5f6f7). Used for the base canvas.
2.  **Surface (Level 1):** White cards (#FFFFFF). These house the primary content. They use a very soft, diffused shadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`.
3.  **Raised (Level 2):** Floating elements like dropdowns, tooltips, and modals. These use a more pronounced shadow to indicate interactivity: `0px 10px 30px rgba(0, 0, 0, 0.1)`.
4.  **Muted Outlines:** To keep the "clean" aesthetic, avoid heavy borders. Use 1px borders in a light gray (#E2E8F0) for input fields and list dividers instead of shadows.

## Shapes

The design system adopts a **Soft** shape language. This professional middle ground avoids the harshness of sharp corners while remaining more formal than fully rounded "pill" styles.

- **Standard Radius:** 0.25rem (4px) for small components like checkboxes and input fields.
- **Component Radius:** 0.5rem (8px) for buttons, cards, and primary dashboard widgets.
- **Container Radius:** 0.75rem (12px) for large modals or main content areas.
- **Status Pills:** The only exception—these use a fully rounded (pill) radius to distinguish them as non-interactive status indicators.

## Components

### Buttons
- **Primary:** Forest Green (#184f27) background with White text. High contrast, bold weight.
- **Secondary:** Transparent background with Forest Green border and text.
- **Tertiary:** Ghost style—no border, green text, subtle gray hover background.

### Status Pills
- Use high-saturation background colors with dark-tinted text.
- **Success:** Vibrant Mint background / Deep Green text.
- **Pending:** Soft Amber background / Brown text.
- **Tracking:** Light Blue background / Navy text.

### Input Fields
- **Style:** Muted and subtle. Use a light gray background (#EDF2F7) with no border in its default state. 
- **Active State:** Transitions to a White background with a 2px Forest Green border and a soft glow.

### Cards
- Pure White background.
- Internal padding of 24px (lg).
- Soft ambient shadows as defined in Elevation.
- Used for grouping product details, order summaries, and user profile data.

### Lists & Tables
- **Dashboard Lists:** Use zebra-striping with the Accent color (#f8f2e6) for better row tracking.
- **Dividers:** 1px width, color #E2E8F0.

### Checkboxes & Radios
- Forest Green fill when selected.
- 4px (Soft) rounded corners for checkboxes to match the overall shape language.