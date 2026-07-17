/**
 * Lustra E-commerce - Final Conversion Controller Module
 * Handles scroll reveals, statistic increments, and newsletter form email validation rules.
 */

export default class FinalConversion {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.headerKids = this.section.querySelectorAll('.c-final-conversion__eyebrow, .c-final-conversion__title, .c-final-conversion__desc');
    this.galleryCards = this.section.querySelectorAll('.c-instagram-card');
    this.statNumbers = this.section.querySelectorAll('.c-social-stat__num');
    this.newsletterCard = this.section.querySelector('.c-luxury-newsletter');
    this.finalBanner = this.section.querySelector('.c-final-banner');

    // Controls items selectors
    this.form = this.section.querySelector('#newsletter-validate-form');
    this.emailInput = this.section.querySelector('#newsletter-field-email');
    this.errorMsg = this.section.querySelector('#email-error-feedback');
    this.chatBtn = this.section.querySelector('.btn-advisor-chat');

    // Bind event handlers
    this.submitBound = this.handleNewsletterSubmit.bind(this);
    this.chatBound = this.handleAdvisorChat.bind(this);

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

    // Bind form events
    if (this.form) {
      this.form.addEventListener('submit', this.submitBound);
    }

    if (this.chatBtn) {
      this.chatBtn.addEventListener('click', this.chatBound);
    }
  }

  /**
   * Play entrance reveals and numeric increments utilizing GSAP
   */
  playEntranceSequence() {
    // Run statistic counters animation increments
    this.statNumbers.forEach(num => {
      const targetVal = parseFloat(num.getAttribute('data-target')) || 0;
      const suffix = num.getAttribute('data-suffix') || '';
      
      const counterObj = { value: 0 };

      if (typeof gsap !== 'undefined') {
        gsap.to(counterObj, {
          value: targetVal,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            num.innerText = Math.floor(counterObj.value).toLocaleString() + suffix;
          }
        });
      } else {
        // Fallback for script libraries delay
        num.innerText = targetVal.toLocaleString() + suffix;
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

    // Step 1: Reveal header row
    tl.from(this.headerKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 });

    // Step 2: Stagger gallery images
    if (this.galleryCards.length > 0) {
      tl.from(this.galleryCards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.4');
    }

    // Step 3: Fade in newsletter panel
    if (this.newsletterCard) {
      tl.from(this.newsletterCard, { y: 30, opacity: 0, duration: 0.9 }, '-=0.5');
    }

    // Step 4: Fade in final banner callout
    if (this.finalBanner) {
      tl.from(this.finalBanner, { scale: 0.98, opacity: 0, duration: 1.0 }, '-=0.5');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-final-conversion__eyebrow, .c-final-conversion__title, .c-final-conversion__desc, .c-instagram-card, .c-luxury-newsletter, .c-final-banner')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

    this.statNumbers.forEach(num => {
      const targetVal = parseFloat(num.getAttribute('data-target')) || 0;
      const suffix = num.getAttribute('data-suffix') || '';
      num.innerText = targetVal.toLocaleString() + suffix;
    });
  }

  /**
   * Validates email rules on submit callbacks
   */
  handleNewsletterSubmit(e) {
    e.preventDefault();

    if (!this.emailInput) return;

    const email = this.emailInput.value.trim();
    const isEmailValid = this.validateEmailFormat(email);

    if (!isEmailValid) {
      this.emailInput.classList.add('is-invalid');
      if (this.errorMsg) {
        this.errorMsg.innerText = 'Please enter a valid luxury correspondence address.';
      }
      return;
    }

    // Reset status fields
    this.emailInput.classList.remove('is-invalid');
    if (this.errorMsg) {
      this.errorMsg.innerText = '';
    }

    // Emit event notifications
    document.dispatchEvent(new CustomEvent('Newsletter:Subscribe', {
      detail: { email }
    }));

    // Trigger visual toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Subscriptions saved. Welcome to our atelier lists.', type: 'success' }
    }));

    // Clean field inputs
    this.form.reset();
  }

  /**
   * Checks pattern format matches standard validation indices
   */
  validateEmailFormat(email) {
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return rx.test(email);
  }

  /**
   * Launches advisor chatbot or concierge triggers
   */
  handleAdvisorChat() {
    document.dispatchEvent(new CustomEvent('AdvisorChat:Open', {
      detail: { mode: 'general-consultation' }
    }));

    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Opening chat suite with our concierge...', type: 'success' }
    }));
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.form) {
      this.form.removeEventListener('submit', this.submitBound);
    }

    if (this.chatBtn) {
      this.chatBtn.removeEventListener('click', this.chatBound);
    }
  }
}
