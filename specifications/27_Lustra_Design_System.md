# 27 Lustra Design System & Reusable Component Library

This document outlines the design system philosophy, layout dimensions, atomic component definitions, responsive attributes, and accessibility configurations for the Lustra e-commerce platform.

---

## 1. Component Philosophy & Architectural Principles

To ensure consistency and ease of maintenance, Lustra's component library follows three core engineering principles:

* **Atomic Design Methodology:**
  1. *Atoms:* Base HTML elements (such as select icons, buttons, labels).
  2. *Molecules:* Simple element groups (like search input fields with search icons).
  3. *Organisms:* Complex UI modules (such as navigation menus or product card grids).
  4. *Templates:* Page structural wireframes (like general catalog grids).
  5. *Pages:* Active routes containing localized data (such as product details pages).
* **Decoupled Business Logic:** Reusable components are styled based on input attributes. They do not handle backend tasks (like database queries) directly, allowing developers to reuse them across different pages and contexts.
* **Component Lifecycles:** Dynamic components follow a strict initialization, interaction, and clean-up lifecycle, disposing of references and listeners when components are dismissed to prevent memory leaks.

---

## 2. Reusable Component Taxonomy

Components on the Lustra platform are grouped into ten functional categories:

```
                            GLOBAL COMPONENT GROUPS
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ Layout Components         │ Commerce Components       │ AI-Guided Widgets         │
│ (Sections, Grids)         │ (Wishlists, Product Info) │ (Virtual Try-On, Advisor) │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ Navigation Components     │ Form Fields               │ Marketing Banners         │
│ (Navbar, Footer, Mega)    │ (OTP Inputs, Selectors)   │ (Hero, Promos, Badges)    │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ Content Elements          │ Feedback Overlays         │ Utility Tools             │
│ (Dividers, Wrappers)      │ (Toasts, Skeletons)       │ (Back to Top, Clipboard)  │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 3. Layout Components

Layout components define the structural grid of the page, keeping elements aligned to the grid system:

* **Container (`.l-container`):** Centers page content. Caps content at `1400px` max-width, with 64px padding on desktop and 16px padding on mobile.
* **Section Grid (`.l-section`):** Adds vertical spacing between page sections (`96px` padding on desktop, `48px` padding on mobile).
* **Flex Group (`.l-flex`):** Flexbox container utility class to align elements horizontally or vertically.
* **Bento Masonry Layout (`.l-bento`):** A responsive grid system used for editorial galleries and community look walls, rendering images in varying sizes.

---

## 4. Navigation Components

* **Main Navigation Header (`navbar`):** A sticky horizontal bar containing brand logos, page links, search controls, and cart drawer buttons.
* **Drop-Down Mega Menu (`mega-menu`):** Opens full-width categories grids on hover, showing catalog links and featured products.
* **Directory Footer (`footer`):** Detailed page directory featuring newsletter signup fields, trust logos, and copyright lines.
* **Breadcrumb Navigation (`breadcrumbs`):** Navigation path indicators displaying current categories (e.g. `Home` / `Necklaces` / `Lariat`).

---

## 5. Button System Specifications

Buttons align to standard sizing and spacing tokens to ensure consistent click targets:

| Button Theme Class | Padding Scope (Desktop) | Padding Scope (Mobile) | Min Click Target | Key Visual States |
| :--- | :--- | :--- | :--- | :--- |
| **`.btn--primary`** | `16px 32px` | `12px 24px` | `48px x 48px` | Default (Solid Charcoal), Hover (Gold), Focus, Pressed, Disabled. |
| **`.btn--secondary`**| `16px 32px` | `12px 24px` | `48px x 48px` | Default (Gold), Hover (Dark Gold), Focus, Pressed, Disabled. |
| **`.btn--outline`** | `14px 30px` | `10px 22px` | `48px x 48px` | Default (Dark Border), Hover (Solid Charcoal), Focus, Pressed. |
| **`.btn--ghost`** | `12px 24px` | `8px 16px` | `48px x 48px` | Default (Transparent), Hover (Light Gray), Focus, Pressed. |
| **`.btn--text`** | `8px 0` | `8px 0` | `48px x 48px` | Default (Underline text link), Hover (Gold Text), Focus. |
| **`.btn--icon`** | `12px` circle | `10px` circle | `48px x 48px` | Default (Circular gray border), Hover (Filled), Focus. |

---

## 6. Card System Specifications

Cards use standard spacing and border variables to display listing details uniformly:

* **Product Display Card (`product-card`):**
  * Aspect Ratio: `3:4` vertical image resolution.
  * Details layout: Displays brand name, item title, price, active reviews star counts, and quick-add actions.
  * Transitions: Hovering over the card translates it upward by `-4px`, displaying secondary product photos and quick-ad shortcuts.
* **Occasion Collection Card (`collection-card`):**
  * Spacing & Visuals: Full-bleed image card showing seasonal collection tags (e.g. "Bridal Collection"). Hovering over the card scales the image up by `1.05x`.
* **Verified Customer Review Card (`review-card`):**
  * Details layout: Lists reviewer name, star count rating, review date, purchase details tag, and review text.

---

## 7. Commerce Components

* **Product Specs Box (`product-info`):** Lists product details (such as metal types, carat weights, and GIA certification status) in a structured table.
* **Shopping Cart Row (`cart-item`):** Lists items added to the cart, displaying thumbnail images, metal choices, SKU details, pricing, and quantity calculators.
* **Mini Cart Drawer (`cart-drawer`):** Slide-out drawer showing cart items and subtotal prices, allowing users to review their cart without leaving the page.
* **VIP Delivery Timeline (`delivery-timeline`):** An interactive index showing order shipping status (e.g. "Order processed", "In Transit", "Delivery secured").

---

## 8. Form Components

* **Text Input Inputs (`form-input`):** Base text inputs with a minimum font size of `16px` to prevent automatic screen zoom on iOS. Outlines transition to gold on focus, and turn red if validation fails.
* **OTP Input block (`otp-inputs`):** Four individual inputs that automatically shift focus to the next field as characters are typed.
* **Price Range Slider (`range-slider`):** Dual-handle slider to filter products by price, updating pricing fields in real time.

---

## 9. Visual Feedback Overlays

* **Toast Notification Popup (`toast`):** Dismissible banner at the top-center of the viewport, announcing actions like "Saved to your Jewellery Box".
* **Skeleton Loaders (`skeleton`):** Shimmering shapes that match components' layout grids to prevent unexpected shifts as content loads.
* **Standard Spinner Indicator (`spinner`):** Looping animation centered within interactive buttons to indicate processing states.

---

## 10. Overlay Components System

All overlays use standard shadow elevations and stack according to defined priority rules to prevent visual clashes:

```
[z-index: 3000] Toast Notification Popup
       &darr;
[z-index: 2000] Dialog Modals (AR webcam, Custom Settings panel)
       &darr;
[z-index: 1000] Primary Navigation Menu Header
       &darr;
[z-index:  980] Cart Drawers / Side Panels
       &darr;
[z-index:  950] Dark Backdrop Overlay Mask
```

---

## 11. AI-Guided Widgets

* **AI Outfit Matcher Upload Canvas (`outfit-uploader`):** An image upload area that processes outfit photos, analyzing clothing colors and occasions to suggest matching jewelry.
* **Conversational Chatbot Widget (`ai-chat`):** A slide-out chat window where users can consult Lustra's virtual personal stylist.
* **AR Try-On Camera Canvas (`webcam-sandbox`):** Full-screen camera feed that overlays jewelry products onto users' features, using face-tracking libraries.

---

## 12. Marketing Banners & Sections

* **Hero Showcase Banner (`hero-banner`):** Features editorial typography overlaying full-bleed lifestyle images, with clear CTAs guiding users to the catalog.
* **Newsletter Box (`newsletter-cta`):** Email entry form offering invitations to VIP collection launches.

---

## 13. Component States & Styling Rules

To ensure a seamless user experience, components implement ten standard operational states:

1. **Default:** Baseline visual styling.
2. **Hover:** Triggers visual transitions when users hover the cursor over interactive elements.
3. **Focus:** Highlights elements when navigated via keyboard. Uses high-contrast focus outlines.
4. **Pressed/Active:** Provides visual feedback on click (e.g. buttons scale down slightly).
5. **Loading:** Displays spinning loaders or shimmers while processing actions, disabling further inputs.
6. **Disabled:** Reduces element brightness and opacity to `45%`, disabling pointer events.
7. **Empty:** Displays fallback messages and redirect links if grids return no values.
8. **Error:** Displays validations feedback and helper text in ruby red.
9. **Success:** Confirms successfully completed actions with green indicators.
10. **Responsive:** Reorganizes grid columns and elements dynamically to fit mobile and tablet screens.

---

## 14. Responsive Layout Rules

* **Desktop Viewports (&ge; 1200px):** Spans the full width of the grid, sorting product lists in 4-column rows.
* **Tablet Viewports (576px - 991px):** Layout grids adjust to 2 columns, and sticky filter controls collapse into a slide-out drawer.
* **Mobile Viewports (< 576px):** Layout grids wrap to single-column lists; navigation links accordion-collapse into mobile slide-out drawers.
* **Touch Device Usability:** Hover animations are disabled on mobile and touch devices; interactive click targets are kept to a minimum height of **48px** to ensure usability.

---

## 15. WCAG AA Accessibility Integrations

* **Skip Navigation Links:** Include a skip-to-content helper as the first focusable element on each page, allowing keyboard users to bypass header menus.
* **Modal Focus Traps:** Keeps keyboard focus locked within open modals, preventing focus from escaping to background elements.
* **Aria Descriptions:** Set explicit labels on icon-only buttons (e.g., `<button aria-label="Add item to wishlist">`).
* **Section Landmarks:** Group structural HTML content within standard landmark tags (`header`, `nav`, `main`, `footer`).

---

## 16. Component Relationships & Nesting

To maintain clean code structures, components nest according to strict relationships:

* `Header` &rarr; Contains `Mega Menu` &rarr; Contains `Search Bar` icon.
* `Product Grid` &rarr; Contains `Product Card` &rarr; Contains `Wishlist Toggle` &rarr; Contains `Sale Badge`.
* `Cart Drawer` &rarr; Contains `Cart Item Rows` &rarr; Contains `Quantity Calculator` &rarr; Contains `Item Price`.
* `Checkout Form` &rarr; Contains `OTP verify Step` &rarr; Contains `Payment Selector`.

---

## 17. Developer Handoff Guidelines

* **When to Extend a Component:** If a component requires minor styling variations (such as secondary buttons needing custom colors), use BEM modifiers (e.g., `.btn--warning`).
* **When to Create a New Component:** Create a new component if the element introduces unique functions or needs to parse different data fields (like custom builders requiring interactive WebGL features).
* **Class Names Standard:** All custom class names must use the lowercase BEM naming system (`block__element--modifier`).
