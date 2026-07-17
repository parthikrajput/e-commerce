/**
 * Lustra E-commerce - Wedding & Premium Collections Controller Module
 * Handles scroll reveals, storytelling staggers, and luxury consultation scheduling event dispatches.
 */

export default class WeddingPremiumCollections {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.storyKids = this.section.querySelectorAll('.c-wedding-premium__eyebrow, .c-wedding-premium__title, .c-wedding-premium__desc, .c-wedding-premium__quote, .c-wedding-premium__narrative, .c-wedding-premium__actions, .c-journey--wedding');
    this.featuredBlock = this.section.querySelector('.c-wedding-premium__featured');
    this.cards = this.section.querySelectorAll('.c-wedding-card');
    this.craftHighlights = this.section.querySelectorAll('.c-craft-highlight');
    this.consultBtn = this.section.querySelector('.btn-consult');

    // Bind event controllers
    this.consultBound = this.handleConsultModalOpen.bind(this);

    // State trackers
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
    }, { threshold: 0.1 });

    this.observer.observe(this.section);

    // Bind legacy consultation triggers
    if (this.consultBtn) {
      this.consultBtn.addEventListener('click', this.consultBound);
    }
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

    // Step 1: Reveal left storytelling side
    if (this.storyKids.length > 0) {
      tl.from(this.storyKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 });
    }

    // Step 2: Fade in right featured collection block
    if (this.featuredBlock) {
      tl.from(this.featuredBlock, { scale: 0.98, opacity: 0, duration: 1.0 }, '-=0.6');
    }

    // Step 3: Stagger lower occasion cards
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5');
    }

    // Step 4: Stagger lower craftsmanship items
    if (this.craftHighlights.length > 0) {
      tl.from(this.craftHighlights, { y: 15, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-wedding-premium__eyebrow, .c-wedding-premium__title, .c-wedding-premium__desc, .c-wedding-premium__quote, .c-wedding-premium__narrative, .c-wedding-premium__actions, .c-journey--wedding, .c-wedding-premium__featured, .c-wedding-card, .c-craft-highlight')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Dispatches consultation modals triggers and emits global actions
   */
  handleConsultModalOpen() {
    // Dispatch global concierge routing parameters
    document.dispatchEvent(new CustomEvent('ConciergeModal:Open', {
      detail: { formType: 'wedding-consultation' }
    }));

    // Trigger visual toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Connecting to our luxury jewellery advisor...', type: 'success' }
    }));
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.consultBtn) {
      this.consultBtn.removeEventListener('click', this.consultBound);
    }
  }
}
