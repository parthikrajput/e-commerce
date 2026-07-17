# 09 Animation Guidelines: Lustra E-commerce

This document outlines the animation standards, GSAP recipes, and performance optimization rules for the Lustra platform.

---

## 1. GreenSock (GSAP) Core Configurations

To maintain a consistent feel, all GSAP motions should use a unified easing structure.

### 1.1 Custom Easing Tokens
* **Soft Luxury Ease (Default):** `cubic-bezier(0.25, 1, 0.5, 1)` &rarr; GSAP equivalent: `"power3.out"`.
* **Snappy Entrance:** `cubic-bezier(0.16, 1, 0.3, 1)` &rarr; GSAP: `"power4.out"`.
* **Subtle Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)` &rarr; GSAP: `"back.out(1.7)"`.

### 1.2 GSAP Global Defaults
```javascript
// Example global default setup definition
gsap.defaults({
  duration: 0.5,
  ease: "power3.out",
  overwrite: "auto"
});
```

---

## 2. Scroll-Activated Animations (ScrollTrigger)

Scroll triggered animations should dynamically highlight content as it enters the viewport.

* **Trigger Actions:** Configure triggers using `toggleActions: "play none none reverse"`. This animates elements as they scroll into view and resets them when scrolled past.
* **Scrub Values:** Use a scrub setting of `1` (or `1.2` seconds) to keep parallax scroll effects anchored to the user's scroll speed:
  ```javascript
  gsap.to(".parallax-bg", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".parallax-section",
      scrub: 1
    }
  });
  ```

---

## 3. Image Reveal Effects

* **Rule:** Reveal images with a smooth sliding curtain mask or a soft focus fade.
* **Curtain Mask Implementation:** Place a solid container on top of the image module.
  1. GSAP scale-animates the mask overlay width from `0%` to `100%`.
  2. The image scale shifts from `1.15` to `1.0`.
  3. The mask rotates and slides to the right side of the container, revealing the underlying image.

```
   Reveal Transition Workflow
   +--------------------+     +--------------------+     +--------------------+
   | [  M A S K   99% ] | --> | [MASK] Image 50%   | --> | Image Active (100%)|
   +--------------------+     +--------------------+     +--------------------+
```

---

## 4. Product Details Gallery Interactions

* **thumbnail Carousel Navigations:** Active item updates slide the main display smoothly into position along the x-axis:
  ```javascript
  gsap.to(".pdp-main-stage", {
    xPercent: -100 * targetIndex,
    duration: 0.6,
    ease: "power4.out"
  });
  ```
* **Virtual Lens Zooms:** Moving the mouse over the product image activates a high-definition zoom lens overlay, scaling up the detail view by `2x` for closer inspection.

---

## 5. Value Counter Animations
* **Use Case:** Animate points or price breakdowns inside user dashboard loyalty displays.
* **Formula:** Use a step function to count numbers up from `0` when the element scrolls into view:
  ```javascript
  const counterObj = { value: 0 };
  gsap.to(counterObj, {
    value: targetValue,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      element.innerHTML = Math.round(counterObj.value).toLocaleString();
    }
  });
  ```

---

## 6. Crucial Performance Rules

1. **Animate Transform and Opacity Only:** Limit animations to `transform: translate3d()/scale()` and `opacity`. Animating properties like `top`, `left`, `width`, or `margin` triggers browser layout reflows, which can cause lag and visual stuttering.
2. **GPU Acceleration:** Add `will-change: transform` to active layers to offload rendering to the GPU and prevent animation lag:
  ```css
  .hero-parallax-layer {
    will-change: transform;
    transform: translateZ(0); /* Force GPU compositing */
  }
  ```
3. **Limit Active WebGL Instances:** In the Custom Builder and AR Try-On tools, dispose of WebGL render targets and pause rendering operations whenever modules are hidden or scrolled out of view.
4. **Adaptive Motion Controls:** Check user preferences using media queries before running animations. If the user prefers reduced motion, disable transitions and default to a simple cross-fade:
  ```javascript
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    // Disable complex GSAP movements, fall back to simple opacity fades.
  }
  ```
5. **Debounce Component Event Handlers:** Debounce target window resize and scroll listeners to prevent animation scripts from overloading device performance.
