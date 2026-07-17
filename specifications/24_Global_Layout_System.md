# 24 Global Layout System & Master Layout Specification: Lustra

Lustra uses a unified, modular layout system across all pages to deliver a premium user experience and maintain consistent styling.

---

## 1. Master Layout Structure

Every page implements a nested, structured layout shell designed for accessibility, high-performance rendering (GPU acceleration), and clean layer stacking.

| Layer Class Name | Structural Responsibility | Rendering / Stack Priority |
| :--- | :--- | :--- |
| **`#root-wrapper`** | Parent structural frame containing all nodes. Manages global variables, color theme tags, and page transitions. | Base layout root wrapper |
| **`.skip-to-content`** | High-contrast access link for keyboard-only users. It remains hidden off-screen until focused. | `z-index: 9999` (Top-level focus) |
| **`.announcement-bar`** | Horizontal bar displaying key promo updates, alerts, and invitations. | Top relative context |
| **`#global-header`**| Sticky outer container for primary navigation, user profile shortcuts, search bar, and cart bag hook. | `z-index: 1000` (Sticky top) |
| **`.mega-menu-drawer`**| Full-width drop-down grid displaying product categories and featured edits. | `z-index: 990` (Header child) |
| **`#main-content`** | Primary content container displaying page-specific layouts and screens. | Baseline |
| **`#floating-assistant`** | Rounded widget hosting the persistent AI chat assistant and personal stylist. | `z-index: 500` (Scroll floating layer) |
| **`#floating-utility-actions`**| Vertical stack containing quick action controls (e.g. Chat, Try-On, Back to Top). | `z-index: 500` (Parallel float) |
| **`#global-newsletter`**| Dedicated email opt-in section positioned right above the footer layout. | Pre-footer layout container |
| **`#global-footer`** | Detailed directory footer displaying site links, warranty standards, and legal notices. | Baseline footer |
| **`#modal-root`** | Active dialog frame mounting dynamic checkout confirmations or specifications menus. | `z-index: 2000` |
| **`#overlay-backdrop`** | Semi-transparent dark overlay mask that dims background content when drawers or menus open. | `z-index: 950` |
| **`#toast-container`** | Notification popup stack displaying live messages (like item additions or price notifications). | `z-index: 3000` (Top center overlay) |

---

## 2. Global Page Layout Flow

To maintain visual consistency, pages follow a standard layout sequence:

```
+-------------------------------------------------------------+
|                      Announcement Bar                       |
+-------------------------------------------------------------+
|                           Header                            |
+-------------------------------------------------------------+
|               Breadcrumbs (Dynamic inclusion)               |
+-------------------------------------------------------------+
|                                                             |
|                        Main Content                         |
|                                                             |
+-------------------------------------------------------------+
|                         Global CTA                          |
+-------------------------------------------------------------+
|                         Newsletter                          |
+-------------------------------------------------------------+
|                           Footer                            |
+-------------------------------------------------------------+
               [Floating Elements | Overlays Stack]
```

### Flow Appearance Conditions:
* **Announcement Bar:** Appears globally. Carousel auto-rotates messaging alerts (such as free shipping details, VIP tier entries, or bridal consultations).
* **Header / Footer:** Visible across all pages, except on minimal checkout views (`checkout.html`) and full-screen camera views (`virtual-try-on.html`).
* **Breadcrumb:** Automatically generated on all pages below the second tier of the site map (e.g. detailed listings, PDPs, and dashboard sub-pages).
* **Global CTA:** Displays on editorial brand pages and collection collections lists to guide users directly to the shopping catalog.
* **Newsletter Box:** Included on all pages except checkout tracks and customer dashboards to maintain focus during transactions.

---

## 3. Global Containers Width Limit

Consistent layout container widths prevent content from stretching or breaking on larger screens:

| Width Token | Max-Width | Gutter Margin (Left/Right) | Responsive Scaling Behavior |
| :--- | :--- | :--- | :--- |
| **`$width-full`** | `100%` | None | Stretches edge-to-edge for full-bleed hero banners or WebGL canvasses. |
| **`$width-hero`** | `1600px` | Laptop: 48px \| Mobile: 0px | Slides full-bleed on mobile, scales to 1600px max on wide desktop screens. |
| **`$width-max`** | `1400px` | Desktop: 64px \| Mobile: 16px| Limits desktop content containers, aligning item rows with grid boundaries. |
| **`$width-product`**| `1200px` | Desktop: 64px \| Mobile: 16px| Standard layout container for product lists and custom builder zones. |
| **`$width-reading`**| `800px` | Desktop: auto \| Mobile: 16px | Centered layout container for blog lines and warranty document copy. |
| **`$width-narrow`** | `600px` | Desktop: auto \| Mobile: 16px | Optimized width for core checkout forms, logins, and settings. |

---

## 4. Global Spacing System (8px Grid Alignment)

Paddings and margins align to an 8px grid scale to maintain visual hierarchy across different breakpoints:

| Spacing Type | Desktop (&ge; 1200px) | Laptop (992px - 1199px) | Tablet (576px - 991px) | Mobile (< 576px) |
| :--- | :--- | :--- | :--- | :--- |
| **Section Spacing** | `96px` | `80px` | `64px` | `48px` |
| **Container Padding**| `64px` | `48px` | `24px` | `16px` |
| **Content Spacing** | `48px` | `40px` | `32px` | `24px` |
| **Card Spacing** | `32px` | `24px` | `20px` | `16px` |
| **Component Padding**| `24px` | `20px` | `16px` | `12px` |
| **Gutter Spacing** | `24px` | `24px` | `16px` | `12px` |

---

## 5. Header Layout Rules

* **Sticky Behavior:** The header sticks to the top of the viewport on scroll. On scroll down, it hides to maximize screen space; on scroll up, it slides back into view automatically.
* **Transparent Behavior:** On landing overlays and visual editorial banners, the header background starts fully transparent, transitioning to a solid charcoal background after scrolling down 50px.
* **Search Input Placement:**
  * Desktop: Opens as a search overlay, dimming the background when active.
  * Mobile: Collapses into an icon shortcut, opening a full-screen input menu when tapped.
* **Cart, Wishlist & Profile Hooks:** Standard quick action links are grouped in the top-right header menu. Tapping these opens the cart drawer, rather than routing users away from their current page.
* **Mega Menu Hover Triggers:** Hovering over header layout titles opens the mega menu drawer with a 150ms animation delay. Tapping layout categories on tablet and touch viewports Toggles drawer states.
* **Mobile Drawer Navigation:** Menu drawer shifts from the right side of the screen on mobile, grouping layout directories into collapsible list pages.

---

## 6. Footer Layout Rules

* **Hierarchy Structure:**
  * Top Level: Large email signup form alongside luxury value badges (e.g. certified materials, lifetime warranty, free courier deliveries).
  * Mid Level: Four-column directory index links (Shop Categories, Brand Story, Custom Customer Assistance, VIP Club Links).
  * Bottom Level: SSL trust seals, payment icons, privacy policy links, and copy notices.
* **Responsive Visual Reflow:**
  * Desktop/Laptop: Four-column layout with links displayed alongside the email form.
  * Tablet: Dual-column grid layouts.
  * Mobile: Collapses links into custom accordions, stack payment icons horizontally, and places the email signup form at the top of the footer.

---

## 7. Global Navigation Rules

* **Primary Directory:** Contains direct links to core pages (`Shop`, `Custom jewellery`, `AR Try-On`, `AI advisor`).
* **Secondary Utility Directory:** Contains links to help templates, store locations, and account dashboards.
* **Breadcrumb Navigation:** Displays the current page hierarchy dynamically (e.g., `Home` / `Rings` / `Golden Aura Solitaire`). Breadcrumbs must include correct schema markup to enable structured rich search results.
* **Pagination System:** Catalog layouts load new items automatically on scroll (infinite scroll) or display "Load More" action buttons to prevent page jumps on tap.
* **Deep Linking Rules:** Dynamic features (such as 3D customizable products or look card collections) should include specific URL parameters to support direct deep linking (e.g. `product.html?ring-stone=emerald-cushion`).

---

## 8. Floating Elements & Widgets

* **Floating AI Stylist Widget:**
  * Visibility: Displays globally, except on checkout screens, interactive canvas editors, or virtual camera feeds.
  * Position: Sticky bubble positioned bottom right (`bottom: 24px, right: 24px` on desktop; `bottom: 16px, right: 16px` on mobile layout grids).
* **Live Chat Concierge:** Grouped within the primary AI stylist window, allowing users to transition from AI suggestions to live support seamlessly.
* **Wishlist Quick Access Drawer:** Provides quick access to saved items. Tapping the wishlist icon in the header slides out a preview drawer listing matching products.
* **Back to Top Button:** Sticky round icon that fades in when the screen is scrolled down 300px, scrolling users back to the top of the page smoothly when clicked.

---

## 9. Overlay System Stack & Priorities

To prevent rendering layout clashes and z-index overlap issues, all overlays must follow a strict styling priority index:

```
[z-index: 3000] Toast Alerts
       &darr;
[z-index: 2000] Modal Dialogs (AR Camera, Custom Settings)
       &darr;
[z-index: 1000] Sticky Navbar Header
       &darr;
[z-index:  990] Mega Menu Drawers
       &darr;
[z-index:  980] Cart Drawers / Side Panels
       &darr;
[z-index:  950] Transparent Backdrop Overlays
```

---

## 10. Global Page State Guidelines

* **Loading States:** Elements display a skeleton loader shimmer (`.skeleton-block`) to match the final component layout and prevent layout shifts.
* **Empty Page States:** Displays a clean brand message alongside a clear primary redirect button (e.g., "Your Jewellery Box is empty. Browse our latest arrivals.").
* **Offline Fallbacks:** If connection errors occur, display a clean popup notification: "You are currently offline. Checking for updates...".
* **Maintenance & Error Panels:** Displays custom 500 server error screens or 404 page redirect lists to help users navigate back to safety.

---

## 11. Accessibility Layout Rules (WCAG 2.2 AA)

* **Skip Navigation Links:** Include a skip-to-content helper as the first focusable element on each page, allowing keyboard users to bypass header menus.
* **Focus Order Controls:** Restrict keyboard focus to open overlays (such as side drawers or modal views), preventing focus from escaping to background elements.
* **Semantic Landmarks:** Group code regions inside standard landmark containers (`header`, `nav`, `main`, `footer`).
* **Interactive Touch Target comfort:** Ensure all buttons, search actions, and links have a minimum hit area of **48px x 48px** to ensure usability on mobile and touch devices.

---

## 12. Responsive Structural Changes

* **Widescreen Desktop (&ge; 1440px):** Layout grid spans the full 1400px width limit; columns list products in 4-column rows.
* **Laptop (992px - 1439px):** Columns adjust from 4 to 3 items per row; header layout options remain horizontal.
* **Tablet (576px - 991px):** Category grids wrap to 2 columns; sticky filter options move into a slide-out drawer.
* **Mobile (< 576px):** Single-column grid layouts; navigation displays in collapsible accordion drawers.

---

## 13. High-Performance Page Rules

* **Critical Path Inline Styles:** Inline critical header and layout reset styles directly in page heads to prevent FOIT/FOUC rendering issues.
* **Script Optimization:** Load non-critical scripts asynchronously using the `defer` tag.
* **Image Lazy Loading:** Use intersection observers to lazy load product and lifestyle images below the fold, while loading above-the-fold hero images eagerly.
* **GPU Accelerated Transitions:** Animations should rely on performance-friendly CSS properties (`transform: translate3d()` and `opacity`) to prevent layout reflows and visual stutter.

---

## 14. Master Layout Flow Architecture

```
#root-wrapper
└── .skip-to-content                (Hidden link index overlay)
└── .announcement-bar               (Horizontal promotion carousel)
└── #global-header                  (Sticky navigation menu bar)
    └── .mega-menu-drawer           (Hover drop-down categories)
└── #main-content                   (Unique page path grid layout)
    └── .breadcrumbs                (SEO relative path indexes list)
    └── [Page-Specific Sections]     (Hero banners, dynamic builders)
    └── #global-newsletter          (Brand signup form section)
└── #global-footer                  (Warranty blocks, index directories)
└── #overlay-backdrop               (Translucent backdrop overlay)
└── #toast-container                (Interactive status alerts index)
└── #floating-assistant             (AI style advisor sticky button)
```

---

## 15. Developer Implementation Notes

* **Container Classes:** Always use standard container wrapper classes (`.container` or `.container--fluid`) to keep elements aligned to the grid.
* **CSS Variable Tokens:** Never use hardcoded pixel values for colors or margins. Reference Design Token variables (`var(--spacing-md)`) to ensure theme compatibility.
* **State Management Hooks:** Control drawer animations and overlay visibility using state classes (like `.is-active`, `.is-expanded`, or `.is-loading`).
* **Dynamic Content Loading:** Use dynamic imports to build reusable components, preventing page scripts from loading unnecessary payloads.
