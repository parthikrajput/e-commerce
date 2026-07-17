# 16 JavaScript Architecture Specification: Lustra

Lustra uses a modular, event-driven vanilla JS architecture (ES6+) that prioritizes fast page loads and smooth interactions.

---

## 1. Modular Architecture & Class Standards

All application scripts are structured as self-contained ES6 classes. Page-specific modules load dynamically to keep bundles performant and light.

* **Class Standards:** Classes should manage their own select scopes, capture DOM refs in constructors, and expose explicit clean-up methods to prevent memory leaks during page state changes.

```javascript
// Base class interface template
export default class BaseComponent {
  constructor(element) {
    if (!element) {
      throw new Error(`Component initialization failed: Missing target element`);
    }
    this.element = element;
    this.ui = {}; // Cache for child DOM elements
  }

  destroy() {
    // Unbind class event listeners and clear DOM references
    this.ui = null;
    this.element = null;
  }
}
```

---

## 2. Event-Driven Communication Model

To keep UI components decoupled (e.g. updating the cart count icon when clicking "Add to Cart" on a product card), Lustra implements a global event mediator system:

```javascript
// Event Mediator Service
class EventDispatcher {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
}

export const GlobalEvents = new EventDispatcher();
```

### Event Names Standard:
* `Wishlist:Item:Added`: Triggers when an item is added to the user's wishlist card collection.
* `Cart:Drawer:Open`: Triggers to open the shopping cart sidebar.
* `Cart:Item:Updated`: Emits when item counts are updated to refresh prices.
* `TryOn:Camera:Calibrated`: Confirms when the face tracker camera initializes.

---

## 3. Swiper.js Slider Configurations

Configure slides across the site using responsive settings options:

```javascript
// Product Detail PDP Gallery swiper template settings
import Swiper from '../vendors/swiper-bundle.min.js';

export function initPdpGallery(sliderSelector, thumbSelector) {
  const thumbs = new Swiper(thumbSelector, {
    spaceBetween: 8,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    direction: 'vertical'
  });

  return new Swiper(sliderSelector, {
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: thumbs,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true }
  });
}
```

---

## 4. Input Validation & Form Engine

* **Real-time Input Validation:** Bind validator checks to `input` and `blur` events on input fields. Error messages fade out automatically as input values are corrected.
* **Regular Expressions for Validation Checks:**
  * Email validator: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
  * Phone format check: `/^[6-9]\d{9}$/` (standard 10-digit Indian mobile layout strings).
  * ZIP code verify: `/^\d{6}$/` (standard postal index numbering).
* **Verify Form Submit Actions:** When submit forms are triggered, validate all fields concurrently. If validation checks fail, prevent submit actions and focus the first invalid field.

---

## 5. Image Lazy Loading & Layout Resets

To prioritize loading key text and image content above the fold, defer down-page images using the browser's `IntersectionObserver` API:

```javascript
// Performance observer layout load
export function initLazyLoadObserver() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Swap image source variables to trigger load
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        
        img.addEventListener('load', () => img.classList.add('fade-in-visible'));
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px' }); // Load images 200px before they enter viewport

  lazyImages.forEach(img => observer.observe(img));
}
```

---

## 6. Performance Optimization Guideline

1. **Debounce High-Frequency Events:** Wrap window scroll and viewport resize listeners in a debounce helper script to prevent layout recalculations from slowing down performance:
  ```javascript
  export function debounce(func, wait = 100) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  ```
2. **Batch Layout Updates:** Coordinate visual shifts and animations using the `requestAnimationFrame` API to prevent visual stuttering and rendering lags.
3. **Dynamic Script Imports:** Conditionally import heavier scripts (like face tracking models for virtual try-on or 3D builders) only when the user interacts with those specific elements.
