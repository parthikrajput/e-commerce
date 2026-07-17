# Luxury Jewellery E-commerce Design System

### Version 1.0 (Premium, Modern, Minimal, Gen Z)

**Design Principles**

-   Premium First
-   Minimal but Emotional
-   Mobile First
-   Luxury Through White Space
-   Smooth Micro-interactions
-   High Accessibility (WCAG AA)
-   AI-Driven Shopping Experience
-   Soft Luxury, Not Flashy

------------------------------------------------------------------------

# 1. Color Palette

## Primary Colors

  Token           Color       Usage
  --------------- ----------- ---------------------------------
  Primary Gold    `#C9A96E`   Primary CTA, Premium Highlights
  Dark Charcoal   `#1A1A1A`   Primary Text
  Pure White      `#FFFFFF`   Background
  Ivory           `#FAF8F5`   Secondary Background
  Platinum Gray   `#E9E7E2`   Borders

## Neutral Scale

  Token         Hex
  ------------- -----------
  Neutral 900   `#121212`
  Neutral 800   `#2A2A2A`
  Neutral 700   `#444444`
  Neutral 600   `#666666`
  Neutral 500   `#8A8A8A`
  Neutral 400   `#B0B0B0`
  Neutral 300   `#D2D2D2`
  Neutral 200   `#ECECEC`
  Neutral 100   `#F6F6F6`

## Accent Colors

  Token       Color       Usage
  ----------- ----------- --------------------
  Emerald     `#2F855A`   Success
  Ruby        `#D64545`   Sale / Error
  Sapphire    `#2563EB`   Information
  Amber       `#F4B740`   Rewards
  Rose Gold   `#D7A7A0`   AI Recommendations

## Gradient Palette

``` css
/* Luxury Gold */
linear-gradient(135deg,#D9C28C,#C9A96E)

/* Rose Luxury */
linear-gradient(135deg,#F7E3E1,#D7A7A0)

/* Dark Luxury */
linear-gradient(180deg,#1A1A1A,#2B2B2B)

/* Premium Glass */
background: rgba(255,255,255,.6);
backdrop-filter: blur(30px);
```

------------------------------------------------------------------------

# 2. Typography

## Font Family

**Heading:** Playfair Display

**Body:** Inter

## Font Scale

  Token          Size   Weight
  ------------ ------ --------
  Display XL       64      700
  Display L        52      700
  H1               44      700
  H2               36      700
  H3               30      600
  H4               24      600
  H5               20      600
  H6               18      600
  Body XL          18      400
  Body L           16      400
  Body M           14      400
  Caption          12      400
  Label            11      500

------------------------------------------------------------------------

# 3. Spacing System

8px Grid

  Token     Value
  ------- -------
  xs            4
  sm            8
  md           16
  lg           24
  xl           32
  2xl          40
  3xl          48
  4xl          64
  5xl          80
  6xl          96

Section Spacing

-   Desktop: 80px
-   Tablet: 60px
-   Mobile: 40px

------------------------------------------------------------------------

# 4. Border Radius

  Token     Radius
  ------- --------
  xs             4
  sm             8
  md            12
  lg            16
  xl            24
  xxl           32
  Pill       999px

Component Usage

-   Buttons: 16px
-   Cards: 24px
-   Inputs: 14px
-   Bottom Sheet: 32px
-   Image Cards: 28px

------------------------------------------------------------------------

# 5. Shadows

``` css
/* Card */
0 2px 6px rgba(0,0,0,.05)

/* Floating */
0 8px 24px rgba(0,0,0,.08)

/* Dialog */
0 20px 60px rgba(0,0,0,.12)

/* Premium Glow */
0 0 30px rgba(201,169,110,.25)

/* Glass */
0 10px 40px rgba(0,0,0,.08)
```

------------------------------------------------------------------------

# 6. Buttons

-   Primary
-   Secondary
-   Tertiary
-   Glass Button
-   AI Gradient Button
-   Floating AI Button
-   Icon Button

------------------------------------------------------------------------

# 7. Form Controls

-   Text Field
-   Search Field
-   Dropdown
-   Checkbox
-   Radio Button
-   Toggle
-   Slider
-   Chips
-   OTP Field

------------------------------------------------------------------------

# 8. Icon Guidelines

## Style

-   Rounded
-   2px Stroke
-   24 × 24 Default
-   Outline by Default
-   Filled for Active States

## Categories

-   Navigation
-   Product
-   Shopping
-   AI
-   Social
-   Status

------------------------------------------------------------------------

# Component Tokens

  Component           Specification
  ------------------- --------------------------------
  Grid                12 / 8 / 4 Columns
  Max Width           1440px
  Touch Target        48 × 48px
  Container Padding   24 / 20 / 16px
  Animation           200ms / 300ms / 500ms
  Easing              `cubic-bezier(0.4, 0, 0.2, 1)`
  Blur                20px, 30px

------------------------------------------------------------------------

This design system is optimized for a premium AI-powered jewellery
e-commerce platform targeting Gen Z users.
