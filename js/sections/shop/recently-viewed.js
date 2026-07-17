/**
 * ============================================================
 *  RECENTLY VIEWED — Lustra Reusable Component JavaScript
 *  File:     js/sections/shop/recently-viewed.js
 *  Purpose:  Controls local storage persistence for recently viewed items,
 *            personalization timestamps, Swiper touch slider binds,
 *            skeletal shim loadings, and event cleanup.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 04_Component_Library (§4)
 * ============================================================
 */

'use strict';

import ProductCard from '../../components/product-card.js';

/** Curated Jewelry Image URLs for Luxury Visuals */
const IMAGES = {
  ring1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
  ring2: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
  ring3: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
  earrings1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
  earrings2: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&auto=format&fit=crop&q=80',
  necklace1: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
  necklace2: 'https://images.unsplash.com/photo-1611085583191-a3b1a3a35541?w=800&auto=format&fit=crop&q=80',
  bracelet1: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80',
  bracelet2: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80'
};

/** Mock Product Database matching the main catalogs */
const MOCK_PRODUCTS_DB = {
  'lst-001': {
    id: 'lst-001',
    name: 'Aura Solitaire Ring',
    collection: 'Aura Collection',
    subtitle: 'A timeless expression of handmade luxury and elegance.',
    metal: '18K Yellow Gold',
    stone: '0.75ct Round Diamond',
    price: 145000,
    originalPrice: 175000,
    discount: '17% OFF',
    rating: 4.9,
    reviewCount: 42,
    imageUrl: IMAGES.ring1,
    hoverImageUrl: IMAGES.ring2,
    labels: ['New', 'Best Seller']
  },
  'cushion-aura-ring': {
    id: 'cushion-aura-ring',
    name: 'Cushion Aura Ring',
    collection: 'Aura Collection',
    subtitle: 'Canary cushion-cut diamond halo statement ring.',
    metal: '18K Yellow Gold',
    stone: '1.2ct Cushion Yellow Diamond',
    price: 185000,
    originalPrice: 210000,
    discount: '12% OFF',
    rating: 4.8,
    reviewCount: 19,
    imageUrl: IMAGES.ring2,
    hoverImageUrl: IMAGES.ring1,
    labels: ['Trending']
  },
  'eternity-band': {
    id: 'eternity-band',
    name: 'Eternity Diamond Band',
    collection: 'Lustra Atelier',
    subtitle: 'Baguette cut diamonds in an eternal circle.',
    metal: 'Platinum',
    stone: '2.0ct Baguette Diamonds',
    price: 215000,
    originalPrice: 215000,
    discount: '',
    rating: 5.0,
    reviewCount: 31,
    imageUrl: IMAGES.ring3,
    hoverImageUrl: IMAGES.ring1,
    labels: ['Limited Edition']
  },
  'emerald-ear-hoops': {
    id: 'emerald-ear-hoops',
    name: 'Marquise Emerald Ear Hoops',
    collection: 'Signature Gemstones',
    subtitle: 'Intricate marquise natural emerald gold ear hoops.',
    metal: '18K Yellow Gold',
    stone: 'Natural Emeralds & Diamonds',
    price: 128000,
    originalPrice: 145000,
    discount: '11% OFF',
    rating: 4.7,
    reviewCount: 14,
    imageUrl: IMAGES.earrings1,
    hoverImageUrl: IMAGES.earrings2,
    labels: ['Exclusive']
  },
  'link-gold-collar': {
    id: 'link-gold-collar',
    name: 'Link Gold Collar',
    collection: 'Lustra Atelier',
    subtitle: 'Bold architectural links in 18K solid yellow gold.',
    metal: '18K Yellow Gold',
    stone: 'No Stones',
    price: 340000,
    originalPrice: 375000,
    discount: '9% OFF',
    rating: 4.9,
    reviewCount: 8,
    imageUrl: IMAGES.necklace1,
    hoverImageUrl: IMAGES.necklace2,
    labels: ['Exclusive']
  }
};

const LOCAL_STORAGE_KEY = 'lustra-recently-viewed';
const MAX_ITEMS = 8;

export default class RecentlyViewed {
  /**
   * @param {HTMLElement} element - Root section element (.c-recently-viewed)
   */
  constructor(element) {
    this.section = element || document.getElementById('recently-viewed-section');
    if (!this.section) {
      console.warn('[RecentlyViewed] Initialization cancelled: Section element not found.');
      return;
    }

    if (this.section.__lustraRecentlyViewed) {
      return this.section.__lustraRecentlyViewed;
    }
    this.section.__lustraRecentlyViewed = this;

    // Cache elements (spec §16)
    this.ui = {
      slider:       this.section.querySelector('#rv-swiper-container'),
      wrapper:      this.section.querySelector('#rv-swiper-wrapper'),
      arrowPrev:    this.section.querySelector('#rv-arrow-prev'),
      arrowNext:    this.section.querySelector('#rv-arrow-next'),
      retryBtn:     this.section.querySelector('.c-recently-viewed__retry-btn'),
      footer:       this.section.querySelector('#rv-browsing-footer')
    };

    // Slider pointers
    this.swiperInstance = null;
    this._observer = null;
    this._listeners = [];
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  /**
   * Boot Section loader
   * @private
   */
  _init() {
    this._bindEvents();
    this.loadAndHydrate();
  }

  /**
   * Bind static action triggers
   * @private
   */
  _bindEvents() {
    if (this.ui.retryBtn) {
      const fn = () => this.loadAndHydrate();
      this.ui.retryBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.retryBtn, type: 'click', fn });
    }
  }

  /**
   * Fetch local storage viewed items and populate
   * @public
   */
  loadAndHydrate() {
    this._setState('loading');

    // Simulate luxury visual delay (500ms) to show skeleton shimmers
    setTimeout(() => {
      if (!this.section) return;

      const viewedList = RecentlyViewed.getViewedProducts();

      if (!viewedList || viewedList.length === 0) {
        this._setState('empty');
        return;
      }

      try {
        this._hydrateCarousel(viewedList);
        this._setState('content');
        this._setupLazyCarouselInit();
      } catch (err) {
        console.error('[RecentlyViewed] Initialization error:', err);
        this._setState('error');
      }
    }, 500);
  }

  /**
   * Dynamically build slides
   * @param {Array<Object>} viewedList - List of { id, timestamp }
   * @private
   */
  _hydrateCarousel(viewedList) {
    if (!this.ui.wrapper) return;
    this.ui.wrapper.innerHTML = '';

    viewedList.forEach(item => {
      const productData = this._resolveProductData(item.id);
      
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      // 1. Render premium timestamp eyebrow above the card
      const relativeTime = this._getRelativeTimeText(item.timestamp);
      const timestampTag = document.createElement('div');
      timestampTag.className = 'c-product-card__collection u-color-neutral-400';
      timestampTag.style.marginBottom = '6px';
      timestampTag.style.fontSize = '9px';
      timestampTag.textContent = relativeTime;
      slide.appendChild(timestampTag);

      // 2. Render actual Product Card element using dynamic render method
      // Reuses product-card.js factory class
      const cardNode = ProductCard.render(productData, 'recent');
      slide.appendChild(cardNode);

      this.ui.wrapper.appendChild(slide);
    });
  }

  /**
   * Set active state via data attribute
   * @param {string} state - 'loading', 'empty', 'error', 'content'
   * @private
   */
  _setState(state) {
    this.section.setAttribute('data-rv-state', state);

    if (state === 'empty') {
      if (this.ui.footer) this.ui.footer.style.display = 'none';
      if (this.ui.arrowPrev) this.ui.arrowPrev.disabled = true;
      if (this.ui.arrowNext) this.ui.arrowNext.disabled = true;
    } else {
      if (this.ui.footer) this.ui.footer.style.display = 'block';
    }
  }

  /**
   * Setup Swiper initialization when entering viewport (spec §26 §7)
   * @private
   */
  _setupLazyCarouselInit() {
    if (!this.ui.slider) return;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._initSwiper();
          this._animateEntrance();
          this._observer.disconnect(); // Only run once
        }
      });
    }, { rootMargin: '100px' });

    this._observer.observe(this.ui.slider);
  }

  /**
   * Initialize Swiper settings
   * @private
   */
  _initSwiper() {
    if (this.swiperInstance) return;

    this.swiperInstance = new Swiper(this.ui.slider, {
      speed: 600,
      slidesPerView: 4,
      spaceBetween: 24,
      watchOverflow: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        prevEl: this.ui.arrowPrev,
        nextEl: this.ui.arrowNext,
      },
      scrollbar: {
        el: this.section.querySelector('.swiper-scrollbar'),
        draggable: true,
        snapOnRelease: true
      },
      breakpoints: {
        0:   { slidesPerView: 1.2, spaceBetween: 12 },
        576: { slidesPerView: 2,   spaceBetween: 16 },
        992: { slidesPerView: 3,   spaceBetween: 20 },
        1200: { slidesPerView: 4,  spaceBetween: 24 }
      }
    });

    // Pause autoplay or triggers when scrolled out of view
    let isThrottled = false;
    const scrollHandler = () => {
      if (isThrottled || !this.swiperInstance) return;
      isThrottled = true;

      setTimeout(() => {
        isThrottled = false;
        const rect = this.section.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

        // Auto pause behavior
        if (!inViewport && this.swiperInstance.autoplay && this.swiperInstance.autoplay.running) {
          this.swiperInstance.autoplay.stop();
        } else if (inViewport && this.swiperInstance.autoplay && !this.swiperInstance.autoplay.running) {
          this.swiperInstance.autoplay.start();
        }
      }, 200);
    };

    window.addEventListener('scroll', scrollHandler);
    this._listeners.push({ el: window, type: 'scroll', fn: scrollHandler });
  }

  /**
   * GSAP staggers entrance reveal (spec §9)
   * @private
   */
  _animateEntrance() {
    if (this.hasGsap && !this.prefersReducedMotion && this.ui.wrapper) {
      window.gsap.from(this.ui.wrapper.children, {
        opacity: 0,
        y: 20,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }
  }

  /**
   * Relative time calculations helper
   * @param {number} timestamp
   * @returns {string} Relative string
   * @private
   */
  _getRelativeTimeText(timestamp) {
    const diff = Date.now() - timestamp;
    const min = 60 * 1000;
    const hr = 60 * min;
    const day = 24 * hr;

    if (diff < 5 * min) return 'Last Viewed';
    if (diff < day) return 'Viewed Today';
    if (diff < 2 * day) return 'Viewed Yesterday';
    return 'Viewed This Week';
  }

  /**
   * Resolves product details
   * @param {string} id - Product ID
   * @returns {Object} Data Object
   * @private
   */
  _resolveProductData(id) {
    if (MOCK_PRODUCTS_DB[id]) {
      return MOCK_PRODUCTS_DB[id];
    }

    // Dynamic fallback generator to prevent empty items
    const formattedName = id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: id,
      name: formattedName || 'Fine Piece',
      collection: 'Atelier Collection',
      subtitle: 'Exclusive handcrafted designer jewellery.',
      metal: '18K Yellow Gold',
      stone: 'Pavé Diamonds',
      price: 115000,
      originalPrice: 115000,
      discount: '',
      rating: 4.9,
      reviewCount: 7,
      imageUrl: IMAGES.ring1,
      hoverImageUrl: IMAGES.ring2,
      labels: []
    };
  }

  /**
   * Safely release Swiper and listeners (spec §16 §10)
   * @public
   */
  destroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true);
      this.swiperInstance = null;
    }

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    this._listeners.forEach(({ el, type, fn }) => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(type, fn);
      }
    });

    if (this.section) {
      delete this.section.__lustraRecentlyViewed;
    }

    this._listeners = [];
    this.ui = null;
    this.section = null;
  }

  // ────────────────────────────────────────────────────────────
  //  STATIC LOCAL STORAGE REGISTRY METHODS
  //  Exposed globally so any PDP page or click trigger can write.
  // ────────────────────────────────────────────────────────────

  /**
   * Caches viewed item
   * @param {string} productId - Product ID
   * @static
   * @public
   */
  static addProduct(productId) {
    if (!productId || productId === 'unknown') return;

    try {
      const list = RecentlyViewed.getViewedProducts();
      
      // Remove old index if duplicate
      const filtered = list.filter(item => item.id !== productId);
      
      // Prepend to top
      filtered.unshift({
        id: productId,
        timestamp: Date.now()
      });

      // Cap size limit
      const capped = filtered.slice(0, MAX_ITEMS);

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(capped));
    } catch (err) {
      console.warn('[RecentlyViewed] LocalStorage caching failed:', err);
    }
  }

  /**
   * Retrieves viewed list array
   * @returns {Array<Object>} viewed array of { id, timestamp }
   * @static
   * @public
   */
  static getViewedProducts() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('[RecentlyViewed] LocalStorage retrieval failed:', err);
      return [];
    }
  }
}
