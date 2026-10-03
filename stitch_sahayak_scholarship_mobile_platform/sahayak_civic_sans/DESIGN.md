---
name: Sahayak Civic Sans
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#404945'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707975'
  outline-variant: '#bfc9c3'
  surface-tint: '#316858'
  primary: '#00362a'
  on-primary: '#ffffff'
  primary-container: '#134e3f'
  on-primary-container: '#86beab'
  inverse-primary: '#99d2be'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#00324f'
  on-tertiary: '#ffffff'
  tertiary-container: '#004971'
  on-tertiary-container: '#60baff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5efda'
  primary-fixed-dim: '#99d2be'
  on-primary-fixed: '#002018'
  on-primary-fixed-variant: '#155041'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a dignified, reassuring, and highly accessible civic-tech interface tailored for students and families accessing the Ministry of Tribal Affairs (MoTA) scholarship schemes across rural and semi-urban regions. 

The aesthetic is **Warm Civic Modernism**: moving away from bureaucratic, cluttered institutional portals toward an empowering, warm, and structured mobile-first experience. It balances institutional trustworthiness with approachable cultural sensitivity through organic forest greens, warm sunrise ambers, and clear, supportive status communication.

Key emotional pillars:
- **Trust & Empowerment:** High-contrast text, clear step-by-step progress tracking, explicit document validation states, and zero visual ambiguity.
- **Inclusivity & Clarity:** Low cognitive load, generous touch targets (minimum 48px), multilingual clarity, and self-explanatory iconography.
- **Dignity & Warmth:** Soft cream base tones, smooth rounded cards, and positive affirmations replacing punitive government language.

## Colors
The palette grounds itself in natural, earth-toned institutional colors with vibrant signaling states.

### Core Swatches
- **Primary (`#134e3f` - Forest Jade):** The brand anchor. Conveys stability, prosperity, tribal heritage, and government authority. Used for primary interactive actions, high-emphasis branding elements, and active navigation bars.
- **Secondary (`#d97706` - Warm Ochre / Amber):** Vital highlight tone used for cautionary badges, critical action required alerts, pending states, and high-visibility reminders.
- **Tertiary (`#0284c7` - Clear Azure):** Functional secondary accent utilized for document links, informational assistant chips (JAGO bot), and secondary status markers.
- **Neutral Dark (`#0f172a` - Deep Slate):** High-contrast text baseline to ensure absolute legibility against daylight reflection on low-cost mobile displays.

### Functional Canvas & Badging
- **Background Base:** `#fbfbf9` (Warm Natural Cream), softer on the eyes than pure white during outdoor field usage.
- **Surface Cards:** `#ffffff` with a defined hairline border `#e2e8f0` (Border Slate).
- **Status Success:** `#15803d` with background `#f0fdf4` (`✓ Verified`).
- **Status Warning/Action:** `#b45309` with background `#fffbeb` (`⚠ Action needed`).
- **Status Processing:** `#0369a1` with background `#f0f9ff` (`◷ Processing`).

## Typography
**Plus Jakarta Sans** is designated across all levels. Its open apertures, geometric warmth, and generous x-height maintain high legibility across low-resolution mobile screens and multi-script adaptations (Hindi, Telugu, Odia, Marathi transliterations).

- **Headlines:** Set with confident weight (`600` and `700`) to anchor dashboard summaries, applicant IDs, and scholarship titles.
- **Body:** Kept at a minimum base of 14px on mobile to guarantee readability for students and field workers alike.
- **Labels & Badges:** Use semi-bold rendering with slight positive tracking to ensure rapid identification of document approval statuses and payment amounts.

## Layout & Spacing
A 4-column fluid mobile grid forms the foundation, transitioning into an 8-column layout on tablets and a 12-column layout on wide web interfaces.

- **Mobile Viewport (default):** Screen outer margins are fixed at `1rem` (16px) with an inner column gutter of `0.75rem` (12px).
- **Vertical Flow:** Stack spacing prioritizes logical grouping with `0.5rem` for item-level details, `1rem` between card segments, and `1.5rem` between distinct task sections (e.g., Application Status vs. Payment Summary).
- **Touch Ergonomics:** All touchable list tiles, language pickers, OTP cells, and buttons enforce a minimum vertical tap zone of 48px, preventing misclicks on compact mobile devices.

## Elevation & Depth
Depth is structured using **tonal nesting layered with subtle tactile drop shadows** rather than deep, blurry blurs.

- **Level 0 (Canvas Base):** Flat `#fbfbf9` with no elevation.
- **Level 1 (Cards & Modules):** Pure `#ffffff` surface, bounded by a crisp 1px stroke of `#e2e8f0` and an ambient shadow `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active Cards & Floating Widgets):** Elevates key tracking containers and bottom navigation bars via `0 4px 6px -1px rgba(19, 78, 63, 0.06), 0 2px 4px -2px rgba(19, 78, 63, 0.04)`.
- **Level 3 (Modal Sheets & Prompts):** Document reuse trays and language selection bottom sheets utilize `0 12px 24px -4px rgba(15, 23, 42, 0.12)` underpinned by a 40% `#0f172a` backdrop veil.

## Shapes
The shape language implements Level 2 (`roundedness: 2`), utilizing friendly, non-aggressive curvature that feels welcoming and approachable:

- **Cards & Primary Modules:** Enforce `1rem` (16px, `rounded-xl`) to `1.25rem` (20px, `rounded-2xl`) corner radiuses for content framing and document cards.
- **Action Buttons & Form Fields:** Standardize on `0.75rem` (12px) to maintain cohesive touch responsiveness.
- **Badges, Chips & Progress Indicators:** Use fully circular / pill radii (`9999px`) to visually distinguish metadata and status chips from structural layout cards.

## Components

### Buttons
- **Primary:** Forest green background (`#134e3f`), high-contrast white label, 12px radius, full-width on mobile with a standard height of 52px. Active press states shift downward to `#0d352b`.
- **Secondary / Ghost:** 1.5px border of `#134e3f`, clear background, `#134e3f` typography.
- **Destructive / Alert Action:** Bordered warm amber (`#d97706`) with light cream fill (`#fffbeb`).

### Status Badges
Pill-shaped containers (`height: 28px`, `padding: 4px 12px`, `font-size: 12px`, weight: `600`) pairing distinct iconography with plain-language text:
- **Verified:** Background `#f0fdf4`, border `#bbf7d0`, text `#15803d` with icon `✓`.
- **Action Needed:** Background `#fffbeb`, border `#fef08a`, text `#b45309` with icon `⚠`.
- **Processing:** Background `#f0f9ff`, border `#bae6fd`, text `#0369a1` with icon `◷`.

### Document & Scholarship Cards
- Contained within white `#ffffff` cards with 16px radius and 1px `#e2e8f0` border.
- Layout splits into a left icon avatar (category/file type in soft green or amber circle), middle information block (title, scheme ID, timeline), and right chevron or status badge.
- Interactive states feature a momentary surface change to `#f8fafc`.

### Stepper & Application Tracker
- Vertical timeline anchored by 24px circular nodes connected by a 2px vertical rule.
- Completed steps display a filled green node with a checkmark (`#134e3f`).
- Current step displays an active pulsing ring or high-contrast accent.
- Incomplete / pending nodes display a light grey stroke `#cbd5e1` with white center.

### Input Fields & OTP Cells
- Form inputs feature a 50px height, 12px rounded corners, `#ffffff` surface, and `#cbd5e1` stroke, transitioning to a 2px `#134e3f` focus ring.
- OTP entry uses separate single-character square boxes (48x56px) with centered bold numbers (`headline-md`) for effortless readability.

### Bottom Navigation Bar
- Fixed 64px height with white surface and top border `#e2e8f0`.
- Icon + label vertical stack, with the active tab highlighted in `#134e3f` and a distinctive floating central action button dedicated to the conversational assistant ("JAGO").