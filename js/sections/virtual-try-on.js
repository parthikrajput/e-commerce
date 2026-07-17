/**
 * Lustra E-commerce - Virtual Try-On Controller Module
 * Handles mock camera frames adjustments, slide scales, snapshot triggers, and entrance reveals.
 */

export default class VirtualTryOn {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI nodes
    this.headerParts = this.section.querySelectorAll('.c-tryon__eyebrow, .c-tryon__title, .c-tryon__desc, .c-tryon__actions, .c-journey--tryon');
    this.benefits = this.section.querySelectorAll('.c-tryon-benefit');
    this.viewport = this.section.querySelector('#tryon-viewport');
    
    // AR Controller selectors
    this.overlayItem = this.section.querySelector('#tryon-product-overlay');
    this.zoomSlider = this.section.querySelector('#tryon-zoom');
    this.rotateSlider = this.section.querySelector('#tryon-rotate');
    this.snapBtn = this.section.querySelector('#tryon-snap');
    this.flashEl = this.section.querySelector('#tryon-flash');
    this.selectorItems = this.section.querySelectorAll('.c-tryon-selector__item');

    // Bind event controllers
    this.zoomBound = this.handleScaleUpdate.bind(this);
    this.rotateBound = this.handleRotationUpdate.bind(this);
    this.snapBound = this.handleCaptureSnapshot.bind(this);
    this.selectorBound = this.handleTypeSwitch.bind(this);

    // Active state dimensions
    this.scale = 1.0;
    this.rotation = 0;
    this.hasAnimated = false;

    this.init();
  }

  init() {
    // Configures modern Intersection Observer triggers to activate animation when visible
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playEntranceSequence();
        }
      });
    }, { threshold: 0.15 });

    this.observer.observe(this.section);

    // Bind slider inputs
    if (this.zoomSlider) this.zoomSlider.addEventListener('input', this.zoomBound);
    if (this.rotateSlider) this.rotateSlider.addEventListener('input', this.rotateBound);

    // Bind snapshot click
    if (this.snapBtn) this.snapBtn.addEventListener('click', this.snapBound);

    // Bind category tabs switches
    this.selectorItems.forEach(item => item.addEventListener('click', this.selectorBound));
  }

  /**
   * Play entrance reveals utilizing GSAP
   */
  playEntranceSequence() {
    // Check if GSAP is available on page pathways
    if (typeof gsap === 'undefined') {
      this.instantLoad();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.instantLoad();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: Reveal header titles
    tl.from(this.headerParts, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 });

    // Step 2: Stagger benefit list items
    if (this.benefits.length > 0) {
      tl.from(this.benefits, { x: -20, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.5');
    }

    // Step 3: Fade in simulator viewport
    if (this.viewport) {
      tl.from(this.viewport, { scale: 0.98, opacity: 0, duration: 1.0 }, '-=0.6');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-tryon__eyebrow, .c-tryon__title, .c-tryon__desc, .c-tryon__actions, .c-journey--tryon, .c-tryon-benefit, #tryon-viewport')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Adjusts scaling metrics on product overlay
   */
  handleScaleUpdate(e) {
    this.scale = e.target.value;
    this.applyTransformations();
  }

  /**
   * Adjusts rotation metrics on product overlay
   */
  handleRotationUpdate(e) {
    this.rotation = e.target.value;
    this.applyTransformations();
  }

  /**
   * Applies cumulative scale and rotation transforms to the overlay item vector
   */
  applyTransformations() {
    if (!this.overlayItem) return;
    this.overlayItem.style.transform = `translate(-50%, -50%) scale(${this.scale}) rotate(${this.rotation}deg)`;
  }

  /**
   * Coordinates simulator overlay src shifts based on selected items
   */
  handleTypeSwitch(e) {
    const item = e.currentTarget;
    if (item.classList.contains('is-active')) return;

    // Toggle active state classes
    this.selectorItems.forEach(el => el.classList.remove('is-active'));
    item.classList.add('is-active');

    const overlaySrc = item.getAttribute('data-overlay-src');
    if (this.overlayItem && overlaySrc) {
      // Apply fade transition on source swap
      if (typeof gsap !== 'undefined') {
        gsap.to(this.overlayItem, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          onComplete: () => {
            this.overlayItem.setAttribute('src', overlaySrc);
            gsap.to(this.overlayItem, { opacity: 1, scale: this.scale, duration: 0.3 });
          }
        });
      } else {
        this.overlayItem.setAttribute('src', overlaySrc);
      }
    }
  }

  /**
   * Instantiates visual flash timeline during camera clicks
   */
  handleCaptureSnapshot() {
    if (!this.flashEl) return;

    // Force animation classes redraw
    this.flashEl.classList.remove('is-flashing');
    void this.flashEl.offsetWidth; // Reflow triggers redraw
    this.flashEl.classList.add('is-flashing');

    // Trigger visual toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Snapshot saved to your style profile.', type: 'success' }
    }));
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.zoomSlider) this.zoomSlider.removeEventListener('input', this.zoomBound);
    if (this.rotateSlider) this.rotateSlider.removeEventListener('input', this.rotateBound);
    if (this.snapBtn) this.snapBtn.removeEventListener('click', this.snapBound);
    this.selectorItems.forEach(item => item.removeEventListener('click', this.selectorBound));
  }
}
