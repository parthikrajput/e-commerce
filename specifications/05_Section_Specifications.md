# 05 Section Specifications: Lustra Platform

This document details the layout layouts, grid alignments, spacing models, animations, and structures for the major sections of the Lustra website.

---

## 1. Hero Showcase Section (`.hero-showcase`)
* **Purpose:** First touch premium brand storyteller.
* **Content:** Desktop/Mobile media cards, headings, product collection tags, action buttons.
* **Layout:** Full page height layout.
* **Grid:** 12-column layout grid.
* **Columns:** Heading and actions span Columns 2 to 7 on desktop; spans full Column bounds on mobile.
* **Spacing:** Margins: Top 0; Paddings: Bottom 80px.
* **Animation:** GSAP overlay fades, fine parallax shifts on scroll triggers (`ScrollTrigger`).
* **Responsive Behaviour:** Mobile changes height to 80% viewport height and displays vertically cropped layouts.
* **Components Used:** Primary Buttons, Swiper Carousel indicator dots.
* **CTA:** "Explore Jewellery" &rarr; `/shop/index.html`.
* **Accessibility:** Native heading landmarks (`<h1>`), color overlays for contrast behind text overlays.

---

## 2. AI Assistant entry section (`.ai-assistant-intro`)
* **Purpose:** Converts traditional explorers to personalized shopping paths.
* **Content:** Description text blocks, custom styling illustrations, quick AI conversation prompt buttons.
* **Layout:** Centered block layout with a glowing background.
* **Grid:** 12 columns.
* **Columns:** Inward 8 columns, offset 2.
* **Spacing:** Padding top-bottom: 96px; internal margins: 24px.
* **Animation:** Pulse ambient blur background glows; cards fade in on scroll.
* **Responsive Behaviour:** Mobile collapses to a single-column layout with 24px padding.
* **Components Used:** AI Styling Button, Text fields, OTP blocks.
* **CTA:** "Start My Personal Styling Chat" &rarr; `/ai/advisor.html`.
* **Accessibility:** Standard visual contrasts, keyboard focus routing for prompt chips.

---

## 3. Shop by Category row (`.shop-category-row`)
* **Purpose:** Visual catalog navigation pathway.
* **Content:** Horizontal row with 5 category block items (Rings, Necklaces, etc.).
* **Layout:** Touch-swipe carousel slider container.
* **Grid:** Flex layouts with item wraps.
* **Columns:** 5 relative columns on desktop layout lines.
* **Spacing:** Section Margins: 80px (top-bottom). Internal item gaps: 16px.
* **Animation:** Hovering shifts individual category product scale ratios.
* **Responsive Behaviour:** Mobile uses a layout with `overflow-x: scroll` (hides native scrollbars) to enable smooth finger-sliding transitions.
* **Components Used:** Category Card modules.
* **CTA:** "Explore Category Link" attached to category blocks.
* **Accessibility:** Enclosed in high-level landmarks (`role="navigation"`, label reads: "Shop by category").

---

## 4. Curated Collections grid (`.featured-collections-grid`)
* **Purpose:** Highlights seasonal collections or special design trends.
* **Content:** 3 Editorial collection showcase cards.
* **Layout:** Asymmetric Bento Grid block layout.
* **Grid:** 12-column grid.
* **Columns:** Card 01 spans 7 columns; Card 02 spans 5 columns; Card 03 (placed underneath) spans full 12 columns.
* **Spacing:** Gutter gaps: 24px width; Margin: 96px bottom structure.
* **Animation:** Scroll reveals glide cards upwards (GSAP y: 50 to 0, duration: 0.8s).
* **Responsive Behaviour:** Mobile stacks cards vertically in a single column with 16px gutter gaps.
* **Components Used:** Collection Card.
* **CTA:** "Discover Occasions" links.
* **Accessibility:** Logical tab order focus sequences, image descriptions.

---

## 5. Shoppable Bento Inspiration board (`.inspiration-bento-wall`)
* **Purpose:** Showcases community styles to drive styling views.
* **Content:** Bento masonry grids containing client photographs with interactive product tags.
* **Layout:** Masonry grids.
* **Grid:** 12 columns.
* **Columns:** High-definition portrait spans 6 columns; side squares span 3 columns each.
* **Spacing:** Margins: Bottom 80px. Gutters: 16px.
* **Animation:** Interactive hotspots pulse to attract user clicks.
* **Responsive Behaviour:** Collapses into a 2x2 grid view with a carousel preview for additional images.
* **Components Used:** Shoppable hotspots, profile link targets.
* **CTA:** "Shop the Look Links".
* **Accessibility:** Keyboard controls let users open hotspot buttons using the spacebar or Enter key.

---

## 6. Product Detail Configuration Zone (`.pdp-config-workspace`)
* **Purpose:** Coordinates product purchase choices (such as Metals, sizing parameters).
* **Content:** Image views, configuration chips, price summary bars, purchase actions.
* **Layout:** Two columns (interactive preview gallery on the left, customization console on the right).
* **Grid:** 12 columns.
* **Columns:** Gallery spans 7 columns; configuration workspace spans 5 columns.
* **Spacing:** Padding levels: 40px interior gaps.
* **Animation:** Selection switches update the gallery image with a quick fade transition.
* **Responsive Behaviour:** Mobile stack layout; positions purchase controls in a sticky bottom toolbar.
* **Components Used:** Size guides, tab structures, button systems.
* **CTA:** "Add to Jewellery Box" (Checkout pathways).
* **Accessibility:** Forms include accessibility labelling inputs and helper texts.

---

## 7. Interactive Custom Builder Arena (`.designer-arena`)
* **Purpose:** Responsive workspace screen for custom jewelry orders.
* **Content:** 3D WebGL preview window, step navigation tabs, material configuration selectors.
* **Layout:** Full screen workspace with absolute controls overlays.
* **Grid:** Offset flex grid layouts.
* **Columns:** Viewport window: 65% width. Options tab frame: 35% width.
* **Spacing:** 0px borders edge setups.
* **Animation:** Orbit controls smoothly rotate the model; updates animate with material glints.
* **Responsive Behaviour:** Mobile options display at the bottom of the screen, sliding up on demand.
* **Components Used:** Design buttons, custom accordion inputs.
* **CTA:** "Checkout Custom Build design".
* **Accessibility:** Keyboard options support all selection shifts, screen readers output text for configured shapes.

---

## 8. Loyalty VIP Tiers Dashboard (`.profile-loyalty-tiers`)
* **Purpose:** Retains customer engagement via points targets.
* **Content:** Total points, current tier labels, rewards trackers, available vouchers.
* **Layout:** Glassmorphic card dashboards.
* **Grid:** 3 columns (Points overview / Tier progress bar / Available rewards).
* **Columns:** Spans equal layout spaces.
* **Spacing:** Internal padding: 32px.
* **Animation:** Points counter counts up on page load; progress tier bar fills from left to right.
* **Responsive Behaviour:** Mobile stacks views vertically; displays achievements in swipeable lists.
* **Components Used:** Secondary button types, alert chips.
* **CTA:** "Redeem Vouchers".
* **Accessibility:** High-contrast progress bar background structures, clear font weights.
