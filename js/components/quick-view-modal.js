/**
 * ============================================================
 *  QUICK VIEW MODAL — Lustra Reusable Component JavaScript
 *  File:     js/components/quick-view-modal.js
 *  Purpose:  Handles modal state, async data hydration simulation,
 *            GSAP transitions, focus trapping, scroll locking,
 *            gallery slide navigation, and dynamic option updates.
 *  Spec Ref: 16_JavaScript_Architecture, 09_Animation_Guidelines,
 *            11_Accessibility_Guidelines, 04_Component_Library (§14)
 * ============================================================
 */

'use strict';

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

/** Mock Jewelry Database mapped to Page Product IDs */
const MOCK_PRODUCTS_DB = {
  'lst-001': {
    id: 'lst-001',
    name: 'Aura Solitaire Ring',
    collection: 'Aura Collection',
    description: 'A timeless expression of handmade luxury, this signature ring features a high-clarity round solitaire diamond nestled in a meticulous 18K yellow gold band designed for maximum light performance.',
    rating: 4.9,
    reviewCount: 42,
    availability: 'In Stock',
    availabilityClass: 'is-in-stock',
    certification: 'GIA Certified',
    priceCurrent: 145000,
    priceOriginal: 175000,
    discount: '17% OFF',
    emi: '₹12,083/month',
    delivery: 'Free Insured Delivery by Wednesday, July 23',
    metals: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold', 'Platinum'],
    stones: ['0.75ct Round Cut Diamond', '1.0ct Emerald Cut Diamond'],
    sizes: ['Size 5', 'Size 6', 'Size 7', 'Size 8', 'Size 9'],
    images: [IMAGES.ring1, IMAGES.ring2, IMAGES.ring3],
    aiScore: 96,
    aiReason: 'Direct match for your recent search in high-clarity solitaire settings and complements your minimalist wardrobe profile.',
    aiOccasion: 'Engagement, Anniversary Gala',
    aiAdvice: 'Pair with fine diamond studs and neutral silk fabrics to let the solitaire showcase its brilliance.'
  },
  'cushion-aura-ring': {
    id: 'cushion-aura-ring',
    name: 'Cushion Aura Ring',
    collection: 'Aura Collection',
    description: 'Featuring a cushion-cut canary diamond framed by a subtle halo, this handcrafted ring captures the warmth of early sunrise. Built using sustainable recylced metals and certified conflict-free gems.',
    rating: 4.8,
    reviewCount: 19,
    availability: 'Low Stock',
    availabilityClass: 'is-low-stock',
    certification: 'SGL Certified',
    priceCurrent: 185000,
    priceOriginal: 210000,
    discount: '12% OFF',
    emi: '₹15,416/month',
    delivery: 'Free Insured Delivery by Thursday, July 24',
    metals: ['18K Yellow Gold', '18K White Gold', 'Platinum'],
    stones: ['1.2ct Cushion Yellow Diamond', '1.5ct Cushion White Diamond'],
    sizes: ['Size 6', 'Size 7', 'Size 8'],
    images: [IMAGES.ring2, IMAGES.ring1, IMAGES.ring3],
    aiScore: 98,
    aiReason: 'Matches your favorited items in the Lustra Lookbook and coordinates with warm-colored festive silhouettes.',
    aiOccasion: 'Brider Showers, Cocktails',
    aiAdvice: 'Coordinate with off-shoulder dark velvet gowns to allow the canary diamond to pop.'
  },
  'eternity-band': {
    id: 'eternity-band',
    name: 'Eternity Diamond Band',
    collection: 'Lustra Atelier',
    description: 'An unbroken circle of light, this eternity band is set with precision-matched baguette diamonds. An elegant statement of everlasting craftsmanship, perfect for layering.',
    rating: 5.0,
    reviewCount: 31,
    availability: 'In Stock',
    availabilityClass: 'is-in-stock',
    certification: 'GIA Certified',
    priceCurrent: 215000,
    priceOriginal: 215000,
    discount: '',
    emi: '₹17,916/month',
    delivery: 'Free Insured Delivery by Wednesday, July 23',
    metals: ['18K White Gold', '18K Rose Gold', 'Platinum'],
    stones: ['2.0ct Baguette Diamonds'],
    sizes: ['Size 5', 'Size 6', 'Size 7', 'Size 8'],
    images: [IMAGES.ring3, IMAGES.ring1, IMAGES.ring2],
    aiScore: 94,
    aiReason: 'Sized to match your saved profile ring settings and recommended for stacking configurations.',
    aiOccasion: 'Daily Luxury, Reception Dinners',
    aiAdvice: 'Ideal for stacking alongside your Aura Solitaire to create a rich multi-dimensional editorial aesthetic.'
  },
  'emerald-ear-hoops': {
    id: 'emerald-ear-hoops',
    name: 'Marquise Emerald Ear Hoops',
    collection: 'Signature Gemstones',
    description: 'Crafted in 18K yellow gold, these statement hoops feature striking marquise-cut natural emeralds interspersed with brilliant pavé diamonds. Lightweight yet structurally rich.',
    rating: 4.7,
    reviewCount: 14,
    availability: 'In Stock',
    availabilityClass: 'is-in-stock',
    certification: 'IGI Certified',
    priceCurrent: 128000,
    priceOriginal: 145000,
    discount: '11% OFF',
    emi: '₹10,666/month',
    delivery: 'Free Insured Delivery by Saturday, July 26',
    metals: ['18K Yellow Gold', '18K White Gold'],
    stones: ['Natural Emeralds & Pavé Diamonds'],
    sizes: ['One Size'],
    images: [IMAGES.earrings1, IMAGES.earrings2],
    aiScore: 91,
    aiReason: 'Curated based on your preferences for green gemstones and coordinates beautifully with emerald styling lookbooks.',
    aiOccasion: 'Sangeet, Festive Receptions',
    aiAdvice: 'Best worn with hair swept back in a soft low bun to highlight the brilliant emerald drop facets.'
  },
  'link-gold-collar': {
    id: 'link-gold-collar',
    name: 'Link Gold Collar',
    collection: 'Lustra Atelier',
    description: 'Bold, architectural links woven in 18K solid yellow gold. High-polish textures catching light from every angle, finished with an elegant safety clasp lock.',
    rating: 4.9,
    reviewCount: 8,
    availability: 'In Stock',
    availabilityClass: 'is-in-stock',
    certification: 'BIS Hallmark',
    priceCurrent: 340000,
    priceOriginal: 375000,
    discount: '9% OFF',
    emi: '₹28,333/month',
    delivery: 'Free Insured Delivery by Wednesday, July 23',
    metals: ['18K Yellow Gold', 'Platinum'],
    stones: ['No Stones'],
    sizes: ['16 inch', '18 inch'],
    images: [IMAGES.necklace1, IMAGES.necklace2],
    aiScore: 89,
    aiReason: 'Matches your preferences for statement necklines and sculptural design aesthetics.',
    aiOccasion: 'Gala Dinners, High Art Openings',
    aiAdvice: 'Layer over a high-neck dark silk jersey or tuxedo jacket for an assertive, high-fashion statement.'
  }
};

export default class QuickViewModal {
  /**
   * @param {HTMLElement} element - Root wrapper element (.c-quick-view-modal)
   */
  constructor(element) {
    this.modal = element || document.getElementById('quick-view-modal');
    if (!this.modal) {
      console.warn('[QuickViewModal] Initialization cancelled: Root element not found.');
      return;
    }

    if (this.modal.__lustraQuickView) {
      return this.modal.__lustraQuickView;
    }
    this.modal.__lustraQuickView = this;

    // Cache elements (spec §16)
    this.ui = {
      overlay:     this.modal.querySelector('.c-quick-view-modal__overlay'),
      dialog:      this.modal.querySelector('.c-quick-view-modal__dialog'),
      closeBtn:    this.modal.querySelector('.c-quick-view-modal__close-btn'),
      
      // States
      stateLoading: this.modal.querySelector('.c-quick-view-modal__state--loading'),
      stateError:   this.modal.querySelector('.c-quick-view-modal__state--error'),
      stateUnavail: this.modal.querySelector('.c-quick-view-modal__state--unavailable'),
      stateContent: this.modal.querySelector('.c-quick-view-modal__state--content'),
      retryBtn:     this.modal.querySelector('.c-quick-view-modal__retry-btn'),

      // Content Hydration targets
      collection:   this.modal.querySelector('#qv-collection'),
      certBadge:    this.modal.querySelector('#qv-certification'),
      title:        this.modal.querySelector('#qv-product-title'),
      ratingVal:    this.modal.querySelector('#qv-rating-val'),
      ratingCount:  this.modal.querySelector('#qv-review-count'),
      starsContainer: this.modal.querySelector('#qv-stars-container'),
      stockStatus:  this.modal.querySelector('#qv-stock-status'),
      priceCurrent: this.modal.querySelector('#qv-price-current'),
      priceOriginal: this.modal.querySelector('#qv-price-original'),
      discount:     this.modal.querySelector('#qv-discount-percent'),
      emiInfo:      this.modal.querySelector('#qv-emi-info span'),
      deliveryInfo: this.modal.querySelector('#qv-delivery-info span'),
      description:  this.modal.querySelector('#qv-description'),
      
      // Form elements
      optionsForm:  this.modal.querySelector('#qv-options-form'),
      metalSelected: this.modal.querySelector('#qv-metal-selected'),
      metalSwatches: this.modal.querySelector('#qv-metal-swatches'),
      stoneGroup:   this.modal.querySelector('#qv-stone-group'),
      stoneSelected: this.modal.querySelector('#qv-stone-selected'),
      stoneSwatches: this.modal.querySelector('#qv-stone-swatches'),
      sizeGroup:    this.modal.querySelector('#qv-size-group'),
      sizeSelect:   this.modal.querySelector('#qv-size-select'),
      qtyMinus:     this.modal.querySelector('.c-quick-view-modal__qty-btn--minus'),
      qtyPlus:      this.modal.querySelector('.c-quick-view-modal__qty-btn--plus'),
      qtyInput:     this.modal.querySelector('#qv-quantity'),

      // AI panel
      aiCard:       this.modal.querySelector('#qv-ai-insights-card'),
      aiScore:      this.modal.querySelector('#qv-ai-score'),
      aiReason:     this.modal.querySelector('#qv-ai-reason'),
      aiOccasion:   this.modal.querySelector('#qv-ai-occasion'),
      aiAdvice:     this.modal.querySelector('#qv-ai-style-advice'),

      // Gallery controls
      galleryTrack: this.modal.querySelector('#qv-gallery-track'),
      galleryPrev:  this.modal.querySelector('.c-quick-view-modal__gallery-arrow--prev'),
      galleryNext:  this.modal.querySelector('.c-quick-view-modal__gallery-arrow--next'),
      galleryCurrent: this.modal.querySelector('#qv-gallery-current'),
      galleryTotal: this.modal.querySelector('#qv-gallery-total'),
      galleryCounter: this.modal.querySelector('.c-quick-view-modal__gallery-counter'),
      thumbsTrack:  this.modal.querySelector('#qv-thumbs-track'),

      // Primary CTAs
      cartBtn:      this.modal.querySelector('#qv-add-to-cart-btn'),
      buyBtn:       this.modal.querySelector('#qv-buy-now-btn'),
      detailsBtn:   this.modal.querySelector('#qv-view-details-btn'),
      wishlistToggle: this.modal.querySelector('#qv-wishlist-toggle-btn'),
      shareBtn:     this.modal.querySelector('#qv-share-btn'),
      favBtn:       this.modal.querySelector('.c-quick-view-modal__fav-btn')
    };

    // Modal state attributes
    this.isOpen = false;
    this.currentProductId = null;
    this.triggerElement = null;

    // Gallery state variables
    this.galleryImages = [];
    this.galleryIndex = 0;

    // Track event listeners for clean up
    this._listeners = [];

    this._init();
  }

  /**
   * Boot listeners
   * @private
   */
  _init() {
    this._bindEvents();
  }

  /**
   * Attach global and localized event listeners
   * @private
   */
  _bindEvents() {
    // 1. Global event listeners for triggers
    const triggerHandler = (e) => {
      const productId = e.detail?.productId;
      if (productId) {
        this.open(productId, e.target);
      }
    };
    document.addEventListener('LustraQuickView:Open', triggerHandler);
    this._listeners.push({ el: document, type: 'LustraQuickView:Open', fn: triggerHandler });

    // 2. Overlay & Close triggers
    const closeElements = this.modal.querySelectorAll('[data-action="close"]');
    closeElements.forEach(el => {
      const fn = (e) => {
        e.preventDefault();
        this.close();
      };
      el.addEventListener('click', fn);
      this._listeners.push({ el, type: 'click', fn });
    });

    // 3. Retry Loading trigger
    if (this.ui.retryBtn) {
      const fn = () => {
        if (this.currentProductId) {
          this.open(this.currentProductId, this.triggerElement);
        }
      };
      this.ui.retryBtn.addEventListener('click', fn);
      this._listeners.push({ el: this.ui.retryBtn, type: 'click', fn });
    }

    // 4. Keyboard dismissal mapping
    const keyFn = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', keyFn);
    this._listeners.push({ el: document, type: 'keydown', fn: keyFn });

    // 5. Gallery arrows binding
    if (this.ui.galleryPrev && this.ui.galleryNext) {
      const prevFn = () => this._setGalleryIndex(this.galleryIndex - 1);
      const nextFn = () => this._setGalleryIndex(this.galleryIndex + 1);
      
      this.ui.galleryPrev.addEventListener('click', prevFn);
      this.ui.galleryNext.addEventListener('click', nextFn);
      this._listeners.push({ el: this.ui.galleryPrev, type: 'click', fn: prevFn });
      this._listeners.push({ el: this.ui.galleryNext, type: 'click', fn: nextFn });
    }

    // 6. Option swatch click delegate
    if (this.ui.optionsForm) {
      const formClickFn = (e) => {
        const swatch = e.target.closest('.c-quick-view-modal__swatch');
        if (!swatch) return;
        
        e.preventDefault();
        const type = swatch.dataset.optionType; // 'metal' or 'stone'
        const value = swatch.dataset.optionValue;

        if (type === 'metal') {
          this.ui.metalSwatches.querySelectorAll('.c-quick-view-modal__swatch').forEach(btn => btn.classList.remove('is-active'));
          swatch.classList.add('is-active');
          if (this.ui.metalSelected) this.ui.metalSelected.textContent = value;
        } else if (type === 'stone') {
          this.ui.stoneSwatches.querySelectorAll('.c-quick-view-modal__swatch').forEach(btn => btn.classList.remove('is-active'));
          swatch.classList.add('is-active');
          if (this.ui.stoneSelected) this.ui.stoneSelected.textContent = value;
        }
      };
      this.ui.optionsForm.addEventListener('click', formClickFn);
      this._listeners.push({ el: this.ui.optionsForm, type: 'click', fn: formClickFn });
    }

    // 7. Quantity Incrementers
    this._setupQuantityControls();
  }

  /**
   * Launch and Hydrate the modal
   * @param {string} productId - Product ID string
   * @param {HTMLElement} triggerEl - Triggering button element for focus return
   * @public
   */
  open(productId, triggerEl = null) {
    this.currentProductId = productId;
    this.triggerElement = triggerEl;
    this.isOpen = true;

    // Reset scroll values and locking
    document.body.classList.add('u-scroll-lock');

    // Show modal layer in DOM immediately
    this.modal.classList.add('is-active');
    this.modal.setAttribute('aria-hidden', 'false');

    // Show Loading state first
    this._showState('loading');

    // Focus Trap setup
    this.modal.focus();
    this._bindFocusTrap();

    // Simulate luxury API fetch latency (750ms) to show shimmer loaders
    setTimeout(() => {
      if (!this.isOpen || this.currentProductId !== productId) return;

      const productData = this._fetchProductData(productId);

      if (!productData) {
        this._showState('unavailable');
        return;
      }

      try {
        this._hydrate(productData);
        this._showState('content');
        this._animateEntrance();
      } catch (err) {
        console.error('[QuickViewModal] Hydration error:', err);
        this._showState('error');
      }
    }, 750);
  }

  /**
   * Animate entrance using GSAP (spec §9) or CSS transition
   * @private
   */
  _animateEntrance() {
    const hasGsap = typeof window.gsap !== 'undefined';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasGsap && !prefersReducedMotion) {
      const gsap = window.gsap;
      gsap.fromTo(this.ui.overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power3.out' });
      gsap.fromTo(this.ui.dialog, 
        { opacity: 0, scale: 0.96 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }

  /**
   * Close the modal dialog
   * @public
   */
  close() {
    this.isOpen = false;
    this.currentProductId = null;

    // Remove Scroll Lock
    document.body.classList.remove('u-scroll-lock');

    // GSAP Exit animation or immediate class dismissal
    const hasGsap = typeof window.gsap !== 'undefined';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finalizeClose = () => {
      this.modal.classList.remove('is-active');
      this.modal.setAttribute('aria-hidden', 'true');
      this._unbindFocusTrap();

      // Return focus to trigger element for accessibility
      if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
        this.triggerElement.focus();
      }
    };

    if (hasGsap && !prefersReducedMotion) {
      const gsap = window.gsap;
      gsap.to(this.ui.dialog, {
        opacity: 0,
        scale: 0.96,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: finalizeClose
      });
      gsap.to(this.ui.overlay, { opacity: 0, duration: 0.35, ease: 'power3.in' });
    } else {
      finalizeClose();
    }
  }

  /**
   * Dynamic hydration of details
   * @param {Object} data - Product details object
   * @private
   */
  _hydrate(data) {
    // 1. Text Info
    this.ui.collection.textContent  = data.collection;
    this.ui.certBadge.textContent   = data.certification;
    this.ui.title.textContent       = data.name;
    this.ui.ratingVal.textContent   = data.rating;
    this.ui.ratingCount.textContent = `(${data.reviewCount} reviews)`;
    this.ui.description.textContent = data.description;
    this.ui.stockStatus.textContent = data.availability;

    // Handle stock status color schemes
    this.ui.stockStatus.className = `c-quick-view-modal__stock-tag ${data.availabilityClass}`;

    // 2. Stars creation
    this.ui.starsContainer.innerHTML = '';
    const ratingFloor = Math.floor(data.rating);
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= ratingFloor;
      const star = document.createElement('svg');
      star.setAttribute('viewBox', '0 0 24 24');
      star.className = `c-quick-view-modal__star-icon ${isFilled ? 'is-filled' : ''}`;
      star.innerHTML = '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>';
      this.ui.starsContainer.appendChild(star);
    }

    // 3. Pricing & Financials
    this.ui.priceCurrent.textContent = '₹' + data.priceCurrent.toLocaleString('en-IN');
    if (data.priceOriginal > data.priceCurrent) {
      this.ui.priceOriginal.textContent = '₹' + data.priceOriginal.toLocaleString('en-IN');
      this.ui.priceOriginal.style.display = 'inline';
      this.ui.discount.textContent = data.discount;
      this.ui.discount.style.display = 'inline';
    } else {
      this.ui.priceOriginal.style.display = 'none';
      this.ui.discount.style.display = 'none';
    }

    this.ui.emiInfo.textContent = `EMI available from ${data.emi}`;
    this.ui.deliveryInfo.textContent = data.delivery;

    // 4. Selections / Swatches
    this._hydrateOptionSwatches(data);

    // 5. AI Insights Card
    if (data.aiScore > 0) {
      this.ui.aiCard.style.display = 'block';
      this.ui.aiScore.textContent = `${data.aiScore}% Match`;
      this.ui.aiReason.textContent = data.aiReason;
      this.ui.aiOccasion.textContent = data.aiOccasion;
      this.ui.aiAdvice.textContent = data.aiAdvice;
    } else {
      this.ui.aiCard.style.display = 'none';
    }

    // 6. Reset Quantity
    this.ui.qtyInput.value = 1;

    // 7. Initialize Gallery Images
    this._initGallery(data.images);

    // 8. Bind Actions to Product Cart events
    this._setupActionButtons(data);
  }

  /**
   * Render options inside the selection form
   * @param {Object} data
   * @private
   */
  _hydrateOptionSwatches(data) {
    // Metal Swatches
    this.ui.metalSwatches.innerHTML = '';
    if (data.metals && data.metals.length) {
      data.metals.forEach((metal, idx) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `c-quick-view-modal__swatch c-quick-view-modal__swatch--metal ${idx === 0 ? 'is-active' : ''}`;
        button.dataset.optionType = 'metal';
        button.dataset.optionValue = metal;
        button.setAttribute('aria-label', `Select metal color: ${metal}`);
        
        // Define representative colors for swatches
        let hexColor = '#C9A96E'; // Gold
        if (metal.includes('White') || metal.includes('Platinum')) hexColor = '#E5E5E5';
        else if (metal.includes('Rose')) hexColor = '#E0B0A8';

        button.innerHTML = `<span style="background-color: ${hexColor};"></span>`;
        this.ui.metalSwatches.appendChild(button);
      });
      if (this.ui.metalSelected) this.ui.metalSelected.textContent = data.metals[0];
      this.ui.metalSelected.parentNode.parentNode.style.display = 'block';
    } else {
      this.ui.metalSelected.parentNode.parentNode.style.display = 'none';
    }

    // Stone Swatches
    this.ui.stoneSwatches.innerHTML = '';
    if (data.stones && data.stones.length && data.stones[0] !== 'No Stones') {
      data.stones.forEach((stone, idx) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `c-quick-view-modal__swatch c-quick-view-modal__swatch--stone ${idx === 0 ? 'is-active' : ''}`;
        button.dataset.optionType = 'stone';
        button.dataset.optionValue = stone;
        button.textContent = stone;
        this.ui.stoneSwatches.appendChild(button);
      });
      if (this.ui.stoneSelected) this.ui.stoneSelected.textContent = data.stones[0];
      this.ui.stoneGroup.style.display = 'block';
    } else {
      this.ui.stoneGroup.style.display = 'none';
    }

    // Size Dropdown options
    this.ui.sizeSelect.innerHTML = '';
    if (data.sizes && data.sizes.length && data.sizes[0] !== 'One Size') {
      data.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        this.ui.sizeSelect.appendChild(option);
      });
      this.ui.sizeGroup.style.display = 'block';
    } else {
      this.ui.sizeGroup.style.display = 'none';
    }
  }

  /**
   * Set up main gallery images track and thumbnails
   * @param {Array<string>} images
   * @private
   */
  _initGallery(images) {
    this.galleryImages = images || [];
    this.galleryIndex = 0;

    // 1. Build stage images track
    this.ui.galleryTrack.innerHTML = '';
    this.galleryImages.forEach((imgUrl, idx) => {
      const item = document.createElement('div');
      item.className = 'c-quick-view-modal__gallery-item';
      item.innerHTML = `<img src="${imgUrl}" alt="Jewellery item preview ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}">`;
      this.ui.galleryTrack.appendChild(item);
    });

    // 2. Build thumbnails track
    this.ui.thumbsTrack.innerHTML = '';
    this.galleryImages.forEach((imgUrl, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `c-quick-view-modal__thumb-btn ${idx === 0 ? 'is-active' : ''}`;
      btn.setAttribute('aria-label', `View image preview ${idx + 1}`);
      btn.innerHTML = `<img src="${imgUrl}" alt="Thumbnail preview ${idx + 1}">`;
      
      btn.addEventListener('click', () => this._setGalleryIndex(idx));
      this.ui.thumbsTrack.appendChild(btn);
    });

    // 3. Update indicators
    this._setGalleryIndex(0);

    // Hide arrows if only 1 image
    if (this.galleryImages.length <= 1) {
      this.ui.galleryPrev.style.display = 'none';
      this.ui.galleryNext.style.display = 'none';
      this.ui.galleryCounter.style.display = 'none';
    } else {
      this.ui.galleryPrev.style.display = 'flex';
      this.ui.galleryNext.style.display = 'flex';
      this.ui.galleryCounter.style.display = 'block';
    }
  }

  /**
   * Swap active image on slider track
   * @param {number} idx - Index
   * @private
   */
  _setGalleryIndex(idx) {
    if (!this.galleryImages.length) return;

    // Boundary constraints loop
    if (idx < 0) {
      this.galleryIndex = this.galleryImages.length - 1;
    } else if (idx >= this.galleryImages.length) {
      this.galleryIndex = 0;
    } else {
      this.galleryIndex = idx;
    }

    // Slide track translation
    this.ui.galleryTrack.style.transform = `translateX(-${this.galleryIndex * 100}%)`;

    // Update index counter
    if (this.ui.galleryCurrent) {
      this.ui.galleryCurrent.textContent = this.galleryIndex + 1;
    }
    if (this.ui.galleryTotal) {
      this.ui.galleryTotal.textContent = this.galleryImages.length;
    }

    // Sync active thumb indicators
    const thumbs = this.ui.thumbsTrack.querySelectorAll('.c-quick-view-modal__thumb-btn');
    thumbs.forEach((thumb, index) => {
      if (index === this.galleryIndex) {
        thumb.classList.add('is-active');
        thumb.focus();
      } else {
        thumb.classList.remove('is-active');
      }
    });
  }

  /**
   * Setup quantity incrementer logic
   * @private
   */
  _setupQuantityControls() {
    const changeQty = (val) => {
      let currentVal = parseInt(this.ui.qtyInput.value, 10) || 1;
      currentVal += val;
      const min = parseInt(this.ui.qtyInput.min, 10) || 1;
      const max = parseInt(this.ui.qtyInput.max, 10) || 10;
      
      if (currentVal < min) currentVal = min;
      if (currentVal > max) currentVal = max;

      this.ui.qtyInput.value = currentVal;
    };

    const minusFn = () => changeQty(-1);
    const plusFn = () => changeQty(1);

    this.ui.qtyMinus.addEventListener('click', minusFn);
    this.ui.qtyPlus.addEventListener('click', plusFn);

    this._listeners.push({ el: this.ui.qtyMinus, type: 'click', fn: minusFn });
    this._listeners.push({ el: this.ui.qtyPlus, type: 'click', fn: plusFn });

    // Validate manual entry limit
    const changeFn = () => {
      let val = parseInt(this.ui.qtyInput.value, 10) || 1;
      const min = parseInt(this.ui.qtyInput.min, 10) || 1;
      const max = parseInt(this.ui.qtyInput.max, 10) || 10;
      if (val < min) this.ui.qtyInput.value = min;
      if (val > max) this.ui.qtyInput.value = max;
    };
    this.ui.qtyInput.addEventListener('change', changeFn);
    this._listeners.push({ el: this.ui.qtyInput, type: 'change', fn: changeFn });
  }

  /**
   * Wire triggers inside modal details (Cart & Wishlist actions)
   * @param {Object} data
   * @private
   */
  _setupActionButtons(data) {
    // 1. Add To Cart triggers
    const cartHandler = (e) => {
      e.preventDefault();
      
      const btn = this.ui.cartBtn;
      btn.classList.add('is-adding');
      btn.disabled = true;

      // Simulate API latency (700ms)
      setTimeout(() => {
        if (!this.isOpen) return;
        btn.classList.remove('is-adding');
        btn.disabled = false;

        this._emitEvent('LustraCart:Added', {
          productId: data.id,
          productName: data.name,
          quantity: parseInt(this.ui.qtyInput.value, 10) || 1,
          metal: this.ui.metalSelected ? this.ui.metalSelected.textContent : null,
          stone: this.ui.stoneSelected ? this.ui.stoneSelected.textContent : null,
          size: this.ui.sizeSelect.value || null
        });

        // Close after add success
        this.close();
      }, 700);
    };

    // Recreate clean triggers
    this.ui.cartBtn.replaceWith(this.ui.cartBtn.cloneNode(true));
    this.ui.cartBtn = this.modal.querySelector('#qv-add-to-cart-btn');
    this.ui.cartBtn.addEventListener('click', cartHandler);

    // 2. Buy Now action
    const buyHandler = (e) => {
      e.preventDefault();
      this.close();
      // Redirect to checkout with active selections
      window.location.href = `checkout.html?id=${data.id}&qty=${this.ui.qtyInput.value}`;
    };
    this.ui.buyBtn.replaceWith(this.ui.buyBtn.cloneNode(true));
    this.ui.buyBtn = this.modal.querySelector('#qv-buy-now-btn');
    this.ui.buyBtn.addEventListener('click', buyHandler);

    // 3. View Full Details details page anchor link
    if (this.ui.detailsBtn) {
      this.ui.detailsBtn.href = `product.html?id=${data.id}`;
    }

    // 4. Secondary actions Wishlist toggle button
    const wishlistHandler = (e) => {
      e.preventDefault();
      const isActive = this.ui.wishlistToggle.classList.contains('is-active');
      
      this.ui.wishlistToggle.classList.add('is-saving');

      // Simulate API lag
      setTimeout(() => {
        if (!this.isOpen) return;
        this.ui.wishlistToggle.classList.remove('is-saving');

        if (isActive) {
          this.ui.wishlistToggle.classList.remove('is-active');
          this.ui.wishlistToggle.setAttribute('aria-pressed', 'false');
          this._emitEvent('LustraWishlist:Removed', { productId: data.id });
        } else {
          this.ui.wishlistToggle.classList.add('is-active');
          this.ui.wishlistToggle.setAttribute('aria-pressed', 'true');
          this._emitEvent('LustraWishlist:Added', { productId: data.id });
        }
      }, 500);
    };
    this.ui.wishlistToggle.replaceWith(this.ui.wishlistToggle.cloneNode(true));
    this.ui.wishlistToggle = this.modal.querySelector('#qv-wishlist-toggle-btn');
    this.ui.wishlistToggle.addEventListener('click', wishlistHandler);

    // 5. Main Gallery wishlist heart button (syncs with secondary)
    const favHandler = (e) => {
      e.preventDefault();
      const isActive = this.ui.wishlistToggle.classList.contains('is-active');
      this.ui.wishlistToggle.click(); // trigger secondary to keep logic DRY
    };
    
    // Sync main image wishlist toggle status
    const isSaved = document.querySelector(`#wishlist-btn-${data.id}`)?.classList.contains('is-active');
    if (isSaved) {
      this.ui.wishlistToggle.classList.add('is-active');
      this.ui.wishlistToggle.setAttribute('aria-pressed', 'true');
      this.ui.favBtn.classList.add('is-active');
      this.ui.favBtn.setAttribute('aria-pressed', 'true');
    } else {
      this.ui.wishlistToggle.classList.remove('is-active');
      this.ui.wishlistToggle.setAttribute('aria-pressed', 'false');
      this.ui.favBtn.classList.remove('is-active');
      this.ui.favBtn.setAttribute('aria-pressed', 'false');
    }

    this.ui.favBtn.replaceWith(this.ui.favBtn.cloneNode(true));
    this.ui.favBtn = this.modal.querySelector('.c-quick-view-modal__fav-btn');
    this.ui.favBtn.addEventListener('click', favHandler);

    // Observer to keep gallery active indicator synced with footer buttons
    const observer = new MutationObserver(() => {
      const isFavActive = this.ui.wishlistToggle.classList.contains('is-active');
      if (isFavActive) {
        this.ui.favBtn.classList.add('is-active');
      } else {
        this.ui.favBtn.classList.remove('is-active');
      }
    });
    observer.observe(this.ui.wishlistToggle, { attributes: true, attributeFilter: ['class'] });

    // 6. Share trigger
    const shareHandler = (e) => {
      e.preventDefault();
      const shareData = {
        title: data.name,
        text: `Check out the gorgeous ${data.name} on Lustra!`,
        url: window.location.origin + `/product.html?id=${data.id}`
      };

      if (navigator.share) {
        navigator.share(shareData).catch(err => {/* Share error ignored */});
      } else {
        // Fallback: Copy link toast emit
        navigator.clipboard.writeText(shareData.url).then(() => {
          this._emitEvent('LustraToast:Open', {
            type: 'success',
            message: 'Copied jewellery share link to clipboard.'
          });
        });
      }
    };
    this.ui.shareBtn.replaceWith(this.ui.shareBtn.cloneNode(true));
    this.ui.shareBtn = this.modal.querySelector('#qv-share-btn');
    this.ui.shareBtn.addEventListener('click', shareHandler);
  }

  /**
   * Helper state-visual switcher
   * @param {string} state - State key
   * @private
   */
  _showState(state) {
    const states = {
      loading:     this.ui.stateLoading,
      error:       this.ui.stateError,
      unavailable: this.ui.stateUnavail,
      content:     this.ui.stateContent
    };

    Object.keys(states).forEach(key => {
      const node = states[key];
      if (!node) return;
      if (key === state) {
        node.setAttribute('aria-hidden', 'false');
      } else {
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * Find product inside static local memory or generate a fallback
   * @param {string} id - Product ID
   * @returns {Object} Product configurations
   * @private
   */
  _fetchProductData(id) {
    if (MOCK_PRODUCTS_DB[id]) {
      return MOCK_PRODUCTS_DB[id];
    }

    // Dynamic Fallback generator to prevent breaking links across the platform
    // Capitalize and format ID
    const formattedName = id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: id,
      name: formattedName || 'Lustra Designer Piece',
      collection: 'Exquisite Curation',
      description: 'An editorial highlight piece curated from Lustra\'s hand-carved designer archive. Intricate micro-pavé contours outlining hand-polished premium facets.',
      rating: 4.9,
      reviewCount: 12,
      availability: 'In Stock',
      availabilityClass: 'is-in-stock',
      certification: 'GIA Certified',
      priceCurrent: 95000,
      priceOriginal: 110000,
      discount: '13% OFF',
      emi: '₹7,916/month',
      delivery: 'Free Insured Delivery by Friday, July 25',
      metals: ['18K Yellow Gold', '18K White Gold', 'Platinum'],
      stones: ['Premium Solitaire Diamond'],
      sizes: ['One Size'],
      images: [IMAGES.ring1, IMAGES.necklace2, IMAGES.earrings2],
      aiScore: 92,
      aiReason: 'Complements items currently placed inside your local design wishlist collection.',
      aiOccasion: 'Brunch Soirees, Fine Cocktails',
      aiAdvice: 'Layer alongside solid link wrist bracelets for an elevated day-to-evening aesthetic.'
    };
  }

  /**
   * Setup keyboard focus loop trap (spec §11)
   * @private
   */
  _bindFocusTrap() {
    this._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusableEls = this.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      // Filter out hidden elements
      const visibleFocusables = Array.from(focusableEls).filter(el => {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      });

      if (!visibleFocusables.length) {
        e.preventDefault();
        return;
      }

      const firstEl = visibleFocusables[0];
      const lastEl = visibleFocusables[visibleFocusables.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', this._focusTrapHandler);
  }

  /**
   * Release keyboard focus loop trap
   * @private
   */
  _unbindFocusTrap() {
    if (this._focusTrapHandler) {
      document.removeEventListener('keydown', this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
  }

  /**
   * Dispatches custom events
   * @private
   */
  _emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      bubbles: true,
      detail,
    });
    this.modal.dispatchEvent(event);
  }

  /**
   * Safely detach listener observers and destroy resources
   * @public
   */
  destroy() {
    this._listeners.forEach(({ el, type, fn }) => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(type, fn);
      }
    });

    this._unbindFocusTrap();
    document.body.classList.remove('u-scroll-lock');

    if (this.modal) {
      delete this.modal.__lustraQuickView;
    }

    this._listeners = [];
    this.ui = null;
    this.modal = null;
  }
}
