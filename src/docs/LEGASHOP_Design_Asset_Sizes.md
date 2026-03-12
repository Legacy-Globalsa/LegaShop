# LEGASHOP Design Asset Sizes

This document lists the current image and banner container sizes used by the app layout so design can prepare assets against the actual UI.

## Shared Layout Rules

- Main content container: max width `1280px`
- Horizontal container padding: `24px` left and `24px` right
- Usable inner width at max desktop container: `1232px`
- Breakpoints in use:
- Mobile: below `768px`
- Tablet: `768px` to `1023px`
- Desktop: `1024px` and up

## Recommended Design Frames

- Mobile reference viewport: `390px` wide
- Tablet reference viewport: `768px` wide
- Desktop reference viewport: `1280px` content container inside a wider browser

## Homepage

### 1. Main Hero Carousel

Component: `BentoHero`

Rendered container sizes:

| Breakpoint | Rendered size | Notes |
|---|---:|---|
| Mobile | `342 x 280` | Full-width inside container |
| Tablet | `720 x 280` | Still single-column |
| Desktop | `921 x 320` | 3-column span inside 4-column grid |

Recommended export sizes:

- Mobile: `684 x 560`
- Tablet: `1440 x 560`
- Desktop: `1842 x 640`

### 2. Hero Side Promo Cards

Component: `BentoHero`

Rendered container sizes:

| Breakpoint | Rendered size | Notes |
|---|---:|---|
| Mobile | Not shown | Hidden below desktop |
| Tablet | Not shown | Hidden below desktop |
| Desktop | `299 x 154` each | Two stacked cards with `12px` gap |

Recommended export sizes:

- Desktop only: `598 x 308` each

### 3. Quick Link Tiles

Component: `QuickLinks`

These are icon tiles, not image containers. No custom artwork is currently required unless the UI is redesigned.

### 4. Category Icon Grid

Component: `CategoryGrid`

These are icon tiles, not image containers. No banner/image export is needed for the current implementation.

### 5. Wide Promo Banner

Component: `PromoBanners`

Rendered container sizes:

| Breakpoint | Rendered size | Notes |
|---|---:|---|
| Mobile | `342 x 160` | Full-width inside container |
| Tablet | `720 x 180` | Full-width inside container |
| Desktop | `1232 x 180` | Max container width |

Recommended export sizes:

- Mobile: `684 x 320`
- Tablet: `1440 x 360`
- Desktop: `2464 x 360`

### 6. Three Small Promo Tiles

Component: `PromoBanners`

Rendered container sizes:

| Breakpoint | Rendered size | Notes |
|---|---:|---|
| Mobile | `342 x 140` each | Stacked vertically |
| Tablet | `232 x 140` each | 3-column layout inside `720px` container |
| Desktop | `402.7 x 140` each | 3-column layout inside `1232px` container |

Recommended export sizes:

- Mobile: `684 x 280` each
- Tablet: `464 x 280` each
- Desktop: `806 x 280` each

## Inner Pages

These hero sections are full-width, text-driven blocks. They do not use fixed image slots in the current code, so the numbers below are practical design targets rather than hard-coded crop boxes.

### 7. 5 SAR Deals Page Hero

Component: `FiveSarDeals`

Rendered behavior:

- Full browser width
- Vertical padding: `40px` mobile, `64px` tablet and up
- Approximate desktop visual height: `360px` to `380px`

Recommended background artboard:

- Mobile: `1170 x 320`
- Tablet: `1536 x 380`
- Desktop: `1920 x 420`

### 8. Nearby Baqalas Page Hero

Component: `StoresPage`

Rendered behavior:

- Full browser width
- Vertical padding: `40px` mobile, `56px` tablet and up
- Approximate desktop visual height: `220px` to `240px`

Recommended background artboard:

- Mobile: `1170 x 260`
- Tablet: `1536 x 280`
- Desktop: `1920 x 300`

### 9. Categories Page Hero

Component: `CategoriesPage`

Rendered behavior:

- Full browser width
- Vertical padding: `40px` mobile, `56px` tablet and up
- Approximate desktop visual height: `210px` to `230px`

Recommended background artboard:

- Mobile: `1170 x 240`
- Tablet: `1536 x 260`
- Desktop: `1920 x 280`

## Implementation Notes

- The homepage hero side cards only appear at desktop widths.
- The homepage main hero remains a single full-width block until the layout reaches the desktop breakpoint.
- The 3 promo tiles stack on mobile and switch to 3 columns from the tablet breakpoint upward.
- The inner-page hero sections are currently gradient sections with text, not fixed-height image banners. If exact image cropping is required, those sections should be refactored to fixed-height hero containers.

## Source References

- `tailwind.config.ts`
- `src/components/BentoHero.tsx`
- `src/components/PromoBanners.tsx`
- `src/components/QuickLinks.tsx`
- `src/components/CategoryGrid.tsx`
- `src/pages/FiveSarDeals.tsx`
- `src/pages/StoresPage.tsx`
- `src/pages/CategoriesPage.tsx`