/**
 * Lustra Platform - Global Event Mediator
 * Decoupled event bus enabling micro-modules to bind and trigger messaging channels
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Bind event callback listener
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Remove event callback listener
   */
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * Broadcast event payload updates
   */
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event listener for ${event}:`, err);
      }
    });
  }
}

const instance = new EventEmitter();
export default instance;
