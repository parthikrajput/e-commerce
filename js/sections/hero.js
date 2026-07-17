/**
 * Lustra E-commerce - Homepage Hero Controller Module
 * Initiates GSAP entrance timelines, executes subtle parallax scrolling, and checks prefers-reduced-motion settings.
 */

export default class Hero {
  constructor(element) {
    if (!element) return;
    this.hero = element;
    
    // Select animated elements
    this.eyebrow = this.hero.querySelector('.c-hero__eyebrow');
    this.headingLines = this.hero.querySelectorAll('.c-hero__title-line');
    this.desc = this.hero.querySelector('.c-hero__desc');
    this.actions = this.hero.querySelector('.c-hero__actions');
    this.trust = this.hero.querySelector('.c-hero__trust');
    this.visual = this.hero.querySelector('.c-hero__visual');
    this.media = this.hero.querySelector('.c-hero__media');
    this.scrollIndicator = this.hero.querySelector('.c-hero__scroll-indicator');

    // Bind scroll monitors
    this.parallaxBound = this.handleParallaxScroll.bind(this);
    
    this.init();
  }

  init() {
    // Scroll event listener for subtle visual parallax shifts
    window.addEventListener('scroll', this.parallaxBound, { passive: true });

    // Check system preference profiles for animations toggle
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.instantLoad();
    } else {
      this.playEntranceAnimation();
    }
  }

  /**
   * Performs standard GSAP entrance reveals timeline sequence
   */
  playEntranceAnimation() {
    // Check if GSAP is available on the page
    if (typeof gsap === 'undefined') {
      this.instantLoad();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: Eager scale preview zoom out
    if (this.media) {
      tl.to(this.media, { scale: 1, duration: 1.6 });
    }

    // Step 2: Content stagger fades
    tl.from(this.eyebrow, { y: 20, opacity: 0, duration: 0.6 }, '0.2')
      .from(this.headingLines, { y: 30, opacity: 0, duration: 0.8, stagger: 0.15 }, '0.4')
      .from(this.desc, { y: 20, opacity: 0, duration: 0.6 }, '0.8')
      .from(this.actions, { y: 20, opacity: 0, duration: 0.6 }, '1.0')
      .from(this.trust, { y: 15, opacity: 0, duration: 0.6 }, '1.2');

    // Step 3: Floating shapes slide checks
    if (this.visual) {
      const decorators = this.visual.querySelectorAll('.c-hero__decorator');
      tl.from(decorators, { scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.1 }, '0.8');
    }

    // Step 4: Scroll Indicator reveal
    if (this.scrollIndicator) {
      tl.from(this.scrollIndicator, { y: -10, opacity: 0, duration: 0.5 }, '1.4');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    if (this.media) this.media.style.transform = 'scale(1)';
    if (this.hero) {
      this.hero.querySelectorAll('.c-hero__eyebrow, .c-hero__title-line, .c-hero__desc, .c-hero__actions, .c-hero__trust, .c-hero__decorator, .c-hero__scroll-indicator')
        .forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
    }
  }

  /**
   * Applies subtle parallax scroll offsets to visually decouple image visual speeds
   */
  handleParallaxScroll() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return; // Stop processing once section is off-screen

    // Parallax on image content
    if (this.media) {
      const offset = scrollY * 0.12;
      this.media.style.transform = `scale(1) translateY(${offset}px)`;
    }

    // Parallax on floating decorator circles
    if (this.visual) {
      const decorators = this.visual.querySelectorAll('.c-hero__decorator');
      decorators.forEach((dec, idx) => {
        const factor = (idx + 1) * 0.18;
        const offset = scrollY * factor;
        dec.style.transform = `translateY(${offset}px)`;
      });
    }
  }

  /**
   * Clean up event bindings on destruction
   */
  destroy() {
    window.removeEventListener('scroll', this.parallaxBound);
  }
}
