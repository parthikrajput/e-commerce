/**
 * Lustra E-commerce - Rewards & Loyalty Membership Controller Module
 * Handles 3D parallax tilt effects on glass card overlays, clicks upgrade events, and entrance timelines.
 */

export default class RewardsMembership {
  constructor(element) {
    if (!element) return;
    this.section = element;

    // Select dynamic UI items
    this.storyKids = this.section.querySelectorAll('.c-rewards__eyebrow, .c-rewards__title, .c-rewards__desc, .c-rewards__quote, .c-rewards__narrative, .c-rewards__actions');
    this.membershipCard = this.section.querySelector('#membership-visual-card');
    this.benefitCards = this.section.querySelectorAll('.c-benefit-card');
    this.tierCards = this.section.querySelectorAll('.c-tier-card');
    this.journeyBox = this.section.querySelector('.c-journey--rewards');

    // Controls items selectors
    this.joinBtn = this.section.querySelector('.btn-join-club');
    this.upgradeBtns = this.section.querySelectorAll('.btn-upgrade-tier');

    // Bind event handlers
    this.joinBound = this.handleJoinPrivilege.bind(this);
    this.upgradeBound = this.handleTierUpgrade.bind(this);
    this.tiltBound = this.handleCardTilt.bind(this);
    this.tiltLeaveBound = this.handleCardTiltLeave.bind(this);

    // State parameters
    this.hasAnimated = false;

    this.init();
  }

  init() {
    // Configures modern Intersection Observer triggers to activate animation when visible
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.playEntranceSequence();
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.section);

    // Bind 3D Card Hover movements
    if (this.membershipCard) {
      this.membershipCard.addEventListener('mousemove', this.tiltBound);
      this.membershipCard.addEventListener('mouseleave', this.tiltLeaveBound);
    }

    // Bind button listeners
    if (this.joinBtn) this.joinBtn.addEventListener('click', this.joinBound);
    this.upgradeBtns.forEach(btn => btn.addEventListener('click', this.upgradeBound));
  }

  /**
   * Play entrance reveals utilizing GSAP
   */
  playEntranceSequence() {
    // Check if GSAP is available on page pathways
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

    // Step 1: Reveal left story elements
    tl.from(this.storyKids, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 });

    // Step 2: Pop right membership card
    if (this.membershipCard) {
      tl.from(this.membershipCard, { scale: 0.95, opacity: 0, duration: 1.0 }, '-=0.5');
    }

    // Step 3: Stagger middle benefits cards
    if (this.benefitCards.length > 0) {
      tl.from(this.benefitCards, { y: 25, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5');
    }

    // Step 4: Stagger lower tier cards
    if (this.tierCards.length > 0) {
      tl.from(this.tierCards, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.4');
    }

    // Step 5: Fade timeline
    if (this.journeyBox) {
      tl.from(this.journeyBox, { y: 10, opacity: 0, duration: 0.5 }, '-=0.3');
    }
  }

  /**
   * Bypasses animation paths if system preferences restrict motion
   */
  instantLoad() {
    this.section.querySelectorAll('.c-rewards__eyebrow, .c-rewards__title, .c-rewards__desc, .c-rewards__quote, .c-rewards__narrative, .c-rewards__actions, #membership-visual-card, .c-benefit-card, .c-tier-card, .c-journey--rewards')
      .forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  /**
   * 3D card tilt effect updates on mouse movement
   */
  handleCardTilt(e) {
    if (!this.membershipCard) return;

    const bounds = this.membershipCard.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    // Calculate rotation indices based on mouse coordinates relative to card midpoints
    const midX = bounds.width / 2;
    const midY = bounds.height / 2;
    const rotX = -((mouseY - midY) / midY) * 12; // Max tilt rotation angle: 12deg
    const rotY = ((mouseX - midX) / midX) * 12;

    this.membershipCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  }

  /**
   * Clears card tilt properties when mouse exits boundary bounds
   */
  handleCardTiltLeave() {
    if (!this.membershipCard) return;
    this.membershipCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }

  /**
   * Coordinates join club events
   */
  handleJoinPrivilege() {
    document.dispatchEvent(new CustomEvent('PrivilegeClub:Join', {
      detail: { source: 'rewards-section' }
    }));

    // Trigger visual toast
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: 'Welcome to Privilège Alliance. Account created.', type: 'success' }
    }));
  }

  /**
   * Coordinates tier upgrading events
   */
  handleTierUpgrade(e) {
    const btn = e.currentTarget;
    const tierId = btn.getAttribute('data-tier-id');

    document.dispatchEvent(new CustomEvent('PrivilegeClub:Upgrade', {
      detail: { tierId }
    }));

    // Trigger visual toast
    const tierName = tierId.toUpperCase();
    document.dispatchEvent(new CustomEvent('Toast:Show', {
      detail: { message: `Request to activate ${tierName} has been submitted to your advisor.`, type: 'success' }
    }));
  }

  /**
   * Cleans event monitors and observers on destruction runs
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.membershipCard) {
      this.membershipCard.removeEventListener('mousemove', this.tiltBound);
      this.membershipCard.removeEventListener('mouseleave', this.tiltLeaveBound);
    }

    if (this.joinBtn) this.joinBtn.removeEventListener('click', this.joinBound);
    this.upgradeBtns.forEach(btn => btn.removeEventListener('click', this.upgradeBound));
  }
}
