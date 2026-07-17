# 03 Page Specifications: Lustra Platform

This document details the functional, visual, structural, and behavioral specifications for all target pages on the Lustra platform.

---

## 01. Home Page

* **Objective:** Establish premium brand positioning, drive immediate AI first-touch discovery engagement, and direct users to high-converting product flows.
* **URL:** `/index.html` (Canonical: `https://www.lustra.com/`)
* **Header Style:** Dynamic Glassmorphism Overlay (Transparent light gold backdrop on top of hero image, transitions into frosted blur backdrop on scroll downward).
* **Footer Style:** Full Directory Footer (Includes newsletter, loyalty signup portals, trust badges, and comprehensive sitemap).
* **Sections:**
  1. **Hero Banner:** Full-screen immersive carousel showcasing model photography with parallax scroll transitions.
  2. **AI Shopping Assistant Quick Entry:** High-visibility horizontal section offering instant conversational style suggestions.
  3. **Shop by Category:** Touch-swipe horizontal carousel cards (Rings, Necklaces, Earrings, Bracelets, Men’s Collection).
  4. **Featured Collections:** Curated collection grids with large imagery and narrative-driven titles.
  5. **AI Style Match Showcase:** Engaging mock-interface banner illustrating dynamic outfit matching.
  6. **New Arrivals Slider:** Touch-friendly slider showcasing new product cards.
  7. **Community Inspiration Wall:** A bento-grid display of user-contributed shots with shoppable hotspots.
* **Components:** Primary Buttons, Dynamic Swiper Carousel, Product Cards, Shoppable Image Hotspots, Floating AI Launcher.
* **Primary CTA:** "Discover the Collection" &rarr; Links to `/shop/index.html`; "Style Me with AI" &rarr; Links to `/ai/advisor.html`.
* **SEO Configuration:**
  * **Title:** Lustra | Hardcrafted Fine Jewels & Smart AI Styling Advisor
  * **Description:** Experience the pinnacle of handcrafted fine jewellery. Try on premium pieces virtually, match accessories with your favorite outfits, and discover your jewelry style today.
  * **Schema Type:** `ECommerceWebsite`, `Organization`.
* **Empty States:** Not applicable (static core page).
* **Loading State:** Skeleton blocks matching sizes of category and collection grid components.
* **Error State:** Full-screen fallback display with option to reload and connection check alert.
* **Responsive Behavior:** 
  * Mobile: Main hero changes to a vertical layout aspect ratio; Category elements collapse into a horizontal scrolling row.
  * Desktop: Multi-column grid rows, mega menu interaction overlays.

---

## 02. Shop Listing Page

* **Objective:** Streamline product catalog exploration with advanced, low-friction filters and sorting attributes.
* **URL:** `/shop/index.html` (Supports query parameters: `?category=rings&metal=gold&price=0-50000`)
* **Header Style:** Solid White/Ivory Sticky Header (Provides clean separation from navigation controls).
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Breadcrumb Bar:** Structural location indicator.
  2. **Category Banner:** Minimal header featuring a collection description and title.
  3. **Interactive Filter Toolbar:** Horizon row housing filters for price, metal, stone type, and sizing.
  4. **Product Grid:** Responsive grid structure containing 12 items.
  5. **Pagination Bar:** Interactive controls with dynamic "Load More" utility.
  6. **Recently Viewed Slider:** Row listing items recently interacted with by the user.
* **Components:** Breadcrumb Tracker, Filter Dropdowns, Active Tag Chips, Product Cards, Secondary CTAs, Skeleton Grid Cards.
* **Primary CTA:** "Filter & Sort" (Mobile Drawer Trigger) / "Add to Wishlist" and "View Details" on Product Cards.
* **SEO Configuration:**
  * **Title:** Handcrafted Luxury Rings, Necklaces & Fine Jewelry | Lustra
  * **Description:** Shop our exquisite collections of diamond rings, platinum necklaces, solid gold bracelets, and minimalist gemstone earrings. Free secure shipping.
  * **Schema Type:** `CollectionPage`, `ItemList`.
* **Empty States:** 
  * "No Matches Found" &rarr; Displays when filters return empty. Offers CTA to reset filters or launch the AI Styling Assistant.
* **Loading State:** Shimmering skeleton cards display within grid containers while filtering operations resolve.
* **Error State:** "Service Unavailable" banner displaying a "Retry Connection" action button.
* **Responsive Behavior:**
  * Mobile: Filter toolbar collapses into a clean bottom sheet trigger menu; Product grid switches to a 2-column layout.
  * Desktop: Sidebar filter panel option; Product grid expands to 3 or 4 columns.

---

## 03. Product Details Page

* **Objective:** Present detailed catalog information, maximize customer trust, and drive checkout additions.
* **URL:** `/shop/product.html?id=xxx`
* **Header Style:** Sticky White Header (Scrolls out of view, reappears on scroll up).
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Detailed Breadcrumb:** Product-specific path.
  2. **Image Gallery Workspace:** HD carousel displaying detail photography and product video.
  3. **Product Configuration panel:** Metal, diamond clarity, and ring size selection selectors.
  4. **Pricing Breakout Section:** Detailed breakdown of gold rates, making charges, and diamond costs.
  5. **AR Try-On Trigger Hook:** Prominent entry point to launch the Virtual Try-On camera.
  6. **Artisanal Review & Q&A Board:** Ratings scale display with user upload photos.
  7. **You May Also Adore Slider:** AI-selected product match recommendations.
* **Components:** Selection Chips, AR Try-On Button, Accordion Details, Add-To-Cart Sticky Bar, Review Cards.
* **Primary CTA:** "Add to Jewellery Box" (Cart addition) & "Virtual Try-On" (Camera overlay activation).
* **SEO Configuration:**
  * **Title:** [Product Title] in Solid 18K Gold | Lustra
  * **Description:** Handcrafted [Product Title] featuring premium certified gemstones. Explore 3D details and try on virtually now.
  * **Schema Type:** `Product` (featuring metadata for rating, pricing, and stock levels).
* **Empty States:** "Review Section Initial State": Displays "Be the first to share your thoughts on this handmade design."
* **Loading State:** Image skeleton outlines, line placeholders for text details.
* **Error State:** "Product Not Found" screen indicating the item has retired, providing a catalog link.
* **Responsive Behavior:**
  * Mobile: Gallery collapses into a single-swipe slider with dot indicators; configuration actions transition into a sticky bottom CTA block.
  * Desktop: Split layout featuring a static image display panel alongside a scrollable configuration sidebar.

---

## 04. AI Style Advisor Page

* **Objective:** Provide interactive wardrobe advice and personalized jewelry suggestions.
* **URL:** `/ai/advisor.html`
* **Header Style:** Minimal Floating Navbar Header (Includes back navigation links).
* **Footer Style:** Minimal Compact Footer.
* **Sections:**
  1. **Style Query Workspace:** Interactive workspace for step questions.
  2. **Wardrobe Upload Section:** Image selection tool for outfit photo staging.
  3. **Visual Matching Dashboard:** Real-time matches displaying outfit tones next to jewelry options.
  4. **Recommended Collection:** Grid layout presenting matching products.
* **Components:** Interaction Cards, Image Upload Boxes, Loader Skeletons, Recommended Match Cards.
* **Primary CTA:** "Build My Styling Profile" (Saves user parameters to account database).
* **SEO Configuration:**
  * **Title:** Smart AI Jewelry Style Advisor | Lustra
  * **Description:** Access personalized styling suggestions matching target outfits, color tones, and specific occasions.
  * **Schema Type:** `WebPage`.
* **Empty States:** Upload placeholder displaying instructions to drag/drop outfit images.
* **Loading State:** Pulsing stylized AI aura graphics alongside styling review captions.
* **Error State:** Image analysis failure banner providing suggestions for a clearer second upload.
* **Responsive Behavior:**
  * Mobile: Touch-optimized scroll pages with single-selection slider panels.
  * Desktop: Dynamic split columns showing upload preview alongside the style workspace.

---

## 05. AI Outfit Matcher Page

* **Objective:** Analyze user wardrobe photos to automatically generate and display matching jewelry recommendations.
* **URL:** `/ai/outfit-match.html`
* **Header Style:** Frost Glass Navbar.
* **Footer Style:** Compact Footer.
* **Sections:**
  1. **Visual Drop Area:** Interactive panel to upload or capture outfit photos.
  2. **Color Palette Analyzer:** Extracted color palette visualization panel.
  3. **Matching Jewellery recommendations:** Side-by-side matching results.
* **Components:** Upload Area, Loader Skeletons, Color Palette Swatches, Product Match Grid.
* **Primary CTA:** "Identify Matching Jewelry".
* **SEO Configuration:**
  * **Title:** Match Jewelry to Your Outfits Automatically | Lustra
  * **Description:** Upload your dress pictures to automatically find the perfect gold, diamond, and gemstone jewelry matches.
  * **Schema Type:** `WebPage`.
* **Empty States:** Empty state showing dress outline templates.
* **Loading State:** Scanning graphic overlays over outfit photos.
* **Error State:** "Format Not Recognized" &rarr; Prompts users for JPEG or PNG files.
* **Responsive Behavior:**
  * Mobile: Centered visual upload screen utilizing device-integrated camera access.
  * Desktop: Drag-and-drop workspace layout.

---

## 06. WebGL Virtual Try-On Page

* **Objective:** Enable interactive, real-time virtual try-ons for catalog items.
* **URL:** `/try-on/index.html` (Accepts parameter `?sku=xxx`)
* **Header Style:** Compact Header (Simple navigation back link to product detail view).
* **Footer Style:** No Footer (Matches full-screen viewport layout rules).
* **Sections:**
  1. **Viewport Feed:** Active area showing interactive face/finger tracking.
  2. **Accessory selector:** Swipe-to-change carousel displaying relative items.
  3. **Comparison panel:** Side-by-side option previews.
* **Components:** Camera Toggle, Capture Snapshot Button, Close Button, Product Cards Slider.
* **Primary CTA:** "Take Photo" & "Add Custom Mix to Cart".
* **SEO Configuration:**
  * **Title:** Virtual Jewelry Try-On Sandbox | Lustra
  * **Description:** Try on rings, necklaces, and earrings using your device's camera. See how pieces look in real time.
  * **Schema Type:** `WebPage`.
* **Empty States:** Camera permission request prompt state.
* **Loading State:** "Calibrating Camera Tracking" screen overlay with helpful graphic instructions.
* **Error State:** "Camera Access Denied" fallback page explaining setting adjustment steps.
* **Responsive Behavior:**
  * Mobile: Streamlined interface layout optimizing button positions for easy thumb access.
  * Desktop: Desktop interface displaying detailed material detail comparison panels.

---

## 07. Custom Jewellery Builder Page

* **Objective:** Provide a digital layout workspace to design custom engagement, pendant, or ring styles.
* **URL:** `/builder/index.html` (Supports query: `?base=classic-ring`)
* **Header Style:** Solid Sticky Header.
* **Footer Style:** Compact Footer.
* **Sections:**
  1. **Canvas Workspace:** High-Detail 360 viewer displaying model updates.
  2. **Option Configurator:** Multi-tab layout for selection options.
  3. **Detail Spec readout:** Ongoing summary of selections (Metal, gemstone clarity, cut parameters).
* **Components:** Material Selection Chips, Value Cards, Accordion Tabs, Price Counter Widget.
* **Primary CTA:** "Complete My Design" (Progresses selection directly to checkout stage).
* **SEO Configuration:**
  * **Title:** Design Your Own Luxury Engagement Ring | Lustra Custom Builder
  * **Description:** Personalize gold type, fine diamond cuts, carat values, and custom engravings with real-time pricing updates.
  * **Schema Type:** `WebPage`.
* **Empty States:** Selection initialization view (prompts type choose).
* **Loading State:** Shimmering outlines over preview model view.
* **Error State:** Engine failure fallback providing dynamic page reset link.
* **Responsive Behavior:**
  * Mobile: Toggle switch styling alternates views between the main product model and configuration actions.
  * Desktop: Side-by-side viewport and configuration panel layout.

---

## 08. Community Inspiration Page

* **Objective:** Showcase user-generated styles to build brand engagement and encourage secondary catalog purchases.
* **URL:** `/community/index.html`
* **Header Style:** Glassmorphism overlay.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Inspiration Banner:** Styled community updates section.
  2. **Community Looks Grid:** Bento block layout showing customer photos.
  3. **Submission Zone:** Upload section for sharing layouts.
* **Components:** Shoppable Image Hotspots, Creator Profile Badges, Like Indicators.
* **Primary CTA:** "Shop This Look" / "Share Your Styling".
* **SEO Configuration:**
  * **Title:** Jewelry Style Inspiration & Community Looks | Lustra
  * **Description:** See how others style our fine jewelry. Discover trends, follow creators, and shop user-shared looks.
  * **Schema Type:** `WebPage`.
* **Empty States:** Grid loading fallback message.
* **Loading State:** Shimmering square placeholder grids.
* **Error State:** Refresh prompt button.
* **Responsive Behavior:**
  * Mobile: Single column scroll layout.
  * Desktop: Bento-style masonry grid layout.

---

## 09. Wishlist Portal Page

* **Objective:** Provide customers a central, curated area to store favorited items and configure alerts.
* **URL:** `/wishlist/index.html`
* **Header Style:** Solid White Header.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Wishlist Grid:** Display cards featuring stored items.
  2. **Personalized collections section:** Stored styling matches category cards.
* **Components:** Product Cards, Price Alert Badges, Remove Icon Buttons.
* **Primary CTA:** "Move to Cart" (Action element next to wishlist items).
* **SEO Configuration:**
  * **Title:** My Luxury Jewellery Box | Lustra Wishlist
  * **Description:** Your curated wishlist. Update sizing details, toggle price alerts, and share collections with others.
  * **Schema Type:** `WebPage`.
* **Empty States:** Displaying: "Your wishlist is waiting ✨. Save the pieces you love and they will always be here."
* **Loading State:** Shimmering placeholder product squares.
* **Error State:** Re-authentication prompt page layout.
* **Responsive Behavior:**
  * Mobile: 2-column product layouts.
  * Desktop: 3 or 4-column product layouts.

---

## 10. Shopping Cart Page

* **Objective:** Manage item list selections, enter coupons, and direct users to checkout.
* **URL:** `/cart/index.html`
* **Header Style:** Minimal Header (Displays core trust indicators: "Secure 256-bit Connection").
* **Footer Style:** Minimal Compact Footer.
* **Sections:**
  1. **Bag Overview:** Items list grid.
  2. **Order Totals:** Cart item summaries, tax calculations, and discount updates.
* **Components:** Cart Item Rows, Coupon Input Boxes, Summary Cards.
* **Primary CTA:** "Proceed to Checkout".
* **SEO Configuration:**
  * **Title:** Secure Shopping Cart | Lustra
  * **Description:** Review shopping cart items, add luxury gift wrap, and apply promo codes before check out.
  * **Schema Type:** `WebPage`.
* **Empty States:** Displaying: "Your jewelry box is empty. Let's find something that sparkles just for you."
* **Loading State:** Skeleton cart lists.
* **Error State:** Checkout block error with instructions to verify item stock.
* **Responsive Behavior:**
  * Mobile: Stacked vertical layout featuring floating checkout controls.
  * Desktop: Split layout (Cart list left panel / Checkout summary right sidebar).

---

## 11. Checkout System Page

* **Objective:** Ensure a secure layout to input billing, delivery, and payment preferences.
* **URL:** `/checkout/index.html`
* **Header Style:** Compact Trust Header (Plain logo alongside secure badges).
* **Footer Style:** Compact Trust Footer.
* **Sections:**
  1. **Address Management:** Form templates to input shipper parameters.
  2. **Delivery Slot options:** Selecting preferred delivery slots.
  3. **Payment integrations:** Integrated interfaces for UPI, Cart, Net Banking, and EMI gateways.
* **Components:** Input validation boxes, Checkout Steppers, Secure Badge Indicators.
* **Primary CTA:** "Pay & Complete Order".
* **SEO Configuration:**
  * **Title:** Secure Checkout | Lustra
  * **Description:** Secure payments processing screen. SSL encrypted check out portal.
  * **Schema Type:** `WebPage`.
* **Empty States:** Billing parameters showing placeholder highlights.
* **Loading State:** Active transaction window: "Processing purchase details safely..."
* **Error State:** Payment decline state providing clear options to switch processing networks.
* **Responsive Behavior:**
  * Mobile: Accordion step tabs layout focusing user attention on one input block at a time.
  * Desktop: Multi-column step layout.

---

## 12. Order Success Page

* **Objective:** Confirm successful transaction details and set delivery expectations.
* **URL:** `/checkout/success.html`
* **Header Style:** Compact Header.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Success Indicator:** Order confirmation message.
  2. **Purchase details summary:** Transaction reference number.
* **Components:** Success icons, dynamic tracking links, order print receipt utility buttons.
* **Primary CTA:** "Track Order Delivery" / "Continue Shopping".
* **SEO Configuration:**
  * **Title:** Thank You for Your Order | Lustra Confirmed
  * **Description:** Your order has been placed. We have sent verification details to your email address.
  * **Schema Type:** `WebPage`.
* **Empty States:** Page redirect check parameters.
* **Loading State:** Static page presentation.
* **Error State:** Order status confirmation delay notice displaying contact helpline buttons.
* **Responsive Behavior:**
  * Mobile: Stacked blocks layout.
  * Desktop: Two-column layout (Summary left panel / Brand illustration panel).

---

## 13. Order Tracking Page

* **Objective:** Provide transparent tracking information for active order deliveries.
* **URL:** `/orders/track.html?ord=xxx`
* **Header Style:** Solid Sticky Header.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Delivery tracker timeline:** Graphic status mapping.
  2. **Shipment details panel:** Courier parameters.
* **Components:** Track timelines, support ticket entry widgets.
* **Primary CTA:** "Help Centre Support".
* **SEO Configuration:**
  * **Title:** Track Your Order Status | Lustra
  * **Description:** Live tracking updates for your premium jewelry order. Check current shipment coordinates.
  * **Schema Type:** `WebPage`.
* **Empty States:** Tracker ID error warning template.
* **Loading State:** Scanning tracking points.
* **Error State:** "Data unavailable" fallback block.
* **Responsive Behavior:**
  * Mobile: Vertical timeline tracker layout.
  * Desktop: Dynamic maps overlay.

---

## 14. User Dashboard Page

* **Objective:** Manage orders, store payment methods, track design builder records, and update shipping details.
* **URL:** `/profile/index.html`
* **Header Style:** Solid Sticky Header.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Dashboard Navigation Menu:** Navigation layout panel.
  2. **Details Display Window:** active module management grid.
  3. **Loyalty points review board:** Tier points monitor block.
* **Components:** Loyalty indicators, profile edit form sheets, table details.
* **Primary CTA:** "Redeem Loyalty Vouchers".
* **SEO Configuration:**
  * **Title:** My Account Profile | Lustra Portal
  * **Description:** Manage your profile settings, custom jewelry designs, loyalty rewards points, and addresses.
  * **Schema Type:** `WebPage`.
* **Empty States:** "No Past Orders" panel displaying shopping suggestions.
* **Loading State:** Pulsating grid layout.
* **Error State:** Connection timeout indicator with reconnect prompt.
* **Responsive Behavior:**
  * Mobile: Side-swipe tab slider navigation.
  * Desktop: Left navigation layout block alongside detail management views.

---

## 15. Authentication Hub Page

* **Objective:** Secure registration and login workspace interface blocks.
* **URL:** `/auth/index.html`
* **Header Style:** Minimal Glass Navbar.
* **Footer Style:** Compact Footer.
* **Sections:**
  1. **Secure Access Module:** Auth layout containing signup and login controls.
* **Components:** Input validation fields, third party oauth buttons, password indicators.
* **Primary CTA:** "Sign In Securely".
* **SEO Configuration:**
  * **Title:** Access Your Lustra Account Profile | Secured Login
  * **Description:** Sign in using touch auth protocols. Register to access personalized recommendations.
  * **Schema Type:** `WebPage`.
* **Empty States:** Not applicable.
* **Loading State:** Loading spinner overlay.
* **Error State:** Validation mismatch alert.
* **Responsive Behavior:**
  * Mobile: Single column layouts.
  * Desktop: Image showcase section alongside auth control forms.

---

## 16. Support & FAQ Page

* **Objective:** Assist users with common inquiries regarding shipping, resizing, and return options.
* **URL:** `/support/index.html`
* **Header Style:** Solid Sticky Header.
* **Footer Style:** Full Directory Footer.
* **Sections:**
  1. **Help Category Matrix Selector:** Grid icons directing users to common support articles.
  2. **Frequently Asked Questions accordion block:** Interactive Q&A list.
  3. **Contact Concierge details:** Communication action columns.
* **Components:** Support Categories, Accordion rows, FAQ Search Input.
* **Primary CTA:** "Engage Live Stylist Chat".
* **SEO Configuration:**
  * **Title:** Customer Support & Fine Jewelry resizings | Lustra FAQ
  * **Description:** Learn details about lifetime exchange assurances, return processing times, and jewelry care tips.
  * **Schema Type:** `FAQPage`.
* **Empty States:** "No Results Found" matching query search inputs.
* **Loading State:** Accordion category block skeletons.
* **Error State:** Contact status indicators showing support agent availability alerts.
* **Responsive Behavior:**
  * Mobile: List layouts.
  * Desktop: Two-column grid layouts.
