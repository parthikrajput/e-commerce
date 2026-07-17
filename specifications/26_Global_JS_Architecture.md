# 26 Global JavaScript Architecture & Initialization Specification: Lustra

Lustra uses a modular, event-driven vanilla JS architecture (ES6+), optimized for fast page loads and smooth interactions.

---

## 1. JavaScript Folder Architecture

Scripts are structured as self-contained ES6 classes, organized into directories based on their role in the application:

```
js/
├── app.js                      # Core Application entrance launcher
│
├── core/                       # Core system classes
│   ├── router.js               # Route-based dynamic importing rules
│   ├── event-emitter.js        # Global Event Mediator utility
│   ├── state-manager.js        # Local Reactive state engine
│   └── accessibility.js        # Keyboard traps and focus manager
│
├── config/                     # Configuration definitions
│   └── settings.js             # API key tokens, limits, defaults
│
├── helpers/                    # Shared DOM & utility functions
│   ├── dom-helpers.js          # Node wrapper creators and text loaders
│   ├── event-helpers.js        # Scroll, swipe, and touch monitors
│   ├── formatting.js           # Currency separator filters (e.g. INR converter)
│   └── device.js               # Device and orientation detections
│
├── utils/                      # Optimization utilities
│   ├── debounce.js             # High-frequency event throttlers
│   ├── lazy-loader.js          # IntersectionObserver class bindings
│   └── local-storage.js        # Browser cache storage wrappers
│
├── modules/                    # Complex logic features modules
│   ├── ai-stylist.js           # Personal advisor chat state
│   ├── ar-tryon.js             # WebGL camera controls
│   └── custom-builder.js       # Custom 3D configuration canvas
│
├── components/                 # Reusable UI component controllers
│   ├── navbar.js               # Sticky search and mobile overlay shifts
│   ├── cart-drawer.js          # Cart details overlay slider
│   ├── accordion.js            # Collapsible QA cards
│   ├── tabs.js                 # Horizontal category triggers
│   └── toast.js                # Notification stack alerts panel
│
└── pages/                      # Target page initializations
    ├── home.js                 # Homepage sliders and transitions setup
    ├── shop.js                 # Catalog filter bindings and lists
    └── product.js              # PDP zoom slider controls
```

---

## 2. Application Initialization Flow

To minimize page load times and target a Lighthouse score of &ge; 98, the application initialization sequence is split into four distinct phases:

```
                  INIT PHASE LIFECYCLE
+-------------------------------------------------+
|   Phase 1: DOM Ready Event                      |  <-- App wrapper initializes
+-------------------------------------------------+
|   Phase 2: Configuration & Core Setup           |  <-- Load settings and event hooks
+-------------------------------------------------+
|   Phase 3: Render Core UI                       |  <-- Load visible headers and overlays
+-------------------------------------------------+
|   Phase 4: Dynamic Page Modules                 |  <-- Load page-specific modules (e.g. 3D builder)
+-------------------------------------------------+
```

### Why this startup sequence is used:
* **Phase 1 (DOM Ready):** Initiates selectors immediately after the DOM has fully parsed, preventing script execution issues.
* **Phase 2 (Configuration & Core Setup):** Loads environment variables and event observers before registering visual items, ensuring other components can reference those hooks on loading.
* **Phase 3 (Core UI):** Initializes visible elements first (such as headers, navigation overlays, list drawers, and floating widgets) to provide users with an interactive UI immediately.
* **Phase 4 (Dynamic Page Modules):** Defers loading page-specific features (such as 3D builders, AR cameras, and details graphs) until after the main UI features render, reducing initial page payloads.

---

## 3. Core Modules Responsibilities

* **Application Launcher (`app.js`):** The main entry point. Initializes global core elements (Event Bus, settings config), is globally accessible at `window.Lustra`, and manages runtime memory cleanup.
* **Event Bus (`core/event-emitter.js`):** A global event coordinator that decouples components, allowing them to communicate via event hooks (e.g. `Wishlist:Added`) without direct dependencies.
* **Page Router (`core/router.js`):** Matches URL paths to load page-specific scripts dynamically, preventing pages from loading unnecessary code.
* **State Manager (`core/state-manager.js`):** A reactive state engine that manages shared variables (like cart quantities or wishlist items) and automatically dispatches updates to subscriber nodes when variables change.
* **Accessibility Helper (`core/accessibility.js`):** Manages keyboard focus rings, wraps focus inside active dialog panels, and announces dynamic content updates via ARIA live regions.

---

## 4. Helper Modules Specifications

* **DOM Helpers:** Select and modify nodes:
  * Provide functions to safely create element nodes (`createElementWithClasses`) and clean up child elements (`clearNodeChildren`).
* **Format Helpers:** Convert values to match layout standards:
  * Format currencies (convert number variables to formatted strings, e.g. `₹78,000`).
* **Validation Helpers:** Check form inputs against regular expressions:
  * Verify email syntax, card formatting, and postal code rules.
* **Image Helpers:** Manage image displays:
  * Detect WebP compatibility and serve fallback formats if WebP is unsupported.

---

## 5. Global Utility Modules

* **Debounce:** Delays script execution until a specified time has elapsed (e.g., resizing triggers wait 150ms to prevent lag).
* **Throttle:** Restricts script execution to a set rate (e.g., scroll calculations running every 16ms to maintain 60 FPS page rendering).
* **Lazy Loader Wrapper:** Initializes `IntersectionObserver` controllers, loading images below the fold only when they are 200px from entering the viewport.
* **Storage Cache Wrapper:** Provides clean methods to access, parse, and store data in `localStorage` and `sessionStorage`.

---

## 6. Page-Specific Module Configurations

Page modules load dynamically using the router system, executing their layout scripts only on their respective page directories:

| Page Handler Class | Active Page Scope | Core Initialization Task | Defer Path Target |
| :--- | :--- | :--- | :--- |
| **`Home`** | `index.html` | Initializes hero banners, loads bento look lists, and triggers entrance animations. | Defer load |
| **`Shop`** | `shop.html` | Binds event listeners to catalog filters, handles sorting dropdowns, and initializes infinite scroll. | Defer load |
| **`Product`** | `product.html` | Initializes PDP zoom galleries, loads size selectors, and binds AR triggers. | Defer load |
| **`CustomBuilder`** | `custom-jewellery.html` | Initializes WebGL rendering canvases, loads interactive customization menus, and handles live pricing updates. | Defer load |
| **`TryOn`** | `virtual-try-on.html` | Requests webcam permissions, initializes WebRTC modules, and sets up face-tracking models. | Defer load |

---

## 7. Swiper & Carousel Slider Architectures

Swiper carousels are configured with responsive layout rules to ensure consistent behavior across all screens:

* **Initialization Strategy:** Carousels initialize only when their respective sliders are visible in the DOM. Loop and autoplay actions are paused when sliders scroll out of view to save processing power.
* **Global Default Settings:**
  ```javascript
  const swiperOptions = {
    speed: 600,
    watchOverflow: true,
    preloadImages: false,
    lazy: { loadPrevNext: true }
  };
  ```
* **Clean-up / Destroy Sequence:** When pages change, carousels are removed from memory using the `destroy(true)` method:
  ```javascript
  if (this.sliderInstance) {
    this.sliderInstance.destroy(true);
    this.sliderInstance = null;
  }
  ```

---

## 8. Form Validation & Submissions Architecture

* **Visual Validation Rules:** Form fields check input data on `blur` and `Change` events, changing border styles to gold on entry and red if errors occur.
* **Automatic Formatting (Input Masking):** Auto-formats card numbers with spacing delimiters and formats phone inputs to help users input values correctly.
* **Form Submission Pipeline:**
  * Displays loading shimmers within dynamic CTAs.
  * Disables buttons to prevent duplicate submissions.
  * If validation fails, focus shifts to the first invalid field.
  * If validation succeeds, triggers a success callback (e.g. redirecting to success confirmations screens).

---

## 9. Animation Architecture (GSAP Rules)

* **GSAP Controller:** Serves as the central utility orchestrating animations, ensuring page transitions and elements reveals use the same easing tokens.
* **ScrollTrigger Manager:** Triggers scroll animations (like image reveals and text fades) as elements enter the viewport:
  ```javascript
  gsap.from(".reveal-img", {
    scrollTrigger: {
      trigger: ".reveal-container",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    duration: 0.6
  });
  ```
* **Memory Cleanup Rule:** When pages change, kill active GSAP animation timelines to free up browser memory:
  ```javascript
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
  ```

---

## 10. Performance Optimization Rules

* **Event Delegation:** Bind event listeners to parent containers instead of individual nodes when managing large lists (like the product grid or filter chips).
* **Caching DOM Elements:** Cache DOM selectors in variables during initialization to avoid repeated queries and improve performance:
  ```javascript
  // Good practice
  this.ui.activeBtn = this.element.querySelector('.btn--active');
  ```
* **Memory Management & Garbage Collection:** Always unbind event listeners and set references to `null` inside component `destroy()` methods:
  ```javascript
  destroy() {
    this.ui.triggerBtn.removeEventListener('click', this.clickBound);
    this.ui = null;
  }
  ```

---

## 11. Error-Handling Framework

* **Visual Error Modals:** Displays error messages overlaying widgets when systems or APIs fail, avoiding using developer console error logs.
* **Missing Media Fallbacks:** Automatically replaces broken product image links with alternative placeholder graphics:
  ```javascript
  img.onerror = () => { img.src = '/assets/images/placeholders/fallback.webp'; };
  ```
* **Offline Fallback Screen:** Detects connection changes using the browser's `navigator.onLine` API, displaying a clean offline overlay if connectivity is lost.

---

## 12. Scalability Parameters

* **Decoupled API Integrations:** Group api endpoints internally, allowing developers to switch between local JSON schemas and live REST API outputs.
* **Theme Tag Hooks:** Page scripts check context classes (like `.theme--dark-luxury`) to automatically adjust WebGL lighting and 3D rendering modes to match the active theme.
* **Offline Support & Service Workers:** The javascript entry layer registers a service worker on load, enabling pages and images to load offline when connectivity is lost.
