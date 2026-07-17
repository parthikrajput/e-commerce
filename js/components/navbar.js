/**
 * Lustra Platform - Global Header Navigation Component
 * Handles sticky transformations, mobile menu overlays, and interactive triggers
 */
export default class Navbar {
  constructor(element) {
    this.header = element || document.querySelector('.c-header') || document.querySelector('.header');
    if (!this.header) return;

    this.menuTrigger = this.header.querySelector('#menu-trigger');
    this.searchTrigger = this.header.querySelector('#search-trigger');
    this.navLinks = this.header.querySelectorAll('.c-nav__trigger');

    this.init();
  }

  init() {
    // Menu mobile toggle
    if (this.menuTrigger) {
      this.menuTrigger.addEventListener('click', () => {
        const isExpanded = this.menuTrigger.getAttribute('aria-expanded') === 'true';
        this.menuTrigger.setAttribute('aria-expanded', !isExpanded);
        document.body.classList.toggle('nav-mobile-open');
      });
    }

    // Scroll sticky headers transitions
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.header.classList.add('is-sticky');
        this.header.classList.add('is-scrolled');
      } else {
        this.header.classList.remove('is-sticky');
        this.header.classList.remove('is-scrolled');
      }
    });

    // Handle accessibility roles
    this.navLinks.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        this.navLinks.forEach(t => t.setAttribute('aria-expanded', 'false'));
        trigger.setAttribute('aria-expanded', !expanded);
      });
    });
  }
}
