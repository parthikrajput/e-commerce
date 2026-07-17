/**
 * ============================================================
 *  PLP SEO CONTENT & BUYING GUIDE — Reusable JavaScript
 *  File:     js/sections/shop/plp-seo-guide.js
 *  Purpose:  Controls guide tabs swaps, GSAP FAQ accordion expansions,
 *            scroll entrance reveals, and listeners cleanups.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 04_Component_Library (§13)
 * ============================================================
 */

'use strict';

export default class PlpSeoGuide {
  /**
   * @param {HTMLElement} element - Root guide section element (.c-seo-guide)
   */
  constructor(element) {
    this.section = element || document.getElementById('plp-seo-guide-section');
    if (!this.section) {
      console.warn('[PlpSeoGuide] Initialization cancelled: Section element not found.');
      return;
    }

    if (this.section.__lustraPlpSeoGuide) {
      return this.section.__lustraPlpSeoGuide;
    }
    this.section.__lustraPlpSeoGuide = this;

    // Cache elements (spec §16)
    this.ui = {
      tablist:        this.section.querySelector('.c-seo-guide__tablist'),
      tabBtns:        this.section.querySelectorAll('.c-seo-guide__tab-btn'),
      panels:         this.section.querySelectorAll('.c-seo-guide__panel'),
      
      // FAQ Accordion Elements
      accordion:      this.section.querySelector('#plp-faq-accordion'),
      faqItems:       this.section.querySelectorAll('.c-seo-faq__item'),
      faqTriggers:    this.section.querySelectorAll('.c-seo-faq__trigger'),
      
      // Prom Promise Grid
      trustGrid:      this.section.querySelector('.c-seo-guide__trust-grid'),
      trustCards:     this.section.querySelectorAll('.c-seo-guide__trust-card'),

      // CTA Chat button
      consultBtn:     this.section.querySelector('#seo-advisor-btn')
    };

    // Observers and pointers
    this._observer = null;
    this._listeners = [];
    this.hasGsap = typeof window.gsap !== 'undefined';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  /**
   * Boot procedures
   * @private
   */
  _init() {
    this._bindEvents();
    this._setupIntersectionObserver();
  }

  /**
   * Bind triggers
   * @private
   */
  _bindEvents() {
    // 1. Guides Tab Switching
    if (this.ui.tablist) {
      const tabClickFn = (e) => {
        const btn = e.target.closest('.c-seo-guide__tab-btn');
        if (!btn || btn.classList.contains('is-active')) return;
        this._switchTab(btn);
      };
      this.ui.tablist.addEventListener('click', tabClickFn);
      this._listeners.push({ el: this.ui.tablist, type: 'click', fn: tabClickFn });

      // Tab Keyboard navigation (Left/Right arrow cycles)
      const tabKeyFn = (e) => {
        const btn = e.target.closest('.c-seo-guide__tab-btn');
        if (!btn) return;
        
        let index = Array.from(this.ui.tabBtns).indexOf(btn);
        let targetIndex = -1;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = (index + 1) % this.ui.tabBtns.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = (index - 1 + this.ui.tabBtns.length) % this.ui.tabBtns.length;
        }

        if (targetIndex > -1) {
          e.preventDefault();
          this.ui.tabBtns[targetIndex].focus();
          this._switchTab(this.ui.tabBtns[targetIndex]);
        }
      };
      this.ui.tablist.addEventListener('keydown', tabKeyFn);
      this._listeners.push({ el: this.ui.tablist, type: 'keydown', fn: tabKeyFn });
    }

    // 2. FAQ Accordion Binds
    if (this.ui.faqTriggers.length) {
      this.ui.faqTriggers.forEach((trigger) => {
        const fn = (e) => {
          e.preventDefault();
          this._toggleFaqItem(trigger);
        };
        trigger.addEventListener('click', fn);
        this._listeners.push({ el: trigger, type: 'click', fn });
      });
    }

    // 3. CTA Action Hook
    if (this.ui.consultBtn) {
      const fn = () => {
        // Removed diagnostic log
        this._emitEvent('LustraAssistant:Trigger', { action: 'start-concierge-chat' });
      };
      this.ui.consultBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.consultBtn, type: 'click', fn });
    }
  }

  /**
   * Switch Active Buying Guide Tab
   * @param {HTMLButtonElement} activeBtn
   * @private
   */
  _switchTab(activeBtn) {
    const targetPanelId = activeBtn.getAttribute('aria-controls');

    // Toggle active markers on tab buttons
    this.ui.tabBtns.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Toggle active markers on tab panels
    this.ui.panels.forEach((panel) => {
      const isTarget = panel.id === targetPanelId;
      panel.classList.toggle('is-active', isTarget);
      panel.setAttribute('aria-hidden', isTarget ? 'false' : 'true');

      if (isTarget && this.hasGsap && !this.prefersReducedMotion) {
        // Stagger fade panel items on tab changes (spec §9)
        window.gsap.fromTo(panel.children, 
          { opacity: 0, y: 12 }, 
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
        );
      }
    });
  }

  /**
   * Expand/Collapse FAQ Item with GSAP scrollHeight interpolation
   * @param {HTMLButtonElement} trigger
   * @private
   */
  _toggleFaqItem(trigger) {
    const item = trigger.closest('.c-seo-faq__item');
    const panel = item.querySelector('.c-seo-faq__panel');
    const arrow = trigger.querySelector('.c-seo-faq__arrow');
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    // 1. First, collapse siblings if one is open to keep layout minimal
    this.ui.faqTriggers.forEach((siblingTrigger) => {
      if (siblingTrigger !== trigger && siblingTrigger.getAttribute('aria-expanded') === 'true') {
        const siblingItem = siblingTrigger.closest('.c-seo-faq__item');
        const siblingPanel = siblingItem.querySelector('.c-seo-faq__panel');
        const siblingArrow = siblingTrigger.querySelector('.c-seo-faq__arrow');

        siblingTrigger.setAttribute('aria-expanded', 'false');
        siblingPanel.setAttribute('aria-hidden', 'true');

        if (this.hasGsap && !this.prefersReducedMotion) {
          window.gsap.to(siblingPanel, { height: 0, duration: 0.35, ease: 'power3.inOut' });
          window.gsap.to(siblingArrow, { rotation: 0, duration: 0.3, ease: 'power3.out' });
        } else {
          siblingPanel.style.height = '0px';
        }
      }
    });

    // 2. Toggle active target
    trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    panel.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');

    if (this.hasGsap && !this.prefersReducedMotion) {
      if (isExpanded) {
        // Collapse
        window.gsap.to(panel, { height: 0, duration: 0.35, ease: 'power3.inOut' });
        window.gsap.to(arrow, { rotation: 0, duration: 0.3, ease: 'power3.out' });
      } else {
        // Expand to inner height limits
        const contentHeight = panel.scrollHeight;
        window.gsap.to(panel, { height: contentHeight, duration: 0.45, ease: 'power3.inOut' });
        window.gsap.to(arrow, { rotation: 180, duration: 0.3, ease: 'power3.out' });
      }
    } else {
      panel.style.height = isExpanded ? '0px' : 'auto';
    }
  }

  /**
   * Set up scroll triggers for reveals
   * @private
   */
  _setupIntersectionObserver() {
    if (!this.ui.trustGrid || !this.hasGsap || this.prefersReducedMotion) return;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger card entries when grid enters viewport (spec §9)
          window.gsap.fromTo(this.ui.trustCards, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }
          );
          this._observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    this._observer.observe(this.ui.trustGrid);
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

    if (this.section) {
      delete this.section.__lustraPlpSeoGuide;
    }

    this._listeners = [];
    this.ui = null;
    this.section = null;
  }
}
