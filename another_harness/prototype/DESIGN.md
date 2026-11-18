---
name: DriverOS Human Interface System
colors:
  surface: '#faf9fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#894d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac6300'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#faf9fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  large-title:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: 0.37px
  large-title-mobile:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0.34px
  title-1:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: 0.36px
  title-2:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.26px
  title-3:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 25px
    letterSpacing: -0.45px
  headline:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.43px
  body:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.43px
  callout:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: -0.31px
  subheadline:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.23px
  footnote:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.08px
  caption-1:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0px
  caption-2:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Text'
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 13px
    letterSpacing: 0.06px
  telemetry-metric:
    fontFamily: -apple-system, BlinkMacSystemFont, 'SF Pro Display'
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a mission-critical, safety-certified operating environment tailored specifically for petroleum tanker dispatch and telemetry. Operating at the intersection of enterprise fleet orchestration and high-hazard petrochemical transportation, the aesthetic adheres strictly to Apple iOS Human Interface Guidelines (HIG).

### Visual Metaphor & Aesthetic
- **iOS Native Precision:** Native iOS Inset Grouped paradigm featuring structured content cards, blur-backed navigation bars, fluid spring haptics, and instant visual legibility under extreme cabin sunlight or night driving conditions.
- **Industrial Safety Priority:** Status communication employs unambiguous semantic signals (ADR/HAZMAT compliance, compartmental tank volume, grounding interlocks, and emergency cutoffs). Decorative ambiguity is eliminated in favor of immediate situational awareness.
- **Interaction Posture:** Ergonomics engineered for single-handed terminal mounting or dashboard cradles: generous touch targets (minimum 44x44 pt), high contrast ratios, and tactile confirmation states.

## Colors

The palette directly maps Apple system tint tokens alongside mission-critical petrochemical telemetry statuses.

### Dynamic Theme Foundations
- **Light Appearance:**
  - `systemBackground`: `#F2F2F7` (Standard grouped background)
  - `secondarySystemGroupedBackground`: `#FFFFFF` (Grouped card surface)
  - `separator`: `rgba(60, 60, 67, 0.18)` (Hairline borders & cell divides)
  - `label`: `#000000` (Primary typography)
  - `secondaryLabel`: `rgba(60, 60, 67, 0.60)` (Secondary meta-data)
- **Dark Appearance:**
  - `systemBackground`: `#000000` (Pure OLED black for night hauling and glare reduction)
  - `secondarySystemGroupedBackground`: `#1C1C1E` (Grouped card surface)
  - `separator`: `rgba(84, 84, 88, 0.65)`
  - `label`: `#FFFFFF`
  - `secondaryLabel`: `rgba(235, 235, 245, 0.60)`

### Operational Semantic Tints
- **iOS systemBlue (`#007AFF`):** Navigation active states, interactive controls, telemetry link confirmation.
- **iOS systemGreen (`#34C759`):** Safe compartment status, grounding established, vapor recovery closed, route clear.
- **iOS systemOrange (`#FF9500`):** Temperature alerts, route diversion, scheduled mandatory driver rest interval.
- **iOS systemRed (`#FF3B30`):** Overfill risk, emergency shutdown tripped, static ground failure, leak detection.
- **iOS systemIndigo (`#5856D6`):** Bill of Lading (BoL), RFID driver badge authentication, weigh station clearance.

## Typography

The typographic hierarchy utilizes Apple's native San Francisco system cascade (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text'`).

### Hierarchy & Rules
- **Large Title Handling:** Navigation bars dynamically collapse from `large-title` to standard `headline` upon scroll activation.
- **High-Density Telemetry:** The `telemetry-metric` style provides bold, immediate numeric recognition for liter indicators, pressure readouts (PSI/bar), and ullage levels.
- **Monospaced Numerics:** All numeric counters, tanker flow rates, and timer clocks must enable tabular figures (`font-variant-numeric: tabular-nums`) to prevent text jitter during high-speed sensor updates.

## Layout & Spacing

Layout adheres strictly to Apple iOS Inset Grouped standards.

### Canvas & Architecture
- **Horizontal Margins:** Fixed 16pt (`1rem`) outer margins on iPhone form factors; 20pt on iPad Pro cabin docks.
- **Inset Grouping:** Content clusters are housed inside continuous vertical stacks of grouped cards. Full-bleed backgrounds are restricted exclusively to interactive map telemetry views.
- **Touch Clearance:** Interactive rows maintain a fixed minimum vertical height of 44pt with 8pt to 12pt internal vertical padding.
- **Safe Area Insets:** Fixed tab bar and navigation bar zones strictly observe hardware Safe Area metrics (accommodating Dynamic Island, home bar indicator, and status bar heights).

## Elevation & Depth

Visual hierarchy does not rely on synthetic drop shadows; it relies entirely on iOS tonal surfaces, ultra-thin border separators, and variable frosted glass.

### Surface Elevation Structure
1. **Canvas Level (Base):** Light: `#F2F2F7` | Dark: `#000000`.
2. **Card Surface (Level 1):** Light: `#FFFFFF` | Dark: `#1C1C1E`.
3. **Modal & Floating Panels (Level 2):** Light: `#FFFFFF` with ultra-diffused ambient shadow (`0px 4px 20px rgba(0, 0, 0, 0.08)`) | Dark: `#2C2C2E`.
4. **Hairline Separators:** `0.5px` borders rendered via `rgba(60, 60, 67, 0.18)` (Light) and `rgba(84, 84, 88, 0.65)` (Dark).
5. **Vitreous Chrome (Nav & Tab Bars):** Background blur using `UIBlurEffectStyleSystemMaterial` (`backdrop-filter: blur(20px)`), with 80% opacity fill over dynamic underlying map and list contents.

## Shapes

The interface employs the standard Apple continuous curvature (squircle) rounding language.

### Geometry Token Applications
- **Inset Grouped Cards:** 10pt to 12pt corner radius matching iOS system grouping conventions.
- **Primary Action Buttons:** 12pt corner radius for prominent forms; full pill curvature (`rounded-full`) for sticky emergency or dispatch trigger buttons.
- **Safety Status Badges & Pills:** Fully rounded pill geometry with internal inset borders.
- **Compartment Tank Cells:** 10pt continuous curvature with clipping bounds to represent cross-sectional tank silhouettes.

## Components

### Buttons
- **Primary Prominent:** Background `#007AFF`, label `#FFFFFF`, height 50pt, corner radius 12pt, weight `headline` (600). Active state drops opacity to 0.75 without layout shift.
- **Secondary Plain:** Background `rgba(0, 122, 255, 0.12)`, label `#007AFF`, height 44pt, corner radius 10pt.
- **Emergency Halt Button:** Full-width `#FF3B30` pill with bold contrasting label and integrated confirmation slide-to-confirm mechanism.

### Inset Grouped Cards & Lists
- Containers use `#FFFFFF` (Light) or `#1C1C1E` (Dark) with a 10pt radius and a 0.5px hairline boundary.
- Cells within groups feature standard accessory disclosures (`chevron.right`), with interior separators inset 16pt from the leading edge to match label alignment.

### Fuel Tanker Safety Badges
- **Status Indicator Badges:** 24pt height, pill-shaped, containing an SF Symbol and compact uppercase text (`caption-2`).
  - *Grounded / Safe:* `#34C759` background at 15% opacity, border `0.5px solid #34C759`, text `#34C759`.
  - *Flammable Class 3 / Caution:* `#FF9500` background at 15% opacity, border `0.5px solid #FF9500`, text `#FF9500`.
  - *Vapor Hazard / Interlock Alert:* `#FF3B30` background at 15% opacity, border `0.5px solid #FF3B30`, text `#FF3B30`.

### Tank Chamber Telemetry Visualizers
- Segmented vertical or horizontal capacity bars rendering independent multi-compartment fuel levels (e.g., Compartment 1: RON 95, Compartment 2: DO 0.05S).
- High-visibility tabular numerical indicators displaying volume (liters) and fill percentage.

### Input Fields & Controls
- **Form Cells:** Standard iOS TableView row with title pinned left, text input right-aligned, text color matching `label`.
- **Switches:** Native iOS toggle switch format using `systemGreen` (`#34C759`) for activated interlocks.

### Bottom Tab Bar & Navigation Bar
- **Tab Bar:** Translucent frosted container (`backdrop-filter: blur(20px)`), height 49pt plus Safe Area margin. Selected icon tinted `#007AFF`, unselected tinted `#8E8E93`.
- **Top Navigation Bar:** Large Title transition zone with trailing profile or HAZMAT alert icons.