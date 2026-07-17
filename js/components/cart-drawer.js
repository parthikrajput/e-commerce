/**
 * Lustra Platform - Shopping Cart Drawer component
 * Coordinates cart slider visibility, line items updates, and drawer triggers.
 */
export default class CartDrawer {
  constructor(element) {
    this.drawer = element || document.querySelector('.c-cart-drawer') || document.querySelector('.cart-drawer');
    this.cartTrigger = document.querySelector('#cart-trigger');

    this.init();
  }

  init() {
    if (this.cartTrigger) {
      this.cartTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    // Close buttons binding inside drawer if layout is present
    if (this.drawer) {
      const closeBtn = this.drawer.querySelector('.c-cart-drawer__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
    }

    // Listen for global cart updates
    document.addEventListener('Cart:Open', () => this.open());
    document.addEventListener('Cart:Close', () => this.close());
  }

  toggle() {
    if (!this.drawer) return;
    const isHidden = this.drawer.getAttribute('aria-hidden') === 'true';
    if (isHidden) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (!this.drawer) return;
    this.drawer.classList.add('is-active');
    this.drawer.setAttribute('aria-hidden', 'false');
    if (this.cartTrigger) this.cartTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('cart-drawer-open');
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('is-active');
    this.drawer.setAttribute('aria-hidden', 'true');
    if (this.cartTrigger) this.cartTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('cart-drawer-open');
  }
}
