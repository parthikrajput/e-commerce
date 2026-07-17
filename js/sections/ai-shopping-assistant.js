/**
 * Lustra E-commerce - AI Shopping Assistant Controller Module
 * Controls element entrance reveal timelines, card hover states, and mouse parallax calculations on desktop.
 */

export default class AIShoppingAssistant {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI nodes
    this.eyebrow = this.section.querySelector('.c-ai-assistant__eyebrow');
    this.title = this.section.querySelector('.c-ai-assistant__title');
    this.desc = this.section.querySelector('.c-ai-assistant__desc');
    this.actions = this.section.querySelector('.c-ai-assistant__actions');
    this.cards = this.section.querySelectorAll('.c-ai-feature-card');
    this.journey = this.section.querySelector('.c-journey');
    this.visual = this.section.querySelector('.c-ai-assistant__visual');
    this.parallaxContainer = this.section.querySelector('#ai-parallax-container');

    // Bind event handlers
    this.mouseMoveBound = this.handleMouseMoveParallax.bind(this);
    
    // Config state parameters
    this.hasAnimated = false;

    this.init();
  }

  init() {
    // Configures modern Intersection Observer triggers to defer animation ticks until visible
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playEntranceSequence();
          this.initMouseParallax();
        }
      });
    }, { threshold: 0.15 });

    this.observer.observe(this.section);
  }

  /**
   * Triggers GSAP timeline animations sequence
   */
  playEntranceSequence() {
    // Check if GSAP is available on document pathways
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

    // Step 1: Reveal content headers
    tl.from(this.eyebrow, { y: 15, opacity: 0, duration: 0.5 }, '0')
      .from(this.title, { y: 25, opacity: 0, duration: 0.7 }, '0.2')
      .from(this.desc, { y: 20, opacity: 0, duration: 0.6 }, '0.4');

    // Step 2: Stagger dynamic cards
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, '0.5');
    }

    // Step 3: Reveal action triggers and flow indicators
    tl.from(this.actions, { y: 15, opacity: 0, duration: 0.5 }, '0.8')
      .from(this.journey, { y: 15, opacity: 0, duration: 0.5 }, '1.0');

    // Step 4: Fade in mockup preview panel details
    if (this.visual) {
      const panelElements = this.visual.querySelectorAll('.c-ai-panel__bubble, .c-ai-panel__status, .c-ai-panel__mock-card, .c-ai-tag');
      tl.from(this.visual, { scale: 0.98, opacity: 0, duration: 1.0 }, '0.4')
        .from(panelElements, { y: 20, opacity: 0, duration: 0.8, stagger: 0.15 }, '0.6');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-ai-assistant__eyebrow, .c-ai-assistant__title, .c-ai-assistant__desc, .c-ai-feature-card, .c-ai-assistant__actions, .c-journey, .c-ai-assistant__visual, .c-ai-panel__bubble, .c-ai-panel__status, .c-ai-panel__mock-card, .c-ai-tag')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Initializes mouse movement listeners for modern editorial parallax layers shifts
   */
  initMouseParallax() {
    if (window.innerWidth < 992) return; // Disable parallax on tablet/mobile viewport widths
    
    if (this.parallaxContainer) {
      this.parallaxContainer.addEventListener('mousemove', this.mouseMoveBound);
    }
  }

  /**
   * Calculates offsets based on pointer positions to tilt visual layers
   */
  handleMouseMoveParallax(e) {
    if (!this.parallaxContainer) return;

    const rect = this.parallaxContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const panel = this.parallaxContainer.querySelector('.c-ai-panel');
    const tagTop = this.parallaxContainer.querySelector('.c-ai-tag--top');
    const tagBottom = this.parallaxContainer.querySelector('.c-ai-tag--bottom');

    if (panel) {
      // Rotate 3D card layout slightly based on vectors
      panel.style.transform = `rotateY(${x * 0.03}deg) rotateX(${y * -0.03}deg) translateY(-2px)`;
    }

    if (tagTop) {
      tagTop.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    }

    if (tagBottom) {
      tagBottom.style.transform = `translate(${x * -0.05}px, ${y * -0.05}px)`;
    }
  }

  /**
   * Clears monitors and observers during destruction routines
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.parallaxContainer) {
      this.parallaxContainer.removeEventListener('mousemove', this.mouseMoveBound);
    }
  }
}
