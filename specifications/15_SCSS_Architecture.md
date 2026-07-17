# 15 SCSS Architecture Specification: Lustra

Lustra uses the Sass 7-1 folder structure to logically separate variable tokens, layouts, base overrides, page styles, and external library styles.

---

## 1. Sass 7-1 Folder Architecture Map

```
scss/
│
├── abstracts/              # Shared configurations (variables and helpers)
│   ├── _variables.scss     # Design token variables (fonts, space scale, radii)
│   ├── _colors.scss        # Hex color definitions
│   ├── _mixins.scss        # Standard media queries and button styles
│   └── _functions.scss     # Pixels-to-rem conversion formulas
│
├── base/                   # Basic reset files and standard element styles
│   ├── _reset.scss         # CSS reset
│   ├── _typography.scss    # Custom typography style guides
│   └── _base.scss          # Core typography default overrides
│
├── layout/                 # Global layout structures
│   ├── _header.scss        # Desktop navigation header
│   ├── _footer.scss        # Detailed directory footer
│   ├── _grid.scss          # Flexbox grid and container widths
│   └── _navigation.scss    # Desktop mega menu and mobile menu drawers
│
├── components/             # Reusable UI components
│   ├── _buttons.scss       # Interactive buttons
│   ├── _cards.scss         # Product details and review cards
│   ├── _forms.scss         # Text inputs and size selectors
│   ├── _badges.scss        # Sale and status label tags
│   ├── _tabs.scss          # Selection tabs
│   ├── _accordions.scss    # FAQ detail accordions
│   └── _modals.scss        # Dialog popups and sliders
│
├── pages/                  # Page-specific styles
│   ├── _home.scss          # Homepage styles
│   ├── _shop-listing.scss  # Catalog search pages
│   ├── _product-detail.scss# PDP customization controls
│   ├── _builder.scss       # Setup interfaces for the custom jewelry builder
│   └── _ai-advisor.scss    # Layouts for the AI advisor chat workspace
│
├── themes/                 # Visual skin overrides
│   ├── _gold-luxury.scss   # Standard brand look
│   └── _dark-luxury.scss   # Dark theme mode overrides
│
├── utilities/              # Target helper utility classes
│   ├── _animations.scss    # Standard fade-in and slide transition rules
│   └── _helpers.scss       # Text alignments, margin spacers, display blocks
│
└── main.scss               # Main stylesheet that aggregates imports
```

---

## 2. File Naming & Compiler Rules

* **Partial Files:** All sub-stylesheets must be prepended with an underscore (`_`) to prevent the Sass compiler from outputting them as separate files.
* **Master Stylesheet (`main.scss`):** This file acts as the central hub, importing all partials in order. Do not write CSS rules directly in `main.scss` to maintain a clean code structure.
* **Imports Order:**
  ```scss
  // Import abstracts first, then base overrides, configurations, components, and pages.
  @import 'abstracts/variables';
  @import 'abstracts/colors';
  @import 'abstracts/mixins';
  @import 'abstracts/functions';

  @import 'base/reset';
  @import 'base/typography';
  @import 'base/base';
  
  @import 'layout/header';
  @import 'layout/footer';
  
  @import 'components/buttons';
  @import 'components/cards';
  
  @import 'pages/home';
  @import 'pages/builder';
  
  @import 'themes/gold-luxury';
  @import 'utilities/helpers';
  ```

---

## 3. Abstract Mixins Recipes

Include helper mixins to handle responsive breakpoints and layout states.

```scss
// Breakpoint mixin configuration
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 575px) { @content; }
  }
  @else if $breakpoint == tablet {
    @media (min-width: 576px) and (max-width: 991px) { @content; }
  }
  @else if $breakpoint == laptop {
    @media (min-width: 992px) and (max-width: 1199px) { @content; }
  }
  @else if $breakpoint == desktop {
    @media (min-width: 1200px) { @content; }
  }
}

// Aspect ratio fallback helper
@mixin aspect-ratio($width, $height) {
  aspect-ratio: $width / $height;
  @supports not (aspect-ratio: $width / $height) {
    &::before {
      content: "";
      float: left;
      padding-top: ($height / $width) * 100%;
    }
    &::after {
      content: "";
      display: table;
      clear: both;
    }
  }
}
```

---

## 4. Visual Themes Overrides

Theme overrides apply structural variations globally using high-level CSS classes:

```scss
// Example theme configuration snippet
.theme--dark-luxury {
  --color-pure-white: #121212;
  --color-dark-charcoal: #FFFFFF;
  --color-neutral-100: #1A1A1A;
  --color-platinum-gray: #2A2A2A;
  
  body {
    background-color: var(--color-pure-white);
    color: var(--color-dark-charcoal);
  }
}
```

---

## 5. CSS Optimization Guidelines

1. **Limit Nesting Depth:** Do not nest selectors more than **3 levels deep**. Excessive nesting creates long CSS selectors that increase file size and make styles harder to maintain.
2. **Media Queries in Context:** Do not write responsive media queries in a separate file. Keep them nested inside the relevant selector blocks using the `@mixin respond-to` helper:
  ```scss
  .product-details {
    padding: var(--spacing-xl);
    
    @include respond-to(mobile) {
      padding: var(--spacing-md);
    }
  }
  ```
3. **Typography Unit Conversion:** Avoid hardcoding static values. Use functions to automatically convert pixel inputs into layout-adaptive `rem` values:
  ```scss
  @function rem($pixels, $context: 16) {
    @return ($pixels / $context) * 1rem;
  }
  .card-title {
    font-size: rem(20); // Resolves cleanly to 1.25rem
  }
  ```
