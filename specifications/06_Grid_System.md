# 06 Grid System Specification: Lustra

This specification defines the responsive layout grids, margins, gutters, spacing metrics, and safe area guidelines for the Lustra platform.

---

## 1. Grid Metrics & Container Parameters

Lustra uses a strict 8px layout grid to maintain structural harmony and visual balance across different screens.

| Screen Category | Viewport Breakpoint | Grid Columns | Outer Margins | Column Gutters | Max Container Width |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Portrait / Touch** | `< 576px` | 4 Columns | `16px` | `16px` | Full Width (`100%`) |
| **Tablet Portrait / Mini** | `576px - 768px` | 8 Columns | `24px` | `16px` | Full Width (`100%`) |
| **Tablet Landscape / iPad** | `768px - 992px` | 8 Columns | `32px` | `20px` | `960px` |
| **Laptop Views / Medium** | `992px - 1200px` | 12 Columns | `48px` | `24px` | `1140px` |
| **Desktop standard** | `1200px - 1440px` | 12 Columns | `64px` | `24px` | `1320px` |
| **Ultra Wide displays** | `&ge; 1440px` | 12 Columns | Auto Centred | `32px` | `1400px` (Max Bounds) |

---

## 2. Spacing Scale Structure

Lustra implements a multi-step design system spacing scale built on **8px** increments. These must be used for layout margins, paddings, and element offsets.

```
$spacing-xs:  4px;  // Micro gaps, close tags
$spacing-sm:  8px;  // Small borders, labels gaps
$spacing-md:  16px; // Input padding levels, card elements
$spacing-lg:  24px; // Normal group gutter, layout blocks
$spacing-xl:  32px; // Card paddings, section list gaps
$spacing-2xl: 40px; // Double columns gaps
$spacing-3xl: 48px; // Inner section padding
$spacing-4xl: 64px; // Standard section spaces (Mobile)
$spacing-5xl: 80px; // Standard page section margins (Tablet)
$spacing-6xl: 96px; // Large editorial spacing blocks (Desktop)
```

### Layout Padding Rules:
* **Section Space (Desktop):** `80px` (`$spacing-5xl`) to `96px` (`$spacing-6xl`).
* **Section Space (Tablet):** `600px` to `80px`.
* **Section Space (Mobile):** `40px` (`$spacing-2xl`) to `48px`.

---

## 3. Responsive Column Grids

To support fluid layouts, responsive grid columns must follow predefined nesting behavior across breakpoints:

* **Bento Editorial Grid Details:**
  * **Desktop:** Spans multiple layouts (e.g. 7-column feature + 5-column secondary card).
  * **Tablet:** Cards adapt to a balanced 4-column span each.
  * **Mobile:** Stacks into a single 4-column layout row.
* **Shop Search Grid Configurations:**
  * **Large Desktop / Wide:** 4 product columns per layout row (span 3 columns each).
  * **Laptop / Standard:** 3 product columns per layout row (span 4 columns each).
  * **Mobile / Touch Portrait:** 2 product columns per layout row (span 2 columns each).

```
   12 Column Desktop Grid Layout Row Preview
   +---+---+---+---+---+---+---+---+---+---+---+---+
   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |
   +---+---+---+---+---+---+---+---+---+---+---+---+
   |-- Card 1 (Span 4) --|-- Card 2 (Span 4) --|-- Card 3 (Span 4) --|
```

---

## 4. Mobile Notch & Safe Area Guidelines

Lustra ensures a seamless layout flow on notch-equipped, wrap-around, and edge-to-edge screens.

* **Top Viewport Navigation:** Sticky headers must incorporate native device safe area variables to ensure brand identifiers do not collide with sensor cutouts:
  ```css
  .header {
    padding-top: calc(16px + env(safe-area-inset-top));
  }
  ```
* **Bottom Cart & CTA Overlay Panels:** Floating, sticky mobile action control panels (e.g. Add to Cart bar, Buy Now buttons, checkout sheets) must apply bottom offsets:
  ```css
  .sticky-bottom-actions {
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
  ```
* **Landscape Aspect Ratios:** Ensure full-bleed visual canvases (such as VR cameras or video components) apply side-padding safe areas:
  ```css
  .webcam-viewport-workspace {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  ```
