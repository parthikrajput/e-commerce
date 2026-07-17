# 11 Accessibility Guidelines (WCAG 2.2 AA): Lustra Platform

This document outlines the accessibility standards and code specifications for the Lustra platform, ensuring compliance with WCAG 2.2 AA.

---

## 1. Contrast & Typography Standards

To ensure readability across all elements:
* **Body Text Contrast:** Maintain a minimum contrast ratio of **4.5:1** for body copy (using colors like `Neutral 900` or `Neutral 800` on native white elements).
* **Large Headings Contrast:** Keep a minimum contrast ratio of **3.0:1** for large heading text (size 24px and up, such as `Primary Gold` on a dark charcoal background).
* **Relative Font Sizing:** Use relative units like `rem` or `em` for all font values, allowing the text to scale up to 200% without breaking visual layout containers.

---

## 2. Keyboard Navigation & Tab Focus

The entire site should be fully navigable using only a keyboard.

### 2.1 Focus Ring Indicator
* Do not disable focus outlines. Implement a high-contrast focus ring style using a CSS rule:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-primary-gold);
    outline-offset: 4px;
  }
  ```

### 2.2 Focus Order Management
* **Skip Links:** Place a class link for skip navigation at the top of the body elements:
  ```html
  <a href="#main-content" class="skip-to-content">Skip to Main Content</a>
  ```
* **Tab Order Sequence:** Interactive elements must follow a logical reading flow (left-to-right, top-to-bottom). Disable access to decorative elements using the attribute `tabindex="-1"`.
* **Modal Focus Locks:** Once a modal is opened, restrict keyboard tab focus to elements inside the modal container. Enable the Escape key block helper to let users dismiss active screens:
  ```javascript
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  });
  ```

---

## 3. Screen Reader Accommodations

Provide descriptive alternative text for non-text content to assist screen reader users.

* **Image Alt Text:** Every image element requires an `alt="..."` attribute. Use descriptive copy for product details:
  ```html
  <img src="product.jpg" alt="Handcrafted 18k solid yellow gold solitaire engagement ring showcasing a brilliant round-cut GIA-certified diamond.">
  ```
* Set empty attributes (`alt=""`) on decorative images to guide screen readers to skip them.
* **SVG Icon Labels:** Add aria labels to icon buttons and links:
  ```html
  <button aria-label="Add Golden Aura Ring to Cart" class="btn-wishlist">
    <svg aria-hidden="true">...</svg> <!-- Hide decorative SVG paths -->
  </button>
  ```

---

## 4. ARIA Implementation Rules

Use ARIA attributes to clearly indicate component states and roles:

* **Interactive Menus:** Accordion button blocks must define relationships to their panel components:
  ```html
  <button aria-expanded="true" aria-controls="faq-panel-01" class="accordion-button">
    Warranty Policy
  </button>
  <div id="faq-panel-01" role="region" class="accordion-content">
    Our handmade pieces include a complimentary lifetime warranty...
  </div>
  ```
* **Dynamic Feed Updates:** Set `aria-live="polite"` on active elements (like the cart quantity total or message update logs) to inform screen reader users of background updates without interrupting their task.

---

## 5. Form Elements Accessibility

* **Explicit Labels:** Every input must be connected to an explicit helper text label using matching `for` and `id` properties:
  ```html
  <label for="user-email-input">Email Address</label>
  <input type="email" id="user-email-input" aria-required="true" class="field-input">
  ```
* **Clear Error Handling:** Connect inline error messages to the corresponding form controls using the `aria-describedby` attribute:
  ```html
  <input type="text" id="pass-field" aria-describedby="pass-error" aria-invalid="true">
  <span id="pass-error" class="error-msg">Password must contain at least 8 characters.</span>
  ```
* **Mobile-friendly Keyboards:** Configure input types explicitly. Use `type="email"` for email fields and `type="number"` for numeric controls to ensure mobile browsers open the appropriate keyboard layout.
