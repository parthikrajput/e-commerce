/**
 * Lustra E-commerce - Featured Collections Controller Module
 * Manages scroll entrance reveals for editorial grids and banner quotes.
 */

export default class FeaturedCollections {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI nodes
    this.headerParts = this.section.querySelectorAll('.c-featured-cols__eyebrow, .c-featured-cols__title, .c-featured-cols__desc, .c-featured-cols__all-link');
    this.heroBlock = this.section.querySelector('.c-collection-hero');
    this.cards = this.section.querySelectorAll('.c-collection-card');
    this.quoteBlock = this.section.querySelector('.c-story-quote');

    // State parameters
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

    // Step 1: Reveal headers
    if (this.headerParts.length > 0) {
      tl.from(this.headerParts, { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 });
    }

    // Step 2: Fade large hero card
    if (this.heroBlock) {
      tl.from(this.heroBlock, { y: 30, opacity: 0, duration: 0.9 }, '-=0.4');
    }

    // Step 3: Stagger grid cards
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5');
    }

    // Step 4: Fade storytelling quotes
    if (this.quoteBlock) {
      tl.from(this.quoteBlock, { scale: 0.97, opacity: 0, duration: 0.8 }, '-=0.3');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-featured-cols__eyebrow, .c-featured-cols__title, .c-featured-cols__desc, .c-featured-cols__all-link, .c-collection-hero, .c-collection-card, .c-story-quote')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
