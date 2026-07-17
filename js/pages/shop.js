/**
 * Lustra Platform - Product Listing Page (PLP) Controller
 */
import PlpFiltersController from '../sections/shop/plp-filters.js';
import PlpProductGrid from '../sections/shop/plp-product-grid.js';
import PlpPagination from '../sections/shop/plp-pagination.js';
import RecentlyViewed from '../sections/shop/recently-viewed.js';
import AiRecommendations from '../sections/shop/ai-recommendations.js';
import PlpSeoGuide from '../sections/shop/plp-seo-guide.js';

export default class ShopController {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    // Removed diagnostic log

    // Instantiates advanced filters and sorting controllers
    const filterSection = document.getElementById('plp-controls-section');
    if (filterSection) {
      this.filters = new PlpFiltersController(filterSection);
    }

    // Instantiates the product grid layout controller
    const gridSection = document.getElementById('plp-product-grid-section');
    if (gridSection) {
      this.productGrid = new PlpProductGrid(gridSection);
    }

    // Instantiates the pagination controller
    const paginationSection = document.getElementById('plp-pagination-root');
    if (paginationSection) {
      this.pagination = new PlpPagination(paginationSection);
    }

    // Instantiates the recently viewed controller
    const recentlyViewedSection = document.getElementById('recently-viewed-section');
    if (recentlyViewedSection) {
      this.recentlyViewed = new RecentlyViewed(recentlyViewedSection);
    }

    // Instantiates the AI recommendations controller
    const aiRecommendationsSection = document.getElementById('ai-recommendations-section');
    if (aiRecommendationsSection) {
      this.aiRecommendations = new AiRecommendations(aiRecommendationsSection);
    }

    // Instantiates the SEO Guide & FAQs controller
    const seoGuideSection = document.getElementById('plp-seo-guide-section');
    if (seoGuideSection) {
      this.seoGuide = new PlpSeoGuide(seoGuideSection);
    }
  }

  destroy() {
    if (this.filters && typeof this.filters.destroy === 'function') {
      this.filters.destroy();
    }
    if (this.productGrid && typeof this.productGrid.destroy === 'function') {
      this.productGrid.destroy();
    }
    if (this.pagination && typeof this.pagination.destroy === 'function') {
      this.pagination.destroy();
    }
    if (this.recentlyViewed && typeof this.recentlyViewed.destroy === 'function') {
      this.recentlyViewed.destroy();
    }
    if (this.aiRecommendations && typeof this.aiRecommendations.destroy === 'function') {
      this.aiRecommendations.destroy();
    }
    if (this.seoGuide && typeof this.seoGuide.destroy === 'function') {
      this.seoGuide.destroy();
    }
  }
}

