/**
 * Lustra Platform - Product Listing Page (PLP) Filters & Sorting Controller
 * Fully supports accessible keyboard navigation, GSAP animations,
 * state synchronization, and dual slider range track rendering.
 */

export default class PlpFiltersController {
  constructor(container) {
    this.container = container || document.getElementById('plp-controls-section');
    if (!this.container) return;

    // Cache elements
    this.overlay = document.getElementById('filter-overlay');
    this.sidebar = document.getElementById('plp-filter-sidebar');
    this.mobileTrigger = document.getElementById('mobile-filter-trigger');
    this.mobileBadge = document.getElementById('mobile-filter-badge');
    
    // Sort Dropdown elements
    this.sortContainer = document.getElementById('sort-dropdown-container');
    this.sortTrigger = document.getElementById('sort-trigger');
    this.sortVal = document.getElementById('current-sort-val');
    this.sortOptions = this.sortContainer ? this.sortContainer.querySelectorAll('.c-sort-dropdown__item') : [];

    // Layout triggers
    this.gridToggle = document.getElementById('grid-view-toggle');
    this.listToggle = document.getElementById('list-view-toggle');

    // Accordions
    this.accordions = this.container.querySelectorAll('.c-accordion');

    // AI Smart panel
    this.aiToggle = document.getElementById('ai-recommendation-toggle');
    this.aiBody = document.getElementById('ai-smart-body');

    // Price sliders
    this.minSlider = document.getElementById('price-slider-min');
    this.maxSlider = document.getElementById('price-slider-max');
    this.minInput = document.getElementById('price-num-min');
    this.maxInput = document.getElementById('price-num-max');
    this.sliderTrack = document.getElementById('price-slider-track');

    // Chip container & count
    this.chipsContainer = document.getElementById('active-chips-container');
    this.clearAllBtn = document.getElementById('clear-all-filters-btn');
    this.productCountText = document.getElementById('active-product-count');
    this.emptyState = document.getElementById('plp-empty-state-view') || this.container.querySelector('.c-plp-empty-state');

    // Global listener pointers
    this.globalKeydownHandler = null;
    this.globalClickHandler = null;

    // Init process
    this.init();
  }

  init() {
    this.setupAccordions();
    this.setupSortDropdown();
    this.setupLayoutToggle();
    this.setupPriceSlider();
    this.setupFilterListeners();
    this.setupAiConsultant();
    this.setupAccessibility();

    // Cache instances to window for global access
    window.LustraFilters = this;
  }

  /**
   * Set up Collapsible Accordion sections
   */
  setupAccordions() {
    this.accordions.forEach(accordion => {
      const trigger = accordion.querySelector('.c-accordion__trigger');
      const panel = accordion.querySelector('.c-accordion__panel');

      if (trigger && panel) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          
          trigger.setAttribute('aria-expanded', !isExpanded);
          
          if (isExpanded) {
            // Collapse
            if (window.gsap) {
              window.gsap.to(panel, {
                height: 0,
                opacity: 0,
                duration: 0.35,
                ease: 'power2.out',
                onComplete: () => panel.classList.add('is-collapsed')
              });
            } else {
              panel.classList.add('is-collapsed');
            }
          } else {
            // Expand
            panel.classList.remove('is-collapsed');
            if (window.gsap) {
              window.gsap.fromTo(panel, 
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
              );
            }
          }
        });
      }
    });
  }

  /**
   * Sort Dropdown interaction
   */
  setupSortDropdown() {
    if (!this.sortTrigger || !this.sortContainer) return;

    this.sortTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.sortContainer.classList.contains('is-open');
      if (isOpen) {
        this.closeSortDropdown();
      } else {
        this.openSortDropdown();
      }
    });

    this.sortOptions.forEach(option => {
      option.addEventListener('click', () => {
        const text = option.textContent.trim();
        const value = option.getAttribute('data-value');

        // Update selected state
        this.sortOptions.forEach(opt => opt.classList.remove('is-selected'));
        option.classList.add('is-selected');

        if (this.sortVal) this.sortVal.textContent = text;
        this.sortTrigger.setAttribute('aria-label', `Sort products, currently sorted by ${text}`);
        this.closeSortDropdown();

        // Trigger Event Dispatch to notify Grid to update elements order
        const event = new CustomEvent('lustra:sort', { detail: { value } });
        document.dispatchEvent(event);
      });
    });

    // Close on click outside
    this.globalClickHandler = (e) => {
      if (this.sortContainer && !this.sortContainer.contains(e.target)) {
        this.closeSortDropdown();
      }
    };
    document.addEventListener('click', this.globalClickHandler);
  }

  openSortDropdown() {
    if (!this.sortContainer || !this.sortTrigger) return;
    this.sortContainer.classList.add('is-open');
    this.sortTrigger.setAttribute('aria-expanded', 'true');
    
    if (window.gsap) {
      const list = this.sortContainer.querySelector('.c-sort-dropdown__list');
      if (list) {
        window.gsap.fromTo(list, 
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  }

  closeSortDropdown() {
    if (!this.sortContainer || !this.sortTrigger) return;
    this.sortContainer.classList.remove('is-open');
    this.sortTrigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Toggle layout between Grid and List views
   */
  setupLayoutToggle() {
    if (this.gridToggle && this.listToggle) {
      this.gridToggle.addEventListener('click', () => {
        this.gridToggle.classList.add('is-active');
        this.gridToggle.setAttribute('aria-pressed', 'true');
        this.listToggle.classList.remove('is-active');
        this.listToggle.setAttribute('aria-pressed', 'false');
        
        document.dispatchEvent(new CustomEvent('lustra:layout', { detail: { view: 'grid' } }));
      });

      this.listToggle.addEventListener('click', () => {
        this.listToggle.classList.add('is-active');
        this.listToggle.setAttribute('aria-pressed', 'true');
        this.gridToggle.classList.remove('is-active');
        this.gridToggle.setAttribute('aria-pressed', 'false');
        
        document.dispatchEvent(new CustomEvent('lustra:layout', { detail: { view: 'list' } }));
      });
    }
  }

  /**
   * Price Range slider calculation
   */
  setupPriceSlider() {
    if (!this.minSlider || !this.maxSlider) return;

    const updateSliderTrack = () => {
      const minVal = parseInt(this.minSlider.value);
      const maxVal = parseInt(this.maxSlider.value);
      const minLimit = parseInt(this.minSlider.min);
      const maxLimit = parseInt(this.minSlider.max);

      const leftPercent = ((minVal - minLimit) / (maxLimit - minLimit)) * 100;
      const rightPercent = 100 - (((maxVal - minLimit) / (maxLimit - minLimit)) * 100);

      if (this.sliderTrack) {
        this.sliderTrack.style.left = `${leftPercent}%`;
        this.sliderTrack.style.right = `${rightPercent}%`;
      }

      if (this.minInput) this.minInput.value = minVal;
      if (this.maxInput) this.maxInput.value = maxVal;
      
      this.updateActiveFilterState();
    };

    const handleMinSlider = () => {
      const minVal = parseInt(this.minSlider.value);
      const maxVal = parseInt(this.maxSlider.value);
      if (minVal >= maxVal - 50000) {
        this.minSlider.value = maxVal - 50000;
      }
      updateSliderTrack();
    };

    const handleMaxSlider = () => {
      const minVal = parseInt(this.minSlider.value);
      const maxVal = parseInt(this.maxSlider.value);
      if (maxVal <= minVal + 50000) {
        this.maxSlider.value = minVal + 50000;
      }
      updateSliderTrack();
    };

    this.minSlider.addEventListener('input', handleMinSlider);
    this.maxSlider.addEventListener('input', handleMaxSlider);

    // Number Inputs
    if (this.minInput && this.maxInput) {
      this.minInput.addEventListener('change', () => {
        let val = parseInt(this.minInput.value);
        const maxVal = parseInt(this.maxSlider.value);

        if (isNaN(val) || val < 20000) val = 20000;
        if (val >= maxVal - 50000) val = maxVal - 50000;

        this.minSlider.value = val;
        updateSliderTrack();
      });

      this.maxInput.addEventListener('change', () => {
        let val = parseInt(this.maxInput.value);
        const minVal = parseInt(this.minSlider.value);

        if (isNaN(val) || val > 1000000) val = 1000000;
        if (val <= minVal + 50000) val = minVal + 50000;

        this.maxSlider.value = val;
        updateSliderTrack();
      });
    }

    // Run first render layout spacing
    updateSliderTrack();
  }

  /**
   * Filter State management and chip track synchronization
   */
  setupFilterListeners() {
    // Listen for inputs updates
    const inputs = this.container.querySelectorAll('.c-custom-control__input, .c-swatch__input');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateActiveFilterState();
      });
    });

    if (this.clearAllBtn) {
      this.clearAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearAllFilters();
      });
    }

    // Mobile Sidebar Drawer bindings
    if (this.mobileTrigger) {
      this.mobileTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openFilters();
      });
    }
  }

  /**
   * Update applied state chips in horizontal toolbar bar
   */
  updateActiveFilterState() {
    const listChips = [];
    const inputs = this.container.querySelectorAll('.c-custom-control__input:checked, .c-swatch__input:checked');
    
    // 1. Inputs values chips
    inputs.forEach(input => {
      // Get readable chip text labels
      let label = input.value;
      const labelSibling = input.nextElementSibling;
      if (labelSibling && (labelSibling.classList.contains('c-custom-control__label') || labelSibling.classList.contains('c-swatch__name') || labelSibling.classList.contains('c-swatch__tag'))) {
        label = labelSibling.textContent.trim();
      }

      listChips.push({
        id: `${input.name || 'filter'}-${input.value}`,
        label,
        remove: () => {
          input.checked = false;
          // dispatch change manually
          input.dispatchEvent(new Event('change'));
        }
      });
    });

    // 2. Price slider threshold chip (only show if changed from default)
    if (this.minSlider && this.maxSlider) {
      const minVal = parseInt(this.minSlider.value);
      const maxVal = parseInt(this.maxSlider.value);
      if (minVal > 20000 || maxVal < 800000) {
        listChips.push({
          id: 'price-filter',
          label: `₹${(minVal/1000).toFixed(0)}k - ₹${(maxVal/1000).toFixed(0)}k`,
          remove: () => {
            this.minSlider.value = 20000;
            this.maxSlider.value = 800000;
            // Trigger updates
            this.minSlider.dispatchEvent(new Event('input'));
            this.maxSlider.dispatchEvent(new Event('input'));
          }
        });
      }
    }

    // Render chips HTML list
    if (this.chipsContainer) {
      this.chipsContainer.innerHTML = '';
      
      listChips.forEach(chip => {
        const span = document.createElement('span');
        span.className = 'c-filter-chip';
        span.id = `chip-${chip.id}`;
        
        span.innerHTML = `
          <span>${chip.label}</span>
          <button class="c-filter-chip__remove" aria-label="Remove filter ${chip.label}">
            <svg class="c-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;

        span.querySelector('.c-filter-chip__remove').addEventListener('click', (e) => {
          e.preventDefault();
          
          if (window.gsap) {
            window.gsap.to(span, {
              opacity: 0,
              scale: 0.8,
              width: 0,
              marginRight: 0,
              padding: 0,
              duration: 0.25,
              ease: 'power2.in',
              onComplete: () => chip.remove()
            });
          } else {
            chip.remove();
          }
        });

        this.chipsContainer.appendChild(span);
        
        // Chip arrival animation
        if (window.gsap) {
          window.gsap.from(span, {
            opacity: 0,
            y: 4,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }

    // Synchronize Clear All visibility
    const count = listChips.length;
    if (this.clearAllBtn) {
      if (count > 0) {
        this.clearAllBtn.classList.remove('is-hidden');
      } else {
        this.clearAllBtn.classList.add('is-hidden');
      }
    }

    // Update numbers badge
    if (this.mobileBadge) {
      this.mobileBadge.textContent = count;
      if (count > 0) {
        this.mobileBadge.classList.remove('is-empty');
      } else {
        this.mobileBadge.classList.add('is-empty');
      }
    }

    // Cache mapped chips for external listeners
    this.activeChips = listChips.map(c => ({
      key: c.id.split('-')[0] || 'filter',
      label: c.label,
      value: c.id.split('-').slice(1).join('-') || ''
    }));

    // Filter update hook
    this.dispatchUpdateFilter();
  }

  /**
   * Reset all sliders, checkbox options, inputs
   */
  clearAllFilters() {
    // Checkboxes and radios
    const inputs = this.container.querySelectorAll('.c-custom-control__input, .c-swatch__input');
    inputs.forEach(input => {
      input.checked = false;
    });

    // Dual slider
    if (this.minSlider && this.maxSlider) {
      this.minSlider.value = 20000;
      this.maxSlider.value = 800000;
      // Resets visually
      this.minSlider.dispatchEvent(new Event('input'));
    }

    // AI recommendation
    if (this.aiToggle && this.aiToggle.checked) {
      this.aiToggle.checked = false;
      this.aiToggle.dispatchEvent(new Event('change'));
    }

    // Reset active filters
    this.updateActiveFilterState();
  }

  /**
   * AI Smart personalization toggle
   */
  setupAiConsultant() {
    if (!this.aiToggle || !this.aiBody) return;

    this.aiToggle.addEventListener('change', () => {
      const active = this.aiToggle.checked;
      
      if (active) {
        this.aiBody.classList.remove('is-collapsed');
        if (window.gsap) {
          window.gsap.fromTo(this.aiBody, 
            { height: 0, opacity: 0 }, 
            { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out' }
          );
        }
      } else {
        if (window.gsap) {
          window.gsap.to(this.aiBody, {
            height: 0,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => this.aiBody.classList.add('is-collapsed')
          });
        } else {
          this.aiBody.classList.add('is-collapsed');
        }
      }

      this.updateActiveFilterState();
    });
  }

  triggerAiStylist() {
    if (this.aiToggle) {
      this.aiToggle.checked = true;
      this.aiToggle.dispatchEvent(new Event('change'));
      
      // Notify page
      alert('Lustra Intelligent AI consultant has matched your style DNA successfully!');
    }
  }

  /**
   * Dispatch filters state to parent modules (Grid catalog compiler)
   */
  dispatchUpdateFilter() {
    const activeFilters = {
      categories: Array.from(this.container.querySelectorAll('input[name="category"]:checked')).map(el => el.value),
      collections: Array.from(this.container.querySelectorAll('input[name="collection"]:checked')).map(el => el.value),
      metals: Array.from(this.container.querySelectorAll('input[name="metal"]:checked')).map(el => el.value),
      stones: Array.from(this.container.querySelectorAll('input[name="stone"]:checked')).map(el => el.value),
      colors: Array.from(this.container.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
      occasions: Array.from(this.container.querySelectorAll('input[name="occasion"]:checked')).map(el => el.value),
      gender: Array.from(this.container.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
      availability: Array.from(this.container.querySelectorAll('input[name="availability"]:checked')).map(el => el.value),
      rating: Array.from(this.container.querySelectorAll('input[name="rating"]:checked')).map(el => el.value),
      price: {
        min: this.minSlider ? parseInt(this.minSlider.value) : 20000,
        max: this.maxSlider ? parseInt(this.maxSlider.value) : 800000
      },
      aiEnabled: this.aiToggle ? this.aiToggle.checked : false
    };

    // Calculate dummy match state count to demo the premium Empty status
    const shouldHideProducts = activeFilters.categories.includes('earrings') && activeFilters.metals.includes('platinum') && activeFilters.stones.includes('pearl');
    let pieces = 320;
    if (shouldHideProducts) {
      pieces = 0;
    } else {
      if (activeFilters.categories.length) pieces = Math.floor(pieces / (activeFilters.categories.length * 1.5 + 1));
      if (activeFilters.metals.length) pieces = Math.floor(pieces / 2);
    }
    
    if (this.emptyState) {
      if (shouldHideProducts) {
        this.emptyState.classList.remove('is-hidden');
        if (this.productCountText) this.productCountText.textContent = '(0 Pieces)';
      } else {
        this.emptyState.classList.add('is-hidden');
        if (this.productCountText) {
          this.productCountText.textContent = `(${pieces} Pieces)`;
        }
      }
    }

    // Broadcast change to local grid
    const sortLabel = this.sortVal ? this.sortVal.textContent.trim() : 'Recommended';
    
    document.dispatchEvent(new CustomEvent('LustraFilters:Changed', {
      detail: {
        activeFilters: this.activeChips || [],
        sortLabel: sortLabel,
        total: pieces
      }
    }));

    // Broadcast change
    document.dispatchEvent(new CustomEvent('lustra:filters-changed', { detail: { filters: activeFilters } }));
  }

  /**
   * Handle Mobile Sheet controls (Open/Close Drawer)
   */
  openFilters() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.add('is-active');
      this.overlay.classList.add('is-active');
      if (this.mobileTrigger) this.mobileTrigger.setAttribute('aria-expanded', 'true');
      
      // Focus tracking
      this.sidebar.setAttribute('tabindex', '-1');
      setTimeout(() => this.sidebar.focus(), 100);
    }
  }

  closeFilters() {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.remove('is-active');
      this.overlay.classList.remove('is-active');
      if (this.mobileTrigger) this.mobileTrigger.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * ARIA Accessibility management
   */
  setupAccessibility() {
    this.globalKeydownHandler = (e) => {
      // Escape closes everything
      if (e.key === 'Escape') {
        this.closeFilters();
        this.closeSortDropdown();
      }
    };
    document.addEventListener('keydown', this.globalKeydownHandler);
  }

  /**
   * Event cleanups to prevent DOM memory leaking
   */
  destroy() {
    if (this.globalClickHandler) {
      document.removeEventListener('click', this.globalClickHandler);
    }
    if (this.globalKeydownHandler) {
      document.removeEventListener('keydown', this.globalKeydownHandler);
    }
  }
}
