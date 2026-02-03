# Story 1.3: Create Category Browsing Interface

Status: in-progress

## Story

As a user (Sarah or Uncle Rasheed),
I want to browse products by category,
So that I can discover products without knowing specific names.

## Acceptance Criteria

**Given** I am on the homepage
**When** I click on a category (Cooking Oil, Rice & Grains, Dairy, Beverages)
**Then** all products in that category are displayed (FR2, FR3)
**And** products from all stores are shown (FR6)
**And** results load within 2 seconds (FR5)
**And** categories are accessible via keyboard navigation (FR34)
**And** categories are displayed as pills/chips for easy selection
**And** active category is visually indicated

## Tasks / Subtasks

- [ ] Task 1: Create CategoryFilter component (AC: 1, 5, 6)
  - [ ] Create `src/components/CategoryFilter.tsx` with MUI Chips
  - [ ] Define category list: Cooking Oil, Rice & Grains, Dairy, Beverages, Spices, Flour, Sugar, Tea & Coffee
  - [ ] Implement horizontal scrollable list on mobile (320-480px)
  - [ ] Implement grid layout on desktop (769px+)
  - [ ] Add keyboard navigation support (Arrow keys, Enter, Space)
  - [ ] Ensure touch targets are 44x44px minimum (FR42)
  - [ ] Visually indicate active category (different color/style)
  - [ ] Add "All Categories" option to clear filter

- [ ] Task 2: Extend SearchContext for category filtering (AC: 1, 2)
  - [ ] Add `selectedCategory` to SearchState type
  - [ ] Add `filterByCategory` action to SearchActions
  - [ ] Add `clearCategoryFilter` action
  - [ ] Update reducer to handle category filter actions
  - [ ] Update search results to respect category filter

- [ ] Task 3: Create useCategoryFilter hook (AC: 1, 2)
  - [ ] Create `src/hooks/useCategoryFilter.ts`
  - [ ] Consume SearchContext
  - [ ] Provide `selectedCategory`, `setCategory`, `clearCategory` functions
  - [ ] Handle category change with automatic product filtering

- [ ] Task 4: Update SearchResults to show category badge (AC: 6)
  - [ ] Display active category chip above results
  - [ ] Show "Clear filter" option when category is selected
  - [ ] Update results count to include category context
  - [ ] Show empty state when no products in category

- [ ] Task 5: Create mock category data service (AC: 1, 2)
  - [ ] Create `src/services/mockCategories.ts`
  - [ ] Define categories array with names and descriptions
  - [ ] Add category icons (optional, use MUI icons)
  - [ ] Implement `getProductsByCategory` function
  - [ ] Filter mockProducts by category match

- [ ] Task 6: Integrate CategoryFilter into App.tsx (AC: 1)
  - [ ] Add CategoryFilter component above SearchBar
  - [ ] Ensure proper spacing and responsive layout
  - [ ] Test mobile: horizontal scroll behavior
  - [ ] Test desktop: grid layout behavior
  - [ ] Test keyboard navigation through categories

- [ ] Task 7: Write tests (AC: 1-6)
  - [ ] Create `__tests__/components/CategoryFilter.test.tsx`
  - [ ] Test category selection and active state
  - [ ] Test keyboard navigation (Arrow keys, Enter, Space)
  - [ ] Test "All Categories" clears filter
  - [ ] Test horizontal scroll on mobile
  - [ ] Test touch target sizes (44x44px minimum)
  - [ ] Create `__tests__/hooks/useCategoryFilter.test.ts`
  - [ ] Test category filtering logic
  - [ ] Test clearing category filter

## Dev Notes

### Architecture Compliance (from Architecture Document)

**State Management Pattern (from Architecture):**
- React Context + useReducer for global state
- Extend SearchContext to include category filter state
- Category state: selectedCategory (string | null)

**Component Naming (Must Follow):**
- Component files: `PascalCase.tsx` → CategoryFilter.tsx
- Custom hooks: `usePascalCase.ts` → useCategoryFilter.ts
- Services: `camelCase.ts` → mockCategories.ts

**API Response Format (CRITICAL - Must Follow):**
```typescript
// Success Response
{ success: true, data: [...products] }

// Error Response
{ success: false, error: { code: 'CATEGORY_NOT_FOUND', message: '...', details: {...} } }
```

### Previous Story Intelligence (Story 1.2)

**Story 1.2 Learnings:**
- SearchContext uses useReducer for state management
- `search` and `clearSearch` functions MUST be memoized with useCallback to prevent infinite re-renders
- useDebounce hook (300ms) prevents excessive API calls
- MUI v7.3.7 installed and working
- Jest 30.2.0 configured with jsdom environment
- Type-based project structure: src/components/, src/hooks/, src/services/, src/context/, src/types/

**Critical Bug Fixes from Story 1.2:**
- **Infinite Loop Issue:** Functions in SearchProvider were recreated on every render
  - **Solution:** Use `useCallback` for search/clearSearch with empty deps array
  - **Solution:** Use `useMemo` for context value
  - **Impact:** Prevents continuous re-rendering when state updates
- **SearchBar Fluctuation:** useEffect dependency array included both handleSearch and debouncedQuery
  - **Solution:** Inline search logic in useEffect, only depend on debouncedQuery
  - **Impact:** Stable re-render behavior

**Files Created in Story 1.2:**
- `src/components/SearchBar.tsx` - Search input with debouncing
- `src/components/SearchResults.tsx` - Results display with loading skeleton
- `src/context/SearchContext.tsx` - Search state with useReducer (useCallback, useMemo critical!)
- `src/hooks/useDebounce.ts` - Custom debounce hook (300ms)
- `src/hooks/useSearch.ts` - Search context consumer hook
- `src/services/apiClient.ts` - API wrapper with {success, data/error} format
- `src/services/mockProducts.ts` - Mock product data (8 products, 3 stores)
- `src/types/Error.types.ts` - AppError interface
- `src/types/Product.types.ts` - Product and ProductPrice interfaces
- `src/types/Search.types.ts` - SearchState and SearchAction types

**Mock Products from Story 1.2:**
```typescript
const mockProducts: Product[] = [
  { id: '1', name: 'Cooking Oil 5L', category: 'Cooking Oil', prices: [...] },
  { id: '2', name: 'Basmati Rice 5kg', category: 'Rice', prices: [...] },
  { id: '3', name: 'Daal Chana 1kg', category: 'Pulses', prices: [...] },
  { id: '4', name: 'Daal Moong 1kg', category: 'Pulses', prices: [...] },
  { id: '5', name: 'Wheat Flour (Atta) 5kg', category: 'Flour', prices: [...] },
  { id: '6', name: 'Sugar 1kg', category: 'Sugar', prices: [...] },
  { id: '7', name: 'Red Chili Powder 200g', category: 'Spices', prices: [...] },
  { id: '8', name: 'Tea Whiteners 1kg', category: 'Beverages', prices: [...] }
];
```

**Git Commits from Story 1.2:**
- `74693ea` - feat: implement product search UI (Story 1.2)
- `21d80b7` - fix: address code review issues (Story 1.2)
- `e5945ce` - fix: resolve infinite loop in SearchBar component
- `7213bc2` - fix: prevent infinite re-render loop in SearchContext (CRITICAL LEARNING!)

### Technical Requirements

**Categories to Support (from mockProducts data):**
Based on existing mock data, support these categories:
1. Cooking Oil
2. Rice & Grains (includes Rice, Pulses)
3. Flour
4. Sugar
5. Spices
6. Beverages (Tea & Coffee)
7. Dairy (to be added in future products)
8. All Categories (clears filter)

**Performance Requirements (from PRD):**
- Category filter results must display within 2 seconds - NFR-PERF-01
- No additional API calls for filtering (filter client-side from mock data)
- Category selection should be instant (no debouncing needed for clicks)

**Accessibility Requirements (WCAG AA):**
- Keyboard navigation for categories: Arrow keys to navigate, Enter/Space to select - FR34
- Touch targets minimum 44x44 pixels - FR42
- Screen reader compatibility: ARIA labels for categories - FR41
- Active category must be visually indicated (color, icon, or both)
- Focus indicators for keyboard navigation

**Responsive Design Requirements:**
- Mobile (320-480px): Horizontal scrollable category list
- Desktop (769px+): Grid layout or flex wrap for categories
- Single-column product results on mobile
- Multi-column product results on desktop (2-3 columns)

### Implementation Approach

**Phase 1: Extend SearchContext for Category Filtering**
- Add `selectedCategory: string | null` to SearchState
- Add `FILTER_BY_CATEGORY` and `CLEAR_CATEGORY_FILTER` actions
- Update reducer to handle new actions
- Update mock search to filter by category when selected

**Phase 2: CategoryFilter Component**
- Create CategoryFilter with MUI Chips
- Define category list with names
- Implement responsive layout (scroll mobile, grid desktop)
- Add keyboard navigation (Arrow keys, Enter, Space)
- Add active category visual indication

**Phase 3: Category Data Service**
- Create mockCategories.ts with category definitions
- Implement getProductsByCategory function
- Filter mockProducts by category match

**Phase 4: Integration**
- Add CategoryFilter to App.tsx
- Update SearchResults to show category badge
- Add "Clear filter" functionality
- Test complete user flow

### MUI Component Guidelines

**CategoryFilter Component:**
- Use `Chip` from MUI for category buttons
- Props: categories array, selectedCategory, onCategoryChange
- Mobile: `sx={{ display: 'flex', overflowX: 'auto', gap: 1 }}`
- Desktop: `sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}`
- Active category: `color="primary" variant="filled"`
- Inactive category: `color="default" variant="outlined"`
- Touch targets: `sx={{ minWidth: 44, minHeight: 44 }}`

**Keyboard Navigation:**
- Arrow Left/Right to navigate between categories
- Enter or Space to select category
- Tab to focus on category filter, Shift+Tab to exit

**Visual Indication:**
- Active category: Filled chip with primary color
- Inactive category: Outlined chip with default color
- Hover state: Show clickability on desktop
- Focus ring: MUI default focus-visible styles

### Testing Standards

**Component Tests (React Testing Library):**
- Test category selection changes active state
- Test "All Categories" clears filter
- Test keyboard navigation (Arrow keys, Enter, Space)
- Test touch target sizes (44x44px minimum)
- Test horizontal scroll on mobile
- Test screen reader labels (ARIA)

**Hook Tests:**
- Test category filtering logic
- Test clear category filter
- Test category state persistence

**Integration Tests:**
- Test category filter + search bar interaction
- Test search results update when category selected
- Test "Clear filter" resets to all products

### File Structure (to be created)

**Components:**
- `src/components/CategoryFilter.tsx` - Category selection component

**Hooks:**
- `src/hooks/useCategoryFilter.ts` - Category filter state hook

**Services:**
- `src/services/mockCategories.ts` - Category data service

**Types (to be updated):**
- `src/types/Search.types.ts` - Add selectedCategory to SearchState
- `src/types/Search.types.ts` - Add FILTER_BY_CATEGORY, CLEAR_CATEGORY_FILTER actions

**Tests:**
- `__tests__/components/CategoryFilter.test.tsx`
- `__tests__/hooks/useCategoryFilter.test.ts`

### Dependencies

**Already Installed (from Story 1.1 & 1.2):**
- MUI v7.3.7 (@mui/material, @mui/icons-material)
- React 19.2.0
- TypeScript 5.9.3
- Jest 30.2.0 + React Testing Library 16.3.2

**No Additional Dependencies Needed:**
- All required MUI components already installed
- Use existing MUI Icons for category icons (optional)

### Code Patterns to Follow (Critical Lessons from Story 1.2!)

**State Management in SearchContext:**
```typescript
// CORRECT: Memoize functions to prevent infinite loops
const search = useCallback(async (query: string) => { ... }, []);
const clearSearch = useCallback(() => { ... }, []);

// CORRECT: Memoize context value
const value = useMemo(() => ({
  state,
  search,
  clearSearch,
}), [state, search, clearSearch]);
```

**useEffect Dependency Arrays:**
```typescript
// CORRECT: Only depend on values that trigger the effect
useEffect(() => {
  const performSearch = async () => { ... };
  performSearch();
}, [debouncedQuery, search, clearSearch]);

// WRONG: Including function that changes on every render
const handleSearch = useCallback(async () => { ... }, [debouncedQuery]);
useEffect(() => { handleSearch(); }, [handleSearch, debouncedQuery]);
```

### Category Data Structure

```typescript
interface Category {
  id: string;
  name: string;
  icon?: string; // MUI icon name (optional)
  description?: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All Categories' },
  { id: 'cooking-oil', name: 'Cooking Oil', icon: 'OilBarrel' },
  { id: 'rice-grains', name: 'Rice & Grains', icon: 'RiceBowl' },
  { id: 'flour', name: 'Flour', icon: 'Grain' },
  { id: 'sugar', name: 'Sugar', icon: 'Cube' },
  { id: 'spices', name: 'Spices', icon: 'Spice' },
  { id: 'beverages', name: 'Beverages', icon: 'LocalCafe' },
  { id: 'dairy', name: 'Dairy', icon: 'WaterDrop' }
];
```

### References

**Source: Architecture Document**
- Section: "Frontend Architecture" - State Management: React Context + useReducer
- Section: "API & Communication Patterns" - REST API with {success, data/error} wrapper
- Section: "Implementation Patterns & Consistency Rules" - Naming conventions, structure patterns
- File: `_bmad-output/planning-artifacts/architecture.md`

**Source: PRD**
- FR2: Browse products by category
- FR3: View products from all scraped stores
- FR5: Search results within 2 seconds
- FR6: View products from all scraped stores
- FR34: Keyboard-only navigation
- FR41: Screen reader compatibility
- FR42: Touch targets 44x44px
- File: `_bmad-output/planning-artifacts/prd.md`

**Source: UX Design Specification**
- MUI components for WCAG AA compliance
- Category interface patterns
- File: `_bmad-output/planning-artifacts/ux-design-specification.md`

**Source: Epics File**
- Story 1.3 requirements and implementation notes
- File: `_bmad-output/planning-artifacts/epics.md` (lines 457-480)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - Story creation

### Completion Notes List

*To be populated during implementation*

### File List

**Components Created:**
- `src/components/CategoryFilter.tsx` - Category selection with horizontal scroll (mobile) and flex wrap (desktop), arrow key navigation support, 44x44px touch targets

**Hooks Created:**
- `src/hooks/useCategoryFilter.ts` - Category filter hook with setCategory and clearCategory functions

**Services Created:**
- `src/services/mockCategories.ts` - Category data (9 categories) and getProductsByCategory filtering function

**Types Created:**
- `src/types/Category.types.ts` - Category interface

**Types Modified:**
- `src/types/Search.types.ts` - Added selectedCategory field and FILTER_BY_CATEGORY, CLEAR_CATEGORY_FILTER actions

**Context Modified:**
- `src/context/SearchContext.tsx` - Added filterByCategory and clearCategoryFilter functions with useCallback memoization (prevents infinite loops!)

**Components Modified:**
- `src/components/SearchResults.tsx` - Added category badge display and "Clear filter" button

**Root Modified:**
- `src/App.tsx` - Added CategoryFilter component above SearchBar

**Tests Created:**
- `__tests__/components/CategoryFilter.test.tsx` - 6 tests covering rendering, ARIA roles, click selection, "All Categories" clear filter, Enter key, Space key
- `__tests__/hooks/useCategoryFilter.test.ts` - 4 tests covering context availability, initial state, setCategory, clearCategory

**Files Modified:**
