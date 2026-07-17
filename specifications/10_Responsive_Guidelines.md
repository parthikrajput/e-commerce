# 10 Responsive Design Guidelines: Lustra

This document defines the responsive scaling behaviors, layout rules, and component adjustments across different screen sizes for the Lustra platform.

---

## 1. Grid Dimensions & Breakpoints

Lustra uses a mobile-first responsive grid system. Design layouts are optimized for five key viewport breakpoints:

```
+---------------------------------------------------------------------------------------------------+
|  Mobile (<576px)  |  Tablet (576px - 992px)  |  Laptop (992px - 1200px)  |  Desktop (1200px - 1440px) |
+---------------------------------------------------------------------------------------------------+
```

### 1.1 Mobile Viewports (`< 576px`)
* **Design Columns:** 4 Columns.
* **Margins:** 16px lateral padding.
* **Core Layout Rules:** Single-column layout. Form controls expand to the full width of the screen.

### 1.2 Tablet Viewports (`576px - 992px`)
* **Design Columns:** 8 Columns.
* **Margins:** 24px (Portrait) to 32px (Landscape) lateral padding.
* **Core Layout Rules:** Two-column grid layouts for product catalog cards. Sticky columns collapse into a vertical stack.

### 1.3 Laptop Viewports (`992px - 1200px`)
* **Design Columns:** 12 Columns.
* **Margins:** 48px lateral padding.
* **Core Layout Rules:** Navigation switches from a mobile hamburger menu to a horizontal link bar with dynamic mega menus.

### 1.4 Desktop Viewports (`1200px - 1440px+`)
* **Design Columns:** 12 Columns.
* **Margins:** 64px lateral padding.
* **Container Width:** Max-width caps at 1400px to maintain content readability on wide screens.

---

## 2. Dynamic Typography Scaling

Typography sizes adjust fluidly across breakpoints using CSS clamp functions, maintaining a balanced hierarchy on both mobile and desktop screens.

| Sizing Token | Mobile Value | Tablet Value | Desktop Value | CSS Implementation Example |
| :--- | :--- | :--- | :--- | :--- |
| **Display XL** | `36px` | `48px` | `64px` | `font-size: clamp(2.25rem, 5vw, 4rem)` |
| **Display L** | `30px` | `40px` | `52px` | `font-size: clamp(1.875rem, 4vw, 3.25rem)` |
| **H1** | `26px` | `34px` | `44px` | `font-size: clamp(1.625rem, 3.5vw, 2.75rem)` |
| **H2** | `22px` | `28px` | `36px` | `font-size: clamp(1.375rem, 3vw, 2.25rem)` |
| **H3** | `18px` | `24px` | `30px` | `font-size: clamp(1.125rem, 2.5vw, 1.875rem)` |
| **Body XL** | `16px` | `18px` | `18px` | `font-size: clamp(1rem, 1.25vw, 1.125rem)` |
| **Body L** | `14px` | `16px` | `16px` | `font-size: 1rem` (Constant on Desktop) |

---

## 3. Responsive Navigation Behavior

* **Desktop Navigation:** Lists category options horizontally in the header menu. Hovering over a category opens a full-width mega menu overlay.
* **Mobile Navigation:** Navigation is grouped into a slide-out drawer menu (`.mobile-menu-drawer`). Menu items open down as accordions on tap.
* **Persistent Search Bar:** Search collapses into a toggle icon on mobile screen sizes; tapping the icon opens a full-screen search container.
* **Sticky Bottom Navigation (Mobile Apps):** For mobile and touch devices, place quick action buttons (e.g. Chat, Try-On, Cart, Account) in a sticky bar at the bottom of the screen.

---

## 4. Responsive Images & Ratios

To ensure fast page loads and sharp visuals:
* Use the `<picture>` tag to swap images based on screen size, loading portrait crops on mobile and landscape crops on desktop:
  ```html
  <picture>
    <source media="(max-width: 575px)" srcset="product-portrait.webp">
    <source media="(min-width: 576px)" srcset="product-landscape.webp">
    <img src="product-default.webp" alt="Handcrafted Gold Ring" loading="lazy">
  </picture>
  ```
* Aspect ratios adjust automatically based on screen limits:
  * Product Gallery Images: Keep a consistent `3:4` vertical crop across all screen widths.
  * Editorial Banners: Display at a `9:16` vertical ratio on mobile, and scale to `16:9` widescreen on desktop.

---

## 5. Touch Target Zones

* **Minimum Interactive Sizes:** Keep interactive touch target margins at a minimum size of `48px` by `48px` to ensure comfortable usability for mobile users.
* **Spacing Between Targets:** Separate adjacent interactive buttons and link elements by at least `8px` of space to prevent accidental taps.
