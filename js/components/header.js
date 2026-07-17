/**
 * Lustra E-commerce - Global Header Component Module
 * Manages sticky state toggles, announcement bar scroll hiding, active page tags, and mobile navigation states.
 */

export default class Header {
  constructor(element) {
    if (!element) return;
    this.header = element;
    
    // Select dynamic UI items
    this.announcementBar = document.getElementById('announcement-bar');
    this.menuTrigger = document.getElementById('menu-trigger');
    this.searchTrigger = document.getElementById('search-trigger');
    
    // Bind context instances to handlers
    this.scrollBound = this.handleScroll.bind(this);
    this.menuBound = this.toggleMobileMenu.bind(this);
    
    // State Tracking variables
    this.lastScrollY = window.scrollY;
    this.isMenuOpen = false;
    this.stickyThreshold = 50;

    this.init();
  }

  init() {
    // Bind Event Listeners
    window.addEventListener('scroll', this.scrollBound, { passive: true });
    
    if (this.menuTrigger) {
      this.menuTrigger.addEventListener('click', this.menuBound);
    }

    // Set Initial Active Navigation Link
    this.setActiveLink();
    
    // Initialize announcement rotation logic
    this.initAnnouncements();
  }

  /**
   * Evaluates sticky rules and announcement displays on scroll
   */
  handleScroll() {
    const currentScrollY = window.scrollY;

    // Sticky Solid Class Toggle
    if (currentScrollY > this.stickyThreshold) {
      this.header.classList.add('is-sticky');
    } else {
      this.header.classList.remove('is-sticky');
    }

    // Hide/Show announcement bar on down scroll
    if (this.announcementBar) {
      if (currentScrollY > 100) {
        this.announcementBar.classList.add('is-hidden');
        this.header.style.top = '0';
      } else {
        this.announcementBar.classList.remove('is-hidden');
        if (!this.header.classList.contains('is-sticky')) {
          this.header.style.top = '36px';
        }
      }
    }

    this.lastScrollY = currentScrollY;
  }

  /**
   * Toggles mobile menu drawer display state
   */
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuTrigger.setAttribute('aria-expanded', this.isMenuOpen.toString());
    
    // Toggle active classes on page layouts
    document.body.classList.toggle('u-overflow-hidden', this.isMenuOpen);
    
    // Emit global event for page drawers components to react to
    const eventName = this.isMenuOpen ? 'MobileMenu:Open' : 'MobileMenu:Close';
    document.dispatchEvent(new CustomEvent(eventName));
  }

  /**
   * Highlights current active page nav page-link
   */
  setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = this.header.querySelectorAll('.c-nav__link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.endsWith(href)) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Starts cyclical auto-rotation on announcements track items
   */
  initAnnouncements() {
    if (!this.announcementBar) return;
    const items = this.announcementBar.querySelectorAll('.c-announcement-bar__item');
    if (items.length <= 1) return;

    let currentIndex = 0;
    
    this.announcementInterval = setInterval(() => {
      items[currentIndex].classList.remove('is-active');
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add('is-active');
    }, 4000); // Rotate announcements every 4 seconds
  }

  /**
   * Release event bindings and intervals during disposal runs
   */
  destroy() {
    window.removeEventListener('scroll', this.scrollBound);
    
    if (this.menuTrigger) {
      this.menuTrigger.removeEventListener('click', this.menuBound);
    }
    
    if (this.announcementInterval) {
      clearInterval(this.announcementInterval);
    }
  }
}
