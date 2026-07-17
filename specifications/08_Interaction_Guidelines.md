# 08 Interaction Guidelines: Lustra Platform

This document establishes the user interaction framework for the Lustra platform.

---

## 1. Dynamic States System

### 1.1 Hover Interactions (Desktop)
* **Rule:** Hover actions should feel soft, sophisticated, and gradual. Avoid sudden changes in shape or color.
* **Implementation:** Hovering over Primary Gold CTA buttons triggers a color transition (`#C9A96E` to `#B0925A`) and a subtle gold glow box shadow (`--shadow-gold-glow`). Hovering over image-based Product Cards triggers a scale zoom (`scale: 1.03`) and slides up a subtle product information panel.

### 1.2 Interactive Focus Rings
* **Rule:** Maintain accessible focus targets without cluttering the screen.
* **Implementation:** Key interactive elements (links, buttons, inputs) display a clean dual ring when focused via keyboard navigation: a 2px inner white ring followed by a 2px gold outer ring, created using the styling rule `box-shadow: 0 0 0 2px var(--color-pure-white), 0 0 0 4px var(--color-primary-gold)`.

### 1.3 Active Touch Responses
* **Rule:** Provide immediate visual feedback when elements are tapped or clicked.
* **Implementation:** Tapping buttons or interactive chips applies a quick scale transformation: `transform: scale(0.97)`. Tapping wishlist heart icons displays a scaling animation: `scale(0.8)` &rarr; `scale(1.2)` &rarr; `scale(1.0)`, while toggling the icon fill state.

### 1.4 Disabled States
* **Rule:** Visually distinguish unavailable actions and block user interaction.
* **Implementation:** Apply `opacity: 0.4`, set the cursor to `not-allowed`, and disable pointer events (`pointer-events: none`) on the target element.

---

## 2. Skeleton Loaders & Transitions

* **Rule:** Prevent layout shifts (CLS) by matching skeleton sizes to the loaded elements. Skeletons should use a smooth shimmering animation.
* **Implementation:** Shimmer animations slide a gradient overlay from left to right at a looping interval.
  ```css
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-block {
    background: linear-gradient(90deg, #F6F6F6 25%, #E9E7E2 50%, #F6F6F6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }
  ```

---

## 3. Page Transitions

* **Rule:** Keep page transitions smooth and lightweight to maintain user engagement.
* **Implementation:** Clicking internal page links triggers a full-bleed grid curtain reveal:
  1. A multi-column overlay grid (`.page-curtain`) slides down from the top of the viewport to cover the screen.
  2. The page navigates to the target URL.
  3. On page load, the curtain split-animates vertically and slides out of view.
  4. Content frames fade in and slide up slightly (`y: 30` to `y: 0`, opacity: `1`).

---

## 4. Scroll Behaviour

* **Rule:** Ensure page scrolling is smooth and responsive to user input.
* **Implementation:**
  * Define `scroll-behavior: smooth` in global CSS.
  * Apply `scroll-padding-top: 80px` to account for the sticky header height when anchor linking.
  * Integrate GSAP's `ScrollTrigger` to activate parallax image reveals only when elements enter the viewport.

---

## 5. Component Micro-Interactions

### 5.1 Interactive Hover Cards
Product cards display secondary lifestyle images on hover with a smooth cross-fade transition:
* Layer 1 (Lifestyle model shot): Opacity changes from `0` to `1` on hover.
* Layer 2 (Studio flat shot): Opacity changes from `1` to `0` on hover.

### 5.2 Form Fields
Labels transition automatically when form fields are focused or contain text:
* Default state: Label acts as a placeholder inside the input field.
* Focus state: Label slides up to the top border, shrinks in size, and shifts color from `Neutral 500` to `#C9A96E`.
* Error state: The border color changes to `Ruby Alert` (`#D64545`), accompanied by a gentle shaking animation.

### 5.3 Modals & Overlays
Modals scale and fade into view using a smooth spring transition:
* Reveal: Opacity changes from `0` to `1`, scale shifts from `0.93` to `1.0`, using the transition timing `cubic-bezier(0.34, 1.56, 0.64, 1)`.
* Backdrop: Dim element background to `rgba(18, 18, 18, 0.6)`.

### 5.4 Navigation Overlays
* Desktop Mega Menu: Smoothly slide downward from the header bar, transitioning opacity from `0` to `1` over `200ms` with a backdrop blur filter.
* Mobile Navigation Drawer: Slide in from the left side of the screen, taking up `85%` of the viewport width.
* Shopping Cart Drawer: Slide in from the right edge with a dark cover overlay.
