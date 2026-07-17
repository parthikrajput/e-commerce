# 21 UI Consistency Checklist: Lustra

Use this consistency checklist during visual reviews and QA testing cycles to ensure all pages match Lustra’s design standards.

---

## 1. Spacing & Grid System Alignment

- [ ] **Grid Alignment:** Verify that all content blocks align to the responsive 12-column grid container (mobile 4-column, tablet 8-column, desktop 12-column).
- [ ] **Adherence to 8px System:** Check that margins, paddings, and element offsets use standard layout tokens (multiples of 8px: 8, 16, 24, 32, 40, etc.).
- [ ] **Consistent Gaps:** Ensure gutter spacing between product cards in catalog search results is uniform (24px gutter default).
- [ ] **Vertical Layout Harmony:** Verify that vertical margins between content sections are consistent across pages (desktop 80px, mobile 40px section padding).

---

## 2. Typography Consistency

- [ ] **Font Family Check:** Confirm that typography styles use only the approved brand fonts: Playfair Display for editorial headings and Inter for body copy.
- [ ] **Scale Compliance:** Verify that text sizes match the design token scale (H1: 44px, H2: 36px, Body L: 16px, Caption: 12px).
- [ ] **Line Heights:** Check that vertical spacing is configured using relative values to prevent overlapping text (headings `1.2–1.3`, body text `1.5–1.6`).
- [ ] **High Contrast:** Ensure all copy meets standard contrast requirements, especially color highlights on dark charcoal backdrops.

---

## 3. Buttons & Interactive Visual States

- [ ] **Visual Hierarchy:** Confirm that each page has a single clear primary CTA (Gold background), with secondary options styled as dark outlines or text links.
- [ ] **Interactive States:** Test visual feedback across all buttons: hover states transition colors smooth, focus states display dual outline glows, and active states scale down slightly.
- [ ] **Corner Radii:** Check that all buttons use the design system's standard rounded corners token (`--radius-lg` / `16px`).
- [ ] **Dynamic Loaders:** Confirm that primary buttons display a looping loading spinner when processing actions, disabling secondary clicks.

---

## 4. Product Cards Visual Assets

- [ ] **Consistent Elevation:** Verify that product cards use the standard card shadow token (`--shadow-card`).
- [ ] **Corner Radii:** Check that all product cards use the design system's standard corner radius token (`--radius-xl` / `24px`).
- [ ] **Text Alignment:** Ensure product titles, star ratings, and prices align consistently across all cards in the grid.
- [ ] **Hover Transitions:** Confirm that hovering over cards swaps the visible product photo with the secondary variant, using a smooth cross-fade animation.

---

## 5. Forms, Inputs & Sizing Selectors

- [ ] **Input Styles:** Check that text inputs use standard sizing tokens (`--radius-md` / `12px` or `14px`) and display subtle gray borders.
- [ ] **Visual Validation Hooks:** Verify that validation states show clear visual feedback: borders transition to gold on focus, and turn ruby red with helper text on error.
- [ ] **No Page Zooming:** Ensure all input fields have a minimum font size of `16px` to prevent automatic screen zoom triggers on iOS browsers.
- [ ] **Clean Option Selectors:** Confirm dropdown menus use the custom scroll overlays design instead of browsers' default dropdown selector blocks.

---

## 6. Grid Alignment & Outer Container Margins

- [ ] **Centered Containers:** Max-width containers must cap at `1400px` and center horizontally on wider screens to prevent layouts from stretching.
- [ ] **Unified Page Gutter Margins:** Verify that parent layout padding elements match screen margin targets (desktop 64px padding, mobile 16px padding).

---

## 7. Motion & Animation Configurations

- [ ] **Unified Motion Curves:** Confirm all GSAP animations and page transitions use standard easing curves (`"power3.out"` for smooth movements).
- [ ] **Predefined Animation Speed:** Ensure transitions complete within target durations (fast animations: 150ms, card reveals: 300ms, page load transitions: 500ms).
- [ ] **Transform-First Animations:** Verify that animations target performance-friendly CSS rules (transforms, scale, translate, opacities) and do not trigger page reflows.

---

## 8. WCAG Accessibility Checks

- [ ] **High Contrast Ratios:** Text headers must maintain a minimum contrast ratio of `3:1` against their backgrounds, and body text must measure at least `4.5:1` contrast.
- [ ] **Screen Reader Descriptions:** Make sure decorative vector SVGs use the `aria-hidden="true"` attribute, while interactive buttons include explicit labels.
- [ ] **No Keyboard Traps:** Test keyboard accessibility, checking that users can tab into, interact with, and close all overlay panels.

---

## 9. Responsive Consistency

- [ ] **Mobile Drawer Layouts:** Verify that all navigation menu items collapse into an accordion drawer on mobile viewports.
- [ ] **Touch Target Zones:** Ensure interactive buttons and link targets meet the minimum `48px x 48px` size guideline to prevent accidental clicks.
