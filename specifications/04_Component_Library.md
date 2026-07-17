# 04 Component Library Specification: Lustra

This library defines the reusable UI components for the Lustra e-commerce platform.

---

## 1. Top Navbar Header (`.header`)
* **Purpose:** Core site navigation and utility action dashboard.
* **Variants:**
  * `transparent-glass` (Home page overlay).
  * `solid-white` (Shop listing and details layout standard).
* **States:** Standard, Sticky-scrolled (compact layout height, frosted glass backdrop), Menu-opened overlay.
* **Spacing:** Pad blocks: Dynamic 24px grid paddings. Inside heights: 80px (sticky: 64px).
* **Responsive Rules:** 
  * Mobile: Main navigation items collapse into a hamburgers drawer menu.
  * Desktop: Displays the full Mega Menu on hover.
* **Accessibility:** `role="banner"`, keyboard tab index navigation loop, screen-reader descriptions for icon-only action links.
* **Interactions:** Hovering category triggers mega-menu dropdowns with a 200ms GSAP ease-in opacity block.

---

## 2. Directory Footer (`.footer`)
* **Purpose:** Structured path resources, trust badges, and email newsletter sign up workspace.
* **Variants:** Standard Full Site directory, Billing checkout compact.
* **States:** Default.
* **Spacing:** Margins top 80px; internal padding blocks 64px (top) / 32px (bottom).
* **Responsive Rules:** Mobile collapses grid layout columns into clean expandable accordion links; desktop utilizes 5 columns.
* **Accessibility:** `role="contentinfo"`, active focus visible rings around anchor hyperlinks.
* **Interactions:** Subtle highlight transitions on hover for link items.

---

## 3. Button System (`.button`)
* **Purpose:** Triggers actions and page navigation flows.
* **Variants:**
  * Primary Gold (`.btn--gold`): Gold background with white text.
  * Secondary Dark (`.btn--dark`): Deep charcoal overlay with clean borders.
  * Glass Button (`.btn--glass`): Transparent backing with frosted border design.
  * AI Stylist Button (`.btn--ai`): Rose Gold & Gold gradient styling.
* **States:** Idle, Active, Focus, Disabled (gray overlay, pointer-events none), Loading (displays a looping spinner icon).
* **Spacing:** 
  * Desktop: 16px (top-bottom) / 32px (left-right).
  * Mobile: 14px (top-bottom) / 28px (left-right).
* **Responsive Rules:** Large touch target spacing on mobile screen size blocks. Full width display models for mobile dialog forms.
* **Accessibility:** `role="button"`, `aria-busy` indicator flags, minimum touch targets 48px.
* **Interactions:** GSAP hover scale (1.02) and subtle box shadow aura transition glows.

---

## 4. Product Display Card (`.product-card`)
* **Purpose:** Compact product display card detailing thumbnails, labels, price variations, and wishlist buttons.
* **Variants:** Default catalog display, grid result blocks, saved card rows.
* **States:** Default, Hover/Focus, Wishlisted, Sold-Out.
* **Spacing:** Inside card: 12px; bottom margins: 24px.
* **Responsive Rules:** Mobile adapts 2-cards per horizontal viewport row; Desktop spans standard 3 or 4 grid columns.
* **Accessibility:** Semantic product anchors, aria labeling on wishlist states: `aria-label="Save Golden Aura Pendant to Wishlist"`.
* **Interactions:** Hover displays secondary variant images, reveals quick-add options, and animates the wishlist icon button.

---

## 5. Review Card (`.review-card`)
* **Purpose:** Displays customer reviews, star ratings, and uploaded styling photos.
* **Variants:** Standard card block, minimal dashboard highlight slide.
* **States:** Idle.
* **Spacing:** Internal padding: 24px. Corner rounds: 16px.
* **Responsive Rules:** Mobile slides horizontal scroll list rows; Desktop renders dynamic grid layout blocks.
* **Accessibility:** Visual star ratings include aria text: `aria-label="5 out of 5 stars review"`.
* **Interactions:** Thumbnail uploads launch image lightboxes on tap/click.

---

## 6. Curated Collection Card (`.collection-card`)
* **Purpose:** Highlights seasonal collections or special jewelry trends.
* **Variants:** Horizontal full banner, grid bento card block.
* **States:** Default, Hover (subtle image scale-up zoom).
* **Spacing:** Margin borders: 20px; Interior padding details: 32px.
* **Responsive Rules:** Mobile collapses to a single square aspect ratio; Desktop uses varying height layout designs.
* **Accessibility:** Anchor wrapper links for keyboard focus.
* **Interactions:** Smooth GSAP ease transition on image scales (`scale: 1.05` on hover).

---

## 7. Interactive Form Inputs (`.field-input`)
* **Purpose:** Captures text, password, name, and search queries.
* **Variants:** Standard, Floating Label box, Search, OTP Code entry sets.
* **States:** Active, Filled, Focus, Invalid Error (highlights red borders with descriptive text).
* **Spacing:** Base height: 50px; Inline text padding: 14px.
* **Responsive Rules:** Prevents browser zoom on iOS by keeping base font sizes at 16px.
* **Accessibility:** Always connects label elements to inputs via `for="..."` and `id="..."` attributes; includes `aria-invalid` values for validation blocks.
* **Interactions:** Input focus transitions border color from platinum gray to gold.

---

## 8. Dropdown Panels (`.dropdown`)
* **Purpose:** Sizing selectors, metal selections, sorting controls.
* **Variants:** Custom list overrides, Native system select wrapper selectors.
* **States:** Open dropdown list panel, Closed status, Selected values.
* **Spacing:** Sizing padding: 12px; lists vertical separation margins: 8px.
* **Responsive Rules:** Mobile displays options in a native bottom sheet menu; Desktop renders absolute list overlays.
* **Accessibility:** `aria-haspopup="listbox"`, dynamically toggles `aria-expanded="true/false"` state labels.
* **Interactions:** Custom panel reveals utilize vertical slide expansions (GSAP slide-down).

---

## 9. Tab Bars (`.tabs`)
* **Purpose:** Alternates display views (such as Product Specs, Material details, Delivery info).
* **Variants:** Underlined text tabs, Segmented pill tabs.
* **States:** Inactive, Active, Focus.
* **Spacing:** Horizontal padding margins: 16px; heights: 44px.
* **Responsive Rules:** Touch swipe navigation layout rows with scrollbar hide tags on mobile.
* **Accessibility:** `role="tablist"`, active focus elements labelled with `aria-selected="true"`.
* **Interactions:** Active underline glides along slider targets.

---

## 10. Info Accordions (`.accordion`)
* **Purpose:** Collapsible details blocks (such as FAQ queries, sizing charts, warranty details).
* **Variants:** Boxed outline accordions, Borderless line layouts.
* **States:** Expanded panel, Collapsed index indicator.
* **Spacing:** Row grid padding: 18px.
* **Responsive Rules:** Native component structures.
* **Accessibility:** Header keys marked `aria-controls="panel-id"`, expands via dynamic button click paths.
* **Interactions:** GSAP animations handle smooth content accordion expansion heights.

---

## 11. Wishlist Items Card (`.wishlist-card`)
* **Purpose:** Displays item previews inside saved account portals.
* **Variants:** Standard Card, Compact grid overlay.
* **States:** Active saved, Price dropped styling alerts.
* **Spacing:** In-block margins: 16px.
* **Responsive Rules:** 2 rows on mobile views.
* **Accessibility:** Delete option element labeled: `aria-label="Remove item description"`.
* **Interactions:** Smooth card fade removals on delete clicks.

---

## 12. Cart Product Rows (`.cart-item`)
* **Purpose:** Manages quantity updates and details previews inside carts and drawers.
* **Variants:** Wide slide detail, checkout list rows.
* **States:** Default.
* **Spacing:** Margin separation gaps: 16px.
* **Responsive Rules:** Stacked layout elements on mobile.
* **Accessibility:** Quantity changes verify input variables.
* **Interactions:** Live update animations for price details.

---

## 13. System Stepper / Pagination (`.pagination`)
* **Purpose:** Navigates multi-page list indexes.
* **Variants:** Number rows, "Load More" action links.
* **States:** Idle state, Current page item (deactivated links).
* **Spacing:** Target links size: 48px square boxes.
* **Responsive Rules:** Mobile only displays First, Next/Prev indicator pages.
* **Accessibility:** `aria-label="Pagination Navigation"`, visual indicator flags for current selection states.
* **Interactions:** Hover highlights, smooth active index shifts.

---

## 14. Dialog Modals (`.modal`)
* **Purpose:** Displays focus modals (Try-On, Size charts, Image views).
* **Variants:** Center lightbox modal, Drawer side overlay layouts.
* **States:** Open state, Offscreen idle blocks.
* **Spacing:** Margin box interior: 32px.
* **Responsive Rules:** Mobile adapts full viewport height layouts.
* **Accessibility:** Focus trap inside modal scope; `aria-modal="true"`, dismisses on Escape key commands.
* **Interactions:** GSAP transitions scale modal layouts up from 0.95 opacity.

---

## 15. Toast Alerts (`.toast`)
* **Purpose:** Inline alerts (such as Item added to cart, copy success hooks).
* **Variants:** Success notification green, Error warning red labels.
* **States:** Active entrance transitions, Exit timeout blocks.
* **Spacing:** Padding sizes: 16px; side heights: 12px.
* **Responsive Rules:** Anchored center bottom positions on mobile viewports; top-right positions on desktop.
* **Accessibility:** `role="status"` / `aria-live="polite"`.
* **Interactions:** Enters view via bottom vertical translations; dismisses automatically after 3000ms timespans.

---

## 16. AI Chat Console Window (`.ai-chat-widget`)
* **Purpose:** Hosts AI styling conversations.
* **Variants:** Full page console panels, Floating bubble widgets.
* **States:** Minimized bubble overlay, Expanded console chat views.
* **Spacing:** Chat list height: 400px. Bubble targets: 56px size circles.
* **Responsive Rules:** Mobile launches full-screen overlays; Desktop shows absolute bottom right float panels.
* **Accessibility:** Accessible elements for typing inputs; live screen reader transcription feeds.
* **Interactions:** Enters with a quick scale bounce animation; typing indicators pulse while processing queries.
