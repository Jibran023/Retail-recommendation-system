# Story 1.2: Implement Product Search UI

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user (Sarah, Ahmed, or Uncle Rasheed),
I want to search for products by name or keyword,
So that I can quickly find specific products and compare prices across stores.

## Acceptance Criteria

**Given** I am on the homepage
**When** I enter a product name or keyword in the search bar
**Then** search results are displayed within 2 seconds (FR5, NFR-PERF-01)
**And** results show products from all scraped stores (FR6)
**And** search works with both English and Roman Urdu text (FR4)
**And** a loading skeleton is shown while fetching results
**And** an empty state message appears if no products match
**And** an error message is displayed if the search fails

## Tasks / Subtasks

- [ ] Task 1: Create SearchBar component with MUI TextField (AC: 1, 3, 4)
  - [ ] Create `src/components/SearchBar.tsx` with MUI TextField component
  - [ ] Implement controlled component with state management
  - [ ] Add search icon from MUI icons
  - [ ] Add debouncing to reduce API calls (300ms delay)
  - [ ] Support both English and Roman Urdu text input
  - [ ] Ensure keyboard navigation works (FR34)
  - [ ] Make touch target minimum 44x44px (FR42)

- [ ] Task 2: Create SearchContext for state management (AC: 1, 2, 6)
  - [ ] Create `src/context/SearchContext.tsx` with React Context + useReducer
  - [ ] Define search state: { query, results, loading, error }
  - [ ] Create search actions: SEARCH_START, SEARCH_SUCCESS, SEARCH_ERROR
  - [ ] Implement reducer to handle state transitions
  - [ ] Add search results count tracking

- [ ] Task 3: Create SearchResults component (AC: 2, 5, 6)
  - [ ] Create `src/components/SearchResults.tsx` with MUI Grid/Stack
  - [ ] Display search results with loading skeleton
  - [ ] Display empty state message when no products match
  - [ ] Display error message when search fails
  - [ ] Show search results count

- [ ] Task 4: Create useSearch hook (AC: 1, 2)
  - [ ] Create `src/hooks/useSearch.ts` custom hook
  - [ ] Consume SearchContext
  - [ ] Provide search function with debouncing
  - [ ] Expose search state and actions

- [ ] Task 5: Create mock API service for development (AC: 2, 6)
  - [ ] Create `src/services/apiClient.ts` with API wrapper structure
  - [ ] Implement {success, data/error} response format per Architecture
  - [ ] Create mock product data for testing (Phase 1: before Supabase integration)
  - [ ] Implement search function with 300ms delay simulation
  - [ ] Add error simulation for testing error states

- [ ] Task 6: Integrate search into App.tsx (AC: 1)
  - [ ] Wrap App with SearchContext.Provider
  - [ ] Add SearchBar component to layout
  - [ ] Add SearchResults component to layout
  - [ ] Test complete user flow: search → loading → results/empty/error

- [ ] Task 7: Write tests (AC: 1-6)
  - [ ] Create `__tests__/components/SearchBar.test.tsx` for SearchBar component
  - [ ] Create `__tests__/components/SearchResults.test.tsx` for SearchResults component
  - [ ] Create `__tests__/hooks/useSearch.test.ts` for useSearch hook
  - [ ] Test loading states, empty states, error states
  - [ ] Test debouncing functionality
  - [ ] Test keyboard navigation (WCAG AA)

## Dev Notes

### Architecture Compliance (from Architecture Document)

**State Management Pattern (from Architecture):**
- React Context + useReducer for global state
- Search state organization: searchState (query, filters, results)
- Local component states: UI-specific state (modals, toggles)

**API Response Format (CRITICAL - Must Follow):**
```typescript
// Success Response
{ success: true, data: [...products] }

// Error Response
{ success: false, error: { code: 'PRODUCT_NOT_FOUND', message: '...', details: {...} } }
```

**Error Handling Pattern:**
```typescript
interface AppError {
  code: string;      // e.g., 'SEARCH_FAILED', 'NETWORK_ERROR'
  message: string;   // User-friendly message
  details?: unknown; // Additional diagnostic info
}
```

**Component Naming (Must Follow):**
- Component files: `PascalCase.tsx` → SearchBar.tsx, SearchResults.tsx
- Custom hooks: `usePascalCase.ts` → useSearch.ts
- Services: `camelCase.ts` → apiClient.ts

### Previous Story Intelligence (Story 1.1)

**Story 1.1 Learnings:**
- MUI v7.3.7 installed and working (not v6 as some docs may say)
- Jest 30.2.0 configured with jsdom environment
- Type-based project structure established: src/components/, src/hooks/, src/services/, src/context/, src/utils/, src/types/, src/constants/
- Separate `__tests__/` directory for tests (not co-located)
- Bundle optimization configured: manualChunks for mui-vendor, react-vendor

**Files Created in Story 1.1:**
- `src/components/` - Component directory (empty, ready for components)
- `src/hooks/` - Hooks directory (empty, ready for custom hooks)
- `src/services/` - Services directory (empty, ready for API clients)
- `src/context/` - Context directory (empty, ready for React contexts)
- `src/theme/index.ts` - MUI theme with WCAG AA compliance (16px body text)
- `__tests__/components/` - Component test directory
- `__tests__/hooks/` - Hook test directory
- `src/setupTests.ts` - Jest setup with @testing-library/jest-dom

**Git Commit from Story 1.1:**
- Commit b3467d7: "feat: initialize Vite + React + TypeScript project with MUI v7 and Jest"
- All project files tracked in git

### Technical Requirements

**Search Performance Requirements (from PRD):**
- Search results must display within 2 seconds (95th percentile) - NFR-PERF-01
- Fuzzy matching for typos (e.g., "cooking oil" vs "CookingOil")
- Debouncing to reduce API calls (300ms delay)

**Accessibility Requirements (WCAG AA):**
- Keyboard-only navigation must work - FR34
- Touch targets minimum 44x44 pixels - FR42
- Screen reader compatibility with semantic HTML and ARIA labels - FR41
- Focus indicators for interactive elements

**Multi-language Support:**
- English and Roman Urdu text support - FR4
- Urdu RTL support will be added in Epic 5 (Story 5.3)

**Mock Data for Development:**
Since Supabase integration happens in Story 1.6, use mock product data:

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  prices: {
    storeId: string;
    storeName: string;
    price: number;  // in cents
    available: boolean;
    lastUpdated: string;  // ISO date
  }[];
}
```

**Mock Products for Testing:**
```typescript
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cooking Oil 5L',
    category: 'Cooking Oil',
    prices: [
      { storeId: 'imtiaz', storeName: 'Imtiaz Supermarket', price: 265000, available: true, lastUpdated: '2026-02-03T02:00:00Z' },
      { storeId: 'chase', storeName: 'Chase Plus', price: 258000, available: true, lastUpdated: '2026-02-03T02:00:00Z' }
    ]
  }
];
```

### Implementation Approach

**Phase 1: State Management Foundation**
- Create SearchContext with useReducer
- Define search state structure and actions
- Implement reducer for state transitions

**Phase 2: API Layer**
- Create apiClient.ts with {success, data/error} wrapper
- Implement mock search function (to be replaced with real API in Story 1.6)
- Add debouncing (300ms) to search calls

**Phase 3: Components**
- SearchBar: MUI TextField with search icon, controlled component
- SearchResults: Display results with loading/empty/error states
- LoadingSkeleton: MUI Skeleton variant for loading state

**Phase 4: Integration**
- Wrap App with SearchContext.Provider
- Add SearchBar and SearchResults to App.tsx
- Test complete user flow

### MUI Component Guidelines

**SearchBar Component:**
- Use `TextField` from MUI with `SearchIcon`
- Props: value, onChange, onSearch, placeholder
- Full width on mobile, max width on desktop
- Input size: large (44px height for touch targets)

**SearchResults Component:**
- Use `Grid` from MUI for responsive layout
- Use `CircularProgress` for loading state
- Use `Typography` for empty/error messages
- Use `Card` from MUI for product cards (future Story 1.4)

**Loading Skeleton:**
- Use `Skeleton` from MUI with variant="text"
- Show 3-5 skeleton rows while loading

### Testing Standards

**Component Tests (React Testing Library):**
- Test user interactions: typing in search bar
- Test state changes: loading → results/empty/error
- Test accessibility: keyboard navigation, ARIA labels

**Hook Tests:**
- Test state management: search triggers correct actions
- Test debouncing: delays API calls by 300ms
- Test error handling: error states set correctly

**Test Naming:**
- `SourceName.test.tsx` format
- Located in `__tests__/components/` or `__tests__/hooks/`

### Performance Considerations

**Debouncing Implementation:**
```typescript
// Use lodash.debounce or custom implementation
import { debounce } from 'lodash-es';

const debouncedSearch = debounce((query: string) => {
  // API call here
}, 300);
```

**Or custom debouncing hook:**
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### File Structure (to be created)

**Components:**
- `src/components/SearchBar.tsx` - Search input component
- `src/components/SearchResults.tsx` - Results display component
- `src/components/LoadingSkeleton.tsx` - Loading indicator (optional, can use MUI Skeleton directly)

**Hooks:**
- `src/hooks/useSearch.ts` - Search state management hook
- `src/hooks/useDebounce.ts` - Debouncing utility hook (reusable)

**Context:**
- `src/context/SearchContext.tsx` - Search state context

**Services:**
- `src/services/apiClient.ts` - API client with {success, data/error} wrapper
- `src/services/mockProducts.ts` - Mock product data (for development)

**Types:**
- `src/types/Product.types.ts` - Product interface (should be created here, not in component files)
- `src/types/Search.types.ts` - Search state types
- `src/types/Error.types.ts` - AppError interface (from Architecture)

**Tests:**
- `__tests__/components/SearchBar.test.tsx`
- `__tests__/components/SearchResults.test.tsx`
- `__tests__/hooks/useSearch.test.ts`
- `__tests__/hooks/useDebounce.test.ts`

### Dependencies

**Already Installed (from Story 1.1):**
- MUI v7.3.7 (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material)
- React 19.2.0
- TypeScript 5.9.3
- Jest 30.2.0 + React Testing Library 16.3.2

**May Need to Install:**
- lodash-es (for debounce utility)
- Or implement custom debounce hook (preferred to avoid dependency)

**Recommendation:** Implement custom `useDebounce` hook to avoid adding lodash dependency.

### References

**Source: Architecture Document**
- Section: "Frontend Architecture" - State Management: React Context + useReducer
- Section: "API & Communication Patterns" - REST API with {success, data/error} wrapper
- Section: "Implementation Patterns & Consistency Rules" - Naming conventions, structure patterns
- File: `_bmad-output/planning-artifacts/architecture.md`

**Source: PRD**
- FR4: Search using English and Roman Urdu text
- FR5: Search results within 2 seconds
- FR6: View products from all scraped stores
- FR34: Keyboard-only navigation
- FR41: Screen reader compatibility
- FR42: Touch targets 44x44px
- NFR-PERF-01: Search results < 2 seconds (95th percentile)
- File: `_bmad-output/planning-artifacts/prd.md`

**Source: UX Design Specification**
- MUI components for WCAG AA compliance
- Search interface patterns
- File: `_bmad-output/planning-artifacts/ux-design-specification.md`

**Source: Epics File**
- Story 1.2 requirements and implementation notes
- File: `_bmad-output/planning-artifacts/epics.md` (lines 431-454)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - Story creation in progress

### Completion Notes List

*To be populated during implementation*

### File List

**Components Created:**
- `src/components/SearchBar.tsx` - Search input with MUI TextField, debouncing, loading indicator
- `src/components/SearchResults.tsx` - Results display with loading skeleton, empty/error states

**Hooks Created:**
- `src/hooks/useDebounce.ts` - Custom debounce hook (300ms delay)
- `src/hooks/useSearch.ts` - Search context consumer hook

**Context Created:**
- `src/context/SearchContext.tsx` - Search state management with useReducer

**Services Created:**
- `src/services/apiClient.ts` - API wrapper with {success, data/error} response format
- `src/services/mockProducts.ts` - Mock product data (8 products, 3 stores each)

**Types Created:**
- `src/types/Error.types.ts` - AppError interface
- `src/types/Product.types.ts` - Product and ProductPrice interfaces
- `src/types/Search.types.ts` - SearchState and SearchAction types

**Tests Created:**
- `__tests__/components/SearchBar.test.tsx` - SearchBar component tests
- `__tests__/components/SearchResults.test.tsx` - SearchResults component tests
- `__tests__/hooks/useDebounce.test.ts` - useDebounce hook tests (6 tests passing)
- `__tests__/hooks/useSearch.test.ts` - useSearch hook tests (5 tests passing)

**Configuration Updates:**
- `jest.config.cjs` - Fixed TypeScript configuration for tests
- `tsconfig.app.json` - Added jest and @testing-library/jest-dom types
- `src/global.d.ts` - Global type declarations for testing
- `src/App.tsx` - Integrated SearchBar and SearchResults with providers

**Files Modified:**
- `src/App.tsx` - Added SearchProvider, SearchBar, and SearchResults components
