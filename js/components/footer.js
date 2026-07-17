/**
 * Lustra E-commerce - Premium Global Footer Component Module
 * Manages newsletter validation filters, mobile accordions, country/language updates, and back-to-top smooth scrolls.
 */

export default class Footer {
  constructor(element) {
    if (!element) return;
    this.footer = element;

    // Select dynamic UI items
    this.backToTopBtn = document.getElementById('back-to-top');
    this.newsletterForm = document.getElementById('newsletter-form');
    this.emailInput = document.getElementById('newsletter-email');
    this.errorMsg = document.getElementById('newsletter-error');
    this.countrySelect = document.getElementById('country-selector');
    this.languageSelect = document.getElementById('language-selector');

    // Bind context instances to handlers
    this.scrollBound = this.handleScroll.bind(this);
    this.backToTopBound = this.scrollToTop.bind(this);
    this.submitBound = this.handleNewsletterSubmit.bind(this);
    this.countryChangeBound = this.handleCountryChange.bind(this);
    this.langChangeBound = this.handleLanguageChange.bind(this);

    this.init();
  }

  init() {
    // Bind Event Listeners
    window.addEventListener('scroll', this.scrollBound, { passive: true });
    
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener('click', this.backToTopBound);
    }

    if (this.newsletterForm) {
      this.newsletterForm.addEventListener('submit', this.submitBound);
    }

    if (this.countrySelect) {
      this.countrySelect.addEventListener('change', this.countryChangeBound);
    }

    if (this.languageSelect) {
      this.languageSelect.addEventListener('change', this.langChangeBound);
    }

    // Initialize mobile accordion folds toggles
    this.initMobileAccordions();
  }

  /**
   * Monitor scroll positions to show/hide the back to top widget.
   * Also sets --scroll-progress CSS variable (0%–100%) for the gold
   * conic-gradient ring on the button's ::before pseudo-element.
   */
  handleScroll() {
    if (!this.backToTopBtn) return;

    const scrollY    = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;

    // Update the CSS custom property for the gold progress ring
    this.backToTopBtn.style.setProperty('--scroll-progress', `${progress}%`);

    // Show after 400px scroll — smooth transition handled by CSS
    if (scrollY > 400) {
      this.backToTopBtn.classList.add('is-visible');
    } else {
      this.backToTopBtn.classList.remove('is-visible');
    }
  }

  /**
   * Smooth scroll to top with native browser smooth behaviour.
   * Falls back to instant scroll if prefers-reduced-motion is active.
   */
  scrollToTop() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }

  /**
   * Audits signup inputs against regular expressions, displaying inline feedback errors
   */
  handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!this.emailInput || !this.errorMsg) return;

    const email = this.emailInput.value.trim();
    this.errorMsg.classList.add('u-d-none');
    this.emailInput.classList.remove('is-invalid');

    if (!email) {
      this.showError('Please enter your email address.');
      return;
    }

    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address.');
      return;
    }

    // Success response setup
    this.emailInput.value = '';
    
    // Display visual feedback using custom Toast notification event
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: {
        message: 'Shared invitations registry updated. Welcome to Lustra.',
        type: 'success'
      }
    }));
  }

  /**
   * Displays target error messaging context below inputs
   */
  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.classList.remove('u-d-none');
    this.emailInput.classList.add('is-invalid');
  }

  /**
   * Audits typical syntax layouts
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Emits country updates triggers globally
   */
  handleCountryChange(e) {
    const country = e.target.value;
    document.dispatchEvent(new CustomEvent('Locale:CountryChanged', { detail: { country } }));
  }

  /**
   * Emits language updates triggers globally
   */
  handleLanguageChange(e) {
    const lang = e.target.value;
    document.dispatchEvent(new CustomEvent('Locale:LanguageChanged', { detail: { lang } }));
  }

  /**
   * Configures collapsible accordion sections on mobile viewports
   */
  initMobileAccordions() {
    const accordionTitles = this.footer.querySelectorAll('.c-footer__title');

    accordionTitles.forEach(title => {
      title.addEventListener('click', () => {
        if (window.innerWidth >= 768) return;

        const linksList = title.nextElementSibling;
        if (!linksList) return;

        const isExpanded = linksList.classList.contains('is-expanded');
        title.classList.toggle('is-active', !isExpanded);
        linksList.classList.toggle('is-expanded', !isExpanded);
      });
    });
  }

  /**
   * Unbind scroll monitors and form validation hooks on destruction runs
   */
  destroy() {
    window.removeEventListener('scroll', this.scrollBound);
    
    if (this.backToTopBtn) {
      this.backToTopBtn.removeEventListener('click', this.backToTopBound);
    }

    if (this.newsletterForm) {
      this.newsletterForm.removeEventListener('submit', this.submitBound);
    }

    if (this.countrySelect) {
      this.countrySelect.removeEventListener('change', this.countryChangeBound);
    }

    if (this.languageSelect) {
      this.languageSelect.removeEventListener('change', this.langChangeBound);
    }
  }
}
