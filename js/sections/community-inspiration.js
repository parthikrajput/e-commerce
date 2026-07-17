/**
 * Lustra E-commerce - Community Inspiration Controller Module
 * Handles scroll reveals, creator follows, bookmarks saves, and shop look click updates.
 */

export default class CommunityInspiration {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.headerKids = this.section.querySelectorAll('.c-community__eyebrow, .c-community__title, .c-community__desc, .c-community__all-link');
    this.featuredLook = this.section.querySelector('.c-featured-look');
    this.cards = this.section.querySelectorAll('.c-inspiration-card');
    this.spotlight = this.section.querySelector('.c-creator-spotlight');
    this.tagsBar = this.section.querySelector('.c-community__tags');
    this.journeyBox = this.section.querySelector('.c-journey--community');

    // AR Controller selectors
    this.followBtn = this.section.querySelector('.btn-follow-creator');
    this.shopButtons = this.section.querySelectorAll('.btn-shop-look');
    this.saveButtons = this.section.querySelectorAll('.c-inspiration-card__save, .btn-save-look');

    // Bind event controllers
    this.followBound = this.handleFollowToggle.bind(this);
    this.shopBound = this.handleShopLook.bind(this);
    this.saveBound = this.handleSaveLookToggle.bind(this);

    // State parameters
    this.hasAnimated = false;
    this.swiperInstance = null;

    this.init();
  }

  init() {
    // Configures modern Intersection Observer triggers to execute script when visible
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

    // Bind interaction buttons
    if (this.followBtn) this.followBtn.addEventListener('click', this.followBound);
    this.shopButtons.forEach(btn => btn.addEventListener('click', this.shopBound));
    this.saveButtons.forEach(btn => btn.addEventListener('click', this.saveBound));
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
    tl.from(this.headerKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 });

    // Step 2: Fade in featured middle block
    if (this.featuredLook) {
      tl.from(this.featuredLook, { y: 30, opacity: 0, duration: 1.0 }, '-=0.5');
    }

    // Step 3: Stagger cards grid
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5');
    }

    // Step 4: Fade in lower spotlight & Tags
    if (this.spotlight) {
      tl.from(this.spotlight, { y: 20, opacity: 0, duration: 0.8 }, '-=0.4');
    }
    if (this.tagsBar) {
      tl.from(this.tagsBar, { opacity: 0, duration: 0.6 }, '-=0.3');
    }
    if (this.journeyBox) {
      tl.from(this.journeyBox, { y: 10, opacity: 0, duration: 0.5 }, '-=0.2');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-community__eyebrow, .c-community__title, .c-community__desc, .c-community__all-link, .c-featured-look, .c-inspiration-card, .c-creator-spotlight, .c-community__tags, .c-journey--community')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Initializes Swiper sliders on mobile touch viewports
   */
  initSwiper() {
    if (window.innerWidth >= 768) return;
    if (typeof Swiper === 'undefined') return;

    this.swiperInstance = new Swiper('#community-swiper', {
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
   * Toggles creator follow states and changes label texts attributes
   */
  handleFollowToggle(e) {
    const btn = e.currentTarget;
    const isFollowing = btn.classList.toggle('is-active');
    
    if (isFollowing) {
      btn.innerText = 'Following Elena';
      btn.classList.replace('btn--secondary', 'btn--primary');
      
      document.dispatchEvent(new CustomEvent('Toast:Show', {
        detail: { message: 'You are now following Elena Rostova.', type: 'success' }
      }));
    } else {
      btn.innerText = 'Follow Elena';
      btn.classList.replace('btn--primary', 'btn--secondary');
    }
  }

  /**
   * Opens Complete Look popup parameters
   */
  handleShopLook(e) {
    const btn = e.currentTarget;
    const lookId = btn.getAttribute('data-look-id');

    document.dispatchEvent(new CustomEvent('ShopLook:Open', {
      detail: { lookId }
    }));

    // Trigger visual toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Opening Shop the Look drawer...', type: 'success' }
    }));
  }

  /**
   * Toggles bookmarks states on looks cards
   */
  handleSaveLookToggle(e) {
    const btn = e.currentTarget;
    const lookCardId = btn.getAttribute('data-look-card-id') || btn.getAttribute('data-look-id');
    const isActive = btn.classList.toggle('is-active');

    // Trigger toast
    const msg = isActive ? 'Look saved to inspiration board.' : 'Look removed from inspiration board.';
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: msg, type: 'success' }
    }));
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

    if (this.followBtn) this.followBtn.removeEventListener('click', this.followBound);
    this.shopButtons.forEach(btn => btn.removeEventListener('click', this.shopBound));
    this.saveButtons.forEach(btn => btn.removeEventListener('click', this.saveBound));
  }
}
