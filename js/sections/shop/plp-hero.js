/**
 * Lustra E-commerce - PLP Hero & Breadcrumbs Controller Module
 * Handles category queries, updates text, runs counter timeline animations, and dispatches filter updates.
 */

export default class PlpHero {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Category mapping configuration metadata
    this.categoriesMap = {
      all: {
        title: 'All Jewellery',
        eyebrow: 'Lustra Atelier Collection',
        desc: 'Sculpted from 18K solid gold and meticulously set with ethically sourced natural diamonds. Each design is a celebration of balance, symmetry, and legacy.',
        count: '1,290',
        collections: '12',
        image: 'assets/images/lifestyle/banner-wedding.webp'
      },
      rings: {
        title: 'Rings & Solitaires',
        eyebrow: 'Lustra Rings Collection',
        desc: 'Explore the pinnacle of ring craftsmanship, from striking statement cocktails to vintage-inspired diamond bands.',
        count: '320',
        collections: '12',
        image: 'assets/images/products/rings-category.webp'
      },
      necklaces: {
        title: 'Necklaces & Pendants',
        eyebrow: 'Lustra Necklaces Collection',
        desc: 'Discover handcrafted collars, chokers, and detailed chains, designed to lay flawlessly and maximize radiance.',
        count: '180',
        collections: '8',
        image: 'assets/images/products/necklaces-category.webp'
      },
      earrings: {
        title: 'Luxury Earrings',
        eyebrow: 'Lustra Earrings Collection',
        desc: 'Frame your expression featuring brilliant diamond hoops, classic solitaires, and cascading drop styling.',
        count: '240',
        collections: '10',
        image: 'assets/images/products/earrings-category.webp'
      },
      bracelets: {
        title: 'Bracelets & Cuffs',
        eyebrow: 'Lustra Bracelets Collection',
        desc: 'Embellish your wrists with solid gold cuffs, modular diamond bangles, and layered fine chains.',
        count: '150',
        collections: '7',
        image: 'assets/images/products/bangles-category.webp'
      },
      wedding: {
        title: 'Wedding & Bridal House',
        eyebrow: 'Lustra Bridal House',
        desc: 'Celebrate life’s most precious vows. Tailored ornaments blending cultural heritage with contemporary diamond luster.',
        count: '290',
        collections: '6',
        image: 'assets/images/lifestyle/banner-wedding.webp'
      },
      bridal: {
        title: 'Wedding & Bridal House',
        eyebrow: 'Lustra Bridal House',
        desc: 'Celebrate life’s most precious vows. Tailored ornaments blending cultural heritage with contemporary diamond luster.',
        count: '290',
        collections: '6',
        image: 'assets/images/lifestyle/banner-wedding.webp'
      },
      mens: {
        title: "Men's Fine Collection",
        eyebrow: "Lustra Men's Collection",
        desc: 'Sophisticated aesthetics meets solid structural build. Fine signet rings, textured bracelets, and robust chains.',
        count: '110',
        collections: '5',
        image: 'assets/images/products/rings-category.webp'
      }
    };

    // DOM selectors
    this.breadcrumbCurrent = this.section.querySelector('#breadcrumb-current-cat');
    this.titleNode = this.section.querySelector('#plp-category-heading');
    this.eyebrowNode = this.section.querySelector('#plp-hero-eyebrow-text');
    this.descNode = this.section.querySelector('#plp-hero-description-text');
    this.imageNode = this.section.querySelector('#plp-hero-banner-image');
    this.prodCountNode = this.section.querySelector('#plp-stat-product-count');
    this.collCountNode = this.section.querySelector('#plp-stat-collection-count');

    // Interactive buttons/chips
    this.chips = this.section.querySelectorAll('.c-plp-chip');
    this.featuredBtn = this.section.querySelector('#btn-hero-featured-action');
    this.advisorBtn = this.section.querySelector('#btn-hero-advisor-action');

    // Bind event handlers
    this.chipBound = this.handleChipClick.bind(this);
    this.featuredBound = this.handleFeaturedClick.bind(this);
    this.advisorBound = this.handleAdvisorClick.bind(this);

    // Initial state
    this.hasAnimated = false;

    this.init();
  }

  init() {
    this.parseCategoryFromUrl();

    // Setup intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playEntranceSequence();
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.section);

    // Bind events
    this.chips.forEach(chip => chip.addEventListener('click', this.chipBound));
    if (this.featuredBtn) this.featuredBtn.addEventListener('click', this.featuredBound);
    if (this.advisorBtn) this.advisorBtn.addEventListener('click', this.advisorBound);
  }

  /**
   * Reads window query search params to dynamically update hero copy
   */
  parseCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const catParam = (params.get('category') || params.get('theme') || 'all').toLowerCase();

    const data = this.categoriesMap[catParam] || this.categoriesMap.all;

    // Apply values to HTML nodes
    if (this.breadcrumbCurrent) this.breadcrumbCurrent.innerText = data.title;
    if (this.titleNode) this.titleNode.innerText = data.title;
    if (this.eyebrowNode) this.eyebrowNode.innerText = data.eyebrow;
    if (this.descNode) this.descNode.innerText = data.desc;
    if (this.prodCountNode) this.prodCountNode.innerText = data.count;
    if (this.collCountNode) this.collCountNode.innerText = data.collections;
    if (this.imageNode && data.image) {
      this.imageNode.src = data.image;
      this.imageNode.alt = `Lustra premium ${data.title} category detail showcase`;
    }

    // Set highlight chip if active
    this.chips.forEach(chip => {
      const filterAttr = chip.getAttribute('data-filter');
      if (filterAttr === catParam) {
        this.chips.forEach(c => {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');
      }
    });
  }

  /**
   * GSAP entrance animation pipeline
   */
  playEntranceSequence() {
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

    // Step 1: Fade breadcrumbs
    tl.from('.c-breadcrumb', { opacity: 0, y: -10, duration: 0.5 });

    // Step 2: Slide left elements
    tl.from([this.eyebrowNode, this.titleNode, this.descNode, '.c-plp-hero__actions'], {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1
    }, '-=0.3');

    // Step 3: Reveal right image
    if (this.imageNode) {
      tl.from(this.imageNode.parentNode, { scale: 0.98, opacity: 0, duration: 1.0 }, '-=0.6');
    }

    // Step 4: Stagger stats cards
    tl.from('.c-plp-stat-card', { y: 15, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');

    // Step 5: Fade navigation chips
    tl.from('.c-plp-hero__navigation', { y: 10, opacity: 0, duration: 0.5 }, '-=0.3');
  }

  instantLoad() {
    this.section.querySelectorAll('.c-breadcrumb, .c-plp-hero__eyebrow, .c-plp-hero__title, .c-plp-hero__desc, .c-plp-hero__actions, .c-plp-hero__img-container, .c-plp-stat-card, .c-plp-hero__navigation')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * Handles navigation chip triggers
   */
  handleChipClick(e) {
    const chip = e.currentTarget;
    const filter = chip.getAttribute('data-filter');

    // Update active visual status
    this.chips.forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');

    // Dispatch global sorting filter events
    document.dispatchEvent(new CustomEvent('PLPFilter:Change', {
      detail: { filter }
    }));

    // Trigger visual feedback toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: `Displaying collection: ${chip.innerText}`, type: 'info' }
    }));
  }

  handleFeaturedClick() {
    document.dispatchEvent(new CustomEvent('PLPFeaturedEdit:View', {
      detail: { source: 'plp-hero' }
    }));
  }

  handleAdvisorClick() {
    document.dispatchEvent(new CustomEvent('AdvisorChat:Open', {
      detail: { context: 'plp-collection-styles' }
    }));
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) this.observer.disconnect();
    this.chips.forEach(chip => chip.removeEventListener('click', this.chipBound));
    if (this.featuredBtn) this.featuredBtn.removeEventListener('click', this.featuredBound);
    if (this.advisorBtn) this.advisorBtn.removeEventListener('click', this.advisorBound);
  }
}
