# 07 Design Tokens Specification: Lustra

This document maps the core design tokens for the Lustra platform. These tokens should be defined as CSS custom properties or Sass variables within the design system:

---

## 1. Color Palette Tokens

### Primary Colors
* `--color-primary-gold`: `#C9A96E` (Usage: CTA headings, active item highlights, high-end highlights).
* `--color-primary-gold-dark`: `#B0925A` (Usage: Buttons hover state).
* `--color-dark-charcoal`: `#1A1A1A` (Usage: Brand background containers, primary headers, readable body texts).
* `--color-neutral-black`: `#121212` (Usage: Deep luxury dark overlays, dark modes).
* `--color-pure-white`: `#FFFFFF` (Usage: Main background canvas, cards background).
* `--color-ivory`: `#FAF8F5` (Usage: Warm secondary layout backgrounds, hero card frames).
* `--color-platinum-gray`: `#E9E7E2` (Usage: Thin minimalist component borders, inactive tabs).

### Neutral Scale
* `--color-neutral-900`: `#121212`
* `--color-neutral-800`: `#2A2A2A`
* `--color-neutral-700`: `#444444`
* `--color-neutral-600`: `#666666`
* `--color-neutral-500`: `#8A8A8A`
* `--color-neutral-400`: `#B0B0B0`
* `--color-neutral-300`: `#D2D2D2`
* `--color-neutral-200`: `#ECECEC`
* `--color-neutral-100`: `#F6F6F6`

### Accent Status Tones
* `--color-emerald-success`: `#2F855A` (Good transaction, coupon verified).
* `--color-ruby-alert`: `#D64545` (Product out of stock, error borders, sale prices).
* `--color-sapphire-info`: `#2563EB` (Shipping trackings, informational alerts).
* `--color-gold-rewards`: `#F4B740` (Loyalty points milestones).
* `--color-rose-gold-ai`: `#D7A7A0` (AI advisor highlights, recommendations glow).

---

## 2. Typography Token Scale
* **Families:**
  * Heading: Playfair Display, Georgia, serif
  * Body: Inter, Helvetica, Arial, sans-serif
* **Display Scales (Web Desktop Context):**
  * `--type-display-xl`: `size: 64px`, `height: 1.15`, `weight: 700`
  * `--type-display-l`: `size: 52px`, `height: 1.2`, `weight: 700`
  * `--type-h1`: `size: 44px`, `height: 1.25`, `weight: 700`
  * `--type-h2`: `size: 36px`, `height: 1.3`, `weight: 700`
  * `--type-h3`: `size: 30px`, `height: 1.35`, `weight: 600`
  * `--type-h4`: `size: 24px`, `height: 1.4`, `weight: 600`
  * `--type-h5`: `size: 20px`, `height: 1.45`, `weight: 600`
  * `--type-h6`: `size: 18px`, `height: 1.5`, `weight: 600`
  * `--type-body-xl`: `size: 18px`, `height: 1.6`, `weight: 400`
  * `--type-body-l`: `size: 16px`, `height: 1.6`, `weight: 400`
  * `--type-body-m`: `size: 14px`, `height: 1.5`, `weight: 400`
  * `--type-caption`: `size: 12px`, `height: 1.4`, `weight: 400`
  * `--type-label`: `size: 11px`, `height: 1.2`, `weight: 500`

---

## 3. Border Radius & Styles
* `--radius-xs`: `4px` (Small checkboxes, badge tags).
* `--radius-sm`: `8px` (Inputs, filter tags, thumbnails).
* `--radius-md`: `12px` (Product cards, mini review cards).
* `--radius-lg`: `16px` (Buttons, notification toast panels).
* `--radius-xl`: `24px` (Main product gallery previews, hero panels).
* `--radius-xxl`: `32px` (Bottom drawer overlays, modal panels).
* `--radius-pill`: `999px` (Status badges, round active indicators).
* `--border-thin`: `1px solid var(--color-platinum-gray)`
* `--border-active`: `1px solid var(--color-primary-gold)`

---

## 4. Shadow & Elevation Tokens
* `--shadow-card`: `0 2px 6px rgba(0, 0, 0, 0.05)` (Product cards, grid items).
* `--shadow-floating`: `0 8px 24px rgba(0, 0, 0, 0.08)` (Sticky header, persistent actions bar).
* `--shadow-dialog`: `0 20px 60px rgba(0, 0, 0, 0.12)` (Checkout modal layouts, details view overlays).
* `--shadow-gold-glow`: `0 0 30px rgba(201, 169, 110, 0.25)` (AI elements active focus, primary buttons hover).
* `--shadow-glass`: `0 10px 40px rgba(0, 0, 0, 0.08)` (Frosted overlay cards).

---

## 5. View Layering (Z-Index Tokens)
* `--z-index-back`: `-10`
* `--z-index-base`: `1`
* `--z-index-sticky`: `100` (Header bar, sticky action bottom banners).
* `--z-index-drawer`: `500` (Cart drawer sidebar).
* `--z-index-overlay`: `1000` (Backdrop overlays, screen modals).
* `--z-index-toast`: `2000` (Urgent alert banners).

---

## 6. Animation & Interaction Tokens
* **Durations (GSAP & CSS Transitions):**
  * `--transition-fast`: `150ms` (Hover highlights, inputs border change).
  * `--transition-normal`: `300ms` (Cart slide overlay reveal, tabs change).
  * `--transition-slow`: `500ms` (Hero slide shifts, modal loading fades).
* **Easing Behaviours:**
  * `--ease-default`: `cubic-bezier(0.4, 0, 0.2, 1)` (Typical UI shifts).
  * `--ease-out-back`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Modal spring transitions).
  * `--ease-premium`: `cubic-bezier(0.25, 1, 0.5, 1)` (Luxury ease curves, slide shows).

---

## 7. Media Sizes & Aspect Ratios
* **Icon Dimensions:**
  * Standard Utility: `24px` by `24px` size, stroke value `2px`.
  * Compact Navigation: `18px` by `18px`.
  * AI Bubble Button: `56px` by `56px`.
* **Product Imagery Aspect Ratios:**
  * Fine Catalog Images: `3:4` portrait ratio (Optimized for showcasing earrings, necklaces, and jewelry styling coordinates).
  * Ring Details Closeup: `1:1` square crop standard.
  * Hero Wide Slides: `16:9` (Desktop) / `9:16` (Mobile).
