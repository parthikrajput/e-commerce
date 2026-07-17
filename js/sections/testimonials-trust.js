/**
 * Lustra E-commerce - Customer Reviews, Testimonials & Trust Controller Module
 * Handles metric counting sequences, Swiper carousels, and entrance reveal timelines.
 */

export default class TestimonialsTrust {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.headerKids = this.section.querySelectorAll('.c-testimonials-trust__eyebrow, .c-testimonials-trust__title, .c-testimonials-trust__desc, .c-testimonials-trust__all-link');
    this.metricCards = this.section.querySelectorAll('.c-metric-card');
    this.featuredStory = this.section.querySelector('.c-featured-story');
    this.testimonialCards = this.section.querySelectorAll('.c-testimonial-card');
    this.trustBadges = this.section.querySelector('.c-trust-badges');
    this.mediaMentions = this.section.querySelector('.c-media-mentions');
    this.journeyBox = this.section.querySelector('.c-journey--testimonials');
    
    // Value trackers
    this.statNumbers = this.section.querySelectorAll('.c-metric-card__number');

    // State parameters
    this.hasAnimated = false;
    this.swiperInstance = null;

    this.init();
  }

  init() {
    // Configures modern Intersection Observer triggers to activate animation when visible
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playEntranceSequence();
          this.initSwiper();
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.section);
  }

  /**
   * Play entrance reveals and numeric increments utilizing GSAP
   */
  playEntranceSequence() {
    // Run stat counters animations
    this.statNumbers.forEach(num => {
      const targetVal = parseFloat(num.getAttribute('data-target')) || 0;
      const suffix = num.getAttribute('data-suffix') || '';
      
      const counterObj = { value: 0 };
      const decimals = targetVal % 1 !== 0;

      if (typeof gsap !== 'undefined') {
        gsap.to(counterObj, {
          value: targetVal,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            num.innerText = decimals 
              ? counterObj.value.toFixed(1) + suffix 
              : Math.floor(counterObj.value).toLocaleString() + suffix;
          }
        });
      } else {
        // Fallback for missing script libraries
        num.innerText = decimals 
          ? targetVal.toFixed(1) + suffix 
          : targetVal.toLocaleString() + suffix;
      }
    });

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

    // Step 1: Reveal header and metric blocks
    tl.from(this.headerKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 })
      .from(this.metricCards, { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.4');

    // Step 2: Fade in featured customer card
    if (this.featuredStory) {
      tl.from(this.featuredStory, { y: 30, opacity: 0, duration: 0.9 }, '-=0.5');
    }

    // Step 3: Stagger cards grid
    if (this.testimonialCards.length > 0) {
      tl.from(this.testimonialCards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5');
    }

    // Step 4: Stagger badges & mentions
    if (this.trustBadges) {
      tl.from(this.trustBadges, { opacity: 0, y: 15, duration: 0.8 }, '-=0.4');
    }
    if (this.mediaMentions) {
      tl.from(this.mediaMentions, { opacity: 0, duration: 0.7 }, '-=0.3');
    }
    if (this.journeyBox) {
      tl.from(this.journeyBox, { y: 10, opacity: 0, duration: 0.5 }, '-=0.2');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-testimonials-trust__eyebrow, .c-testimonials-trust__title, .c-testimonials-trust__desc, .c-testimonials-trust__all-link, .c-metric-card, .c-featured-story, .c-testimonial-card, .c-trust-badges, .c-media-mentions, .c-journey--testimonials')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

    this.statNumbers.forEach(num => {
      const targetVal = parseFloat(num.getAttribute('data-target')) || 0;
      const suffix = num.getAttribute('data-suffix') || '';
      const decimals = targetVal % 1 !== 0;
      num.innerText = decimals 
        ? targetVal.toFixed(1) + suffix 
        : targetVal.toLocaleString() + suffix;
    });
  }

  /**
   * Initializes Swiper sliders on touch viewport screens
   */
  initSwiper() {
    if (window.innerWidth >= 768) return;
    if (typeof Swiper === 'undefined') return;

    this.swiperInstance = new Swiper('#testimonials-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        480: {
          slidesPerView: 1.8,
        }
      }
    });
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }
}
