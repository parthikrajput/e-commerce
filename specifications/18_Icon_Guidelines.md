# 18 Icon Guidelines: Lustra Platform

This document outlines the SVG icon standards, size settings, stroke widths, fill rules, and usage standards for the Lustra design system.

---

## 1. Icon Library Aesthetic & Selection

* **Visual Style:** Lustra uses a custom, geometric icon style characterized by monoline paths with rounded terminals, clean circle diameters, and thin details. It is styled to match libraries like Lucide or Feather Icons.
* **SVG Output Settings:** All icons must be output as clean vector elements, using SVGs configured with default viewboxes:
  ```html
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lustra-icon">
    <!-- SVG Vector paths -->
  </svg>
  ```

---

## 2. Standard Size Tokens

Icons are configured in five standard sizes to match different UI contexts:

| Size Token | Dimension | Stroke Width | Primary Application |
| :--- | :--- | :--- | :--- |
| **`$icon-xs`** | `16px x 16px` | `1.5px` | Meta tags, details panels, alert indicators |
| **`$icon-sm`** | `20px x 20px` | `2px` | Sub-navigation items, detail cards inputs |
| **`$icon-default`**| `24px x 24px` | `2px` | Primary UI controls, cart hooks |
| **`$icon-lg`** | `32px x 32px` | `2px` | Category cards filters, action sheets |
| **`$icon-xl`** | `48px x 48px` | `2.5px` | Success indicators |

---

## 3. Stroke & Fill Behaviors

* **Outline Style:** By default, all icons are outline-only (`fill: none`) with a standard `2px` stroke weight (`stroke: currentColor`) to adapt to dark charcoal or white container backdrops automatically.
* **Filled State Transition:** Interactive states (like selecting a filters indicator or saving a wishlist card) fill the icon path:
  * Toggling a heart icon changes the fill attribute to `--color-primary-gold` (or `#D64545` if clicked), while keeping the standard border.
  * Toggling navigation profile categories changes the outline style to fill elements.

---

## 4. Spacing & Container Margins

* **Target Boundaries:** Sizing layout blocks include spacing padding settings around small icons to maintain a minimum interactive hit area of `48px` for touch devices:
  ```css
  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 12px; /* Pad 24px icon sizes to 48px footprint boundaries */
  }
  ```
* **Text Alignments:** Center icons vertically when placing them next to text labels (like buttons or search bars):
  * Apply `vertical-align: middle` or use a layout with `display: inline-flex; align-items: center; gap: 8px;`.

---

## 5. Usage & Accessibility Rules

1. **Decorative Icons:** Add `aria-hidden="true"` to vector SVG icons used purely for visual accent next to copy labels. This hides the icon from screen readers to prevent repetitive announcements:
  ```html
  <button class="btn btn-gold">
    <svg aria-hidden="true" class="lustra-icon">...</svg>
    <span>Process Checkout</span>
  </button>
  ```
2. **Interactive Action Controls:** When using standalone icon buttons (like search icons, wishlist hearts, or cart bags), wrap the icon in a link or button tag with a descriptive aria-label:
  ```html
  <a href="/cart/index.html" aria-label="Open Shopping Bag containing 3 items" class="utility-icon-link">
    <svg class="lustra-icon">...</svg>
    <span class="active-badge-number" aria-hidden="true">3</span>
  </a>
  ```
3. **Prevent Color Traps:** Never hardcode colors directly in SVG paths. Use `stroke="currentColor"` configuration tokens so the icon's color adapts automatically to match the parent element's text color.
