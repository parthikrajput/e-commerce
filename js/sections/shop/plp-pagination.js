/**
 * ============================================================
 *  PLP PAGINATION — Lustra Reusable Component JavaScript
 *  File:     js/sections/shop/plp-pagination.js
 *  Purpose:  Coordinates traditional page numbering, progressive load more
 *            actions, infinite scroll sentinels, scroll restoration,
 *            History API query updates, and return to top triggers.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 04_Component_Library (§13)
 * ============================================================
 */

'use strict';

export default class PlpPagination {
  /**
   * @param {HTMLElement} element - Root pagination wrapper (.c-plp-pagination)
   */
  constructor(element) {
    this.root = element || document.getElementById('plp-pagination-root');
    if (!this.root) {
      console.warn('[PlpPagination] Initialization cancelled: Root element not found.');
      return;
    }

    if (this.root.__lustraPlpPagination) {
      return this.root.__lustraPlpPagination;
    }
    this.root.__lustraPlpPagination = this;

    // Cache elements (spec §16)
    this.ui = {
      summary:       this.root.querySelector('.c-plp-pagination__summary'),
      pageStart:     this.root.querySelector('#qv-page-start'),
      pageEnd:       this.root.querySelector('#qv-page-end'),
      pageTotal:     this.root.querySelector('#qv-page-total'),
      
      // Traditional Layout
      traditional:   this.root.querySelector('.c-plp-pagination__traditional'),
      numbers:       this.root.querySelector('#qv-pag-numbers'),
      btnFirst:      this.root.querySelector('#qv-pag-btn-first'),
      btnPrev:       this.root.querySelector('#qv-pag-btn-prev'),
      btnNext:       this.root.querySelector('#qv-pag-btn-next'),
      btnLast:       this.root.querySelector('#qv-pag-btn-last'),

      // Load More Layout
      loadMore:      this.root.querySelector('.c-plp-pagination__load-more'),
      progressText:  this.root.querySelector('#qv-progress-text'),
      progressBar:   this.root.querySelector('#qv-progress-bar'),
      btnLoadMore:   this.root.querySelector('#qv-load-more-trigger'),

      // Sentinel
      sentinel:      this.root.querySelector('.c-plp-pagination__sentinel'),
      
      // State Cards
      stateEmpty:    this.root.querySelector('#qv-pag-state-empty'),
      stateError:    this.root.querySelector('#qv-pag-state-error'),
      scrollTopBtn:  this.root.querySelector('.c-plp-pagination__scroll-top-btn'),
      retryBtn:      this.root.querySelector('.c-plp-pagination__error-retry-btn'),

      // Back to Top widget
      backToTop:     document.getElementById('plp-back-to-top-widget')
    };

    // State parameters
    this.state = {
      currentPage:  1,
      itemsPerPage: 12,
      totalItems:   324,
      totalPages:   27,
      loadedItems:  12, // For Load More / Infinite Scroll tracking
      mode:         this.root.getAttribute('data-pagination-mode') || 'traditional',
      isLoading:    false
    };

    this.state.totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);

    // Watchers pointers
    this._listeners = [];
    this._observer = null;
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  /**
   * Boot Pagination Logic
   * @private
   */
  _init() {
    this._setupScrollRestoration();
    this._bindEvents();
    this._setupReturnToTop();
    this._updateSummary();

    if (this.state.mode === 'traditional') {
      this._renderPageNumbers();
    } else if (this.state.mode === 'infinite-scroll') {
      this._setupIntersectionObserver();
    }
  }

  /**
   * Bind event elements
   * @private
   */
  _bindEvents() {
    // 1. Traditional Nav Click bindings
    if (this.ui.btnFirst) {
      const fn = () => this._changePage(1);
      this.ui.btnFirst.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.btnFirst, type: 'click', fn });
    }
    if (this.ui.btnPrev) {
      const fn = () => this._changePage(this.state.currentPage - 1);
      this.ui.btnPrev.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.btnPrev, type: 'click', fn });
    }
    if (this.ui.btnNext) {
      const fn = () => this._changePage(this.state.currentPage + 1);
      this.ui.btnNext.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.btnNext, type: 'click', fn });
    }
    if (this.ui.btnLast) {
      const fn = () => this._changePage(this.state.totalPages);
      this.ui.btnLast.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.btnLast, type: 'click', fn });
    }

    // 2. Traditional Numbers Click delegates (spec §16)
    if (this.ui.numbers) {
      const fn = (e) => {
        const btn = e.target.closest('.c-plp-pagination__num-btn');
        if (!btn || btn.classList.contains('is-active')) return;
        const page = parseInt(btn.textContent, 10);
        if (page) this._changePage(page);
      };
      this.ui.numbers.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.numbers, type: 'click', fn });
    }

    // 3. Load More Action triggers
    if (this.ui.btnLoadMore) {
      const fn = (e) => {
        e.preventDefault();
        this._loadMore();
      };
      this.ui.btnLoadMore.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.btnLoadMore, type: 'click', fn });
    }

    // 4. Retry Loading state button
    if (this.ui.retryBtn) {
      const fn = () => {
        this._showStateCard(null);
        if (this.state.mode === 'traditional') {
          this._changePage(this.state.currentPage);
        } else {
          this._loadMore();
        }
      };
      this.ui.retryBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.retryBtn, type: 'click', fn });
    }
  }

  /**
   * Set active mode dynamically
   * @param {string} mode - 'traditional', 'load-more', or 'infinite-scroll'
   * @public
   */
  setMode(mode) {
    if (!['traditional', 'load-more', 'infinite-scroll'].includes(mode)) return;
    this.state.mode = mode;
    this.root.setAttribute('data-pagination-mode', mode);

    // Cancel old observer if present
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (mode === 'traditional') {
      this._renderPageNumbers();
    } else if (mode === 'infinite-scroll') {
      this._setupIntersectionObserver();
    }

    this._updateSummary();
  }

  /**
   * Update Query Parameters via HTML5 History API
   * @param {number} page - Current page
   * @private
   */
  _syncUrlState(page) {
    if (window.history && window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      window.history.pushState({ page, path: url.pathname + url.search }, '', url.href);
    }
  }

  /**
   * Handle page selection change
   * @param {number} page
   * @private
   */
  _changePage(page) {
    if (page < 1 || page > this.state.totalPages || this.state.isLoading) return;

    this.state.currentPage = page;
    this.state.isLoading = true;
    this.state.loadedItems = page * this.state.itemsPerPage;

    // Simulate grid latency loading (600ms)
    this.root.classList.add('is-loading');

    setTimeout(() => {
      this.state.isLoading = false;
      this.root.classList.remove('is-loading');

      this._renderPageNumbers();
      this._updateSummary();
      this._syncUrlState(page);

      // Emit global pagination change custom event for Grid updates
      this._emitEvent('LustraPagination:Change', {
        page: this.state.currentPage,
        limit: this.state.itemsPerPage,
        mode: this.state.mode
      });

      // Scroll smoothly back to top of product grid
      const grid = document.getElementById('plp-product-grid-section') || document.getElementById('main-content');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  }

  /**
   * Incremental progressive loading
   * @private
   */
  _loadMore() {
    if (this.state.isLoading || this.state.loadedItems >= this.state.totalItems) return;

    this.state.isLoading = true;
    if (this.ui.btnLoadMore) this.ui.btnLoadMore.classList.add('is-loading');

    // Simulate API loading (800ms)
    setTimeout(() => {
      this.state.isLoading = false;
      if (this.ui.btnLoadMore) this.ui.btnLoadMore.classList.remove('is-loading');

      const oldEnd = this.state.loadedItems;
      this.state.loadedItems = Math.min(this.state.loadedItems + this.state.itemsPerPage, this.state.totalItems);
      this.state.currentPage = Math.ceil(this.state.loadedItems / this.state.itemsPerPage);

      this._updateSummary();

      // Emit lazy load event so product-grid appends new cards
      this._emitEvent('LustraPagination:LoadMore', {
        page: this.state.currentPage,
        startItem: oldEnd + 1,
        endItem: this.state.loadedItems
      });

      // If reached maximum count limit, show empty visual "no more products"
      if (this.state.loadedItems >= this.state.totalItems) {
        this._showStateCard('empty');
      }
    }, 800);
  }

  /**
   * Traditional page numbering render (includes ellipses)
   * @private
   */
  _renderPageNumbers() {
    if (!this.ui.numbers) return;
    this.ui.numbers.innerHTML = '';

    const current = this.state.currentPage;
    const total = this.state.totalPages;
    const maxVisible = window.innerWidth < 768 ? 3 : 5;

    // Boundary button updates
    if (this.ui.btnFirst) this.ui.btnFirst.disabled = current === 1;
    if (this.ui.btnPrev) this.ui.btnPrev.disabled = current === 1;
    if (this.ui.btnNext) this.ui.btnNext.disabled = current === total;
    if (this.ui.btnLast) this.ui.btnLast.disabled = current === total;

    let rangeStart = Math.max(1, current - Math.floor(maxVisible / 2));
    let rangeEnd = Math.min(total, rangeStart + maxVisible - 1);

    if (rangeEnd - rangeStart + 1 < maxVisible) {
      rangeStart = Math.max(1, rangeEnd - maxVisible + 1);
    }

    // First page
    if (rangeStart > 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'c-plp-pagination__num-btn';
      btn.textContent = '1';
      this.ui.numbers.appendChild(btn);

      if (rangeStart > 2) {
        const dot = document.createElement('span');
        dot.className = 'c-plp-pagination__ellipsis';
        dot.textContent = '...';
        this.ui.numbers.appendChild(dot);
      }
    }

    // Visible numbers range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `c-plp-pagination__num-btn ${i === current ? 'is-active' : ''}`;
      if (i === current) btn.setAttribute('aria-current', 'page');
      btn.textContent = i;
      this.ui.numbers.appendChild(btn);
    }

    // Last page
    if (rangeEnd < total) {
      if (rangeEnd < total - 1) {
        const dot = document.createElement('span');
        dot.className = 'c-plp-pagination__ellipsis';
        dot.textContent = '...';
        this.ui.numbers.appendChild(dot);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'c-plp-pagination__num-btn';
      btn.textContent = total;
      this.ui.numbers.appendChild(btn);
    }
  }

  /**
   * Sync text summary counts and progress bar
   * @private
   */
  _updateSummary() {
    const start = this.state.mode === 'traditional'
      ? (this.state.currentPage - 1) * this.state.itemsPerPage + 1
      : 1;

    const end = this.state.mode === 'traditional'
      ? Math.min(this.state.currentPage * this.state.itemsPerPage, this.state.totalItems)
      : this.state.loadedItems;

    // Update main text
    if (this.ui.pageStart) this.ui.pageStart.textContent = start;
    if (this.ui.pageEnd) this.ui.pageEnd.textContent = end;
    if (this.ui.pageTotal) this.ui.pageTotal.textContent = this.state.totalItems.toLocaleString('en-IN');

    // Update Load More progress details
    if (this.ui.progressText) {
      this.ui.progressText.textContent = `${end} of ${this.state.totalItems} Products Loaded`;
    }

    if (this.ui.progressBar) {
      const percent = (end / this.state.totalItems) * 100;
      
      if (this.hasGsap && !this.prefersReducedMotion) {
        window.gsap.to(this.ui.progressBar, { width: `${percent}%`, duration: 0.5, ease: 'power3.out' });
      } else {
        this.ui.progressBar.style.width = `${percent}%`;
      }
    }
  }

  /**
   * Intersection Observer for infinite scrolling sentinel (spec §16)
   * @private
   */
  _setupIntersectionObserver() {
    if (!this.ui.sentinel) return;

    const options = {
      root: null,
      rootMargin: '100px', // pre-trigger before target hits view
      threshold: 0.1
    };

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.state.isLoading && this.state.loadedItems < this.state.totalItems) {
          this._loadMore();
        }
      });
    }, options);

    this._observer.observe(this.ui.sentinel);
  }

  /**
   * Floating widget triggers (spec §13)
   * @private
   */
  _setupReturnToTop() {
    if (!this.ui.backToTop) return;

    // Scroll throttle handler (spec §16)
    let isThrottled = false;
    const scrollFn = () => {
      if (isThrottled) return;
      isThrottled = true;

      setTimeout(() => {
        isThrottled = false;
        const threshold = 400; // reveal past 400px scroll offset
        const y = window.scrollY || document.documentElement.scrollTop;

        if (y > threshold) {
          this.ui.backToTop.classList.add('is-visible');
        } else {
          this.ui.backToTop.classList.remove('is-visible');
        }
      }, 100);
    };

    window.addEventListener('scroll', scrollFn);
    this._listeners.push({ el: window, type: 'scroll', fn: scrollFn });

    // Smooth scroll event binding
    const clickFn = (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Accessibility focus redirect to first landmark
      const skipTarget = document.querySelector('.c-skip-link') || document.body;
      if (skipTarget) {
        skipTarget.focus();
      }
    };
    this.ui.backToTop.addEventListener('click', clickFn);
    this._listeners.push({ el: this.ui.backToTop, type: 'click', fn: clickFn });

    // Bind Empty state Return to Top CTA too
    const emptyScrollBtn = this.root.querySelector('.c-plp-pagination__scroll-top-btn');
    if (emptyScrollBtn) {
      emptyScrollBtn.addEventListener('click', clickFn);
      this._listeners.push({ el: emptyScrollBtn, type: 'click', fn: clickFn });
    }
  }

  /**
   * Caches scroll coordinates on page unload to support Scroll Restoration
   * @private
   */
  _setupScrollRestoration() {
    const unloadFn = () => {
      sessionStorage.setItem('lustra-plp-scroll-y', window.scrollY);
      sessionStorage.setItem('lustra-plp-page', this.state.currentPage);
      sessionStorage.setItem('lustra-plp-mode', this.state.mode);
      sessionStorage.setItem('lustra-plp-loaded-items', this.state.loadedItems);
    };
    window.addEventListener('beforeunload', unloadFn);
    this._listeners.push({ el: window, type: 'beforeunload', fn: unloadFn });

    // Try to restore on DOM load
    const savedPage = sessionStorage.getItem('lustra-plp-page');
    const savedMode = sessionStorage.getItem('lustra-plp-mode');
    const savedItems = sessionStorage.getItem('lustra-plp-loaded-items');

    if (savedPage) {
      this.state.currentPage = parseInt(savedPage, 10) || 1;
    }
    if (savedMode) {
      this.state.mode = savedMode;
      this.root.setAttribute('data-pagination-mode', savedMode);
    }
    if (savedItems) {
      this.state.loadedItems = parseInt(savedItems, 10) || 12;
    }

    const savedScrollY = sessionStorage.getItem('lustra-plp-scroll-y');
    if (savedScrollY) {
      // Defer slightly to let layout and cards paint
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScrollY, 10),
          behavior: 'instant'
        });
        sessionStorage.removeItem('lustra-plp-scroll-y');
      }, 250);
    }
  }

  /**
   * Show inline empty or error card components
   * @param {string|null} stateName - 'empty', 'error', or null
   * @private
   */
  _showStateCard(stateName) {
    if (this.ui.stateEmpty) {
      this.ui.stateEmpty.setAttribute('aria-hidden', stateName === 'empty' ? 'false' : 'true');
    }
    if (this.ui.stateError) {
      this.ui.stateError.setAttribute('aria-hidden', stateName === 'error' ? 'false' : 'true');
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
    this.root.dispatchEvent(event);
  }

  /**
   * Safely destroy listeners and observers (spec §16)
   * @public
   */
  destroy() {
    this._listeners.forEach(({ el, type, fn }) => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(type, fn);
      }
    });

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (this.root) {
      delete this.root.__lustraPlpPagination;
    }

    this._listeners = [];
    this.ui = null;
    this.root = null;
  }
}
