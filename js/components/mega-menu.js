/**
 * Lustra E-commerce - Premium Mega Menu Module
 * Coordinates dropdown hover triggers with delays, esc/click-outside dismissals, and responsive accordion shifts.
 */

export default class MegaMenu {
  constructor() {
    // Select triggers and menu panels
    this.triggers = document.querySelectorAll('.c-nav__trigger');
    this.menus = document.querySelectorAll('.c-mega-menu');
    this.backdrop = document.getElementById('overlay-backdrop');
    
    // Bind context instances to handlers
    this.closeAllBound = this.closeAll.bind(this);
    this.escapeBound = this.handleEscape.bind(this);
    this.clickOutsideBound = this.handleClickOutside.bind(this);
    
    this.hoverTimeout = null;
    this.activeMenu = null;

    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      const targetId = trigger.getAttribute('aria-controls');
      const menu = document.getElementById(targetId);
      if (!menu) return;

      // Desktop Hover Listeners
      trigger.addEventListener('mouseenter', () => this.queueOpen(menu, trigger));
      trigger.addEventListener('mouseleave', () => this.queueClose(menu));
      menu.addEventListener('mouseenter', () => this.cancelClose(menu));
      menu.addEventListener('mouseleave', () => this.queueClose(menu));

      // Mobile Touch Click Listeners
      trigger.addEventListener('click', (e) => this.handleTriggerClick(e, menu, trigger));

      // Keyboard Focus Trapping inside menu
      this.initKeyboardNav(menu, trigger);
    });

    // Mobile Accordion Titles toggles action
    this.initMobileAccordions();

    // Document listener hooks for dismissals
    document.addEventListener('keydown', this.escapeBound);
    document.addEventListener('click', this.clickOutsideBound);
  }

  /**
   * Opens the mega menu panel after a 150ms hover delay
   */
  queueOpen(menu, trigger) {
    if (window.innerWidth < 992) return; // Disable hover actions on tablet/mobile
    clearTimeout(this.hoverTimeout);

    this.hoverTimeout = setTimeout(() => {
      this.open(menu, trigger);
    }, 150);
  }

  /**
   * Closes active mega menu panels after a 250ms hover delay
   */
  queueClose(menu) {
    if (window.innerWidth < 992) return;
    clearTimeout(this.hoverTimeout);

    this.hoverTimeout = setTimeout(() => {
      this.close(menu);
    }, 250);
  }

  /**
   * Cancels scheduled close actions while cursor remains over target components
   */
  cancelClose() {
    clearTimeout(this.hoverTimeout);
  }

  /**
   * Opens a specific mega menu panel and displays the backdrop
   */
  open(menu, trigger) {
    this.closeAll();
    
    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    this.activeMenu = menu;

    if (this.backdrop) {
      this.backdrop.classList.add('is-active');
    }
  }

  /**
   * Closes the active mega menu panel and hides the backdrop
   */
  close(menu) {
    if (!menu) return;
    menu.classList.remove('is-open');

    const trigger = document.querySelector(`[aria-controls="${menu.id}"]`);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (this.activeMenu === menu) {
      this.activeMenu = null;
    }

    // Hide backdrop list only if no other panels remain open
    if (!this.activeMenu && this.backdrop) {
      this.backdrop.classList.remove('is-active');
    }
  }

  /**
   * Closes all open mega menu panels
   */
  closeAll() {
    this.menus.forEach(menu => this.close(menu));
  }

  /**
   * Toggles dropdown states on touch viewports, preventing default click routing
   */
  handleTriggerClick(e, menu, trigger) {
    if (window.innerWidth >= 992) return;
    e.preventDefault();

    const isOpen = menu.classList.contains('is-open');
    if (isOpen) {
      this.close(menu);
    } else {
      this.open(menu, trigger);
    }
  }

  /**
   * Closes active mega menu panels when the Escape key is pressed
   */
  handleEscape(e) {
    if (e.key === 'Escape' && this.activeMenu) {
      const trigger = document.querySelector(`[aria-controls="${this.activeMenu.id}"]`);
      this.close(this.activeMenu);
      if (trigger) trigger.focus(); // Shift focus back to the menu trigger
    }
  }

  /**
   * Closes active mega menu panels when clicking outside the menu elements
   */
  handleClickOutside(e) {
    if (!this.activeMenu) return;

    const navItem = e.target.closest('.c-nav__item');
    const isClickInsideMenu = e.target.closest('.c-mega-menu');

    if (!navItem && !isClickInsideMenu) {
      this.closeAll();
    }
  }

  /**
   * Sets up keyboard navigation and arrow key support inside the menu
   */
  initKeyboardNav(menu, trigger) {
    const focusableLinks = menu.querySelectorAll('a, button');
    if (focusableLinks.length === 0) return;

    const firstEl = focusableLinks[0];
    const lastEl = focusableLinks[focusableLinks.length - 1];

    // Listen for tab focus boundary jumps
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            trigger.focus();
            this.close(menu);
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            this.close(menu);
          }
        }
      }
    });
  }

  /**
   * Configures collapsible accordion sub-menus on mobile devices
   */
  initMobileAccordions() {
    this.menus.forEach(menu => {
      const titleHeaders = menu.querySelectorAll('.c-mega-menu__title');
      
      titleHeaders.forEach(title => {
        title.addEventListener('click', () => {
          if (window.innerWidth >= 992) return;

          const linksList = title.nextElementSibling;
          if (!linksList) return;

          const isExpanded = linksList.classList.contains('is-expanded');
          title.classList.toggle('is-active', !isExpanded);
          linksList.classList.toggle('is-expanded', !isExpanded);
        });
      });
    });
  }

  /**
   * Release event bindings and intervals during disposal runs
   */
  destroy() {
    document.removeEventListener('keydown', this.escapeBound);
    document.removeEventListener('click', this.clickOutsideBound);
    clearTimeout(this.hoverTimeout);
  }
}
