/**
 * ============================================================
 *  PRODUCT DETAIL PAGE (PDP) — Lustra Fine Jewellery Platform
 *  File:     js/pages/product-detail.js
 *  Purpose:  Full PDP controller. Manages gallery, variants,
 *            quantity, delivery checker, tabs, reviews,
 *            Q&A accordion, bundle, similar products carousel,
 *            share, sticky bar, newsletter, and GSAP animations.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines
 * ============================================================
 */

'use strict';

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

/** Product data — in production this would be fetched from an API */
const PRODUCT_DATA = {
  id: 'LST-RING-001',
  name: 'Aura Solitaire Ring',
  basePrice: 145000,
  originalPrice: 175000,
  discount: 17,
  images: [
    'assets/images/products/aura-ring-1.webp',
    'assets/images/products/aura-ring-2.webp',
    'assets/images/products/aura-ring-3.webp',
    'assets/images/products/aura-ring-4.webp',
  ],
  variants: {
    metal: {
      'yellow-gold': { priceAdjust: 0, label: '18K Yellow Gold' },
      'rose-gold':   { priceAdjust: -5000, label: '18K Rose Gold' },
      'white-gold':  { priceAdjust: 0, label: '18K White Gold' },
      'platinum':    { priceAdjust: 25000, label: 'Platinum 950' },
    },
    diamond: {
      '0.50ct': { priceAdjust: -45000, label: '0.50ct Round Cut' },
      '0.75ct': { priceAdjust: 0, label: '0.75ct Round Cut' },
      '1.00ct': { priceAdjust: 55000, label: '1.00ct Round Cut' },
      '1.50ct': { priceAdjust: 135000, label: '1.50ct Round Cut' },
    },
  },
};

/** GSAP animation config */
const GSAP_CONFIG = {
  DURATION: 0.6,
  STAGGER: 0.1,
  EASE: 'power3.out',
};

/** Simulated PIN codes for delivery lookup */
const DELIVERABLE_PINS = ['400001', '110001', '560001', '500001', '700001', '600001'];


// ─────────────────────────────────────────────────────────────
//  UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Format Indian Rupee currency */
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

/** Debounce helper */
function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/** Safe querySelector with null guard */
function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/** Safe querySelectorAll */
function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}


// ─────────────────────────────────────────────────────────────
//  CLASS: GalleryController
// ─────────────────────────────────────────────────────────────

class GalleryController {
  constructor() {
    this.root       = qs('.c-pdp-gallery');
    this.mainImg    = qs('#pdp-main-img');
    this.thumbs     = qsa('.c-pdp-gallery__thumb');
    this.lightbox   = qs('#pdp-lightbox');
    this.lbImg      = qs('#pdp-lightbox-img');
    this.lbCounter  = qs('#pdp-lightbox-counter');
    this.currentIdx = 0;
    this.images     = PRODUCT_DATA.images;

    if (!this.root) return;
    this._bindEvents();
  }

  _bindEvents() {
    // Thumbnail clicks
    this.thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => this._switchImage(idx));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._switchImage(idx);
        }
      });
    });

    // Media type tabs
    qsa('.c-pdp-gallery__media-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        qsa('.c-pdp-gallery__media-tab').forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
      });
    });

    // Lightbox open
    const expandBtn = qs('#pdp-gallery-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => this._openLightbox(this.currentIdx));
    }

    // Main image click to open lightbox
    const imgWrap = qs('#pdp-main-img-wrap');
    if (imgWrap) {
      imgWrap.addEventListener('click', () => this._openLightbox(this.currentIdx));
    }

    // Lightbox close
    const lbClose = qs('#pdp-lightbox-close');
    if (lbClose) lbClose.addEventListener('click', () => this._closeLightbox());

    const lbOverlay = qs('#pdp-lightbox-overlay');
    if (lbOverlay) lbOverlay.addEventListener('click', () => this._closeLightbox());

    // Lightbox navigation
    const lbPrev = qs('#pdp-lightbox-prev');
    const lbNext = qs('#pdp-lightbox-next');
    if (lbPrev) lbPrev.addEventListener('click', () => this._navigateLightbox(-1));
    if (lbNext) lbNext.addEventListener('click', () => this._navigateLightbox(1));

    // Keyboard navigation in lightbox
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || this.lightbox.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape') this._closeLightbox();
      if (e.key === 'ArrowLeft') this._navigateLightbox(-1);
      if (e.key === 'ArrowRight') this._navigateLightbox(1);
    });
  }

  _switchImage(idx) {
    if (idx < 0 || idx >= this.images.length) return;
    this.currentIdx = idx;

    // Update main image
    if (this.mainImg) {
      this.mainImg.src = this.images[idx];
      this.mainImg.classList.add('is-active');
    }

    // Update thumbnail active state
    this.thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === idx);
    });
  }

  _openLightbox(idx) {
    if (!this.lightbox) return;
    this.currentIdx = idx;
    this._updateLightboxImage(idx);
    this.lightbox.classList.add('is-open');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    qs('#pdp-lightbox-close')?.focus();
  }

  _closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('is-open');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  _navigateLightbox(direction) {
    this.currentIdx = (this.currentIdx + direction + this.images.length) % this.images.length;
    this._updateLightboxImage(this.currentIdx);
  }

  _updateLightboxImage(idx) {
    if (this.lbImg) this.lbImg.src = this.images[idx] || '';
    if (this.lbCounter) this.lbCounter.textContent = `${idx + 1} / ${this.images.length}`;
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: VariantController
// ─────────────────────────────────────────────────────────────

class VariantController {
  constructor() {
    this.currentMetal   = 'yellow-gold';
    this.currentDiamond = '0.75ct';

    this.priceEl     = qs('#pdp-price-current');
    this.metalLabel  = qs('#pdp-metal-selected');
    this.diamondLabel = qs('#pdp-stone-selected');
    this.stickyPrice = qs('#pdp-sticky-price');

    this._bindEvents();
  }

  _bindEvents() {
    // Metal radio buttons
    qsa('input[name="metal"]').forEach(input => {
      input.addEventListener('change', () => {
        this.currentMetal = input.value;
        const info = PRODUCT_DATA.variants.metal[this.currentMetal];
        if (this.metalLabel && info) this.metalLabel.textContent = info.label;
        this._updatePrice();
      });
    });

    // Diamond radio buttons
    qsa('input[name="diamond"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.currentDiamond = e.target.value;
        const info = PRODUCT_DATA.variants.diamond[this.currentDiamond];
        if (this.diamondLabel && info) this.diamondLabel.textContent = info.label;

        // Update chip visual state
        qsa('.c-pdp-chip-selector').forEach(chip => {
          chip.classList.toggle('is-active', chip.querySelector('input')?.value === this.currentDiamond);
        });

        this._updatePrice();
      });
    });

    // Size selection
    const sizeSelect = qs('#pdp-ring-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', () => {
        const sizeLabel = qs('#pdp-size-selected');
        if (sizeLabel) sizeLabel.textContent = `Size ${sizeSelect.value}`;
      });
    }
  }

  _updatePrice() {
    const metalAdjust   = PRODUCT_DATA.variants.metal[this.currentMetal]?.priceAdjust || 0;
    const diamondAdjust = PRODUCT_DATA.variants.diamond[this.currentDiamond]?.priceAdjust || 0;
    const newPrice      = PRODUCT_DATA.basePrice + metalAdjust + diamondAdjust;

    if (this.priceEl) {
      this.priceEl.textContent = formatINR(newPrice);
      // Animate price update
      this.priceEl.classList.add('is-updating');
      setTimeout(() => this.priceEl.classList.remove('is-updating'), 400);
    }

    if (this.stickyPrice) {
      this.stickyPrice.textContent = formatINR(newPrice);
    }
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: QuantityController
// ─────────────────────────────────────────────────────────────

class QuantityController {
  constructor() {
    this.input   = qs('#pdp-quantity-input');
    this.decBtn  = qs('#pdp-qty-decrement');
    this.incBtn  = qs('#pdp-qty-increment');
    this.min     = 1;
    this.max     = 5;

    if (!this.input) return;
    this._bindEvents();
    this._updateButtonStates();
  }

  _bindEvents() {
    this.decBtn?.addEventListener('click', () => this._adjust(-1));
    this.incBtn?.addEventListener('click', () => this._adjust(1));
  }

  _adjust(delta) {
    const current = parseInt(this.input.value, 10) || 1;
    const next    = Math.min(this.max, Math.max(this.min, current + delta));
    this.input.value = next;
    this._updateButtonStates();
  }

  _updateButtonStates() {
    const current = parseInt(this.input.value, 10);
    if (this.decBtn) this.decBtn.disabled = current <= this.min;
    if (this.incBtn) this.incBtn.disabled = current >= this.max;
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: DeliveryChecker
// ─────────────────────────────────────────────────────────────

class DeliveryChecker {
  constructor() {
    this.pinInput  = qs('#pdp-pin-input');
    this.checkBtn  = qs('#pdp-pin-check-btn');
    this.resultEl  = qs('#pdp-pin-result');

    if (!this.pinInput) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.checkBtn?.addEventListener('click', () => this._check());
    this.pinInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._check();
    });
    // Only allow numeric input
    this.pinInput?.addEventListener('input', () => {
      this.pinInput.value = this.pinInput.value.replace(/\D/g, '');
    });
  }

  _check() {
    const pin = this.pinInput?.value?.trim();
    if (!pin || pin.length !== 6) {
      this._showResult('Please enter a valid 6-digit PIN code.', 'error');
      return;
    }

    this._showResult('Checking availability…', '');
    this.checkBtn.disabled = true;

    // Simulate async lookup
    setTimeout(() => {
      this.checkBtn.disabled = false;
      if (DELIVERABLE_PINS.includes(pin)) {
        const days = Math.floor(Math.random() * 2) + 3;
        this._showResult(`✓ Delivery available. Estimated arrival: ${days}–${days + 1} business days. Free insured shipping included.`, 'success');
      } else {
        this._showResult('✗ Delivery to this PIN is not currently available. Contact our concierge for assistance.', 'error');
      }
    }, 1000);
  }

  _showResult(msg, type) {
    if (!this.resultEl) return;
    this.resultEl.textContent = msg;
    this.resultEl.className = 'c-pdp-delivery__pin-result';
    if (type) this.resultEl.classList.add(`is-${type}`);
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: TabController (Detail Tabs)
// ─────────────────────────────────────────────────────────────

class TabController {
  constructor(rootSelector, tabSelector, panelSelector) {
    this.root      = qs(rootSelector);
    this.tabs      = qsa(tabSelector, this.root);
    this.panels    = qsa(panelSelector, this.root);

    if (!this.root || !this.tabs.length) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('aria-controls');
        this._activate(tab, target);
      });

      tab.addEventListener('keydown', (e) => {
        const idx  = this.tabs.indexOf(tab);
        let newIdx = idx;
        if (e.key === 'ArrowRight') newIdx = (idx + 1) % this.tabs.length;
        if (e.key === 'ArrowLeft')  newIdx = (idx - 1 + this.tabs.length) % this.tabs.length;
        if (e.key === 'Home')       newIdx = 0;
        if (e.key === 'End')        newIdx = this.tabs.length - 1;
        if (newIdx !== idx) {
          e.preventDefault();
          this.tabs[newIdx].click();
          this.tabs[newIdx].focus();
        }
      });
    });
  }

  _activate(activeTab, targetId) {
    this.tabs.forEach(tab => {
      const isActive = tab === activeTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.panels.forEach(panel => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('is-active', isTarget);
      panel.setAttribute('aria-hidden', isTarget ? 'false' : 'true');
    });
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: ReviewController
// ─────────────────────────────────────────────────────────────

class ReviewController {
  constructor() {
    this.filterBtns    = qsa('.c-pdp-reviews__filter-btn');
    this.sortSelect    = qs('#pdp-reviews-sort');
    this.loadMoreBtn   = qs('#pdp-reviews-load-more');

    this._bindEvents();
  }

  _bindEvents() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // In production: re-fetch/filter reviews
      });
    });

    this.sortSelect?.addEventListener('change', () => {
      // In production: re-sort/re-fetch reviews
    });

    this.loadMoreBtn?.addEventListener('click', () => {
      this.loadMoreBtn.classList.add('is-loading');
      setTimeout(() => {
        this.loadMoreBtn.classList.remove('is-loading');
        // In production: fetch more reviews and inject
      }, 1500);
    });
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: QAController
// ─────────────────────────────────────────────────────────────

class QAController {
  constructor() {
    this.triggers = qsa('.c-pdp-qa__trigger');
    this.form     = qs('#pdp-ask-form');

    this._bindAccordion();
    this._bindForm();
  }

  _bindAccordion() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId  = trigger.getAttribute('aria-controls');
        const panel    = qs(`#${panelId}`);

        // Close all
        this.triggers.forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          const p = qs(`#${t.getAttribute('aria-controls')}`);
          if (p) p.setAttribute('aria-hidden', 'true');
        });

        // Toggle target
        if (!expanded) {
          trigger.setAttribute('aria-expanded', 'true');
          if (panel) panel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  _bindForm() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = qs('#pdp-qa-submit');
      if (submitBtn) {
        submitBtn.textContent = '✓ Question submitted!';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = 'Submit Question';
          submitBtn.disabled = false;
          this.form.reset();
        }, 3000);
      }
    });
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: BundleController
// ─────────────────────────────────────────────────────────────

class BundleController {
  constructor() {
    this.checkboxes  = qsa('.c-pdp-bundle__product-checkbox');
    this.totalEl     = qs('#pdp-bundle-total');
    this.savingsEl   = qs('#pdp-bundle-savings');
    this.addBtn      = qs('#pdp-bundle-add-btn');
    this.prices      = { 'bundle-item-2': 89000, 'bundle-item-3': 112000 };
    this.mainPrice   = PRODUCT_DATA.basePrice;

    if (!this.checkboxes.length) return;
    this._bindEvents();
    this._updateTotal();
  }

  _bindEvents() {
    this.checkboxes.forEach(cb => {
      cb.addEventListener('change', () => this._updateTotal());
    });

    this.addBtn?.addEventListener('click', () => {
      const origText = this.addBtn.textContent;
      this.addBtn.textContent = '✓ Added to Cart';
      this.addBtn.disabled = true;
      setTimeout(() => {
        this.addBtn.textContent = origText;
        this.addBtn.disabled = false;
      }, 2000);
    });
  }

  _updateTotal() {
    let total = this.mainPrice;
    this.checkboxes.forEach(cb => {
      if (cb.checked && this.prices[cb.id]) {
        total += this.prices[cb.id];
      }
    });

    const savings = Math.round(total * 0.05);
    if (this.totalEl) this.totalEl.textContent = formatINR(total - savings);
    if (this.savingsEl) this.savingsEl.textContent = `Save ${formatINR(savings)} (5%)`;
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: StickyBarController
// ─────────────────────────────────────────────────────────────

class StickyBarController {
  constructor() {
    this.bar         = qs('#pdp-sticky-bar');
    this.actionPanel = qs('#pdp-purchase-actions');
    this.threshold   = 400;

    if (!this.bar) return;
    this._bindScroll();
  }

  _bindScroll() {
    const onScroll = debounce(() => {
      if (!this.actionPanel) {
        this._show(window.scrollY > this.threshold);
        return;
      }
      const rect = this.actionPanel.getBoundingClientRect();
      const isBelow = rect.bottom < 0;
      this._show(isBelow);
    }, 50);

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  _show(visible) {
    if (!this.bar) return;
    this.bar.classList.toggle('is-visible', visible);
    this.bar.setAttribute('aria-hidden', !visible ? 'true' : 'false');
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: ShareController
// ─────────────────────────────────────────────────────────────

class ShareController {
  constructor() {
    this.shareBtn  = qs('#pdp-share-btn');
    this.dropdown  = qs('#pdp-share-dropdown');
    this.items     = qsa('.c-pdp-share-dropdown__item');

    if (!this.shareBtn) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.dropdown?.classList.contains('is-open');
      this._toggleDropdown(!isOpen);
    });

    this.items.forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.share;
        this._share(type);
        this._toggleDropdown(false);
      });
    });

    document.addEventListener('click', () => this._toggleDropdown(false));
  }

  _toggleDropdown(open) {
    if (!this.dropdown) return;
    this.dropdown.classList.toggle('is-open', open);
    this.dropdown.setAttribute('aria-hidden', !open ? 'true' : 'false');
  }

  _share(type) {
    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Aura Solitaire Ring by Lustra');

    const actions = {
      link:      () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          this.shareBtn.title = 'Link copied!';
          setTimeout(() => { this.shareBtn.title = ''; }, 2000);
        });
      },
      whatsapp:  () => window.open(`https://wa.me/?text=${title}%20${url}`, '_blank'),
      email:     () => window.open(`mailto:?subject=${title}&body=Check%20this%20out:%20${url}`, '_blank'),
    };

    actions[type]?.();
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: SimilarProductsCarousel
// ─────────────────────────────────────────────────────────────

class SimilarProductsCarousel {
  constructor() {
    this.swiperEl = qs('#pdp-similar-swiper');
    if (!this.swiperEl) return;
    this._init();
  }

  _init() {
    const Swiper = window.Swiper;
    if (!Swiper) return;

    this.swiper = new Swiper('#pdp-similar-swiper', {
      slidesPerView: 1.3,
      spaceBetween: 16,
      grabCursor: true,
      scrollbar: {
        el: '.c-pdp-similar__scrollbar',
        draggable: true,
      },
      navigation: {
        prevEl: '#similar-arrow-prev',
        nextEl: '#similar-arrow-next',
      },
      a11y: {
        prevSlideMessage: 'Previous similar product',
        nextSlideMessage: 'Next similar product',
      },
      breakpoints: {
        576:  { slidesPerView: 2.2, spaceBetween: 20 },
        992:  { slidesPerView: 3.2, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 },
      },
    });
  }

  destroy() {
    this.swiper?.destroy?.(true, true);
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: NewsletterController
// ─────────────────────────────────────────────────────────────

class NewsletterController {
  constructor() {
    this.form      = qs('#pdp-newsletter-form');
    this.input     = qs('#pdp-newsletter-email');
    this.submitBtn = qs('#pdp-newsletter-submit');
    this.successEl = qs('#pdp-newsletter-success');

    if (!this.form) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = this.input?.value?.trim();
      if (!email || !email.includes('@')) {
        this.input?.classList.add('is-error');
        return;
      }
      this.input?.classList.remove('is-error');
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Joining…';

      setTimeout(() => {
        this.successEl?.setAttribute('aria-hidden', 'false');
        this.form.style.display = 'none';
      }, 1000);
    });
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: AddToCartController
// ─────────────────────────────────────────────────────────────

class AddToCartController {
  constructor() {
    this.cartBtn       = qs('#pdp-add-to-cart-btn');
    this.buyNowBtn     = qs('#pdp-buy-now-btn');
    this.stickyCartBtn = qs('#pdp-sticky-cart-btn');
    this.wishlistBtn   = qs('#pdp-wishlist-btn');
    this.galleryWLBtn  = qs('#pdp-gallery-wishlist');
    this.stickyWLBtn   = qs('#pdp-sticky-wishlist');

    this._bindEvents();
  }

  _bindEvents() {
    this.cartBtn?.addEventListener('click', () => this._addToCart());
    this.stickyCartBtn?.addEventListener('click', () => this._addToCart());
    this.buyNowBtn?.addEventListener('click', () => this._buyNow());

    [this.wishlistBtn, this.galleryWLBtn, this.stickyWLBtn].forEach(btn => {
      btn?.addEventListener('click', () => this._toggleWishlist(btn));
    });
  }

  _addToCart() {
    const btn = this.cartBtn;
    if (!btn || btn.disabled) return;

    const sizeSelect = qs('#pdp-ring-size');
    if (sizeSelect && !sizeSelect.value) {
      sizeSelect.focus();
      sizeSelect.classList.add('is-error');
      setTimeout(() => sizeSelect.classList.remove('is-error'), 2000);
      return;
    }

    btn.classList.add('is-loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('is-loading');
      btn.disabled = false;
      const span = btn.querySelector('.c-pdp-actions__cta-text') || btn;
      const originalText = span.textContent;
      btn.querySelector('span:first-child')?.setAttribute('data-original', originalText);
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Added to Box';
      setTimeout(() => {
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg> Add to Jewellery Box <span class="c-pdp-actions__btn-spinner" aria-hidden="true"></span>';
      }, 2500);

      // Dispatch cart event for global cart drawer
      window.dispatchEvent(new CustomEvent('lustra:cart:add', {
        detail: { productId: PRODUCT_DATA.id }
      }));
    }, 1200);
  }

  _buyNow() {
    const sizeSelect = qs('#pdp-ring-size');
    if (sizeSelect && !sizeSelect.value) {
      sizeSelect.focus();
      return;
    }
    window.location.href = '../checkout.html';
  }

  _toggleWishlist(btn) {
    if (!btn) return;
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', (!pressed).toString());

    // Sync all wishlist buttons on page
    [this.wishlistBtn, this.galleryWLBtn, this.stickyWLBtn].forEach(b => {
      b?.setAttribute('aria-pressed', (!pressed).toString());
    });

    // Persist to localStorage
    const wishlist = JSON.parse(localStorage.getItem('lustra_wishlist') || '[]');
    const id = PRODUCT_DATA.id;
    if (!pressed) {
      if (!wishlist.includes(id)) wishlist.push(id);
    } else {
      const idx = wishlist.indexOf(id);
      if (idx > -1) wishlist.splice(idx, 1);
    }
    localStorage.setItem('lustra_wishlist', JSON.stringify(wishlist));
  }
}


// ─────────────────────────────────────────────────────────────
//  CLASS: AnimationsController (GSAP)
// ─────────────────────────────────────────────────────────────

class AnimationsController {
  constructor() {
    this.gsap = window.gsap;
    if (!this.gsap) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    this._runEntranceAnimations();
    this._initScrollReveal();
  }

  _runEntranceAnimations() {
    const { gsap } = this;

    // Gallery entrance
    gsap.from('.c-pdp__gallery-col', {
      opacity: 0,
      x: -40,
      duration: GSAP_CONFIG.DURATION,
      ease: GSAP_CONFIG.EASE,
    });

    // Info panel entrance (staggered children)
    gsap.from('.c-pdp-info > *', {
      opacity: 0,
      y: 24,
      duration: GSAP_CONFIG.DURATION,
      stagger: GSAP_CONFIG.STAGGER,
      ease: GSAP_CONFIG.EASE,
      delay: 0.2,
    });
  }

  _initScrollReveal() {
    const { gsap } = this;
    const sections = qsa('.c-pdp-detail-tabs, .c-pdp-reviews, .c-pdp-qa, .c-pdp-bundle, .c-pdp-similar, .c-pdp-newsletter');

    if (!gsap.from) return;

    sections.forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
        },
      });
    });
  }
}


// ─────────────────────────────────────────────────────────────
//  MAIN CONTROLLER — ProductDetailController
// ─────────────────────────────────────────────────────────────

export default class ProductDetailController {
  constructor() {
    this.init();
  }

  init() {
    // Gallery
    this.gallery = new GalleryController();

    // Variants (metal, stone, size)
    this.variants = new VariantController();

    // Quantity stepper
    this.quantity = new QuantityController();

    // Delivery PIN checker
    this.delivery = new DeliveryChecker();

    // Detail tabs (Description, Specs, Care, Certs)
    this.detailTabs = new TabController(
      '#pdp-detail-tabs-section',
      '.c-pdp-detail-tabs__tab',
      '.c-pdp-detail-tabs__panel'
    );

    // Reviews
    this.reviews = new ReviewController();

    // Q&A accordion + form
    this.qa = new QAController();

    // Bundle controller
    this.bundle = new BundleController();

    // Sticky bar
    this.stickyBar = new StickyBarController();

    // Share dropdown
    this.share = new ShareController();

    // Similar products carousel
    this.similarCarousel = new SimilarProductsCarousel();

    // Newsletter
    this.newsletter = new NewsletterController();

    // Cart / Wishlist actions
    this.cart = new AddToCartController();

    // GSAP animations
    this.animations = new AnimationsController();

    // Restore wishlist state from localStorage
    this._restoreWishlist();
  }

  _restoreWishlist() {
    try {
      const wishlist = JSON.parse(localStorage.getItem('lustra_wishlist') || '[]');
      if (wishlist.includes(PRODUCT_DATA.id)) {
        [
          qs('#pdp-wishlist-btn'),
          qs('#pdp-gallery-wishlist'),
          qs('#pdp-sticky-wishlist')
        ].forEach(btn => btn?.setAttribute('aria-pressed', 'true'));
      }
    } catch (e) {
      // localStorage unavailable
    }
  }

  destroy() {
    this.similarCarousel?.destroy?.();
  }
}
