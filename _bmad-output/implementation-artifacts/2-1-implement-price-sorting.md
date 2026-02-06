# Story 2.1: Implement Price Sorting

**As a user (Sarah optimizing her budget),**
**I want to sort product comparisons by price from low to high,**
**So that I can quickly identify the cheapest option and save money.**

## Acceptance Criteria

**Given** I am viewing product comparison results
**When** I select "Sort by Price (Low to High)"
**Then** products are re-sorted with cheapest prices first (FR8)
**And** the cheapest store is highlighted with a "Best Value" badge
**And** the sort option is visually indicated as active
**And** I can toggle back to default sorting
**And** sorting works across all products in the results
**And** the sort state is maintained when I search for new products

## Implementation Notes

- Use MUI Select or ButtonGroup for sort control
- Implement sort logic in React Context
- Add visual indicator (chevron up/down icon)
- Store sort preference in localStorage for session persistence
- Ensure sorting is performant (< 100ms for 100 products)

## Status

**Status:** done
**Epic:** Epic 2 - Filtering, Sorting & Distance
**Created:** 2026-02-05
**Completed:** 2026-02-05

## Implementation Summary

- Added `SortOption` type ('default', 'price-asc', 'price-desc')
- Extended SearchState with `sortBy` field
- Added `SET_SORT` action to reducer
- Created `SortControl` component with ButtonGroup
- Implemented sorting logic using useMemo in SearchResults
- Sorting is based on cheapest available price for each product
- Visual indicator for active sort option (contained vs outlined button)
- Results count displays current sort option
