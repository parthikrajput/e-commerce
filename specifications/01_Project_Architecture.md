# 01 Project Architecture Specification: Lustra

## 1. Project Overview
**Lustra** is a premium, AI-powered jewellery e-commerce platform that transitions traditional high-end jewellery retail into a bespoke, modern, mobile-first, and highly immersive digital experience. Designed specifically to resonate with digital-native demographic trends (Gen Z & Millennials in India, transitioning globally in Phase 2), it leverages artificial intelligence (AI recommendation engines, conversational style advisors, color and outfit matches) and augmented reality (AR Virtual Try-On) to minimize purchase hesitation, reduce return rates, and maximize brand trust.

## 2. Business Goals
* **Conversion Rate Expansion:** Accomplish and sustain an e-commerce conversion rate of **&ge; 5%**.
* **Cart Abandonment Mitigation:** Drive down checkout/cart abandonment to **< 40%**.
* **Average Order Value (AOV) Boost:** Uplift AOV by **+20%** via strategic product bundles, AI personalization, and upsells.
* **Customer Retention & Loyalty:** Boost repeat purchase rate by **+30%** and customer lifetime value (LTV) by **+25%**.
* **AI & AR Feature Adoption:** Achieve **> 50% usage** of AR Try-On and **&ge; 35% growth** in AI-assisted purchases.

## 3. Product Goals
* **Style Discovery Optimization:** Reduce product discovery time to **< 2 minutes** via intuitive search and conversational AI advisors.
* **Trust & Quality Assurance:** Minimize customer hesitation regarding product sizing, authenticity, metals, and real-life appearance.
* **Frictionless Checking Flow:** Secure a task completion rate of **> 95%** and checkout completion rate of **> 85%**.
* **Community-Led Engagement:** Create a modular shop-from-user-posts system that turns customer-generated styling lists into conversion opportunities.

## 4. Target Users
### Primary Profile: The Gen Z Trendsetter (Ages 18-30)
* **Behavior:** Mobile-first, visual-driven, heavily influenced by Instagram/Pinterest, comfortable with conversational AI and AR.
* **Focus:** Self-expression, fast fashion trends, affordable luxury, festive and gifting purchases, quick checkouts.
* **Pain Points:** Choice overload, generic recommendations, lack of visualization.

### Secondary Profile: The Millennial Planner (Ages 30-45)
* **Behavior:** Research-focused, values security, quality certifications, and heritage storytelling.
* **Focus:** Investment purchases, bridal and wedding collections, family gifting, custom-designed premium jewellery.
* **Pain Points:** Hidden costs, security concerns during high-ticket transactions, sizing doubts.

## 5. Competitive Landscape
* **Tanishq:** High offline trust, catalog depth; lacks conversational AI and modern mobile-first UX.
* **CaratLane:** Strong mobile app, active AR; lacks advanced outfit-matching and community integrations.
* **BlueStone:** Good customization options; discovery flow is traditional and static.
* **Pandora:** Strong emotional gifting; lacks deep Indian market-specific design cues and AI assistants.
* **Mejuri:** Clean aesthetics and styling; lacks interactive AR try-ons and tailored Indian collections.

## 6. Comprehensive Features (MVP Scope)
* **Conversational AI Shopping Assistant:** A persistent NLP chatbot acting as a virtual personal stylist.
* **AI Outfit Matcher & Style Advisor:** Core visual upload tool analyzing clothing colors/occasions to dynamically suggest matching accessories.
* **Virtual AR Try-On:** Low-latency WebGL/WebRTC camera feed mapping earrings, rings, necklaces, and bracelets onto users' features.
* **Smart Custom Jewellery Builder:** Interactive configurator choosing metals, diamonds, engravings, and gemstone sizes with instant pricing updates.
* **Smart Discoverability:** Multi-modal support (NLP Text Search, Voice Search, and Image Upload Search).
* **Rewards & Gamified Loyalty Engine:** VIP loyalty tiers, birthday rewards, refer-a-friend credits, and interactive spin wheels.

## 7. Technical Stack
* **Markup:** Semantic HTML5 (structure-first, accessibility-first).
* **Styling:** SCSS (Sass Spec 1.x compliant, structured in 7-1 pattern). No CSS frameworks (such as Tailwind) to maintain high brand flexibility and fine control.
* **Behavior & Logic:** Vanilla JavaScript (ES6+ modular structure) for custom DOM handling.
* **Sliders & Galleries:** Swiper.js (modern touch-responsive touch navigation).
* **Transitions & Micro-animations:** GreenSock Animation Platform (GSAP v3) and ScrollTrigger.
* **Build tool & Dev environment:** Native Vite (highly performant HMR bundle management) or live server compilation.
* **Asset Optimization:** WebP image formatting, SVGs for UI icons, CDN delivery models.

## 8. Website Architecture
```
Lustra Platform Map
├── 01. Home Page (/index.html)
├── 02. Shop Listing (/shop/index.html)
├── 03. Product Details (/shop/product.html)
├── 04. AI Style Advisor (/ai/advisor.html)
├── 05. AI Outfit Matcher (/ai/outfit-match.html)
├── 06. Virtual Try-On Hub (/try-on/index.html)
├── 07. Custom Jewellery Builder (/builder/index.html)
├── 08. Community Inspiration (/community/index.html)
├── 09. Wishlist Portal (/wishlist/index.html)
├── 10. Shopping Cart (/cart/index.html)
├── 11. Checkout System (/checkout/index.html)
├── 12. Order Success Page (/checkout/success.html)
├── 13. Order Tracking Portal (/orders/track.html)
├── 14. User Dashboard (/profile/index.html)
│   ├── Order History
│   ├── Address Manager
│   ├── Saved Payment Methods
│   └── Rewards & Achievements
├── 15. Authentication Hub (/auth/index.html)
│   ├── Login / OTP Sign In
│   ├── Password Reset
│   └── Sign-Up
└── 16. Support & FAQ (/support/index.html)
```

## 9. Development Rules
1. **Mobile-First Construction:** Build layout grids and sizing for mobile viewport breaks first ($viewport-sm), then scale up incrementally to desktop layout structures.
2. **Strict Code Ownership:** Zero inline style attributes. Styling is completely isolated to SCSS stylesheets.
3. **No UI Code in Spec-only Development Phase:** Design specifications must describe component configurations, layouts, and hooks without coding markup or stylesheets natively.
4. **No External Library Sprawl:** Only use curated packages (GSAP, Swiper.js) to guarantee 99.9% runtime performance.

## 10. Naming Conventions
* **CSS/SCSS Class Names:** Follow BEM (Block-Element-Modifier) pattern:
  * Block: `.product-card`
  * Element: `.product-card__title`
  * Modifier: `.product-card__title--featured`, `.button--primary`
* **JavaScript File Names:** Lowercase with hyphens indicating module behavior (e.g., `ai-chat-handler.js`).
* **SCSS Partial File Names:** Prepended by underscore (e.g., `_buttons.scss`).
* **Variable Tokens:** CamelCase or kebab-case matching standard systems (e.g., `--color-primary-gold` or `$font-playfair`).

## 11. Folder Structure (Project Root)
```
/
├── index.html
├── specifications/      # Complete Architected Specs + Moved Source Briefs
│   ├── 01_Project_Architecture.md ... 27_Lustra_Design_System.md
│   ├── Lustra_UX_Brief.md
│   ├── Lustra_UX_Case_Study.md
│   ├── Lustra_Website_Information_Architecture.md
│   ├── Luxury_Jewellery_Design_System.md
│   ├── Luxury_Jewellery_Microcopy_Guide.md
│   ├── Project_Management_Platform.md
│   └── Senior_UX_Audit_Framework.md
├── scss/
│   ├── abstracts/       # Variables, functions, mixins
│   ├── base/            # Reset, typography, utility margins
│   ├── components/      # Reusable components (e.g., buttons, cards)
│   ├── layout/          # Header, footer, grid layers
│   ├── pages/           # Page-specific styling rules
│   ├── themes/          # Gold, Rose Gold, Premium Dark themes
│   └── main.scss        # Main assembly stylesheet
├── js/
│   ├── modules/         # Modular ES6 controllers
│   ├── utils/           # Utilities, validation filters
│   └── app.js           # Main initialization entry script
├── assets/
│   ├── fonts/           # Local typography (Playfair, Inter)
│   ├── icons/           # Raw custom SVGs
│   └── images/          # Performance optimized web images
└── dist/                # Production build targets
```

## 12. Coding Standards
* **HTML Integrity:** Validate elements via WCAG AA parsers. Implement native ARIA labels for interaction markers.
* **SCSS Strict nesting limits:** Limit nesting depth to a maximum of **3 levels** to keep output files performant.
* **JavaScript Structure:** Modular architecture using standard ES6 classes with clean constructor methods and modular DOM query caching.
* **Performance Targets:** Drive for 100/100 Lighthouse performance metrics. Optimize scripts for deferred or asynchronous loading.
