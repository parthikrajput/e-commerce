/**
 * Lustra Platform - Route-based Module Router
 * Dynmically imports and instantiates page controllers based on matching window paths.
 */
export default class Router {
  constructor(routes = []) {
    this.routes = routes;
    this.currentController = null;
    this.init();
  }

  init() {
    // Listen for history push/pop state adjustments
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Run route matching on page load
    this.handleRoute();
  }

  /**
   * Evaluates location paths and loads the target page handler
   */
  handleRoute() {
    const rawPath = window.location.pathname;
    
    // Normalize path (support default, index.html, index files redirect)
    let path = rawPath;
    if (path.endsWith('/') || path === '') {
      path = '/';
    } else if (path.endsWith('index.html')) {
      // If index.html is loaded from a subfolder, check context
      if (path === '/index.html' || path.endsWith('/index.html')) {
        path = '/';
      }
    }

    // Find configured route
    const route = this.routes.find(r => {
      if (r.path === '/' && path === '/') return true;
      if (r.path !== '/' && path.includes(r.path)) return true;
      return false;
    });

    if (route && typeof route.controller === 'function') {
      route.controller().then(module => {
        // Clear active controllers if any
        if (this.currentController && typeof this.currentController.destroy === 'function') {
          this.currentController.destroy();
        }

        // Instantiate page controller
        if (module.default) {
          const PageController = module.default;
          const rootNode = document.querySelector('body');
          if (rootNode) {
            this.currentController = new PageController(rootNode);
          }
        }
      }).catch(err => {
        console.error(`Failed to dynamic import page module for route path: ${path}`, err);
      });
    }
  }
}
