/**
 * ============================================================
 *  AI RECOMMENDATIONS — Lustra Reusable Component JavaScript
 *  File:     js/sections/shop/ai-recommendations.js
 *  Purpose:  Controls the premium AI Shopper experience. Triggers
 *            Style DNA card transitions, dynamic categories swapping,
 *            GSAP slide dismissals, explain modal dialogs, and Swiper binds.
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

/** Categorized mock database of recommended jewelry items */
const RECOMMENDATIONS_DB = {
  perfect: [
    {
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
      labels: ['New', 'AI Recommended'],
      aiMatch: 98,
      aiReason: 'Matches your ring metal preferences.'
    },
    {
      id: 'cushion-aura-ring',
      name: 'Cushion Aura Ring',
      collection: 'Aura Collection',
      subtitle: 'Canary cushion-cut diamond statement gold ring.',
      metal: '18K Yellow Gold',
      stone: '1.2ct Cushion Yellow Diamond',
      price: 185000,
      originalPrice: 210000,
      discount: '12% OFF',
      rating: 4.8,
      reviewCount: 19,
      imageUrl: IMAGES.ring2,
      hoverImageUrl: IMAGES.ring1,
      labels: ['Trending', 'AI Recommended'],
      aiMatch: 95,
      aiReason: 'Curated based on cushions viewed today.'
    },
    {
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
      labels: ['Exclusive'],
      aiMatch: 92,
      aiReason: 'Recommended to match your emerald searches.'
    }
  ],
  wishlist: [
    {
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
      labels: ['Limited Edition'],
      aiMatch: 96,
      aiReason: 'Inspired by baguette items on your wishlist.'
    },
    {
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
      labels: ['Exclusive'],
      aiMatch: 94,
      aiReason: 'Matches emerald studs on your wishlist.'
    }
  ],
  trending: [
    {
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
      labels: ['Exclusive'],
      aiMatch: 89,
      aiReason: 'Highly popular in Mumbai this week.'
    },
    {
      id: 'cushion-aura-ring',
      name: 'Cushion Aura Ring',
      collection: 'Aura Collection',
      subtitle: 'Canary cushion-cut diamond statement gold ring.',
      metal: '18K Yellow Gold',
      stone: '1.2ct Cushion Yellow Diamond',
      price: 185000,
      originalPrice: 210000,
      discount: '12% OFF',
      rating: 4.8,
      reviewCount: 19,
      imageUrl: IMAGES.ring2,
      hoverImageUrl: IMAGES.ring1,
      labels: ['Trending'],
      aiMatch: 87,
      aiReason: 'Currently trending in your neighborhood.'
    }
  ],
  luxury: [
    {
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
      labels: ['Exclusive', 'AI Recommended'],
      aiMatch: 97,
      aiReason: 'Matches your preference for premium designer statement links.'
    },
    {
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
      labels: ['Limited Edition'],
      aiMatch: 96,
      aiReason: 'Curated diamond bands matching your high confidence score.'
    }
  ]
};

/** AI Profile state dictionary mapping tabs selection */
const INSIGHTS_DB = {
  perfect:  { score: '98% Match', style: 'Minimal Luxury', metal: 'Yellow Gold', stone: 'Diamond', budget: 'Under ₹2.0L', occasion: 'Everyday Couture' },
  wishlist: { score: '94% Match', style: 'Modern Editorial', metal: 'Platinum', stone: 'Baguette Diamond', budget: 'Under ₹3.0L', occasion: 'Milestones' },
  trending: { score: '89% Match', style: 'Architectural Gold', metal: '18K Yellow Gold', stone: 'None', budget: 'Under ₹4.0L', occasion: 'Evening Soiree' },
  luxury:   { score: '97% Match', style: 'High Fine Jewellery', metal: 'Platinum / Gold', stone: 'Rare Gemstones', budget: 'No Limit', occasion: 'Bespoke Bridal' }
};

export default class AiRecommendations {
  /**
   * @param {HTMLElement} element - Root section element (.c-ai-recommendations)
   */
  constructor(element) {
    this.section = element || document.getElementById('ai-recommendations-section');
    if (!this.section) {
      console.warn('[AiRecommendations] Initialization cancelled: Root element not found.');
      return;
    }

    if (this.section.__lustraAiRecommendations) {
      return this.section.__lustraAiRecommendations;
    }
    this.section.__lustraAiRecommendations = this;

    // Cache elements (spec §16)
    this.ui = {
      slider:         this.section.querySelector('#ai-swiper-container'),
      wrapper:        this.section.querySelector('#ai-swiper-wrapper'),
      arrowPrev:      this.section.querySelector('#ai-arrow-prev'),
      arrowNext:      this.section.querySelector('#ai-arrow-next'),
      refreshBtn:     this.section.querySelector('#ai-refresh-trigger'),
      tabsContainer:  this.section.querySelector('#ai-tabs-container'),
      improveBtn:     this.section.querySelector('#ai-improve-profile-trigger'),
      retryBtn:       this.section.querySelector('.c-ai-recommendations__retry-btn'),
      
      // Insight Card Elements
      scoreLabel:     this.section.querySelector('#ai-match-score'),
      styleLabel:     this.section.querySelector('#ai-val-style'),
      metalLabel:     this.section.querySelector('#ai-val-metal'),
      stoneLabel:     this.section.querySelector('#ai-val-stone'),
      budgetLabel:    this.section.querySelector('#ai-val-budget'),
      occasionLabel:  this.section.querySelector('#ai-val-occasion'),

      // Explanatory Modals
      explainModal:   document.getElementById('ai-explain-modal-root'),
      explainBody:    document.getElementById('ai-explain-body'),
      explainClose:   document.getElementById('ai-explain-close'),
      explainOverlay: document.getElementById('ai-explain-overlay')
    };

    // State params
    this.swiperInstance = null;
    this.activeCategory = 'perfect';
    this._observer = null;
    this._listeners = [];
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  /**
   * Boot logic
   * @private
   */
  _init() {
    this._bindEvents();
    this.loadAndHydrate(this.activeCategory);
  }

  /**
   * Bind triggers
   * @private
   */
  _bindEvents() {
    // 1. Refresh action
    if (this.ui.refreshBtn) {
      const fn = (e) => {
        e.preventDefault();
        this._triggerRefresh();
      };
      this.ui.refreshBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.refreshBtn, type: 'click', fn });
    }

    // 2. Navigation category tabs selection
    if (this.ui.tabsContainer) {
      const fn = (e) => {
        const btn = e.target.closest('.c-ai-recommendations__tab-btn');
        if (!btn || btn.classList.contains('is-active')) return;

        // Reset navigation active state
        this.ui.tabsContainer.querySelectorAll('.c-ai-recommendations__tab-btn').forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const cat = btn.dataset.category;
        if (cat) {
          this.activeCategory = cat;
          this.loadAndHydrate(cat);
        }
      };
      this.ui.tabsContainer.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.tabsContainer, type: 'click', fn });
    }

    // 3. Dynamic card click delegates: Why, Dismiss (spec §16)
    if (this.ui.wrapper) {
      const fn = (e) => {
        const dismissBtn = e.target.closest('[data-rv-action="hide"]');
        const whyBtn = e.target.closest('[data-rv-action="why"]');

        if (dismissBtn) {
          e.preventDefault();
          const slide = dismissBtn.closest('.swiper-slide');
          this._dismissSlide(slide);
        } else if (whyBtn) {
          e.preventDefault();
          const productId = whyBtn.dataset.productId;
          this._openExplainModal(productId);
        }
      };
      this.ui.wrapper.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.wrapper, type: 'click', fn });
    }

    // 4. Explain modal close triggers
    if (this.ui.explainClose) {
      const fn = () => this._closeExplainModal();
      this.ui.explainClose.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.explainClose, type: 'click', fn });
    }
    if (this.ui.explainOverlay) {
      const fn = () => this._closeExplainModal();
      this.ui.explainOverlay.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.explainOverlay, type: 'click', fn });
    }

    // Escape keyboard modal dismiss
    const escFn = (e) => {
      if (e.key === 'Escape' && this.ui.explainModal && this.ui.explainModal.getAttribute('aria-hidden') === 'false') {
        this._closeExplainModal();
      }
    };
    document.addEventListener('keydown', escFn);
    this._listeners.push({ el: document, type: 'keydown', fn: escFn });

    // 5. Improvement style profiles
    if (this.ui.improveBtn) {
      const fn = () => {

        this._emitEvent('LustraAssistant:Trigger', { action: 'refine-style-profile' });
      };
      this.ui.improveBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.improveBtn, type: 'click', fn });
    }

    // 6. State Recovery Retry Button
    if (this.ui.retryBtn) {
      const fn = () => this.loadAndHydrate(this.activeCategory);
      this.ui.retryBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.retryBtn, type: 'click', fn });
    }
  }

  /**
   * Triggers recommendations refresh cycle
   * @private
   */
  _triggerRefresh() {
    this.loadAndHydrate(this.activeCategory);
  }

  /**
   * Populate slider layout
   * @param {string} category - perfect, wishlist, trending, luxury
   * @public
   */
  loadAndHydrate(category) {
    this._setState('loading');

    // Simulate API lookup latency (600ms)
    setTimeout(() => {
      if (!this.section) return;

      const products = RECOMMENDATIONS_DB[category];
      if (!products || products.length === 0) {
        this._setState('empty');
        return;
      }

      try {
        this._hydrateInsightCard(category);
        this._hydrateCarousel(products);
        this._setState('content');
        this._setupLazyCarouselInit();
      } catch (err) {
        console.error('[AiRecommendations] Hydration crash:', err);
        this._setState('error');
      }
    }, 600);
  }

  /**
   * Swaps values in Style DNA Frosted Card
   * @param {string} category
   * @private
   */
  _hydrateInsightCard(category) {
    const val = INSIGHTS_DB[category];
    if (!val) return;

    if (this.ui.scoreLabel) this.ui.scoreLabel.textContent = val.score;
    if (this.ui.styleLabel) this.ui.styleLabel.textContent = val.style;
    if (this.ui.metalLabel) this.ui.metalLabel.textContent = val.metal;
    if (this.ui.stoneLabel) this.ui.stoneLabel.textContent = val.stone;
    if (this.ui.budgetLabel) this.ui.budgetLabel.textContent = val.budget;
    if (this.ui.occasionLabel) this.ui.occasionLabel.textContent = val.occasion;

    // Trigger pulse GSAP animation on Style DNA values changes (spec §9)
    if (this.hasGsap && !this.prefersReducedMotion) {
      const targets = [this.ui.scoreLabel, this.ui.styleLabel, this.ui.metalLabel, this.ui.stoneLabel, this.ui.budgetLabel];
      window.gsap.fromTo(targets, 
        { opacity: 0.3, y: -2 }, 
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  /**
   * Build Swiper Slide nodes
   * @param {Array<Object>} products - List of product details json
   * @private
   */
  _hydrateCarousel(products) {
    if (!this.ui.wrapper) return;
    this.ui.wrapper.innerHTML = '';

    products.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      // 1. Prepend subtle AI Curation match text description
      if (item.aiReason) {
        const explainTag = document.createElement('span');
        explainTag.className = 'c-product-card__ai-explain';
        explainTag.textContent = item.aiReason;
        slide.appendChild(explainTag);
      }

      // 2. Build Card Node leveraging product card component factory
      const cardNode = ProductCard.render(item, 'default');
      
      // 3. Inject float overlays toolbar (Dismiss, Explain)
      const optionsBar = document.createElement('div');
      optionsBar.className = 'c-product-card__ai-options';
      optionsBar.innerHTML = `
        <button class="c-product-card__ai-options--btn" data-rv-action="why" data-product-id="${item.id}" aria-label="Why am I seeing this recommendation?" type="button">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
        <button class="c-product-card__ai-options--btn" data-rv-action="hide" aria-label="Dismiss this recommendation" type="button">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      cardNode.appendChild(optionsBar);

      slide.appendChild(cardNode);
      this.ui.wrapper.appendChild(slide);
    });
  }

  /**
   * Triggers card slide dismissal with GSAP scaling animations
   * @param {HTMLElement} slide - Swiper Slide element node
   * @private
   */
  _dismissSlide(slide) {
    if (!slide) return;

    const completeDismissal = () => {
      if (!this.swiperInstance) return;
      const index = Array.from(this.ui.wrapper.children).indexOf(slide);
      if (index > -1) {
        this.swiperInstance.removeSlide(index);
        this.swiperInstance.update();
      }

      // If no cards left in slide list, switch to empty state visual
      if (this.ui.wrapper.children.length === 0) {
        this._setState('empty');
      }
    };

    if (this.hasGsap && !this.prefersReducedMotion) {
      window.gsap.to(slide, {
        scale: 0.75,
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: completeDismissal
      });
    } else {
      completeDismissal();
    }
  }

  /**
   * Open the Explain Modal popup
   * @param {string} productId
   * @private
   */
  _openExplainModal(productId) {
    if (!this.ui.explainModal || !this.ui.explainBody) return;

    // Look up reason details
    const products = RECOMMENDATIONS_DB[this.activeCategory];
    const match = products.find(p => p.id === productId);
    const reasonText = match ? match.aiReason : 'Matches your active search parameters.';
    const score = match ? match.aiMatch : 95;

    this.ui.explainBody.innerHTML = `
      <p style="margin-bottom: 12px; font-weight: 500; color: var(--color-dark-charcoal);">
        Curated Match Score: <strong style="color: var(--color-primary-gold);">${score}%</strong>
      </p>
      <p style="color: var(--color-neutral-600);">
        "${reasonText}"
      </p>
      <p style="margin-top: 16px; font-size: 12px; color: var(--color-neutral-400); line-height: 1.4;">
        Our AI curates jewellery pieces by correlating metal types (Yellow Gold, Rose Gold, Platinum), gem cuts, and pricing tags from your wishlist, shopping cart, and recently viewed timeline. You can adjust your profile preferences anytime.
      </p>
    `;

    this.ui.explainModal.setAttribute('aria-hidden', 'false');
    
    // Focus close button for keyboard traps (WCAG 2.2 AA)
    if (this.ui.explainClose) {
      this.ui.explainClose.focus();
    }
  }

  /**
   * Close the explain dialog
   * @private
   */
  _closeExplainModal() {
    if (this.ui.explainModal) {
      this.ui.explainModal.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Toggle layout visual display state
   * @param {string} state - 'loading', 'empty', 'error', 'content'
   * @private
   */
  _setState(state) {
    this.section.setAttribute('data-ai-state', state);
  }

  /**
   * Viewport intersection observers
   * @private
   */
  _setupLazyCarouselInit() {
    if (!this.ui.slider) return;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._initSwiper();
          this._animateEntrance();
          this._observer.disconnect();
        }
      });
    }, { rootMargin: '100px' });

    this._observer.observe(this.ui.slider);
  }

  /**
   * Boot swiper instances
   * @private
   */
  _initSwiper() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true);
      this.swiperInstance = null;
    }

    this.swiperInstance = new Swiper(this.ui.slider, {
      speed: 600,
      slidesPerView: 3,
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
        992: { slidesPerView: 2,   spaceBetween: 20 },
        1200: { slidesPerView: 3,  spaceBetween: 24 }
      }
    });
  }

  /**
   * GSAP staggers entrance
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
   * Helper to dispatch custom events
   * @private
   */
  _emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      bubbles: true,
      detail,
    });
    this.section.dispatchEvent(event);
  }

  /**
   * Release resources
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
      delete this.section.__lustraAiRecommendations;
    }

    this._listeners = [];
    this.ui = null;
    this.section = null;
  }
}
