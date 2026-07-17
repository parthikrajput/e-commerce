/**
 * Lustra E-commerce - AI Personalized Recommendations Controller Module
 * Controls side insights animations, linear progress bars, mobile carousels, and products click triggers.
 */

export default class AIPersonalizedRecommendations {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.headerParts = this.section.querySelectorAll('.c-ai-recommendations__eyebrow, .c-ai-recommendations__title, .c-ai-recommendations__desc, .c-ai-recommendations__cta');
    this.profileCard = this.section.querySelector('.c-ai-profile-card');
    this.progressFills = this.section.querySelectorAll('.c-ai-stat__progress-fill');
    this.journeyBox = this.section.querySelector('.c-journey--recs');
    this.cards = this.section.querySelectorAll('.c-product-card');
    this.wishlistBtns = this.section.querySelectorAll('.c-product-card__wishlist');
    this.quickViewBtns = this.section.querySelectorAll('.btn-quick-view');
    this.addCartBtns = this.section.querySelectorAll('.btn-add-cart');

    // Bind event handlers
    this.wishlistBound = this.handleWishlistToggle.bind(this);
    this.quickViewBound = this.handleQuickView.bind(this);
    this.addCartBound = this.handleAddToCart.bind(this);

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

    // Bind Action Buttons
    this.wishlistBtns.forEach(btn => btn.addEventListener('click', this.wishlistBound));
    this.quickViewBtns.forEach(btn => btn.addEventListener('click', this.quickViewBound));
    this.addCartBtns.forEach(btn => btn.addEventListener('click', this.addCartBound));
  }

  /**
   * Play entrance reveals utilizing GSAP
   */
  playEntranceSequence() {
    // Fill progress bars dynamically
    this.progressFills.forEach(fill => {
      const percentage = fill.getAttribute('data-progress') || '90';
      
      if (typeof gsap !== 'undefined') {
        gsap.to(fill, { width: `${percentage}%`, duration: 1.5, ease: 'power3.out' });
      } else {
        fill.style.width = `${percentage}%`;
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

    // Step 1: Reveal header and profile card
    tl.from(this.headerParts, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 })
      .from(this.profileCard, { y: 25, opacity: 0, duration: 0.8 }, '-=0.4')
      .from(this.journeyBox, { y: 15, opacity: 0, duration: 0.5 }, '-=0.3');

    // Step 2: Stagger recommender cards
    if (this.cards.length > 0) {
      tl.from(this.cards, { y: 30, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.6');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-ai-recommendations__eyebrow, .c-ai-recommendations__title, .c-ai-recommendations__desc, .c-ai-recommendations__cta, .c-ai-profile-card, .c-journey--recs, .c-product-card')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

    this.progressFills.forEach(fill => {
      const percentage = fill.getAttribute('data-progress') || '90';
      fill.style.width = `${percentage}%`;
    });
  }

  /**
   * Initializes Swiper sliders on mobile touch screens
   */
  initSwiper() {
    if (window.innerWidth >= 768) return;
    if (typeof Swiper === 'undefined') return;

    this.swiperInstance = new Swiper('#recs-swiper', {
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
   * Toggles product wishlist state and fires global event notifications
   */
  handleWishlistToggle(e) {
    const btn = e.currentTarget;
    const prodId = btn.getAttribute('data-wishlist-id');
    const isActive = btn.classList.toggle('is-active');

    // Emit event notifications for global wishlist counters updates
    document.dispatchEvent(new CustomEvent('Wishlist:Update', {
      detail: { productId: prodId, isAdded: isActive }
    }));

    // Trigger visual toast
    const msg = isActive ? 'Product added to wishlist.' : 'Product removed from wishlist.';
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: msg, type: 'success' }
    }));
  }

  /**
   * Dispatches Quick View events
   */
  handleQuickView(e) {
    const btn = e.currentTarget;
    const productId = btn.getAttribute('data-product-id');
    
    document.dispatchEvent(new CustomEvent('QuickView:Open', {
      detail: { productId }
    }));
  }

  /**
   * Dispatches Add to Cart events
   */
  handleAddToCart(e) {
    const btn = e.currentTarget;
    const productId = btn.getAttribute('data-product-id');

    document.dispatchEvent(new CustomEvent('Cart:Add', {
      detail: { productId }
    }));

    // Toast feedback
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Item added to shopping bag.', type: 'success' }
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

    this.wishlistBtns.forEach(btn => btn.removeEventListener('click', this.wishlistBound));
    this.quickViewBtns.forEach(btn => btn.removeEventListener('click', this.quickViewBound));
    this.addCartBtns.forEach(btn => btn.removeEventListener('click', this.addCartBound));
  }
}
