# 14 Frontend Architecture Specification: Lustra

This document outlines the frontend engineering architecture, directory structures, scripting guidelines, module management rules, and development guidelines for the Lustra platform.

---

## 1. Directory Tree Architecture

The frontend project utilizes a flat-file directory layout optimized for static builds, CDN distribution, and easy asset deployment.

```
/ (Root)
│
├── index.html                  # Core entry point page
├── specifications/             # Design and engineering specifications
│
├── assets/                     # Static media directories
│   ├── fonts/                  # Custom web fonts (Playfair Display, Inter)
│   ├── icons/                  # Optimized individual custom SVG assets
│   └── images/                 # Compressed WebP products and model layouts
│
├── scss/                       # SCSS 7-1 stylesheet architecture
│   ├── abstracts/              # Shared SCSS variables, functions, and mixins
│   ├── base/                   # Global resets, base resets, and typography
│   ├── layout/                 # Global UI layouts (header, footer, sidebar)
│   ├── components/             # Reusable UI component styling rules
│   ├── pages/                  # Page-specific styling rules
│   ├── themes/                 # High-end color theme variations
│   ├── vendors/                # External styles overrides (vendor-specific)
│   └── main.scss               # Main stylesheet that aggregates imports
│
├── js/                         # Vanilla ES6 javascript modules
│   ├── modules/                # Component logic handlers
│   │   ├── ai-stylist.js       # AI advisor conversation logic
│   │   ├── ar-tryon.js         # WebGL camera-tracking module
│   │   ├── custom-builder.js   # 3D jewelry customization logic
│   │   ├── nav-manager.js      # Header interactions and mega menus
│   │   ├── cart-drawer.js      # Cart overlay state and updates
│   │   └── product-gallery.js  # PDP zoom lens and carousels
│   │
│   ├── utils/                  # Shared helper scripts
│   │   ├── dom-helpers.js      # DOM element creation helpers
│   │   ├── validator.js        # Checkout input validation script
│   │   └── localStorage.js     # Saved items cache utilities
│   │
│   ├── vendors/                # Local copies of external libraries
│   │   ├── gsap.min.js
│   │   ├── swiper-bundle.min.js
│   │   └── scroll-trigger.min.js
│   │
│   └── app.js                  # Global application entry point
│
└── dist/                       # Production output (minified files)
```

---

## 2. Dynamic Asset Management Rules

To speed up page loads and improve performance:
* **UI Icons:** Use inline SVGs or load local SVG sprites to reduce the number of HTTP requests. Do not import external icon font libraries (such as FontAwesome) to avoid loading unnecessary CSS.
* **Web Typography:** Host typography files locally in self-contained folders to prevent layout rendering blocks (FOIT).
* **Media Assets:** Deliver all product imagery in WebP format, compressed to a quality level of **75-80%** to balance quality and file size.

---

## 3. JavaScript Component Modularity

State changes, UI interactions, and animations are managed using a modular vanilla ES6 architecture.

* **Module Isolation Rule:** Class instances should contain self-contained event listeners and manage their own DOM references:
  * Selectors are passed into class constructors during initialization.
  * Avoid global query selectors outside of class boundaries.
  * Cache all element selectors in constructor methods to prevent repeated DOM queries.

### JavaScript Class Implementation Pattern:
```javascript
// Example component initialization structure
export default class CartDrawer {
  constructor(options) {
    this.drawerEl = document.querySelector(options.drawerSelector);
    this.triggerEl = document.querySelector(options.triggerSelector);
    this.closeEl = document.querySelector(options.closeSelector);
    this.isOpen = false;
    
    if (this.drawerEl) this.bindEvents();
  }
  
  bindEvents() {
    this.triggerEl.addEventListener('click', () => this.open());
    this.closeEl.addEventListener('click', () => this.close());
  }
  
  open() {
    this.isOpen = true;
    this.drawerEl.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // GSAP Slide Entrance Animation
    gsap.fromTo(this.drawerEl, { xPercent: 100 }, { xPercent: 0, ease: "power3.out" });
  }

  close() {
    this.isOpen = false;
    gsap.to(this.drawerEl, {
      xPercent: 100,
      ease: "power3.in",
      onComplete: () => {
        this.drawerEl.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }
}
```

---

## 4. Coding & Clean-Code Standards

* **Variables:** Declare variables using `const` and `let`. Avoid using `var` to prevent scope issues.
* **Event Delegation:** Bind event listeners to parent containers instead of individual nodes when managing large lists (like the product grid or filtering chips).
* **Component Lifecycle Initialization:** Ensure elements exist in the DOM before initializing selectors and classes to prevent JavaScript run-time execution errors:
  ```javascript
  document.addEventListener('DOMContentLoaded', () => {
    const isPdpPage = document.querySelector('.pdp-config-workspace');
    if (isPdpPage) {
      import('./modules/product-gallery.js').then((module) => {
        const PDP = new module.default();
      });
    }
  });
  ```
