/**
 * Lustra E-commerce - Trending & New Arrivals Controller Module
 * Manages tab filters, mobile carousel initialization, wishlist actions, and entrance timelines.
 */

export default class TrendingProducts {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.tabs = this.section.querySelectorAll('.c-trending__tab');
    this.cards = this.section.querySelectorAll('.c-product-card');
    this.wishlistBtns = this.section.querySelectorAll('.c-product-card__wishlist');
    this.quickViewBtns = this.section.querySelectorAll('.btn-quick-view');
    this.addCartBtns = this.section.querySelectorAll('.btn-add-cart');

    // Bind event handlers
    this.wishlistBound = this.handleWishlistToggle.bind(this);
    this.quickViewBound = this.handleQuickView.bind(this);
    this.addCartBound = this.handleAddToCart.bind(this);
    
    // State tracker variables
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

    // Initial Filter Setup: Show Trending only
    this.applyFilter('trending');

    // Bind Filter Tabs Clicks
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e));
    });

    // Bind Action Buttons
    this.wishlistBtns.forEach(btn => btn.addEventListener('click', this.wishlistBound));
    this.quickViewBtns.forEach(btn => btn.addEventListener('click', this.quickViewBound));
    this.addCartBtns.forEach(btn => btn.addEventListener('click', this.addCartBound));
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

    // Step 1: Reveal header and filters
    const introKids = this.section.querySelectorAll('.c-trending__eyebrow, .c-trending__title, .c-trending__desc, .c-trending__filters, .c-hero-product');
    tl.from(introKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 });

    // Step 2: Stagger active visible cards
    const activeCards = Array.from(this.cards).filter(card => card.style.display !== 'none');
    if (activeCards.length > 0) {
      tl.from(activeCards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.4');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-trending__eyebrow, .c-trending__title, .c-trending__desc, .c-trending__filters, .c-hero-product, .c-product-card')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Manage filter tabs clicks
   */
  handleTabClick(e) {
    const clickedTab = e.currentTarget;
    if (clickedTab.classList.contains('is-active')) return;

    // Toggle active state classes
    this.tabs.forEach(tab => {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    clickedTab.classList.add('is-active');
    clickedTab.setAttribute('aria-selected', 'true');
    clickedTab.removeAttribute('tabindex');

    const filterVal = clickedTab.getAttribute('data-tab');
    
    // Apply filter with smooth opacity swap transitions
    if (typeof gsap !== 'undefined') {
      const activeCards = Array.from(this.cards).filter(card => card.style.display !== 'none');
      gsap.to(activeCards, { 
        opacity: 0, 
        y: 10,
        duration: 0.25, 
        onComplete: () => {
          this.applyFilter(filterVal);
          const nextCards = Array.from(this.cards).filter(card => card.style.display !== 'none');
          gsap.fromTo(nextCards, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    } else {
      this.applyFilter(filterVal);
    }
  }

  /**
   * Evaluates card targets and displays matches
   */
  applyFilter(category) {
    this.cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Re-initialize or update carousels if active on touch viewport widths
    if (this.swiperInstance) {
      this.swiperInstance.update();
    }
  }

  /**
   * Initializes Swiper components on mobile devices
   */
  initSwiper() {
    if (window.innerWidth >= 768) return;
    if (typeof Swiper === 'undefined') return;

    this.swiperInstance = new Swiper('#trending-swiper', {
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

    this.tabs.forEach(tab => tab.removeEventListener('click', this.handleTabClick));
    this.wishlistBtns.forEach(btn => btn.removeEventListener('click', this.wishlistBound));
    this.quickViewBtns.forEach(btn => btn.removeEventListener('click', this.quickViewBound));
    this.addCartBtns.forEach(btn => btn.removeEventListener('click', this.addCartBound));
  }
}
