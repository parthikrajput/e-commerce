/**
 * ============================================================
 *  PLP PRODUCT GRID — Lustra Fine Jewellery Platform
 *  File:     js/sections/shop/plp-product-grid.js
 *  Purpose:  Grid state management, view modes, product count,
 *            filter chip rendering, GSAP stagger reveal,
 *            IntersectionObserver, infinite-scroll architecture,
 *            Swiper recommendation carousel, event cleanup.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 06_Grid_System
 *  Author:   Lustra Frontend Team
 *  Prompt:   23 — PLP Product Grid Layout
 * ============================================================
 */

'use strict';

import ProductCard from '../../components/product-card.js';

// ──────────────────────────────────────────────────────────────
//  CONSTANTS & CONFIGURATION
// ──────────────────────────────────────────────────────────────

/** Valid grid states — drives CSS visibility via data attribute */
const GRID_STATES = Object.freeze({
  DEFAULT: 'default',
  LOADING: 'loading',
  EMPTY:   'empty',
  ERROR:   'error',
  OFFLINE: 'offline',
});

/** View mode identifiers */
const VIEW_MODES = Object.freeze({
  GRID:    'grid',
  COMPACT: 'compact',
  LIST:    'list',
});

/** GSAP stagger configuration (per spec §9 — power3.out, 0.5s) */
const GSAP_CONFIG = Object.freeze({
  DURATION:  0.55,
  STAGGER:   0.07,
  Y_OFFSET:  28,
  EASE:      'power3.out',
});

/** IntersectionObserver rootMargin — pre-load 200px before viewport */
const IO_ROOT_MARGIN = '0px 0px 200px 0px';

/** Recommendation Swiper config */
const REC_SWIPER_CONFIG = {
  spaceBetween:    20,
  slidesPerView:   4.3,
  freeMode:        true,
  grabCursor:      true,
  navigation: {
    prevEl: '#plp-rec-prev',
    nextEl: '#plp-rec-next',
  },
  a11y: {
    prevSlideMessage: 'Previous recommendation',
    nextSlideMessage: 'Next recommendation',
  },
  breakpoints: {
    0:    { slidesPerView: 1.3, spaceBetween: 12 },
    576:  { slidesPerView: 2.2, spaceBetween: 16 },
    992:  { slidesPerView: 3.3, spaceBetween: 18 },
    1200: { slidesPerView: 4.3, spaceBetween: 20 },
  },
};


// ──────────────────────────────────────────────────────────────
//  UTILITY: DEBOUNCE (spec §16 — performance optimisation)
// ──────────────────────────────────────────────────────────────

/**
 * Debounces a function to prevent excessive calls on scroll/resize.
 * @param {Function} func - Target function to debounce.
 * @param {number} wait   - Delay in milliseconds.
 * @returns {Function}
 */
function debounce(func, wait = 100) {
  let timeout;
  return function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


// ──────────────────────────────────────────────────────────────
//  CLASS: PlpProductGrid
//  Self-contained ES6 class per spec §16 JavaScript Architecture
// ──────────────────────────────────────────────────────────────

export default class PlpProductGrid {

  /**
   * @param {HTMLElement} element - Root .c-plp-grid section element
   */
  constructor(element) {
    if (!element) {
      throw new Error('[PlpProductGrid] Initialization failed: Missing root element (.c-plp-grid).');
    }
    if (element.__lustraProductGrid) {
      return element.__lustraProductGrid;
    }
    element.__lustraProductGrid = this;

    /** Root element reference */
    this.element = element;

    /** Cached DOM references (spec §16 — capture in constructor) */
    this.ui = {
      // Grid header
      header:          element.querySelector('#plp-grid-header'),
      countRange:      element.querySelector('#plp-count-range'),
      countTotal:      element.querySelector('#plp-count-total'),
      filterChips:     element.querySelector('#plp-filter-chips'),
      sortDisplayVal:  element.querySelector('#plp-sort-display-value'),
      viewBtns:        element.querySelectorAll('.c-plp-grid__view-btn'),
      refreshBtn:      element.querySelector('#plp-refresh-btn'),

      // Grid canvas and states
      gridCanvas:      element.querySelector('#plp-grid-canvas'),
      skeletonCanvas:  element.querySelector('#plp-skeleton-canvas'),
      emptyState:      element.querySelector('#plp-empty-state'),
      errorState:      element.querySelector('#plp-error-state'),
      offlineState:    element.querySelector('#plp-offline-state'),

      // Card slots
      cardSlots:       element.querySelectorAll('.c-plp-grid__card-slot'),

      // Empty state CTAs
      emptyResetBtn:   element.querySelector('#plp-empty-reset-btn'),
      emptyAiBtn:      element.querySelector('#plp-empty-ai-btn'),

      // Error state CTAs
      errorRetryBtn:   element.querySelector('#plp-error-retry-btn'),

      // Offline state CTAs
      offlineRetryBtn: element.querySelector('#plp-offline-retry-btn'),

      // Recommendation strip
      recCarousel:     element.querySelector('#plp-rec-carousel'),
    };

    /** Current state */
    this._state = GRID_STATES.DEFAULT;

    /** Current view mode */
    this._viewMode = VIEW_MODES.GRID;

    /** Current product count data */
    this._productData = {
      rangeStart: 1,
      rangeEnd:   12,
      total:      324,
    };

    /** Applied filter chips array */
    this._activeFilters = [];

    /** Bound event handler references (for cleanup) */
    this._handlers = {};

    /** Intersection Observer instance */
    this._gridObserver = null;

    /** Swiper instance for recommendation carousel */
    this._recSwiper = null;

    /** Reduced motion preference (spec §9 §6.4) */
    this._prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Scroll position for sticky header shadow */
    this._lastScrollY = 0;

    // Initialise all subsystems
    this._init();
  }


  // ────────────────────────────────────────────────────────────
  //  INIT
  // ────────────────────────────────────────────────────────────

  /**
   * Boot all subsystems in correct order.
   * @private
   */
  _init() {
    this._setState(GRID_STATES.DEFAULT);
    this._initViewModes();
    this._initRefreshBtn();
    this._initEmptyStateCTAs();
    this._initErrorStateCTAs();
    this._initOfflineStateCTAs();
    this._initGridRevealObserver();
    this._initStickyHeaderShadow();
    this._initNetworkMonitor();
    this._initRecCarousel();
    this._syncProductCount(this._productData);

    // GSAP grid reveal (runs on default state)
    requestAnimationFrame(() => {
      this._animateGridReveal();
    });
  }


  // ────────────────────────────────────────────────────────────
  //  STATE MANAGEMENT
  // ────────────────────────────────────────────────────────────

  /**
   * Transition the grid to a new state.
   * Drives CSS panel visibility via data-grid-state attribute.
   * @param {string} newState - One of GRID_STATES values.
   * @public
   */
  setState(newState) {
    this._setState(newState);
  }

  /**
   * @private
   */
  _setState(newState) {
    if (!Object.values(GRID_STATES).includes(newState)) {
      console.warn(`[PlpProductGrid] Unknown state: "${newState}". Falling back to default.`);
      newState = GRID_STATES.DEFAULT;
    }

    this._state = newState;
    this.element.setAttribute('data-grid-state', newState);

    // Announce to assistive tech via the skeleton's role="status" live region
    if (newState === GRID_STATES.LOADING && this.ui.skeletonCanvas) {
      this.ui.skeletonCanvas.setAttribute('aria-hidden', 'false');
    } else if (this.ui.skeletonCanvas) {
      this.ui.skeletonCanvas.setAttribute('aria-hidden', 'true');
    }

    // On returning to default, re-run GSAP stagger if items are ready
    if (newState === GRID_STATES.DEFAULT) {
      requestAnimationFrame(() => {
        this._animateGridReveal();
      });
    }
  }

  /**
   * Returns current grid state.
   * @returns {string}
   * @public
   */
  getState() {
    return this._state;
  }


  // ────────────────────────────────────────────────────────────
  //  PRODUCT COUNT
  // ────────────────────────────────────────────────────────────

  /**
   * Update the product count display.
   * @param {{ rangeStart: number, rangeEnd: number, total: number }} data
   * @public
   */
  syncProductCount(data) {
    this._syncProductCount(data);
  }

  /**
   * @private
   */
  _syncProductCount({ rangeStart, rangeEnd, total }) {
    this._productData = { rangeStart, rangeEnd, total };

    if (this.ui.countRange) {
      this.ui.countRange.textContent = `${rangeStart}–${rangeEnd}`;
    }
    if (this.ui.countTotal) {
      this.ui.countTotal.textContent = total.toLocaleString('en-IN');
    }
  }


  // ────────────────────────────────────────────────────────────
  //  FILTER CHIPS
  // ────────────────────────────────────────────────────────────

  /**
   * Render active filter chips in the grid header summary strip.
   * Called by plp-filters.js when filters change.
   * @param {Array<{ key: string, label: string, value: string }>} filters
   * @public
   */
  renderFilterChips(filters) {
    this._activeFilters = filters;
    this._renderFilterChips();
  }

  /**
   * @private
   */
  _renderFilterChips() {
    if (!this.ui.filterChips) return;

    // Clear previous chips
    this.ui.filterChips.innerHTML = '';

    if (!this._activeFilters || this._activeFilters.length === 0) return;

    const fragment = document.createDocumentFragment();

    this._activeFilters.forEach(({ key, label, value }) => {
      const chip = document.createElement('span');
      chip.className = 'c-plp-grid__filter-chip';
      chip.setAttribute('role', 'listitem');
      chip.innerHTML = `
        <span class="c-plp-grid__filter-chip-label">${this._escapeHtml(label)}</span>
        <button
          class="c-plp-grid__filter-chip-remove"
          aria-label="Remove ${this._escapeHtml(label)} filter"
          data-filter-key="${this._escapeHtml(key)}"
          data-filter-value="${this._escapeHtml(value)}"
          type="button"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `;

      // Remove handler
      const removeBtn = chip.querySelector('.c-plp-grid__filter-chip-remove');
      removeBtn.addEventListener('click', (e) => {
        const filterKey   = e.currentTarget.dataset.filterKey;
        const filterValue = e.currentTarget.dataset.filterValue;
        this._emitFilterRemove(filterKey, filterValue);
      });

      fragment.appendChild(chip);
    });

    this.ui.filterChips.appendChild(fragment);
  }

  /**
   * Emit a custom event for parent orchestrator to remove a filter.
   * @private
   */
  _emitFilterRemove(key, value) {
    const event = new CustomEvent('PlpGrid:FilterRemove', {
      bubbles: true,
      detail:  { key, value },
    });
    this.element.dispatchEvent(event);
  }


  // ────────────────────────────────────────────────────────────
  //  SORT STATUS DISPLAY
  // ────────────────────────────────────────────────────────────

  /**
   * Update the sort status label in the header.
   * Called by plp-filters.js when sort changes.
   * @param {string} sortLabel - Human-readable sort label.
   * @public
   */
  setSortLabel(sortLabel) {
    if (this.ui.sortDisplayVal) {
      this.ui.sortDisplayVal.textContent = sortLabel;
    }
  }


  // ────────────────────────────────────────────────────────────
  //  VIEW MODES
  // ────────────────────────────────────────────────────────────

  /**
   * Initialise view mode toggle buttons.
   * Only "grid" is active; compact/list are disabled placeholders.
   * @private
   */
  _initViewModes() {
    if (!this.ui.viewBtns.length) return;

    const handler = (e) => {
      const btn  = e.currentTarget;
      const mode = btn.dataset.view;

      // Disabled modes — swallow click, no action
      if (btn.classList.contains('is-disabled') || btn.getAttribute('aria-disabled') === 'true') {
        return;
      }

      this._setViewMode(mode);
    };

    this.ui.viewBtns.forEach((btn) => {
      btn.addEventListener('click', handler);
    });

    // Store for cleanup
    this._handlers.viewMode = { els: this.ui.viewBtns, fn: handler };
  }

  /**
   * Apply a view mode, updating aria-pressed and data attribute.
   * @param {string} mode - VIEW_MODES value.
   * @private
   */
  _setViewMode(mode) {
    if (this._viewMode === mode) return;

    this._viewMode = mode;
    this.element.setAttribute('data-view-mode', mode);

    // Sync button states
    this.ui.viewBtns.forEach((btn) => {
      const isActive = btn.dataset.view === mode;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Emit for parent to reorganise layout if needed
    const event = new CustomEvent('PlpGrid:ViewModeChange', {
      bubbles: true,
      detail:  { mode },
    });
    this.element.dispatchEvent(event);
  }


  // ────────────────────────────────────────────────────────────
  //  REFRESH BUTTON
  // ────────────────────────────────────────────────────────────

  /**
   * Wire the refresh button with loading spin animation.
   * @private
   */
  _initRefreshBtn() {
    if (!this.ui.refreshBtn) return;

    const handler = () => {
      this.ui.refreshBtn.classList.add('is-loading');

      // Emit refresh event for parent page to handle
      const event = new CustomEvent('PlpGrid:Refresh', {
        bubbles: true,
        detail:  {},
      });
      this.element.dispatchEvent(event);

      // Reset spin class after 1.5s (page will complete the state reset)
      setTimeout(() => {
        this.ui.refreshBtn && this.ui.refreshBtn.classList.remove('is-loading');
      }, 1500);
    };

    this.ui.refreshBtn.addEventListener('click', handler);
    this._handlers.refresh = { el: this.ui.refreshBtn, fn: handler, event: 'click' };
  }


  // ────────────────────────────────────────────────────────────
  //  EMPTY STATE CTAs
  // ────────────────────────────────────────────────────────────

  /**
   * @private
   */
  _initEmptyStateCTAs() {
    if (this.ui.emptyResetBtn) {
      const handler = () => {
        const event = new CustomEvent('PlpGrid:ResetFilters', {
          bubbles: true,
          detail:  {},
        });
        this.element.dispatchEvent(event);
      };
      this.ui.emptyResetBtn.addEventListener('click', handler);
      this._handlers.emptyReset = { el: this.ui.emptyResetBtn, fn: handler, event: 'click' };
    }
  }


  // ────────────────────────────────────────────────────────────
  //  ERROR STATE CTAs
  // ────────────────────────────────────────────────────────────

  /**
   * @private
   */
  _initErrorStateCTAs() {
    if (this.ui.errorRetryBtn) {
      const handler = () => {
        const event = new CustomEvent('PlpGrid:Retry', {
          bubbles: true,
          detail:  {},
        });
        this.element.dispatchEvent(event);
      };
      this.ui.errorRetryBtn.addEventListener('click', handler);
      this._handlers.errorRetry = { el: this.ui.errorRetryBtn, fn: handler, event: 'click' };
    }
  }


  // ────────────────────────────────────────────────────────────
  //  OFFLINE STATE CTAs
  // ────────────────────────────────────────────────────────────

  /**
   * @private
   */
  _initOfflineStateCTAs() {
    if (this.ui.offlineRetryBtn) {
      const handler = () => {
        if (navigator.onLine) {
          const event = new CustomEvent('PlpGrid:Retry', {
            bubbles: true,
            detail:  {},
          });
          this.element.dispatchEvent(event);
        }
      };
      this.ui.offlineRetryBtn.addEventListener('click', handler);
      this._handlers.offlineRetry = { el: this.ui.offlineRetryBtn, fn: handler, event: 'click' };
    }
  }


  // ────────────────────────────────────────────────────────────
  //  GSAP GRID REVEAL ANIMATION
  //  Spec §9 — stagger entrance, power3.out, reduced-motion aware
  // ────────────────────────────────────────────────────────────

  /**
   * Stagger-reveal product card slots using GSAP if available.
   * Falls back to CSS class toggle for no-GSAP environments.
   * @private
   */
  _animateGridReveal() {
    if (this._state !== GRID_STATES.DEFAULT) return;

    const slots = Array.from(this.ui.cardSlots);
    if (!slots.length) return;

    // Reduced motion: immediately reveal all slots
    if (this._prefersReducedMotion) {
      slots.forEach((slot) => {
        slot.style.opacity = '1';
        slot.style.transform = 'none';
      });
      return;
    }

    // GSAP path
    if (typeof window.gsap !== 'undefined') {
      window.gsap.set(slots, { opacity: 0, y: GSAP_CONFIG.Y_OFFSET });
      window.gsap.to(slots, {
        opacity:  1,
        y:        0,
        duration: GSAP_CONFIG.DURATION,
        ease:     GSAP_CONFIG.EASE,
        stagger:  GSAP_CONFIG.STAGGER,
        overwrite: 'auto',
      });
    } else {
      // CSS fallback — add .is-revealed class in sequence
      slots.forEach((slot, i) => {
        setTimeout(() => {
          slot.classList.add('is-revealed');
        }, i * (GSAP_CONFIG.STAGGER * 1000));
      });
    }
  }


  // ────────────────────────────────────────────────────────────
  //  INTERSECTION OBSERVER — Grid canvas visibility
  //  Spec §16 §5 — lazy-load / infinite-scroll ready
  // ────────────────────────────────────────────────────────────

  /**
   * Sets up IntersectionObserver on the grid canvas to:
   * 1. Trigger slot reveal animation when grid enters viewport.
   * 2. Provide an infinite-scroll hook point (last card).
   * @private
   */
  _initGridRevealObserver() {
    if (!this.ui.gridCanvas) return;

    this._gridObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this._animateGridReveal();
            // Disconnect after first reveal to avoid re-triggering
            this._gridObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: IO_ROOT_MARGIN, threshold: 0.05 }
    );

    this._gridObserver.observe(this.ui.gridCanvas);

    // ── Infinite-scroll sentinel (architecture ready, not yet active) ──
    // The last card slot acts as the sentinel.
    // When Prompt 24 populates real cards, attach a separate observer here:
    // this._initInfiniteScrollSentinel();
  }

  /**
   * Infinite-scroll ready: observes the last card slot to trigger loading.
   * Disabled by default — activated when real product cards are injected.
   * @public call from parent orchestrator after card injection
   */
  initInfiniteScrollSentinel() {
    const lastSlot = this.ui.gridCanvas
      ? this.ui.gridCanvas.querySelector('.c-plp-grid__card-slot:last-child')
      : null;

    if (!lastSlot) return;

    const sentinel = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const event = new CustomEvent('PlpGrid:LoadMore', {
              bubbles: true,
              detail:  {
                currentTotal: this._productData.rangeEnd,
                grandTotal:   this._productData.total,
              },
            });
            this.element.dispatchEvent(event);
          }
        });
      },
      { rootMargin: '0px 0px 300px 0px', threshold: 0 }
    );

    sentinel.observe(lastSlot);

    // Store reference for cleanup
    this._infiniteSentinel = sentinel;
    this._sentinelEl = lastSlot;
  }


  // ────────────────────────────────────────────────────────────
  //  STICKY HEADER SHADOW ON SCROLL
  // ────────────────────────────────────────────────────────────

  /**
   * Add a subtle shadow to the grid header when user scrolls down.
   * Uses debounce to prevent layout recalc on every pixel.
   * @private
   */
  _initStickyHeaderShadow() {
    if (!this.ui.header) return;

    const handleScroll = debounce(() => {
      const currentY = window.scrollY;
      this.ui.header.classList.toggle('is-scrolled', currentY > 40);
      this._lastScrollY = currentY;
    }, 80);

    window.addEventListener('scroll', handleScroll, { passive: true });
    this._handlers.scroll = { el: window, fn: handleScroll, event: 'scroll', options: { passive: true } };
  }


  // ────────────────────────────────────────────────────────────
  //  NETWORK MONITOR
  //  Automatically switch to offline state when disconnected.
  // ────────────────────────────────────────────────────────────

  /**
   * @private
   */
  _initNetworkMonitor() {
    const offlineHandler = () => {
      if (this._state === GRID_STATES.DEFAULT || this._state === GRID_STATES.LOADING) {
        this._setState(GRID_STATES.OFFLINE);
      }
    };

    const onlineHandler = () => {
      if (this._state === GRID_STATES.OFFLINE) {
        // Emit retry — parent decides whether to reload or show error
        const event = new CustomEvent('PlpGrid:Retry', {
          bubbles: true,
          detail:  { reason: 'network-restored' },
        });
        this.element.dispatchEvent(event);
      }
    };

    window.addEventListener('offline', offlineHandler);
    window.addEventListener('online',  onlineHandler);

    this._handlers.offline = { el: window, fn: offlineHandler, event: 'offline' };
    this._handlers.online  = { el: window, fn: onlineHandler,  event: 'online'  };
  }


  // ────────────────────────────────────────────────────────────
  //  RECOMMENDATION CAROUSEL (Swiper)
  //  Spec §16 §3 — Swiper.js configuration
  // ────────────────────────────────────────────────────────────

  /**
   * Initialise the AI recommendation Swiper carousel.
   * Guards against missing Swiper library gracefully.
   * @private
   */
  _initRecCarousel() {
    if (!this.ui.recCarousel) return;

    // Swiper is loaded via defer in shop.html — wait for it
    const tryInit = () => {
      if (typeof window.Swiper !== 'undefined') {
        this._recSwiper = new window.Swiper(this.ui.recCarousel, REC_SWIPER_CONFIG);
      } else {
        // Retry after 200ms if Swiper not yet loaded
        setTimeout(tryInit, 200);
      }
    };

    tryInit();
  }


  // ────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────

  /**
   * Set the grid into loading state (skelets visible).
   * @public
   */
  showLoading() {
    this._setState(GRID_STATES.LOADING);
  }

  /**
   * Set the grid back to the default (product cards visible).
   * @public
   */
  showGrid() {
    this._setState(GRID_STATES.DEFAULT);
  }

  /**
   * Set the grid to the empty state.
   * @public
   */
  showEmpty() {
    this._setState(GRID_STATES.EMPTY);
  }

  /**
   * Set the grid to the error state.
   * @public
   */
  showError() {
    this._setState(GRID_STATES.ERROR);
  }

  /**
   * Set the grid to the offline state.
   * @public
   */
  showOffline() {
    this._setState(GRID_STATES.OFFLINE);
  }

  /**
   * Inject product cards into slot elements.
   * Accepts an array of HTMLElement product cards (from Prompt 24).
   * @param {HTMLElement[]} cardEls - Array of 12 card elements.
   * @public
   */
  injectCards(cardEls) {
    const slots = Array.from(this.ui.cardSlots);

    slots.forEach((slot, index) => {
      // Clear placeholder
      slot.innerHTML = '';

      // Inject real card if supplied for this slot
      const card = cardEls[index];
      if (card) {
        slot.appendChild(card);
      }
    });

    // Re-run stagger reveal for newly injected cards
    requestAnimationFrame(() => {
      this._animateGridReveal();
    });
  }

  /**
   * Inject recommendation cards into the carousel strip.
   * Accepts an array of HTMLElement product cards.
   * @param {HTMLElement[]} cardEls - Array of recommendation card elements.
   * @public
   */
  injectRecCards(cardEls) {
    if (!this.ui.recCarousel) return;

    const track = this.ui.recCarousel.querySelector('.c-plp-grid__rec-track');
    if (!track) return;

    const slots = track.querySelectorAll('.c-plp-grid__rec-slot');

    slots.forEach((slot, index) => {
      const card = cardEls[index];
      if (card) {
        slot.innerHTML = '';
        slot.appendChild(card);
      }
    });

    // Update Swiper after DOM change
    if (this._recSwiper) {
      this._recSwiper.update();
    }
  }


  // ────────────────────────────────────────────────────────────
  //  UTILITY — HTML ESCAPE (XSS prevention)
  // ────────────────────────────────────────────────────────────

  /**
   * Escape HTML special characters in user-supplied strings.
   * @param {string} str
   * @returns {string}
   * @private
   */
  _escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (m) => map[m]);
  }


  // ────────────────────────────────────────────────────────────
  //  CLEANUP — spec §16 §1 (lifecycle dispose)
  // ────────────────────────────────────────────────────────────

  /**
   * Remove all event listeners, disconnect observers, destroy Swiper.
   * Call this when navigating away or unmounting the section.
   * @public
   */
  destroy() {
    // Remove stored event listeners
    Object.values(this._handlers).forEach((handler) => {
      if (handler.el && handler.fn) {
        if (handler.els) {
          // NodeList (view mode buttons)
          handler.els.forEach((el) => el.removeEventListener('click', handler.fn));
        } else {
          handler.el.removeEventListener(handler.event || 'click', handler.fn, handler.options || false);
        }
      }
    });

    // Disconnect IntersectionObservers
    if (this._gridObserver) {
      this._gridObserver.disconnect();
      this._gridObserver = null;
    }

    if (this._infiniteSentinel) {
      this._infiniteSentinel.disconnect();
      this._infiniteSentinel = null;
    }

    // Destroy Swiper
    if (this._recSwiper) {
      this._recSwiper.destroy(true, true);
      this._recSwiper = null;
    }

    // Kill any active GSAP tweens on grid slots
    if (typeof window.gsap !== 'undefined' && this.ui.cardSlots) {
      window.gsap.killTweensOf(Array.from(this.ui.cardSlots));
    }

    // Clear references
    this.ui      = null;
    this.element = null;
    this._handlers = {};
  }

}


// ──────────────────────────────────────────────────────────────
//  MOCK CATALOG DATA
// ──────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  {
    id: 'lst-001',
    name: 'Aura Solitaire Ring',
    collection: 'Aura Collection',
    subtitle: 'A timeless expression of handmade luxury and elegance.',
    metal: '18K Yellow Gold',
    metalKey: 'gold',
    stone: '0.75ct Round Cut Diamond',
    category: 'rings',
    price: 145000,
    originalPrice: 175000,
    discount: '17% OFF',
    emi: 'EMI available from ₹12,083/month',
    rating: 4.9,
    reviewCount: 42,
    imageUrl: 'assets/images/products/rings-category.webp',
    hoverImageUrl: 'assets/images/products/hero-promo-ring.webp',
    labels: ['New', 'Best Seller'],
    isWishlisted: false
  },
  {
    id: 'lst-002',
    name: 'Grace Pearl Earrings',
    collection: 'Grace Collection',
    subtitle: 'Lustrous South Sea pearls suspended on delicate diamond-cut drops.',
    metal: '18K Yellow Gold',
    metalKey: 'gold',
    stone: 'South Sea Pearl',
    category: 'earrings',
    price: 68000,
    originalPrice: 80000,
    discount: '15% OFF',
    emi: 'EMI available from ₹5,667/month',
    rating: 4.8,
    reviewCount: 18,
    imageUrl: 'assets/images/products/earrings-category.webp',
    hoverImageUrl: 'assets/images/products/earrings-category.webp',
    labels: ['Trending'],
    isWishlisted: true
  },
  {
    id: 'lst-003',
    name: 'Eternal Platinum Band',
    collection: 'Promise Collection',
    subtitle: 'Artisanal micro-pave platinum band showcasing extreme brilliance.',
    metal: '950 Platinum',
    metalKey: 'platinum',
    stone: 'Brilliant Cut Diamonds',
    category: 'rings',
    price: 185000,
    originalPrice: 210000,
    discount: '12% OFF',
    emi: 'EMI available from ₹15,417/month',
    rating: 5.0,
    reviewCount: 35,
    imageUrl: 'assets/images/products/rings-category.webp',
    hoverImageUrl: 'assets/images/products/hero-promo-ring.webp',
    labels: ['Exclusive'],
    isWishlisted: false
  },
  {
    id: 'lst-004',
    name: 'Aria Emerald Bracelet',
    collection: 'Aria Collection',
    subtitle: 'Classic line bracelet featuring matching emerald-cut Zambian emeralds.',
    metal: '18K White Gold',
    metalKey: 'white-gold',
    stone: 'Zambian Emeralds',
    category: 'bracelets',
    price: 320000,
    originalPrice: 380000,
    discount: '15% OFF',
    emi: 'EMI available from ₹26,667/month',
    rating: 4.7,
    reviewCount: 22,
    imageUrl: 'assets/images/products/bracelets-category.webp',
    hoverImageUrl: 'assets/images/products/bracelets-category.webp',
    labels: ['AI Recommended'],
    aiMatch: 98,
    aiReason: 'Matches Your Style DNA',
    isWishlisted: false
  },
  {
    id: 'lst-005',
    name: 'Halo Solitaire Pendant',
    collection: 'Halo Collection',
    subtitle: 'Magnificent 1.0ct diamond surrounded by a delicate double halo.',
    metal: '18K Rose Gold',
    metalKey: 'rose-gold',
    stone: '1.0ct GIA Diamond',
    category: 'necklaces',
    price: 240000,
    originalPrice: 280000,
    discount: '14% OFF',
    emi: 'EMI available from ₹20,000/month',
    rating: 4.9,
    reviewCount: 30,
    imageUrl: 'assets/images/products/necklaces-category.webp',
    hoverImageUrl: 'assets/images/lifestyle/hero-necklace-portrait.webp',
    labels: ['Wedding', 'Best Seller'],
    isWishlisted: false
  },
  {
    id: 'lst-006',
    name: 'Serenade Ruby Ring',
    collection: 'Serenade Collection',
    subtitle: 'Elegant cushion-cut Myanmar ruby nestled between brilliant diamonds.',
    metal: '18K Rose Gold',
    metalKey: 'rose-gold',
    stone: 'Burma Ruby & Diamonds',
    category: 'rings',
    price: 155000,
    originalPrice: 155000,
    discount: '',
    emi: 'EMI available from ₹12,917/month',
    rating: 4.8,
    reviewCount: 16,
    imageUrl: 'assets/images/products/rings-category.webp',
    hoverImageUrl: 'assets/images/products/hero-promo-ring.webp',
    labels: ['New'],
    isWishlisted: false
  },
  {
    id: 'lst-007',
    name: 'Classic Gold Hoops',
    collection: 'Essentials',
    subtitle: 'Hand-polished standard medium hoop earrings in high polish gold.',
    metal: '18K Yellow Gold',
    metalKey: 'gold',
    stone: 'None',
    category: 'earrings',
    price: 45000,
    originalPrice: 50000,
    discount: '10% OFF',
    emi: 'EMI available from ₹3,750/month',
    rating: 4.6,
    reviewCount: 25,
    imageUrl: 'assets/images/products/earrings-category.webp',
    hoverImageUrl: 'assets/images/products/earrings-category.webp',
    labels: ['Trending'],
    isWishlisted: false
  },
  {
    id: 'lst-008',
    name: 'Starlight Sapphire Necklace',
    collection: 'Starlight Collection',
    subtitle: 'Luminous blue Ceylon sapphire pendant accented by a diamond halo.',
    metal: '950 Platinum',
    metalKey: 'platinum',
    stone: 'Blue Sapphire & Diamonds',
    category: 'necklaces',
    price: 410000,
    originalPrice: 480000,
    discount: '14% OFF',
    emi: 'EMI available from ₹34,167/month',
    rating: 4.9,
    reviewCount: 14,
    imageUrl: 'assets/images/products/necklaces-category.webp',
    hoverImageUrl: 'assets/images/lifestyle/hero-necklace-portrait.webp',
    labels: ['Limited Edition'],
    isWishlisted: false
  },
  {
    id: 'lst-009',
    name: 'Aura Pearl Ring',
    collection: 'Aura Collection',
    subtitle: 'Solitaire rings featuring a premium white South Sea cultured pearl.',
    metal: '18K Yellow Gold',
    metalKey: 'gold',
    stone: 'South Sea Pearl',
    category: 'rings',
    price: 85000,
    originalPrice: 95000,
    discount: '10% OFF',
    emi: 'EMI available from ₹7,083/month',
    rating: 4.7,
    reviewCount: 28,
    imageUrl: 'assets/images/products/rings-category.webp',
    hoverImageUrl: 'assets/images/products/hero-promo-ring.webp',
    labels: ['Best Seller'],
    isWishlisted: false
  },
  {
    id: 'lst-010',
    name: 'Destiny Marquise Ring',
    collection: 'Destiny Collection',
    subtitle: 'Contemporary gold band displaying a marquise-cut certified diamond.',
    metal: '18K White Gold',
    metalKey: 'white-gold',
    stone: 'Marquise Cut Diamond',
    category: 'rings',
    price: 290000,
    originalPrice: 290000,
    discount: '',
    emi: 'EMI available from ₹24,167/month',
    rating: 5.0,
    reviewCount: 9,
    imageUrl: 'assets/images/products/rings-category.webp',
    hoverImageUrl: 'assets/images/products/hero-promo-ring.webp',
    labels: ['Exclusive'],
    isWishlisted: false
  },
  {
    id: 'lst-011',
    name: 'Infinity Diamond Bangle',
    collection: 'Infinity Collection',
    subtitle: 'Hand-set pavé diamond bangle that sparkles from every luxury angle.',
    metal: '18K Yellow Gold',
    metalKey: 'gold',
    stone: 'Pavé Diamonds',
    category: 'bracelets',
    price: 165000,
    originalPrice: 195000,
    discount: '15% OFF',
    emi: 'EMI available from ₹13,750/month',
    rating: 4.8,
    reviewCount: 20,
    imageUrl: 'assets/images/products/bangles-category.webp',
    hoverImageUrl: 'assets/images/products/bangles-category.webp',
    labels: ['New'],
    isWishlisted: false
  },
  {
    id: 'lst-012',
    name: 'Aria Diamond Earrings',
    collection: 'Aria Collection',
    subtitle: 'Dazzling round diamond studs bezel-set in luxury white gold housings.',
    metal: '18K White Gold',
    metalKey: 'white-gold',
    stone: '0.50ct Twin Diamonds',
    category: 'earrings',
    price: 110000,
    originalPrice: 130000,
    discount: '15% OFF',
    emi: 'EMI available from ₹9,167/month',
    rating: 4.9,
    reviewCount: 33,
    imageUrl: 'assets/images/products/earrings-category.webp',
    hoverImageUrl: 'assets/images/products/earrings-category.webp',
    labels: ['Trending'],
    isWishlisted: false
  }
];


// ──────────────────────────────────────────────────────────────
//  AUTO-INITIALISATION
//  Boots the grid when the DOM is ready.
//  Exposes instance on window.LustraPlpGrid for cross-module access.
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('plp-product-grid-section');

  if (!gridEl) return; // Not on shop page — silently exit.

  try {
    window.LustraPlpGrid = new PlpProductGrid(gridEl);

    // Initial load: Hydrate grid with real visual product cards
    const initialCards = MOCK_PRODUCTS.slice(0, 12).map(p => ProductCard.render(p));
    window.LustraPlpGrid.injectCards(initialCards);

    /**
     * Listen for filter events from plp-filters.js and sync the grid header.
     * plp-filters.js emits 'LustraFilters:Changed' with { activeFilters, sortLabel, total }.
     */
    document.addEventListener('LustraFilters:Changed', (e) => {
      const { activeFilters = [], sortLabel = 'Recommended', total = 324 } = e.detail || {};

      if (window.LustraPlpGrid) {
        // Update filter chips
        window.LustraPlpGrid.renderFilterChips(activeFilters);

        // Update sort label
        window.LustraPlpGrid.setSortLabel(sortLabel);

        // Trigger loading state while new results are fetched
        window.LustraPlpGrid.showLoading();

        // Simulate result hydration with filtered cards
        setTimeout(() => {
          if (!window.LustraPlpGrid) return;

          if (total === 0) {
            window.LustraPlpGrid.showEmpty();
          } else {
            // Apply filtering logic to MOCK_PRODUCTS array
            const filtered = MOCK_PRODUCTS.filter(p => {
              const activeCats = activeFilters.filter(f => f.key === 'category').map(f => f.value);
              if (activeCats.length && !activeCats.includes(p.category)) return false;

              const activeMetals = activeFilters.filter(f => f.key === 'metal').map(f => f.value);
              if (activeMetals.length && !activeMetals.includes(p.metalKey)) return false;

              return true;
            });



            window.LustraPlpGrid.syncProductCount({
              rangeStart: 1,
              rangeEnd:   Math.min(12, filtered.length),
              total:      filtered.length,
            });
            window.LustraPlpGrid.showGrid();

            const cardsToInject = filtered.slice(0, 12).map(p => ProductCard.render(p));
            window.LustraPlpGrid.injectCards(cardsToInject);
          }
        }, 800);
      }
    });

    /**
     * Handle reset filters from empty state CTA.
     * Broadcast to plp-filters.js to clear all active filters.
     */
    gridEl.addEventListener('PlpGrid:ResetFilters', () => {
      if (typeof window.LustraFilters !== 'undefined') {
        window.LustraFilters.clearAllFilters();
      }
    });

    /**
     * Handle retry events from error/offline states.
     */
    gridEl.addEventListener('PlpGrid:Retry', () => {
      window.LustraPlpGrid && window.LustraPlpGrid.showLoading();

      // Simulate retry (parent page should implement real fetch logic)
      setTimeout(() => {
        if (!window.LustraPlpGrid) return;
        window.LustraPlpGrid.showGrid();
      }, 1000);
    });

  } catch (err) {
    console.error('[PlpProductGrid] Failed to initialise:', err);
  }
});
