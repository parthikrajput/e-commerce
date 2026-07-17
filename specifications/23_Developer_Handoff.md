# 23 Developer Handoff Specification: Lustra

This handoff document compiles the design tokens, component rules, asset formats, animation configurations, and styling conventions required by developers to build the Lustra e-commerce platform.

---

## 1. Asset Packages & Directories

* **Media Folders:** Store all optimized image assets in `/assets/images/`, and group UI vector icons inside the `/assets/icons/` directory.
* **Image Delivery Format:** Deliver visual assets in WebP format compressed to **75-80% quality** to keep file sizes low. Standalone product catalog assets should use transparency-enabled PNG layers.
* **Vector Optimization:** Run custom SVGs through SVGO optimization tools to remove metadata before saving.

---

## 2. Design Token Variables (CSS Stylesheet)

Configure global colors and spacing rules inside the Abstracts variables file:

```scss
// Main color codes
$color-gold-cream:     #C9A96E;
$color-charcoal-dark:  #1A1A1A;
$color-white-pure:     #FFFFFF;
$color-cream-tint:     #FAF8F5;
$color-gray-line:      #E9E7E2;

// Secondary colors
$color-neutral-900:    #121212;
$color-neutral-600:    #666666;
$color-neutral-400:    #B0B0B0;
$color-emerald-ok:     #2F855A;
$color-ruby-warn:      #D64545;
$color-rose-gold-ai:   #D7A7A0;

// Corner radii
$radius-sm:            8px;
$radius-md:            12px;
$radius-lg:            16px;
$radius-xl:            24px;
```

---

## 3. Web Fonts & Typography Integration

Include custom fonts locally to prevent layout rendering blocks and display layout text cleanly:

* **Header Title Font:** Playfair Display (Serif, weights: Bold `700`, Semi-Bold `600`).
* **Interface Body Font:** Inter (Sans-serif, weights: Standard `400`, Medium `500`, Bold `700`).
* **Integration Example (SCSS):**
  ```scss
  @font-face {
    font-family: 'Playfair Display';
    src: url('../fonts/playfair-display-bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  ```

---

## 4. Custom Icon Set Instructions

* All icons should use standardized monoline vector elements based on the Lucide icon library.
* **Standard Vector Properties:** Set stroke weight lines to `2px` and use rounded stroke joints (`stroke-linecap="round" stroke-linejoin="round"`).
* Avoid hardcoding color attributes (like `stroke="#C9A96E"`) directly inside SVG icons. Use dynamic color tags (`stroke="currentColor"`) so icons adapt automatically to match the surrounding text color.

---

## 5. Layout Spacing Scales

Build layout structures on increments of **8px** using the standard spacing tokens:

```scss
$space-xs:  4px;
$space-sm:  8px;
$space-md:  16px;
$space-lg:  24px;
$space-xl:  32px;
$space-2xl: 40px;
$space-3xl: 48px;
$space-4xl: 64px;
$space-5xl: 80px;
$space-6xl: 96px;
```

---

## 6. Responsive Breakpoint Rules

Write responsive styling overrides inside respective component files using the `@respond-to` Media mixins:

```scss
// Breakpoints structure mapping
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 575px) { @content; } // 4-column structures
  }
  @else if $breakpoint == tablet {
    @media (min-width: 576px) and (max-width: 991px) { @content; } // 8-column structures
  }
  @else if $breakpoint == desktop {
    @media (min-width: 1200px) { @content; } // 12-column layouts
  }
}
```

---

## 7. Interaction & Motion Settings (GSAP Guidelines)

Include animation settings to ensure consistent, premium motion across components:

* **Interactive Hover Easing:** `"power3.out"` (Custom transition ease).
* **Entrance Ease Curve:** `"power4.out"` (Transitions components efficiently).
* **Modal spring transition curve:** `"back.out(1.7)"` (Spring animations for modals).
* **Speed durations:** Hover highlights transition over **150ms**, card reveals transition over **300ms**, and page transitions take **500ms**.

---

## 8. Styling Guidelines

* **BEM-Styled CSS Files:** Block-Element-Modifier namespaces (e.g. `.product-card__detail--sale`).
* **Variables Names:** Camelcase or kebab-case matching standard systems (e.g., `--color-primary-gold` or `$font-playfair`).
* **JavaScript Classes:** Lowercase, hyphens (e.g., `ai-chat-handler.js`).
