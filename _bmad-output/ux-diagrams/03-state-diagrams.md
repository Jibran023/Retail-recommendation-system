# State Diagrams - Retail Recommendation System

**Document Version:** 1.0
**Last Updated:** 2026-02-03
**Author:** Jibran

---

## Table of Contents

1. [Search Component State](#search-component-state)
2. [Product Card State](#product-card-state)
3. [Filter State Management](#filter-state-management)
4. [API Request State](#api-request-state)
5. [Modal State](#modal-state)
6. [Data Scraping State](#data-scraping-state)

---

## Search Component State

States for the search bar and search functionality.

```mermaid
stateDiagram-v2
    [*] --> Idle: Component Mounts

    Idle --> Focused: User Clicks Search Bar
    Idle --> Typing: User Starts Typing

    Focused --> Typing: User Types
    Focused --> Idle: User Blurs (no input)

    Typing --> Debouncing: User Pauses (>100ms)
    Typing --> Focused: User Clears Input
    Typing --> Idle: User Blurs

    Debouncing --> Loading: 300ms elapsed
    Debouncing --> Typing: User Resumes Typing

    Loading --> Success: API Success
    Loading --> Error: API Error
    Loading --> Loading: Pagination / Infinite Scroll

    Success --> Idle: User Clears Results
    Success --> Typing: User Modifies Search
    Success --> Selected: User Selects Result

    Error --> Idle: User Dismisses Error
    Error --> Loading: User Retries

    Selected --> Idle: Selection Complete

    note right of Idle
        Empty search bar
        Placeholder visible
        Recent searches shown
    end note

    note right of Debouncing
        Waiting for user to
        stop typing before
        API call
    end note

    note right of Loading
        Skeleton screens shown
        "Searching..." indicator
    end note

    note right of Success
        Results displayed
        Autocomplete shown
        Cheapest highlighted
    end note

    note right of Error
        Error message shown
        Retry button available
    end note
```

### Search State Specifications

**Component:** `SearchBar.tsx` + `SearchResults.tsx`

**State Structure:**
```typescript
interface SearchState {
  query: string;           // Current search query
  status: 'idle' | 'focused' | 'typing' | 'loading' | 'success' | 'error';
  results: Product[];      // Search results
  hasMore: boolean;        // Pagination available
  error: AppError | null;  // Error object
  suggestion: string | null; // Autocomplete suggestion
}
```

**Transition Triggers:**
- `onFocus()` → Focused
- `onChange()` → Typing
- `onBlur()` → Idle
- `300ms debounce` → Loading
- `API success` → Success
- `API error` → Error

---

## Product Card State

States for individual product comparison cards.

```mermaid
stateDiagram-v2
    [*] --> Loading: Card Created

    Loading --> Loaded: Data Fetched
    Loading --> Error: Fetch Failed

    Loaded --> Idle: Displayed
    Loaded --> Expanding: User Clicks Expand

    Idle --> Hovering: Mouse Hovers (desktop)
    Idle --> Expanding: User Clicks Expand
    Idle --> Clicking: User Clicks Store Button

    Hovering --> Idle: Mouse Leaves
    Hovering --> Clicking: User Clicks During Hover

    Expanding --> Expanded: All Stores Visible
    Expanding --> Idle: User Cancels

    Expanded --> Idle: User Collapses
    Expanded --> Clicking: User Clicks Store Button

    Clicking --> Redirecting: Store URL Opens
    Redirecting --> Idle: Back to Platform

    Error --> Retry: User Clicks Retry
    Error --> Idle: User Dismisses
    Retry --> Loading

    note right of Loading
        Skeleton card shown
        Shimmer effect
    end note

    note right of Idle
        Default price shown
        2-3 stores visible
        Cheapest highlighted
    end note

    note right of Expanding
        Animation in progress
        Height increasing
    end note

    note right of Expanded
        All stores visible
        Full details shown
        "Show less" button
    end note

    note right of Error
        Error message in card
        Retry button available
    end note
```

### Product Card State Specifications

**Component:** `ProductCard.tsx`

**State Structure:**
```typescript
interface ProductCardState {
  status: 'loading' | 'loaded' | 'error';
  isExpanded: boolean;    // Show all stores
  isHovered: boolean;      // Desktop hover state
  isClicking: boolean;     // Button click in progress
  primaryStore: Price;     // Best value store
  allStores: Price[];      // All available prices
  error: AppError | null;
}
```

**Visual States:**

| State | Stores Shown | Actions |
|-------|--------------|---------|
| **Idle (collapsed)** | 2-3 stores | Hover to preview |
| **Hovering** | 2-3 stores + preview | Click to expand |
| **Expanded** | All stores (3+) | Collapse button |
| **Loading** | Skeleton | None (disabled) |
| **Error** | Error message | Retry button |

---

## Filter State Management

Global state for filters and sorting across the platform.

```mermaid
stateDiagram-v2
    [*] --> NoFilters: Initial State

    NoFilters --> ActiveFilter: User Applies Filter
    NoFilters --> Sorted: User Sorts Only

    ActiveFilter --> MultipleFilters: User Adds More Filters
    ActiveFilter --> Sorted: User Sorts Results
    ActiveFilter --> NoFilters: User Clears All

    Sorted --> ActiveFilter: User Adds Filter
    Sorted --> NoFilters: User Resets Sort
    Sorted --> Sorted: User Changes Sort Order

    MultipleFilters --> Refined: User Adjusts Filter Values
    MultipleFilters --> Sorted: User Sorts
    MultipleFilters --> NoFilters: User Clears All

    Refined --> MultipleFilters: Adjustment Complete
    Refined --> NoFilters: User Clears All

    note right of NoFilters
        • No filters applied
        • Default: Price sort
        • All products shown
    end note

    note right of ActiveFilter
        • 1+ filters active
        • Filter pills shown
        • "Clear all" button
    end note

    note right of MultipleFilters
        • 2+ filters active
        • Complex filtering
        • Results count updated
    end note

    note right of Sorted
        • Sort order changed
        • No filters (or existing)
        • Visual sort indicator
    end note
```

### Filter State Specifications

**Context:** `FilterContext.tsx`

**State Structure:**
```typescript
interface FilterState {
  // Active filters
  priceRange: { min: number; max: number } | null;
  stores: number[];           // Selected store IDs
  inStockOnly: boolean;       // Stock status filter

  // Sorting
  sortBy: 'price' | 'distance' | 'relevance';
  sortOrder: 'asc' | 'desc';

  // UI state
  hasActiveFilters: boolean;
  resultsCount: number;
  totalCount: number;

  // Computed
  filteredProducts: Product[];
}

interface FilterActions {
  setPriceRange: (min: number, max: number) => void;
  toggleStore: (storeId: number) => void;
  setInStockOnly: (enabled: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  clearAllFilters: () => void;
  removeFilter: (filterType: string) => void;
}
```

**Filter Persistence:**
- Stored in `localStorage`
- Key: `retail_comparison_filters`
- Synced across browser sessions
- Survives page refreshes

---

## API Request State

Universal state for all API requests throughout the platform.

```mermaid
stateDiagram-v2
    [*] --> Idle: No Request

    Idle --> Pending: Request Initiated
    Idle --> Pending: User Action

    Pending --> Success: Response 200-299
    Pending --> ClientError: Response 400-499
    Pending --> ServerError: Response 500-599
    Pending --> NetworkError: Network Failure
    Pending --> Timeout: Request Timeout

    Success --> Idle: Data Displayed
    Success --> Cached: Response Cached

    ClientError --> Idle: Error Handled
    ClientError --> Validation: Validation Error
    ClientError --> NotFound: Resource Not Found

    Validation --> Idle: User Corrects Input
    NotFound --> Idle: User Navigates Away

    ServerError --> Retry: Auto Retry (1x)
    ServerError --> Idle: Manual Retry

    NetworkError --> Retry: Auto Retry (2x)
    NetworkError --> Idle: Manual Retry

    Timeout --> Retry: Auto Retry (1x)
    Timeout --> Idle: Manual Retry

    Retry --> Pending: Retry Request
    Retry --> Failed: Max Retries Exceeded

    Failed --> Idle: Show Error

    Cached --> Pending: Cache Miss
    Cached --> Success: Cache Hit

    note right of Pending
        Loading indicator shown
        Skeleton screens
        Request in flight
    end note

    note right of Success
        Data transformed
        snake_case → camelCase
        UI updated
    end note

    note right of ClientError
        400: Bad Request
        401: Unauthorized
        403: Forbidden
        404: Not Found
        429: Rate Limited
    end note

    note right of ServerError
        500: Internal Server Error
        502: Bad Gateway
        503: Service Unavailable
        504: Gateway Timeout
    end note

    note right of Failed
        All retries exhausted
        User notified
        Graceful degradation
    end note
```

### API Request State Specifications

**Hook:** `useApiRequest.ts` (custom hook)

**State Structure:**
```typescript
interface ApiRequestState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  retryCount: number;
  lastRequest: Date | null;
  cached: boolean;
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: unknown;
  retry?: boolean;
  retryCount?: number;
  cache?: boolean;
  cacheTTL?: number; // milliseconds
}
```

**Retry Strategy:**
- **Network errors:** 2 retries with exponential backoff
- **Server errors:** 1 retry
- **Timeout:** 1 retry
- **Client errors:** No retry (user action required)
- **Backoff:** 30s → 60s → 120s

---

## Modal State

State management for modal dialogs (store info, alerts, etc.).

```mermaid
stateDiagram-v2
    [*] --> Closed: Modal Created

    Closed --> Opening: Trigger Action
    Opening --> Open: Animation Complete

    Open --> Active: User Interaction
    Open --> Closed: Backdrop Clicked
    Open --> Closed: Escape Key Pressed

    Active --> Closing: Close Action
    Active --> Loading: Action In Progress
    Active --> Error: Action Failed

    Loading --> Active: Action Complete
    Loading --> Error: Action Failed

    Error --> Active: User Acknowledges
    Error --> Closing: User Dismisses

    Closing --> Closed: Animation Complete
    Closing --> [*]: Modal Unmounted

    Active --> Closing: Confirm/Close Button
    Active --> Open: User Interacts (continues)

    note right of Closed
        Not in DOM
        No overlay visible
        Focus on trigger element
    end note

    note right of Opening
        Overlay fades in
        Modal animates in
        Focus trapped (after open)
    end note

    note right of Open
        Modal visible
        Focus inside modal
        Backdrop darkens
        Scroll locked on body
    end note

    note right of Active
        User interacting
        Form input possible
        Buttons clickable
        Focus management active
    end note

    note right of Closing
        Modal animates out
        Overlay fades out
        Focus returns to trigger
    end note
```

### Modal State Specifications

**Component:** MUI `Dialog` / `Modal`

**State Structure:**
```typescript
interface ModalState {
  isOpen: boolean;
  isAnimating: boolean;
  type: 'store_info' | 'error' | 'confirm' | 'alert';
  title: string;
  content: React.ReactNode;
  actions: ModalAction[];
  focusSelector: string | null;  // Element to focus on open
  returnFocus: boolean;          // Return focus on close
}

interface ModalAction {
  label: string;
  primary: boolean;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}
```

**Accessibility Features:**
- **Focus trap:** Tab stays within modal
- **Focus return:** Focus returns to trigger element
- **Escape key:** Closes modal
- **Backdrop click:** Closes modal
- **ARIA attributes:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

---

## Data Scraping State

Background scraping service state (server-side, not user-facing).

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Cron Configured

    Scheduled --> Triggering: Cron Triggered
    Scheduled --> Triggering: Manual Trigger

    Triggering --> Initializing: Setup Scrapers
    Initializing --> Running: Scrapers Running

    Running --> Partial: Some Scrapers Failed
    Running --> Complete: All Scrapers Success
    Running --> Failed: All Scrapers Failed

    Partial --> Logging: Log Partial Results
    Complete --> Logging: Log Success
    Failed --> Logging: Log Failure

    Logging --> Alerting: Check Alert Thresholds
    Logging --> Archiving: Archive Price History

    Alerting --> Success: No Alerts Needed
    Alerting --> Notified: Alerts Sent

    Archiving --> Storing: Store New Prices
    Storing --> Updating: Update Status Indicators

    Updating --> Success: Process Complete
    Updating --> Notified: Process Complete

    Notified --> Scheduled: Schedule Next Run
    Success --> Scheduled

    note right of Scheduled
        Next run: Tomorrow 2-4 AM
        Status: Waiting
        Scrapers: Idle
    end note

    note right of Running
        Imtiaz: In progress
        Chase Plus: In progress
        Bin Hashim: In progress
        Rate limiting active
    end note

    note right of Partial
        Some stores successful
        Others failed
        Graceful degradation
        Alert threshold check
    end note

    note right of Complete
        All stores scraped
        Products updated
        Prices archived
        Status: ✅ Success
    end note

    note right of Failed
        All stores failed
        No data updated
        Alert sent
        Status: ❌ Failed
    end note
```

### Scraping State Specifications

**Service:** Scraping Service (Node.js/TypeScript)

**State Structure:**
```typescript
interface ScrapingState {
  status: 'scheduled' | 'running' | 'partial' | 'complete' | 'failed';
  lastRun: Date | null;
  nextRun: Date | null;
  scrapers: ScraperStatus[];
  productsScraped: number;
  errors: ScrapingError[];
}

interface ScraperStatus {
  storeId: number;
  storeName: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  productsScraped: number;
  error: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
}

interface ScrapingError {
  storeId: number;
  type: 'network' | 'validation' | 'blocking' | 'timeout';
  message: string;
  timestamp: Date;
  resolved: boolean;
}
```

**Status Indicators (Admin Dashboard):**
- **🟢 Success:** All scrapers successful
- **🟡 Warning:** Partial failure (some scrapers failed)
- **🔴 Failed:** Complete failure
- **⚪ Pending:** Scheduled, not yet run

---

## State Transition Summary

| State Machine | States | Complexity | User Impact |
|---------------|--------|-----------|-------------|
| **Search** | 7 states | Medium | Core navigation |
| **Product Card** | 8 states | Low | Comparison view |
| **Filters** | 4 states | Medium | Result refinement |
| **API Request** | 11 states | High | All data fetching |
| **Modal** | 7 states | Low | Secondary actions |
| **Scraping** | 8 states | High | Data freshness (admin) |

---

## State Management Architecture

```
AppContext (Global)
├── SearchContext
│   └── Search State (local to search components)
├── FilterContext
│   └── Filter State (global, persisted)
└── UIContext
    ├── Loading states (local per component)
    ├── Modal states (global, one at a time)
    └── Error states (local per component)
```

**Key Principles:**
1. **Local loading states** - No global loading indicator
2. **Persisted filters** - Survive navigation and refresh
3. **Error boundaries** - Isolate component failures
4. **Optimistic UI** - Update UI before API confirmation
5. **Graceful degradation** - Partial failures don't break everything

---

## Next Steps

- Implement state machines in code
- Add state transition logging
- Test all error states
- Monitor state transitions in production

