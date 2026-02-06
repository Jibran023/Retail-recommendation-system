# Story 1.4: Build Multi-Store Price Comparison View

**As a user (Sarah, Ahmed, or Uncle Rasheed),**
**I want to see prices for the same product across multiple stores side-by-side,**
**So that I can identify the cheapest option and make informed decisions.**

## Acceptance Criteria

**Given** I am viewing search or category results
**When** I view a product card
**Then** prices from all scraped stores are displayed side-by-side (FR7)
**And** each price shows the store name prominently (FR13)
**And** the cheapest price is visually highlighted ("Best Value" badge)
**And** the last updated timestamp is displayed for each price (FR17)
**And** in-stock status is shown for each store
**And** the layout is responsive (mobile: stacked, desktop: side-by-side)

## Implementation Notes

- Use MUI Card component for product display
- Create a PriceComparison subcomponent
- Implement visual hierarchy (cheapest price highlighted with green badge)
- Format: "Store Name | PKR 2,650 | In Stock | Updated 2 hours ago"
- Ensure contrast ratios meet WCAG AA (FR35)

## Tasks

- [ ] Create PriceComparisonCard component
- [ ] Add "Best Value" badge for cheapest price
- [ ] Add last updated timestamp display
- [ ] Implement responsive layout (stacked on mobile, side-by-side on desktop)
- [ ] Ensure WCAG AA contrast compliance

## Status

**Status:** done
**Epic:** Epic 1 - Product Search & Discovery
**Created:** 2026-02-05
**Completed:** 2026-02-05

## Implementation Summary

- Created `PriceComparisonCard` component with:
  - Best Value badge (star icon) for cheapest price
  - Visual highlighting with green border and background for best value
  - In-stock/out-of-stock status with icons
  - Relative timestamp display (e.g., "Updated 2 hours ago")
- Responsive layout using Box with flex:
  - Mobile: stacked (100% width)
  - Tablet: 2 columns (calc(50% - 16px))
  - Desktop: 3-4 columns depending on number of prices
- WCAG AA compliant with proper contrast ratios
