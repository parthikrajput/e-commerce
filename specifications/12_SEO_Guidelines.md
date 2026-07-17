# 12 SEO & Core Web Vitals Guidelines: Lustra

This document defines search engine optimization (SEO) standards, Structured Data schemas, and Core Web Vitals targets for the Lustra platform.

---

## 1. Meta Tag Standards & Open Graph Configs

Maintain an optimized title and description structure to maximize search visibility and organic click-through rates.

### 1.1 Content Limit Rules
* **Title Length:** Keep titles between **50 and 60 characters** to ensure they display properly in search results.
* **Description Length:** Keep descriptions between **140 and 155 characters** to summarize pages concisely without being cut off.

### 1.2 Core Metadata Structure
```html
<!-- Main Page SEO Tags -->
<title>Lustra | Handcrafted Fine Gold & Diamond Jewelry</title>
<meta name="description" content="Explore handcrafted gold rings, platinum necklaces, and gemstone earrings. Try on virtually and design custom jewelry with Lustra.">
<link rel="canonical" href="https://www.lustra.com/index.html">

<!-- Open Graph Social Media Shares -->
<meta property="og:type" content="website">
<meta property="og:title" content="Lustra | Handcrafted Fine Gold & Diamond Jewelry">
<meta property="og:description" content="Try on luxury rings and necklaces virtually. Handcrafted quality certified by high authorities.">
<meta property="og:image" content="https://www.lustra.com/assets/images/og-main-preview.jpg">
<meta property="og:url" content="https://www.lustra.com/index.html">
```

---

## 2. Heading Hierarchy Rules

* **Single H1:** Each page must contain exactly one `<h1>` tag containing the primary topic, positioned at the top of the content structure (e.g. `<h1 class="page-title">Golden Rings Collection</h1>`).
* **Nested Heading Flow:** Headings must follow a logical, sequential hierarchy (`<h1>` &rarr; `<h2>` &rarr; `<h3>` &rarr; `<h4>`). Avoid skipping levels (e.g., do not place an `<h5>` directly after an `<h2>`).
* **Heading Styling:** Never select heading tags based on visual layout sizes. If a sub-headline requires H2 styling details but functions logically as a paragraph, use a CSS helper class instead of changing the tag:
  ```html
  <p class="h2-style-highlight">Brand Ethos</p>
  ```

---

## 3. Performance & Core Web Vitals Targets

Lustra targets a Lighthouse performance score of **&ge; 98** and aims for clean passes across all Core Web Vitals metrics.

| Core Web Vitals Metric | Benchmark Target | Tech Implementation Tactics |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | `< 2.5s` | Preload critical hero images, defer non-critical javascript scripts, implement code splitting. |
| **Interaction to Next Paint (INP)** | `< 200ms` | Debounce scroll event handlers, run heavy script execution tasks on separate execution threads. |
| **Cumulative Layout Shift (CLS)** | `< 0.1` | Set explicit width and height dimensions on all image and iframe blocks; reserve space for dynamic blocks using loaders. |

---

## 4. Image Optimization Rules

* **Next-Gen File Formats:** Convert and deliver styling assets in high-efficiency WebP or AVIF image files.
* **Lazy Loading:** Add the native `loading="lazy"` attribute to all images below the page fold, while setting `loading="eager"` on critical above-the-fold assets:
  ```html
  <img src="card-ring.webp" alt="Minimal Solitaire Gold Ring" loading="lazy">
  ```
* **Specific Resolutions:** Always include explicit width and height dimensions on image wrappers to prevent shifting layouts on page load:
  ```html
  <img src="product.webp" width="300" height="400" alt="Necklace Product">
  ```

---

## 5. Structured Data & JSON-LD Schemas

Provide search engines with structured context using JSON-LD schemas to enable rich snippets and highlight product details in search results.

### 5.1 JSON-LD Schema: Product Page
Include the following schema block in the head element of every product details page:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "The Celestial Gold Necklace",
  "image": [
    "https://www.lustra.com/assets/images/products/celestial-necklace-3-4.jpg"
  ],
  "description": "Exquisite 18k solid gold lariat necklace featuring hand-set certified diamonds.",
  "sku": "LUS-NEC-CEL-01",
  "brand": {
    "@type": "Brand",
    "name": "Lustra"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.lustra.com/shop/necklaces/celestial.html",
    "priceCurrency": "INR",
    "price": "78000",
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Lustra"
    }
  }
}
</script>
```

### 5.2 JSON-LD Schema: Site navigation rules
Place this schema on the homepage to link category search options directly to sitelinks search inputs:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Lustra",
  "url": "https://www.lustra.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.lustra.com/shop/index.html?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```
