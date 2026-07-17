# 17 Image Guidelines: Lustra Platform

This document outlines the standard image aspect ratios, formatting settings, compression guides, responsive code templates, and file naming structures for the Lustra catalog.

---

## 1. Catalog Image Dimensions & Aspect Ratios

To maintain a consistent look across the site, all visual assets must follow precise resolution guidelines:

| Asset Type | Desktop Resolution | Mobile Resolution | Aspect Ratio | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Image Banner** | `1920px x 1080px` | `800px x 1200px` | `16:9` (D) / `2:3` (M) | Home page showcase banners |
| **Category Card** | `600px x 800px` | `400px x 533px` | `3:4` portrait | Main list directories |
| **Product Card** | `768px x 1024px` | `375px x 500px` | `3:4` vertical | Catalog search grids |
| **Product Closeup Zoom**| `1600px x 1600px` | `1000px x 1000px` | `1:1` square | HD PDP zoom galleries |
| **Inspiration Bento** | `800px x 800px` | `500px x 500px` | `1:1` masonry | Live community look cards |

---

## 2. File Formats & Compression Rules

* **Vector Elements (Logos, Icons, Badges):** Always save and render as pure inline SVGs or external referenced SVGs. Run SVGs through custom vector optimization utilities (like SVGO) to strip unnecessary system metadata:
  ```bash
  svgo icon-catalog.svg --multipass
  ```
* **Catalog Product Items (Transparent Backgrounds):** Save as PNG files with 24-bit transparency. Run files through PNGOUT utilities to reduce file size. Use PNG files primarily when compositing graphics overlays in the 3D Custom Builder or AR Try-On feeds.
* **Photography & Lifestyle Assets:** Convert and save all photography assets in WebP or AVIF format.
* **Compression Level Target:** Save WebP assets using a **75-80% lossy compression quality level**. This maintains sharp luxury visual details while reducing file size by 50-70% compared to legacy JPEG configurations.

---

## 3. Responsive Images Implementation Code

Optimize image loading across different viewports using the `<picture>` tag and `srcset` descriptors.

* **High-Density screens support:** Deliver `2x` resolution assets for Retina and high-density screens:
  ```html
  <picture>
    <!-- Desktop layouts load landscape media -->
    <source media="(min-width: 992px)" 
            srcset="banner-hero-summer-1x.webp 1x, banner-hero-summer-2x.webp 2x" 
            type="image/webp">
    <!-- Tablet layouts load mid-size crop media -->
    <source media="(min-width: 576px)" 
            srcset="banner-hero-summer-tab-1x.webp 1x, banner-hero-summer-tab-2x.webp 2x" 
            type="image/webp">
    <!-- Mobile viewports load portrait crop media -->
    <source media="(max-width: 575px)" 
            srcset="banner-hero-summer-mob-1x.webp 1x, banner-hero-summer-mob-2x.webp 2x" 
            type="image/webp">
    <!-- Fallback default img container config -->
    <img src="banner-hero-summer-1x.webp" 
         width="1920" 
         height="1080" 
         alt="Lustra Handcrafted Summer Diamond Jewels Collection" 
         class="hero-img-stage" 
         loading="eager">
  </picture>
  ```

---

## 4. File Naming Conventions

* **Structure:** All image assets must use lowercase names with hyphens. File names should follow a clear descriptive structure:
  `[type]-[page/category]-[color/variant]-[specific-identifier].[extension]`
* **Asset Prefix System:**
  * `hero-` &rarr; Landing display panels (e.g. `hero-pdp-solitaire.webp`).
  * `prod-` &rarr; Catalog item cards (e.g. `prod-rings-gold-celestial-01.webp`).
  * `cat-` &rarr; Category directory icons (e.g. `cat-necklaces-cuff.webp`).
  * `logo-` &rarr; Brand identity indicators (e.g. `logo-head-primary.svg`).
  * `user-` &rarr; Creator profiles and community photos (e.g. `user-look-ria-stack.webp`).
  * `banner-` &rarr; Wide promotional banner sections (e.g. `banner-promo-wedding-india.webp`).
