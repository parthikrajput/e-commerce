# 22 Quality Assurance (QA) Checklist: Lustra E-commerce

This checklist defines the testing passes, usability benchmarks, and validation steps required before launching any page or feature on the Lustra platform.

---

## 1. Desktop Layout QA

- [ ] **Interactive Hover States:** Verify all buttons, links, search input controls, and product cards display smooth hover transitions on primary displays.
- [ ] **Viewport Resize Check:** Resize browser windows from 992px up to 1920px width, checking for broken layout containers or overlapping text lines.
- [ ] **Mega Menu Hovers:** Verify mega menu panels open on hover, and close when the cursor leaves the header menu bounds.
- [ ] **Parallax Visual Assets:** Test parallax animations on scroll, ensuring image sections scroll smoothly without visual stutter.

---

## 2. Table Landscape & Portrait QA

- [ ] **Orientation Mode Changes:** Tilt devices between portrait and landscape orientations, checking for layout shifts or clipped image containers.
- [ ] **Touch Swipe Carousels:** Verify that product sliders, new arrivals cards, and review lists respond to touch swipe swiping controls.
- [ ] **Touch Targets:** Verify navigation items and filtering chips are easy to tap and do not trigger accidental clicks on adjacent links.
- [ ] **Popup Overlays:** Check that modals and dialog overlays fit tablet screens, centering buttons to be easily reachable.

---

## 3. Mobile Viewport & Notches QA

- [ ] **Thumb Reach Comfort:** Place critical purchase actions (like checkout buttons and cart links) in easily accessible areas near the bottom of mobile screens.
- [ ] **Mobile Drawer Navigation:** Verify slide-out drawers open and close smoothly, scroll vertically on long lists, and trap tab focus within menu containers.
- [ ] **Notch & Safe Areas:** Test display layouts on notch screens, checking safe areas around critical navigation items and checkout bars.
- [ ] **Mobile Keyboard Layouts:** Confirm text inputs display the appropriate keyboard layouts: email fields open email-configured keyboards, and phone inputs open numeric keys.

---

## 4. Cross-Browser Engines QA

- [ ] **Webkit (Apple Safari Mobile & macOS):** Test Webkit rendering compatibility, checking SVG stroke scaling, WebGL camera feeds, and custom fonts.
- [ ] **Chromium (Google Chrome, Microsoft Edge, Opera):** Test Chromium compatibility, checking web animations, image decodes, and CSS clamp typography scaling.
- [ ] **Gecko (Mozilla Firefox):** Test Gecko layout standards, verifying CSS backdrop filter blur effects support on header navbar menus.
- [ ] **Unified WebGL Support:** Confirm that 3D customization widgets load, rotate, and interact properly across all browser types, with simple images as fallback options support.

---

## 5. Accessibility Testing (WCAG 2.2 AA)

- [ ] **Keyboard Only Navigation:** Navigate pages using only the keyboard `Tab` and `Shift + Tab` commands, checking that focus styles remain visible.
- [ ] **Logical Focus Order:** Ensure tab navigation follow a logical reading flow, and do not get stuck inside search overlays or inputs.
- [ ] **Dynamic Feed Announcements:** Test dynamic page elements (like updating quantity selectors inside the cart drawer) using a screen reader to verify announcements.
- [ ] **Zoom Scaling Tests:** Scale layouts up to 200% using browser zoom tools, checking for broken containers or overlapping text.

---

## 6. Performance Benchmarks

- [ ] **Lighthouse Performance Test:** Ensure performance tests score **&ge; 98** across mobile and desktop.
- [ ] **LCP Loading Limit:** Optimize LCP metrics to load page content in **< 2.5 seconds**.
- [ ] **CLS Shift Limit:** Prevent cumulative layout shifts, keeping CLS scores **< 0.1** on load.
- [ ] **Minimized Network Overhead:** Optimize bundle sizes: main JS files should measure `< 50KB` (compressed), and product images should compress `< 100KB`.

---

## 7. Search Engine Optimization (SEO) QA

- [ ] **Meta Tag Verification:** Verify page titles contain relevant keywords below the **60 character limit**, and descriptions outline pages below **155 characters**.
- [ ] **Structured Schema Validation:** Run structured data reviews using Google’s Rich Results Test tool to verify JSON-LD schemas.
- [ ] **Canonical URL Verification:** Check that all pages include a canonical link pointing to their official URLs to prevent duplicate indexing issues.
- [ ] **Sitemap and robots file check:** Verify sitemaps include page routes, and robots files permit crawl indexing.
