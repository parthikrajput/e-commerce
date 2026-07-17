/**
 * Lustra E-commerce - Categories Controller Module
 * Initiates category grid staggers and viewport scroll entrance reveals.
 */

export default class Categories {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.headerParts = this.section.querySelectorAll('.c-categories__eyebrow, .c-categories__title, .c-categories__desc, .c-categories__all-link');
    this.cards = this.section.querySelectorAll('.c-category-card');
    
    // Tracking parameters
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
   * Play entrance reveal timeline animations using GSAP
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
    if (this.headerParts.length > 0) {
      tl.from(this.headerParts, { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 });
    }

    // Step 2: Stagger category cards layouts
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.4');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-categories__eyebrow, .c-categories__title, .c-categories__desc, .c-categories__all-link, .c-category-card')
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
