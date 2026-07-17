/**
 * Lustra E-commerce Platform Architecture - main entry point app.js
 * Exposes core page-initialization controllers and registers shared components dynamically.
 */

// Import Core Infrastructure
import EventEmitter from './core/event-emitter.js';
import Router from './core/router.js';

// Import Global Component Handles
import Navbar from './components/navbar.js';
import CartDrawer from './components/cart-drawer.js';
import Footer from './components/footer.js';
import QuickViewModal from './components/quick-view-modal.js';

// Import Web Configurations
import CONFIG from './config/settings.js';

class LustraApp {
  constructor() {
    this.events = EventEmitter;
    this.config = CONFIG;
    
    this.initGlobalComponents();
    this.initRouter();
  }

  /**
   * Initializes shared components present across layouts
   */
  initGlobalComponents() {
    this.navbar     = new Navbar(document.querySelector('.header'));
    this.cartDrawer = new CartDrawer(document.querySelector('.cart-drawer'));
    this.footer     = new Footer(document.querySelector('.c-footer'));
    this.quickView  = new QuickViewModal(document.querySelector('.c-quick-view-modal'));

    // Run once immediately so the back-to-top button is in the correct
    // state if the page loads after the user has already scrolled down
    if (this.footer && typeof this.footer.handleScroll === 'function') {
      this.footer.handleScroll();
    }
  }

  /**
   * Dynamically imports page controllers based on routes
   */
  initRouter() {
    this.router = new Router([
      {
        path: '/',
        controller: () => import('./pages/home.js')
      },
      {
        path: 'shop',
        controller: () => import('./pages/shop.js')
      },
      {
        path: 'product',
        controller: () => import('./pages/product.js')
      },
      {
        path: 'product-detail',
        controller: () => import('./pages/product-detail.js')
      }
    ]);
  }
}

// Instantiate Global App Namespace
document.addEventListener('DOMContentLoaded', () => {
  window.Lustra = new LustraApp();
});
