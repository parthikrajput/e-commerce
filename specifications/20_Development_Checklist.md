# 20 Development Checklist: Lustra Platform

This checklist must be reviewed by the development team before starting, during implementation, and prior to committing changes for any page on the Lustra platform.

---

## Phase 1: Pre-Development Configuration

- [ ] **Design Review:** Verify the page mockup details (mobile & desktop) against the standard layout rules in the Lustra Design System.
- [ ] **Asset Verification:** Verify that all image assets are compressed in `.webp` format and stored in the `/assets/images/` directory.
- [ ] **Web Vectors check:** Verify that all SVG icon files are optimized using SVGO tools and stored in the `/assets/icons/` folder.
- [ ] **Routing Validation:** Confirm that the page URL routes match the sitemap (defined in the `02_Information_Architecture.md` specification).
- [ ] **Design Token Check:** Ensure matching CSS custom theme variables are defined in target SCSS files before writing style overrides.

---

## Phase 2: Implementation & Structure

### 2.1 Markup & HTML
- [ ] **Semantic Structure:** Verify that the page uses semantic HTML5 header landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- [ ] **Single Headline Target:** Ensure there is exactly one `<h1>` tag on the page to maintain clean SEO heading structures.
- [ ] **Alt Attributes Check:** Double check that every image tag has an alt text description, or is marked with a null attribute (`alt=""`) if decorative.
- [ ] **Aria Elements Configuration:** Verify that interactive elements have descriptive aria labels (e.g. `aria-label="Filter products"`).
- [ ] **Skip navigation link:** Include skip-to-content links as the first focusable element on each page.

### 2.2 Styling & SCSS
- [ ] **BEM Class Conventions:** Confirm all CSS class styling matches BEM conventions (e.g. `.product-card__title--featured`).
- [ ] **No Inline Styles:** Ensure that no inline style attributes are written in the HTML elements.
- [ ] **Nesting Limits:** Verify that SCSS selectors do not exceed **3 levels of nesting**.
- [ ] **Responsive Breakpoints:** Implement responsive layouts using the `@respond-to` styling mixins.
- [ ] **Focus Styles Configuration:** Ensure default focus styles are styled with high-contrast outlines using `box-shadow`.
- [ ] **Spacing Scale:** Confirm all paddings and margins use design system tokens based on the 8px grid scale.

### 2.3 JavaScript logic
- [ ] **Self-Contained Modules:** Check that all custom script configurations are written as modular, self-contained ES6 classes.
- [ ] **DOM Cache:** Cache DOM element references locally inside constructors to prevent repeated queries.
- [ ] **Event Unbinding:** Clean up event listeners and references inside `destroy()` methods to prevent memory leaks.
- [ ] **Form Validation Rules:** Configure form inputs with validation checkers, input limits, and helpful error labels.
- [ ] **Lazy Loading:** Add observers to images below the fold to lazy load them as they scroll into view.
- [ ] **Touch Target Zones:** Ensure interactive buttons and input targets meet the minimum `48px x 48px` size guideline.

---

## Phase 3: Interactive States & Edge Cases

- [ ] **Empty States Implementation:** Confirm empty states display correctly when data flows return empty (e.g. Empty Wishlist, No Search Results).
- [ ] **Interaction States Review:** Test hover, focus, active, static, and disabled states across all button components.
- [ ] **Dynamic Loading Indicators:** Implement loading skeletons to prevent layout shifts as images load.
- [ ] **Error Fallback Screen:** Verify that network error screens display correctly if API connections time out.
- [ ] **Notch & Safe Areas:** Test display layouts on notch screens, checking safe areas around critical navigation items.
- [ ] **Reduced Motion Check:** Test pages with reduced motion settings enabled, ensuring transitions fall back to simple opacity fades.
