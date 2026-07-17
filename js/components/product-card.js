/**
 * ============================================================
 *  PRODUCT CARD — Lustra Reusable Component JavaScript
 *  File:     js/components/product-card.js
 *  Purpose:  Handles card interactions (wishlist, add-to-cart latency,
 *            quick view triggers), lazy-load image swap, GSAP
 *            micro-interactions (lift, zoom, reveals), and ES6
 *            dynamic factory rendering for all card layout variants.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 04_Component_Library (§4)
 * ============================================================
 */

'use strict';

/** Visual variants mapping */
export const CARD_VARIANTS = Object.freeze({
  DEFAULT:        'default',
  COMPACT:        'compact',
  FEATURED:       'featured',
  RECOMMENDATION: 'recommendation',
  WISHLIST:       'wishlist',
  RELATED:        'related',
  RECENT:         'recent',
  COLLECTION:     'collection',
  QUICKVIEW:      'quickview',
});

export default class ProductCard {

  /**
   * @param {HTMLElement} element - Root card wrapper (.c-product-card)
   */
  constructor(element) {
    if (!element) {
      throw new Error('[ProductCard] Initialization failed: Missing root element.');
    }

    if (element.__lustraProductCard) {
      return element.__lustraProductCard;
    }
    element.__lustraProductCard = this;

    /** Root element reference */
    this.element = element;

    /** Product ID extracted from DOM */
    this.productId = element.getAttribute('data-product-id') || 'unknown';

    /** Cached DOM selectors (spec §16) */
    this.ui = {
      wishlistBtn:  element.querySelector('.c-product-card__wishlist-btn'),
      removeBtn:    element.querySelector('.c-product-card__remove-btn'),
      ctaBtn:       element.querySelector('.c-product-card__cta'),
      quickBtn:     element.querySelectorAll('.c-product-card__quick-action-btn'),
      quickActions: element.querySelector('.c-product-card__quick-actions'),
      imgFront:     element.querySelector('.c-product-card__img--front'),
      imgBack:      element.querySelector('.c-product-card__img--back'),
      titleLink:    element.querySelector('.c-product-card__title-link'),
      badges:       element.querySelectorAll('.c-badge')
    };

    /** Animation state variables */
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Event handler pointers for cleanup */
    this._listeners = [];

    this._init();
  }

  /**
   * Initialize event handlers
   * @private
   */
  _init() {
    this._setupWishlistBtn();
    this._setupRemoveBtn();
    this._setupAddToCartBtn();
    this._setupQuickActions();
    this._setupHoverAnimations();
  }

  /**
   * Setup hover micro-interactions via GSAP if available
   * @private
   */
  _setupHoverAnimations() {
    if (!this.hasGsap || this.prefersReducedMotion) {
      return; // Fall back to CSS transitions defined in scss
    }

    const gsap = window.gsap;

    // Prepare initial styles for GSAP target layers
    if (this.ui.quickActions) {
      gsap.set(this.ui.quickActions, { opacity: 0, y: 12 });
    }
    if (this.ui.imgBack) {
      gsap.set(this.ui.imgBack, { opacity: 0, scale: 1.05 });
    }

    // Hover Enter timeline/tween
    const hoverEnter = () => {
      if (this.element.classList.contains('is-disabled') || this.element.classList.contains('is-skeleton')) return;

      gsap.to(this.element, {
        y: -6,
        borderColor: 'rgba(201, 169, 110, 0.45)', // gold outline glow tint
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (this.ui.imgFront) {
        gsap.to(this.ui.imgFront, {
          opacity: this.ui.imgBack ? 0 : 1,
          scale: 1.05,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.imgBack) {
        gsap.to(this.ui.imgBack, {
          opacity: 1,
          scale: 1.0,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.quickActions) {
        gsap.to(this.ui.quickActions, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.badges.length) {
        gsap.to(this.ui.badges, {
          y: -2,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    };

    // Hover Leave timeline/tween
    const hoverLeave = () => {
      if (this.element.classList.contains('is-disabled') || this.element.classList.contains('is-skeleton')) return;

      gsap.to(this.element, {
        y: 0,
        borderColor: 'rgba(233, 231, 226, 0.6)', // back to gray line
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (this.ui.imgFront) {
        gsap.to(this.ui.imgFront, {
          opacity: 1,
          scale: 1.0,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.imgBack) {
        gsap.to(this.ui.imgBack, {
          opacity: 0,
          scale: 1.05,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.quickActions) {
        gsap.to(this.ui.quickActions, {
          opacity: 0,
          y: 12,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      if (this.ui.badges.length) {
        gsap.to(this.ui.badges, {
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    };

    this.element.addEventListener('mouseenter', hoverEnter);
    this.element.addEventListener('mouseleave', hoverLeave);

    this._listeners.push({ el: this.element, type: 'mouseenter', fn: hoverEnter });
    this._listeners.push({ el: this.element, type: 'mouseleave', fn: hoverLeave });
  }

  /**
   * Wire wishlist heart button
   * @private
   */
  _setupWishlistBtn() {
    if (!this.ui.wishlistBtn) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const btn = this.ui.wishlistBtn;
      const isWishlisted = btn.classList.contains('is-active');

      btn.classList.add('is-saving');
      btn.setAttribute('aria-busy', 'true');

      // Simulate API latency (500ms)
      setTimeout(() => {
        if (!this.element) return; // Guard against destroyed instance
        
        btn.classList.remove('is-saving');
        btn.setAttribute('aria-busy', 'false');

        if (isWishlisted) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-pressed', 'false');
          this._emitEvent('LustraWishlist:Removed', { productId: this.productId });
        } else {
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');

          // Trigger GSAP pulse scale effect on saving success (spec §9)
          if (this.hasGsap && !this.prefersReducedMotion) {
            window.gsap.fromTo(btn, 
              { scale: 0.8 }, 
              { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
          }

          this._emitEvent('LustraWishlist:Added', { productId: this.productId });
        }
      }, 500);
    };

    this.ui.wishlistBtn.addEventListener('click', handler);
    this._listeners.push({ el: this.ui.wishlistBtn, type: 'click', fn: handler });
  }

  /**
   * Wire close button for wishlist variant
   * @private
   */
  _setupRemoveBtn() {
    if (!this.ui.removeBtn) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // GSAP fade removal trigger
      if (this.hasGsap && !this.prefersReducedMotion) {
        window.gsap.to(this.element, {
          opacity: 0,
          scale: 0.9,
          y: 10,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            this._emitEvent('LustraWishlist:Removed', { productId: this.productId });
          }
        });
      } else {
        this.element.style.opacity = '0.3';
        this.element.style.pointerEvents = 'none';
        this._emitEvent('LustraWishlist:Removed', { productId: this.productId });
      }
    };

    this.ui.removeBtn.addEventListener('click', handler);
    this._listeners.push({ el: this.ui.removeBtn, type: 'click', fn: handler });
  }

  /**
   * Wire primary Call to Action (Add to Jewellery Box)
   * @private
   */
  _setupAddToCartBtn() {
    if (!this.ui.ctaBtn) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const btn = this.ui.ctaBtn;

      // Add loading status spinner class
      btn.classList.add('is-adding');
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;

      // Simulate API latency adding item (800ms)
      setTimeout(() => {
        if (!this.element || !btn) return;
        
        btn.classList.remove('is-adding');
        btn.setAttribute('aria-busy', 'false');
        btn.disabled = false;

        this._emitEvent('LustraCart:Added', {
          productId: this.productId,
          productName: this.element.querySelector('.c-product-card__title-link')?.textContent.trim() || 'Product',
        });
      }, 800);
    };

    this.ui.ctaBtn.addEventListener('click', handler);
    this._listeners.push({ el: this.ui.ctaBtn, type: 'click', fn: handler });
  }

  /**
   * Quick Actions click tracking
   * @private
   */
  _setupQuickActions() {
    if (!this.ui.quickBtn.length) return;

    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const btn = e.currentTarget;
      const action = btn.dataset.action; // 'quickview' or 'compare' or 'share'

      if (action === 'quickview') {
        this._emitEvent('LustraQuickView:Open', { productId: this.productId });
      } else if (action === 'compare') {
        this._emitEvent('LustraCompare:Add', { productId: this.productId });
      } else if (action === 'share') {
        const shareData = {
          title: this.element.querySelector('.c-product-card__title-link')?.textContent.trim() || 'Lustra Piece',
          url: window.location.origin + `/product.html?id=${this.productId}`
        };
        if (navigator.share) {
          navigator.share(shareData).catch(() => {});
        } else {
          navigator.clipboard.writeText(shareData.url).then(() => {
            this._emitEvent('LustraToast:Open', {
              type: 'success',
              message: 'Copied link to clipboard.'
            });
          });
        }
      }
    };

    this.ui.quickBtn.forEach((btn) => {
      btn.addEventListener('click', handler);
      this._listeners.push({ el: btn, type: 'click', fn: handler });
    });
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
    this.element.dispatchEvent(event);
  }

  /**
   * Remove event listeners, destroy references.
   * @public
   */
  destroy() {
    this._listeners.forEach(({ el, type, fn }) => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(type, fn);
      }
    });

    if (this.element) {
      delete this.element.__lustraProductCard;
    }

    this.ui = null;
    this.element = null;
    this._listeners = [];
  }


  // ────────────────────────────────────────────────────────────
  //  DYNAMIC DOM FACTORY METHOD
  //  Generates complete premium card HTML blocks from JSON data.
  // ────────────────────────────────────────────────────────────

  /**
   * Factory constructor: Renders a product card element dynamically.
   * @param {Object} data - Product details JSON.
   * @param {string} variant - CARD_VARIANTS value.
   * @returns {HTMLElement} The constructed .c-product-card node.
   * @static
   */
  static render(data, variant = CARD_VARIANTS.DEFAULT) {
    const defaultData = {
      id:            'unknown',
      name:          'Fine Jewel Piece',
      collection:    'Lustra Atelier',
      subtitle:      'Exclusive handcrafted design.',
      metal:         '18K Gold',
      stone:         'Precious Gem',
      price:         0,
      originalPrice: 0,
      discount:      '',
      emi:           '',
      rating:        5.0,
      reviewCount:   0,
      imageUrl:      '',
      hoverImageUrl: '',
      labels:        [],
      aiMatch:       0,
      aiReason:      '',
      isWishlisted:  false,
      isOutOfStock:  false,
      isComingSoon:  false,
      isExclusive:   false,
    };

    // Hydrate parameters
    const p = Object.assign({}, defaultData, data);
    
    const card = document.createElement('article');
    card.className = `c-product-card ${variant !== 'default' ? 'c-product-card--' + variant : ''}`;
    card.setAttribute('data-product-id', p.id);
    card.setAttribute('data-variant', variant);
    card.setAttribute('role', 'article');
    card.setAttribute('aria-roledescription', 'product card');
    card.setAttribute('aria-label', `${p.name} in ${p.metal}`);

    if (p.isOutOfStock) card.classList.add('is-out-of-stock');
    if (p.isComingSoon) card.classList.add('is-coming-soon');

    // 1. Build Badges List HTML
    let badgesHtml = '';
    if (p.labels.length) {
      p.labels.forEach((label) => {
        const badgeClass = label.toLowerCase().replace(/\s+/g, '-');
        badgesHtml += `<span class="c-badge c-badge--${badgeClass}">${label}</span>`;
      });
    }

    // 2. Build Ratings Stars HTML
    let starsHtml = '';
    const ratingFloor = Math.floor(p.rating);
    for (let i = 1; i <= 5; i++) {
      starsHtml += `
        <svg class="c-product-card__star-icon ${i <= ratingFloor ? 'is-filled' : ''}" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      `;
    }

    // 3. Format Currency
    const formatCurrency = (val) => {
      return typeof val === 'number' && val > 0 
        ? '₹' + val.toLocaleString('en-IN') 
        : '';
    };

    // 4. Format EMI
    const emiHtml = p.emi ? `<div class="c-product-card__emi">${p.emi}</div>` : '';

    // 5. Build AI Curation Block
    const aiRecHtml = (variant === CARD_VARIANTS.RECOMMENDATION || p.aiMatch > 0)
      ? `
        <div class="c-product-card__ai-rec">
          <span class="c-product-card__ai-badge">${p.aiMatch}% Match</span>
          <span class="c-product-card__ai-desc">${p.aiReason || 'Matches your Style DNA'}</span>
        </div>
      ` : '';

    // 6. Primary CTA text depending on state
    let ctaText = 'Add to Jewellery Box';
    if (p.isOutOfStock) ctaText = 'Sold Out';
    else if (p.isComingSoon) ctaText = 'Coming Soon';

    // Assemble components HTML structure
    card.innerHTML = `
      <header class="c-product-card__header">
        <div class="c-product-card__badges" role="group" aria-label="Product tags">
          ${badgesHtml}
        </div>
        ${
          variant === CARD_VARIANTS.WISHLIST 
            ? `
              <button class="c-product-card__remove-btn" aria-label="Remove ${p.name} from wishlist" type="button">
                <svg class="c-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 18l12-12"/>
                </svg>
              </button>
            `
            : `
              <button
                class="c-product-card__wishlist-btn ${p.isWishlisted ? 'is-active' : ''}"
                id="wishlist-btn-${p.id}"
                aria-label="Save ${p.name} to wishlist"
                aria-pressed="${p.isWishlisted ? 'true' : 'false'}"
                type="button"
              >
                <svg class="c-product-card__wishlist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                <span class="c-product-card__wishlist-spinner" aria-hidden="true"></span>
              </button>
            `
        }
      </header>

      <div class="c-product-card__media">
        <a href="product.html?id=${p.id}" class="c-product-card__image-link" tabindex="-1" aria-hidden="true">
          <div class="c-product-card__image-wrap">
            <img
              src="${p.imageUrl}"
              alt="${p.name} - Front View"
              class="c-product-card__img c-product-card__img--front"
              loading="lazy"
              width="300"
              height="400"
            >
            ${
              p.hoverImageUrl
                ? `<img
                    src="${p.hoverImageUrl}"
                    alt="${p.name} - Alternate View"
                    class="c-product-card__img c-product-card__img--back"
                    loading="lazy"
                    width="300"
                    height="400"
                  >`
                : ''
            }
          </div>
        </a>

        <div class="c-product-card__quick-actions">
          <button class="c-product-card__quick-action-btn" aria-label="Quick View ${p.name}" data-action="quickview" type="button">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Quick View</span>
          </button>
          <button class="c-product-card__quick-action-btn" aria-label="Compare ${p.name}" data-action="compare" type="button">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l17 17"/>
            </svg>
            <span>Compare</span>
          </button>
        </div>
      </div>

      <div class="c-product-card__details">
        <div class="c-product-card__collection">${p.collection}</div>
        
        <h3 class="c-product-card__title">
          <a href="product.html?id=${p.id}" class="c-product-card__title-link">
            ${p.name}
          </a>
        </h3>

        ${variant !== CARD_VARIANTS.COMPACT && variant !== CARD_VARIANTS.RECENT ? `<p class="c-product-card__subtitle">${p.subtitle}</p>` : ''}

        ${
          variant !== CARD_VARIANTS.COMPACT && variant !== CARD_VARIANTS.RECENT
            ? `
              <div class="c-product-card__specs">
                <span class="c-product-card__spec-item">${p.metal}</span>
                <span class="c-product-card__spec-divider" aria-hidden="true">•</span>
                <span class="c-product-card__spec-item">${p.stone}</span>
              </div>
            `
            : ''
        }

        ${
          variant !== CARD_VARIANTS.RECENT
            ? `
              <div class="c-product-card__rating" aria-label="Rating: ${p.rating} stars out of ${p.reviewCount} reviews">
                <div class="c-product-card__stars" aria-hidden="true">
                  ${starsHtml}
                </div>
                <span class="c-product-card__rating-text" aria-hidden="true">(${p.reviewCount})</span>
              </div>
            `
            : ''
        }

        ${aiRecHtml}

        <div class="c-product-card__price-group">
          <span class="c-product-card__price c-product-card__price--current">${formatCurrency(p.price)}</span>
          ${
            p.originalPrice > p.price
              ? `
                <span class="c-product-card__price c-product-card__price--original">${formatCurrency(p.originalPrice)}</span>
                <span class="c-product-card__discount" aria-label="${p.discount} discount">${p.discount}</span>
              `
              : ''
          }
        </div>
        
        ${variant !== CARD_VARIANTS.COMPACT && variant !== CARD_VARIANTS.RECENT ? emiHtml : ''}
      </div>

      ${
        variant !== CARD_VARIANTS.RECENT
          ? `
            <footer class="c-product-card__footer">
              <button
                class="btn btn--primary c-product-card__cta"
                id="add-to-box-${p.id}"
                aria-label="Add ${p.name} to Jewellery Box"
                type="button"
                ${p.isOutOfStock || p.isComingSoon ? 'disabled' : ''}
              >
                <span class="c-product-card__cta-text">${ctaText}</span>
                <span class="c-product-card__cta-spinner" aria-hidden="true"></span>
              </button>
            </footer>
          `
          : ''
      }
    `;

    // Instantiate class immediately on dynamic elements
    new ProductCard(card);

    return card;
  }

}
