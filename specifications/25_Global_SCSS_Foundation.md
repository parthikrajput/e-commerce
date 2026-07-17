# 25 Global SCSS Foundation & Styling System: Lustra

This document maps out the CSS resets, CSS variable tokens, global utility selectors, typography scales, buttons/forms behavior matrices, and coding standards for the Lustra styling system.

---

## 1. `main.scss` Import Hierarchy

The compiler file layout is structured to prevent style overrides and ensure rules cascade correctly:

```
                  IMPORT SEQUENCING
+-------------------------------------------------+
|   Abstracts (Variables, Colors, Mixins)         |  <-- Set initial rules first
+-------------------------------------------------+
|   Base Layouts (Resets, Root variables, Type)    |  <-- Normalize elements styling
+-------------------------------------------------+
|   Layout Elements (Navbar headers, Footers)      |  <-- Outline site structures
+-------------------------------------------------+
|   Components (Buttons, Cards, Inputs grids)     |  <-- Set reusable classes
+-------------------------------------------------+
|   Pages (Overlays overrides, details)           |  <-- Contextual pages style overrides
+-------------------------------------------------+
|   Themes & Utilities (Themes, helper overrides)  |  <-- Final adjustments
+-------------------------------------------------+
```

### Why this Import sequence is used:
1. **Abstracts First:** Sass helper functions and mixins must load before other rules so they can compile references like `rem()` conversions correctly.
2. **Resets Before Layouts:** Resets clear basic margin and padding rules before grid structural parameters are applied.
3. **Components Before Pages:** General component styles must compile before page-specific styles so that pages can selectively override component features without having to use high-specificity classes.

---

## 2. CSS Reset Strategy

Lustra uses an optimized reset file (`reset.css`) to align element styling across different browsers:

* **Sizing Rules:** Sets `box-sizing: border-box` globally across all components, keeping margins and borders within elements' set widths.
* **Margins & Spacings Reset:** Clears default margins and paddings globally to build spacing heights using utility values.
* **Media Assets Behavior:** Forces layout tags (`img`, `video`, `iframe`, `canvas`) to display as block elements, capping heights at `max-width: 100%` and `height: auto` to prevent image scaling layout breaks.
* **Inline Indicators Reset:** Replaces browser default list styles (`ul`, `ol`) with raw listing arrays (`list-style: none`).
* **Input Elements Reset:** Disables default input borders, browser dropdown icons, and custom search close clear-points. Form elements inherit text scales from parent scopes automatically.
* **Keyboard Selections:** Maps highlighted selection tags to background gold borders and high-contrast texts.
* **Scrollbar Resets:** Replaces native scrollbars with thin custom overlays on scrollable elements.

---

## 3. Root Variables (`:root` Layout Tokens)

Design token parameters are configured in `:root` scope variables:

```scss
:root {
  // Brand Color Palette
  --color-primary-gold:         #C9A96E;
  --color-primary-gold-hover:   #B8985D;
  --color-dark-charcoal:        #1A1A1A;
  --color-dark-charcoal-hover:  #0F0F0F;
  --color-pure-white:           #FFFFFF;
  --color-cream-tint:           #FAF8F5;
  --color-gray-line:            #E9E7E2;
  
  // Secondary Colors
  --color-neutral-900:          #121212;
  --color-neutral-600:          #666666;
  --color-neutral-400:          #B0B0B0;
  --color-ok-green:             #2F855A;
  --color-warn-red:             #D64545;
  --color-ai-rose:              #D7A7A0;

  // Typographic Font Stack
  --font-family-display:        'Playfair Display', Georgia, serif;
  --font-family-body:           'Inter', system-ui, -apple-system, sans-serif;

  // Spacing Scales (8px Grid system)
  --spacing-2xs:                4px;
  --spacing-xs:                 8px;
  --spacing-sm:                 16px;
  --spacing-md:                 24px;
  --spacing-lg:                 32px;
  --spacing-xl:                 48px;
  --spacing-2xl:                64px;
  --spacing-3xl:                80px;

  // Visual Shapes Radii
  --radius-xs:                  4px;
  --radius-sm:                  8px;
  --radius-md:                  12px;
  --radius-lg:                  16px;
  --radius-xl:                  24px;
  --radius-circle:              50%;

  // Shadow Elevation Tokens
  --shadow-sm:                  0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md:                  0 8px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg:                  0 16px 32px rgba(0, 0, 0, 0.12);
  --shadow-card:                0 10px 30px rgba(26, 26, 26, 0.04);
  --shadow-modal:               0 20px 50px rgba(0, 0, 0, 0.3);

  // Transitions & Animations
  --transition-ease-slow:       all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  --transition-ease-default:    all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  --transition-ease-fast:       all 0.15s cubic-bezier(0.25, 1, 0.5, 1);
}
```

---

## 4. Typography System

Lustra uses relative font units (`rem`) with fluid scaling rules managed by custom CSS clamp expressions.

### 4.1 Headings Scale (Playfair Display)
* **Display H1:** `clamp(2.25rem, 5vw, 4rem)` (Line Height: `1.2` \| Letter Spacing: `-0.01em` \| Medium `500`).
* **H1 Section:** `clamp(1.625rem, 3.5vw, 2.75rem)` (Line Height: `1.25` \| Light/Regular `400`).
* **H2 Section:** `clamp(1.375rem, 3vw, 2.25rem)` (Line Height: `1.3` \| Regular `400`).
* **H3 Subheader:** `clamp(1.125rem, 2.5vw, 1.875rem)` (Line Height: `1.35` \| Semi-Bold `600`).

### 4.2 Body text Scales (Inter)
* **Body XL:** `clamp(1rem, 1.25vw, 1.125rem)` (Line Height: `1.6` \| Regular `400`).
* **Body L:** `1rem` (Constant on Desktop; Line Height: `1.5` \| Regular `400`).
* **Label / Details:** `0.875rem` (Line Height: `1.4` \| Medium `500`).
* **Caption / Meta:** `0.75rem` (Line Height: `1.3` \| Regular `400` \| Letter Spacing: `0.05em`).

---

## 5. Grid System & Container Rules

The layout follows a mobile-first responsive grid system:

| Viewport Breakpoint | Columns | Gutter Width | Container Max-Width | Sidebar Margins |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (`<576px`)** | 4 | `12px` | `100%` | `16px` |
| **Tablet (`576px - 991px`)** | 8 | `16px` | `90%` | `24px` |
| **Laptop (`992px - 1199px`)** | 12 | `24px` | `95%` | `48px` |
| **Desktop (`&ge; 1200px`)** | 12 | `24px` | `1400px` | `64px` |

---

## 6. Global Utility Classes

The styling framework includes standard utility helper classes to manage layout formatting:

* **Display Helpers:** `.u-d-block`, `.u-d-flex`, `.u-d-grid`, `.u-d-none`.
* **Flex Layouts:** `.u-flex-row`, `.u-flex-column`, `.u-align-center`, `.u-justify-between`, `.u-flex-wrap`.
* **Flow Spacing Margins:** `.u-m-0`, `.u-mt-sm`, `.u-mb-lg`, `.u-mx-auto` (centering helpers).
* **Text Alignments:** `.u-text-center`, `.u-text-right`, `.u-text-uppercase`, `.u-text-italic`.
* **Visual Opacities:** `.u-opacity-0`, `.u-opacity-50`, `.u-opacity-100`.
* **Overflow Controls:** `.u-overflow-hidden`, `.u-overflow-scroll-y`.

---

## 7. Global Button UI Specifications

Buttons follow a clean layout structure, using standard size variations and hover transitions:

| CSS Selector Class | Visual Style | Border & Radius | Hover Transition State |
| :--- | :--- | :--- | :--- |
| **`.btn--primary`** | Solid dark charcoal background, white text. | `--radius-lg` / `16px` | Shifts background color to gold. |
| **`.btn--secondary`**| Solid gold background, dark text. | `--radius-lg` / `16px` | Darkens background shade slightly. |
| **`.btn--outline`** | Transparent background, dark borders. | `--radius-lg` / `16px` | Fills background dark with white text. |
| **`.btn--ghost`** | Transparent background, dark text. | `--radius-sm` / `8px` | Fades background to a light gray. |
| **`.btn--text`** | Underlined text with no border. | None | Gold outline underline text transition. |
| **`.btn--icon`** | Circular frame for icon buttons. | `50%` circle radius| Fades background to light gray, scales icon. |

### Button Operational States:
* **Loading State (`.is-loading`):** Text fades out slightly, and a loading spinner loops at the center of the button. The button is programmatically disabled to prevent repeated form submissions.
* **Disabled State (`.is-disabled`):** Element opacity is reduced to `45%`, mouse interactions are disabled, and cursor behavior reverts to disabled.
* **Success State (`.is-success`):** Background transitions to dynamic green (`--color-ok-green`).
* **Warning State (`.is-danger`):** Background transitions to warning ruby red (`--color-warn-red`).

---

## 8. Global Form System

Inputs and selectors are styled to maintain a clean layout alignment across forms:

* **Sizing Options:** Focus borders transition from light gray to primary gold. Inputs use a base height of `48px` to ensure comfortable tap sizes on mobile.
* **Validations Feedback:**
  * Active/Focus: Transitions borders to Gold.
  * Valid inputs (`.is-valid`): Outputs a thin green border and helper checkmark icon.
  * Invalid inputs (`.is-invalid`): Outputs standard warning red borders and error sub-text.
* **Checkbox & Radio Blocks:** Accessible hiding overlays display custom vector outlines and check graphics.
* **Toggle Switches:** Replaces native styling with custom track handles.
* **OTP Input Forms:** Centered single-character input blocks (`width: 48px, height: 56px`) with automatic focus transitions.

---

## 9. Reusable Card Foundation

Standard layout variables for item and listing cards:

* **Padding Configuration:** Component cards use `var(--spacing-sm)` (`16px`) padding on mobile viewports, scaling up to `var(--spacing-md)` (`24px`) on desktop grids.
* **Corner Radius:** Cards use the standard corner radius token (`--radius-xl` / `24px`) on outer borders, and `--radius-md` (`12px`) on interior photo media.
* **Elevation Shadows:** Product cards use the standard card shadow token (`--shadow-card`).
* **Hover Interaction:** Hovering over a card triggers a smooth transition:
  * Cards translate upward by `-4px` along the Y-axis.
  * Standard shadows transition to a deeper level (`--shadow-lg`).
  * Secondary product photos fade in to swap the main image view.

---

## 10. Animation Tokens

* **Default Dynamic Transition Duration:** `300ms` (e.g. standard hover states and text inputs transitions).
* **Entrance Transition Duration:** `500ms` (applied during drawer reveals and container shifts).
* **Dynamic Easing Curve:** `cubic-bezier(0.25, 1, 0.5, 1)` (Power3.out curve).
* **Skeleton Loader Shimmer:** Linear shimmer transitions loop over 1.2s cycles:
  ```css
  @keyframes skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```

---

## 11. Responsive SCSS Breakpoint Rules

Media queries are organized using the custom responsive mixin, keeping breakpoints nested inside their target selectors rather than separated in a different file:

```scss
// Standard responsive declaration code
.product-showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);

  @include respond-to(tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  @include respond-to(mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }
}
```

---

## 12. Accessibility Styling (WCAG 2.2 AA)

* **Dual Outline Focus Ring:** Ensure interactive elements have a high-contrast focus outline when focused via keyboard:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-primary-gold);
    outline-offset: 4px;
  }
  ```
* **Keyboard-Only States:** Highlight active focus states on buttons and links only when navigated via keyboard commands, avoiding focus rings on standard touch interactions.
* **Reduced Motion Adjustments:** Wrap animations in a reduced-motion media query, falling back to simple opacity fades if the user prefers reduced motion:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 13. Third-Party Vendor Rules

* **Swiper.js Custom Themes:** Swiper pagination dots and navigation arrows use the design system's primary colors:
  * `.swiper-pagination-bullet-active` is styled using `--color-primary-gold`.
* **GSAP Rendering Optimizations:** Add `will-change: transform` styles to elements targeted for GSAP scroll animations, offloading rendering to the GPU to prevent lags.
* **Fallback Content Areas:** If WebGL tools (Try-On, Custom Builder) fail to load, display static image fallbacks automatically.

---

## 14. SCSS Coding Standards

1. **Limit Nesting depth:** Do not nest selectors more than **3 levels deep** to keep stylesheet sizing lightweight and maintainable.
2. **Standard Variable Declarations:** Never use hardcoded pixel values. All spacing configurations and colors must reference design token variables.
3. **No Inline Styling:** Do not write styling options directly in HTML elements. All overrides must be handled through the Sass structure.
4. **Naming Standards:** Use the lowercase BEM naming system (`block__element--modifier`) for class names.

---

## 15. Developer Guidelines

* **When to Create a Utility:** Use standard utility helper classes for simple overrides (e.g. centering text or adding margins), rather than creating new selectors.
* **When to Create a Component:** Create a dedicated component partial if the element is reused across multiple layouts (like button styles or product card structures).
* **When to Use Mixins:** Use mixins to simplify layout blocks that repeat across components (like layout grids or media queries).
