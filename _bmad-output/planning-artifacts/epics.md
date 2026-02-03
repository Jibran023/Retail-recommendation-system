---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/architecture.md", "_bmad-output/planning-artifacts/ux-design-specification.md", "_bmad-output/planning-artifacts/product-brief-Retail-recommendation-system-2026-01-28.md"]
epicsCreated: 6
storiesCreated: 33
status: 'complete'
completedAt: '2026-02-03'
workflowType: 'epics-and-stories'
---

# Retail-recommendation-system - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Retail-recommendation-system, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

#### Product Discovery (FR1-FR6)
**FR1:** Users can search for products by name or keyword
**FR2:** Users can browse products by category
**FR3:** Users can view product categories including Cooking Oil, Rice & Grains, Dairy, and Beverages
**FR4:** Users can search using both English and Roman Urdu text
**FR5:** Users can see search results within 2 seconds of submitting a search query
**FR6:** Users can view products from all scraped stores in search results

#### Price Comparison (FR7-FR14)
**FR7:** Users can view prices for the same product across multiple stores side-by-side
**FR8:** Users can sort product comparisons by price (low to high)
**FR9:** Users can sort product comparisons by distance from their location (near to far)
**FR10:** Users can filter products by price range
**FR11:** Users can filter products to show only in-stock items
**FR12:** Users can filter products by specific stores
**FR13:** Users can view store names alongside product prices
**FR14:** Users can view approximate distance information for each store

#### Store Navigation (FR15-FR17)
**FR15:** Users can click through to view a product on the original store's website
**FR16:** Users can view store information including store name and location
**FR17:** System can display the last date and time when product prices were updated

#### Data Acquisition (FR18-FR25)
**FR18:** System can automatically scrape product data from store websites including product name, price, and availability status
**FR19:** System can scrape data from multiple store websites including Imtiaz Supermarket and Chase Plus
**FR20:** System can update product data on a daily schedule
**FR21:** System can detect and alert when website scraping fails
**FR22:** System can detect and alert when scraped data does not meet validation requirements
**FR23:** System can implement respectful scraping practices including rate limiting and off-peak timing
**FR24:** System can implement anti-scraping countermeasures including IP rotation and user agent variation
**FR25:** System can store historical product data including prices and availability

#### System Monitoring (FR26-FR33)
**FR26:** System administrator can view scraping status indicators showing success/failure for each store
**FR27:** System administrator can view the last run timestamp for each scraping job
**FR28:** System administrator can view the number of products successfully scraped from each store
**FR29:** System can generate real-time alerts when scraping failures occur
**FR30:** System can generate real-time alerts when users encounter errors while using the platform
**FR31:** System administrator can view error logs with diagnostic information
**FR32:** System administrator can trigger manual re-scraping of store data
**FR33:** System can track performance metrics including response times and uptime

#### User Accessibility (FR34-FR42)
**FR34:** Users can navigate and use all platform features using only a keyboard
**FR35:** Users can view the interface with text that meets WCAG AA contrast requirements
**FR36:** Users can view the interface with text sized at minimum 16px for body content
**FR37:** Users can view interface labels in both English and Urdu languages
**FR38:** Users can access the platform on mobile devices including smartphones and tablets
**FR39:** Users can access the platform on desktop computers
**FR40:** Users can access the platform without creating an account or signing in
**FR41:** System can support screen reader compatibility with semantic HTML and ARIA labels
**FR42:** Users can view touch interface elements sized at minimum 44x44 pixels on mobile devices

**Total Functional Requirements: 42**

### NonFunctional Requirements

#### Performance Requirements (NFR-PERF)
**NFR-PERF-01:** Search results must be displayed to users within 2 seconds of query submission (95th percentile)
**NFR-PERF-02:** Initial page load must complete within 3 seconds on 3G mobile networks (Time to Interactive)
**NFR-PERF-03:** Application initial bundle size must not exceed 200KB (compressed)
**NFR-PERF-04:** Core Web Vitals must meet "Good" thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1)
**NFR-PERF-05:** Click-through to store websites must open within 1 second

#### Accessibility Requirements (NFR-A11Y)
**NFR-A11Y-01:** Platform must comply with WCAG 2.1 Level AA accessibility standards
**NFR-A11Y-02:** All user interface text must meet minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
**NFR-A11Y-03:** All user interface functionality must be accessible via keyboard-only navigation
**NFR-A11Y-04:** Touch interface elements must be minimum 44x44 pixels in size
**NFR-A11Y-05:** Platform must support screen reader compatibility with semantic HTML and ARIA labels
**NFR-A11Y-06:** Interface labels must be available in both English and Urdu languages
**NFR-A11Y-07:** Body text must be minimum 16px font size

#### Reliability Requirements (NFR-REL)
**NFR-REL-01:** Data scraping operations must achieve 95%+ success rate
**NFR-REL-02:** Platform uptime must be 95%+ for MVP phase (scale to 99%+ in Phase 2)
**NFR-REL-03:** Scraped data must achieve 95%+ accuracy rate
**NFR-REL-04:** System must detect and alert on scraping failures within 15 minutes
**NFR-REL-05:** System must detect and alert on user-facing errors within 5 minutes
**NFR-REL-06:** System must implement graceful degradation if one store's scraping fails

#### Scalability Requirements (NFR-SCAL)
**NFR-SCAL-01:** System must support 100 concurrent users in MVP phase
**NFR-SCAL-02:** System must support 1,000 concurrent users in Phase 2 (12-month target)
**NFR-SCAL-03:** System architecture must support 10x user growth with <10% performance degradation
**NFR-SCAL-04:** Database must support storage of 50,000 products across 10 stores by Phase 3

#### Security Requirements (NFR-SEC)
**NFR-SEC-01:** All data transmission must be encrypted using HTTPS/TLS 1.2+
**NFR-SEC-02:** Platform must not store sensitive user data in MVP phase (no accounts, no authentication)
**NFR-SEC-03:** Admin dashboard access must be protected by authentication
**NFR-SEC-04:** System must implement rate limiting on public-facing endpoints

#### Data Management Requirements (NFR-DATA)
**NFR-DATA-01:** Product data must be updated at minimum once every 24 hours
**NFR-DATA-02:** System must retain historical price data for minimum 6 months
**NFR-DATA-03:** System must display "last updated" timestamp to users

**Total Non-Functional Requirements: 27**

### Additional Requirements

#### Starter Template (From Architecture)
- **Vite + React + TypeScript** is the selected starter template
- First implementation command:
  ```bash
  npm create vite@latest retail-recommendation-system -- --template react-ts
  cd retail-recommendation-system
  npm install
  npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
  npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy
  ```
- **Jest Configuration:** Requires manual setup (jest.config.cjs) to work with Vite
- **Project initialization** should be the first story in Epic 1

#### Technology Stack Requirements (From Architecture)
- **Frontend:** React 19 + TypeScript + Vite 6+ + MUI v6 + Emotion
- **Backend:** Supabase (PostgreSQL) with REST API
- **Web Scraping:** Playwright (TypeScript/Node.js) with anti-scraping countermeasures
- **State Management:** React Context + useReducer
- **Routing:** React Router v6
- **Testing:** Jest + React Testing Library
- **Hosting:** Vercel (Frontend + Serverless Functions) + Supabase (Database)

#### Architecture & Implementation Patterns (From Architecture)
- **Type-based organization:** Project structure organized by feature/concern
- **Separate test directory:** `__tests__/` mirrors `src/` structure
- **API versioning:** Use `/api/v1/` pattern for all API routes
- **Database naming:** PostgreSQL convention (snake_case) for tables/columns
- **API transformation:** API layer transforms database snake_case to frontend camelCase
- **Component naming:** PascalCase for all React components
- **Error handling:** Structured AppError interface with {code, message, details}
- **Loading states:** Local loading states (no global loading)
- **Consistent API wrapper:** All API responses use {success, data/error} format

#### Database & API Requirements (From Architecture)
- **Database Schema** must be designed before API endpoints
- **API Endpoints** must be defined before frontend data fetching
- **Web Scraping** must populate database before frontend displays data
- **State Management** architecture affects component structure
- **Routing** structure affects component organization and lazy loading
- **Testing** configuration must be set up before writing tests

#### Performance Requirements (From Architecture & UX)
- **Bundle size limit:** < 200KB initial bundle target (Vite optimization)
- **Code splitting:** Lazy load routes with React.lazy()
- **Image optimization:** Vite image plugin + lazy loading
- **3G optimization:** Progressive loading, skeleton screens, optimistic UI
- **Search performance:** < 2 second response time (95th percentile)
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

#### Accessibility Requirements (From UX Design)
- **WCAG AA compliance** is foundational, not an afterthought
- **Urdu language support** with RTL (Right-to-Left) layout
- **MUI components** provide built-in accessibility (keyboard nav, ARIA, focus management)
- **Minimum 16px body text** for readability (Uncle Rasheed persona)
- **High contrast ratios:** 4.5:1 for text, 3:1 for large text
- **Touch targets:** Minimum 44x44 pixels for mobile
- **Screen reader compatibility:** Semantic HTML, ARIA labels, proper heading hierarchy

#### Deployment & Infrastructure (From Architecture)
- **Vercel** for hosting (Frontend + Serverless Functions + Cron Jobs)
- **Supabase** for database and backend services
- **Environment configuration:** `.env.development` for local, `.env.production` for Vercel
- **CI/CD:** Vercel auto-deploys on git push
- **Scraping schedule:** Daily 2-4 AM via Vercel Cron Jobs

#### Business Constraints (From Product Brief & PRD)
- **MVP timeline:** 9-17 weeks from start to launch
- **Solo developer:** Jibran (full-stack)
- **Target stores:** 1-2 stores in MVP (Imtiaz Supermarket, Chase Plus)
- **3-month Go/No-Go decision:** 100+ users, 30%+ retention, 95%+ scraping success
- **No monetization** in MVP (future consideration if traction achieved)

#### Risk Mitigation Requirements (From PRD)
- **Web scraping reliability:** 95%+ success rate target (highest risk area)
- **Respectful scraping:** Once daily, off-peak hours (2-4 AM), rate limiting
- **Anti-scraping countermeasures:** IP rotation, user agent variation, request throttling
- **Graceful degradation:** System continues if one store's scraping fails
- **Admin monitoring:** Scraping status, error logs, manual re-scrape triggers

### FR Coverage Map

#### Product Discovery (FR1-FR6)
FR1: Epic 1 - Search for products by name or keyword
FR2: Epic 1 - Browse products by category
FR3: Epic 1 - View product categories (Cooking Oil, Rice & Grains, Dairy, Beverages)
FR4: Epic 1 - Search using English and Roman Urdu text
FR5: Epic 1 - Search results within 2 seconds
FR6: Epic 1 - View products from all scraped stores

#### Price Comparison (FR7-FR14)
FR7: Epic 1 - View prices across multiple stores side-by-side
FR8: Epic 2 - Sort comparisons by price (low to high)
FR9: Epic 2 - Sort comparisons by distance (near to far)
FR10: Epic 2 - Filter products by price range
FR11: Epic 2 - Filter products to show only in-stock items
FR12: Epic 2 - Filter products by specific stores
FR13: Epic 1 - View store names alongside product prices
FR14: Epic 2 - View approximate distance information for each store

#### Store Navigation (FR15-FR17)
FR15: Epic 3 - Click through to view product on original store website
FR16: Epic 3 - View store information (name, location)
FR17: Epic 1 - Display last date and time when product prices were updated

#### Data Acquisition (FR18-FR25)
FR18: Epic 4 - Automatically scrape product data (name, price, availability)
FR19: Epic 4 - Scrape data from multiple stores (Imtiaz Supermarket, Chase Plus)
FR20: Epic 4 - Update product data on daily schedule
FR21: Epic 6 - Detect and alert when website scraping fails
FR22: Epic 6 - Detect and alert when scraped data does not meet validation requirements
FR23: Epic 4 - Implement respectful scraping practices (rate limiting, off-peak timing)
FR24: Epic 4 - Implement anti-scraping countermeasures (IP rotation, user agent variation)
FR25: Epic 4 - Store historical product data (prices and availability)

#### System Monitoring (FR26-FR33)
FR26: Epic 6 - System administrator can view scraping status indicators (success/failure)
FR27: Epic 6 - System administrator can view last run timestamp for each scraping job
FR28: Epic 6 - System administrator can view number of products successfully scraped
FR29: Epic 6 - System can generate real-time alerts when scraping failures occur
FR30: Epic 6 - System can generate real-time alerts when users encounter errors
FR31: Epic 6 - System administrator can view error logs with diagnostic information
FR32: Epic 6 - System administrator can trigger manual re-scraping of store data
FR33: Epic 6 - System can track performance metrics (response times, uptime)

#### User Accessibility (FR34-FR42)
FR34: Epic 5 - Users can navigate and use all platform features using only a keyboard
FR35: Epic 5 - Users can view interface with text meeting WCAG AA contrast requirements
FR36: Epic 5 - Users can view interface with text sized at minimum 16px
FR37: Epic 5 - Users can view interface labels in both English and Urdu languages
FR38: Epic 1 - Users can access platform on mobile devices (smartphones, tablets)
FR39: Epic 1 - Users can access platform on desktop computers
FR40: Epic 1 - Users can access platform without creating an account or signing in
FR41: Epic 5 - System can support screen reader compatibility (semantic HTML, ARIA labels)
FR42: Epic 5 - Users can view touch interface elements sized at minimum 44x44 pixels

**Coverage Summary:** 42/42 FRs mapped ✅

## Epic List

### Epic 1: Product Search & Discovery

**Users can search for products and view real-time prices across all stores**

**Value Delivered:** Core platform functionality - users can immediately find and compare products to make informed purchasing decisions. This is the "Aha!" moment where users see all store prices in one place.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR13, FR17, FR38, FR39, FR40

**Stories Will Include:**
- Set up Vite + React + TypeScript project (from Architecture starter template)
- Implement search UI with MUI components
- Build category browsing interface
- Create product comparison view
- Integrate with Supabase for product data
- Implement responsive mobile-first layout
- Add data freshness timestamp display
- Implement no-account-access (zero friction onboarding)

**Dependencies:** Requires Epic 4 (Data Pipeline) for product data, but can work with mock data for development

---

### Epic 2: Filtering, Sorting & Distance

**Users can refine results and find the best store based on price and proximity**

**Value Delivered:** Enhanced decision support - users can optimize for savings (price) or convenience (proximity), addressing Sarah's weekly planning and Ahmed's time-sensitive needs.

**FRs Covered:** FR8, FR9, FR10, FR11, FR12, FR14

**Stories Will Include:**
- Implement price sorting with visual indicators for "best value"
- Add distance-based sorting with proximity badges
- Build price range slider filter
- Create in-stock status filter
- Implement store selection filter
- Add filter state management with React Context

**Dependencies:** Builds on Epic 1 (search results), enables user decision optimization

---

### Epic 3: Store Navigation & Click-Through

**Users can navigate to store websites to complete purchases**

**Value Delivered:** Complete shopping journey - from product discovery to purchase decision. Users can verify prices and buy products from the cheapest or most convenient store.

**FRs Covered:** FR15, FR16

**Stories Will Include:**
- Implement click-through buttons for each store
- Build store information modal
- Add external link handling
- Implement "Open in Google Maps" for mobile (from Ahmed's journey)

**Dependencies:** Builds on Epic 1 & 2 (comparison results)

---

### Epic 4: Data Pipeline & Scraping

**System automatically acquires product data from store websites daily**

**Value Delivered:** Platform data foundation - ensures accurate, up-to-date prices are available for users. Critical for platform value and user trust.

**FRs Covered:** FR18, FR19, FR20, FR23, FR24, FR25

**Stories Will Include:**
- Set up Playwright for web scraping
- Implement scraping logic for Imtiaz Supermarket
- Implement scraping logic for Chase Plus
- Create Supabase database schema
- Build ETL pipeline (extract, transform, load)
- Configure Vercel Cron Jobs for daily 2-4 AM execution
- Implement rate limiting and respectful scraping
- Add IP rotation and user agent variation
- Create error handling and retry logic
- Store historical price data for 6-month retention

**Dependencies:** Enables Epic 1 (provides product data), but can be developed in parallel with mock data

---

### Epic 5: WCAG AA Accessibility & Urdu Support

**Platform is accessible and usable by diverse users including non-tech and Urdu-speaking users**

**Value Delivered:** Inclusive design - ensures Uncle Rasheed (65, low tech comfort) and non-English speakers can use the platform independently. WCAG AA compliance is foundational, not an afterthought.

**FRs Covered:** FR34, FR35, FR36, FR37, FR41, FR42

**Plus NFRs:** NFR-A11Y-01 through NFR-A11Y-07

**Stories Will Include:**
- Implement keyboard navigation for all interactive elements
- Add ARIA labels and semantic HTML
- Configure Urdu language support with RTL layout
- Ensure MUI components meet WCAG AA
- Test with screen readers (NVDA/JAWS)
- Verify touch target sizes on mobile (44x44px minimum)
- Implement focus indicators and skip links
- Ensure minimum 16px body text
- Verify contrast ratios (4.5:1 for text, 3:1 for large text)

**Dependencies:** Enhances Epic 1 & 2 (makes features accessible), but accessibility is built into each story

---

### Epic 6: Platform Monitoring & Reliability

**System administrators can monitor platform health and respond to issues**

**Value Delivered:** Operational excellence - ensures platform reliability (95%+ uptime target), rapid response to scraping failures, and data accuracy validation.

**FRs Covered:** FR21, FR22, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33

**Stories Will Include:**
- Build admin dashboard (Phase 2 - post-MVP)
- Implement scraping status indicators
- Create error logging system
- Set up real-time alerts (email/SMS)
- Build manual re-scrape triggers
- Implement performance monitoring (response times, uptime)
- Create data accuracy validation tools
- Add graceful degradation for partial failures

**Dependencies:** Supports Epic 4 (monitoring), but not blocking for MVP (basic logging in MVP, full dashboard Phase 2)

---

## Epic 1: Product Search & Discovery

**Users can search for products and view real-time prices across all stores**

### Story 1.1: Initialize Project with Vite + React + TypeScript

As a developer,
I want to set up the project with Vite + React + TypeScript,
So that I have a modern, optimized foundation for building the price comparison platform.

**Acceptance Criteria:**

**Given** a new project is to be created for Retail-recommendation-system
**When** I run the Vite initialization commands
**Then** a React 19 + TypeScript project is created successfully
**And** MUI v6 and Emotion are installed and configured
**And** Jest and React Testing Library are installed with manual Vite configuration
**And** the project structure follows type-based organization
**And** a separate `__tests__/` directory is created mirroring `src/`
**And** Vite configuration is set up for bundle optimization
**And** the development server starts successfully on port 5173

**Implementation Notes:**
- Use Architecture-specified commands:
  ```bash
  npm create vite@latest retail-recommendation-system -- --template react-ts
  cd retail-recommendation-system
  npm install
  npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
  npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest identity-obj-proxy
  ```
- Configure `jest.config.cjs` for Vite compatibility
- Set up project structure per Architecture (type-based organization)
- Configure Vite for < 200KB bundle target

---

### Story 1.2: Implement Product Search UI

As a user (Sarah, Ahmed, or Uncle Rasheed),
I want to search for products by name or keyword,
So that I can quickly find specific products and compare prices across stores.

**Acceptance Criteria:**

**Given** I am on the homepage
**When** I enter a product name or keyword in the search bar
**Then** search results are displayed within 2 seconds (FR5, NFR-PERF-01)
**And** results show products from all scraped stores (FR6)
**And** search works with both English and Roman Urdu text (FR4)
**And** a loading skeleton is shown while fetching results
**And** an empty state message appears if no products match
**And** an error message is displayed if the search fails

**Implementation Notes:**
- Use MUI TextField or Autocomplete component for search input
- Implement React Context for search state management
- Add debouncing to reduce API calls (300ms delay)
- Support fuzzy matching for typos (e.g., "cooking oil" vs "CookingOil")
- Display search results count

---

### Story 1.3: Create Category Browsing Interface

As a user (Sarah or Uncle Rasheed),
I want to browse products by category,
So that I can discover products without knowing specific names.

**Acceptance Criteria:**

**Given** I am on the homepage
**When** I click on a category (Cooking Oil, Rice & Grains, Dairy, Beverages)
**Then** all products in that category are displayed (FR2, FR3)
**And** products from all stores are shown (FR6)
**And** results load within 2 seconds (FR5)
**And** categories are accessible via keyboard navigation (FR34)
**And** categories are displayed as pills/chips for easy selection
**And** active category is visually indicated

**Implementation Notes:**
- Use MUI Chip or Button component for category selection
- Display categories as horizontal scrollable list on mobile
- Grid layout on desktop for categories
- Integrate with Supabase to fetch products by category

---

### Story 1.4: Build Multi-Store Price Comparison View

As a user (Sarah, Ahmed, or Uncle Rasheed),
I want to see prices for the same product across multiple stores side-by-side,
So that I can identify the cheapest option and make informed decisions.

**Acceptance Criteria:**

**Given** I am viewing search or category results
**When** I view a product card
**Then** prices from all scraped stores are displayed side-by-side (FR7)
**And** each price shows the store name prominently (FR13)
**And** the cheapest price is visually highlighted ("Best Value" badge)
**And** the last updated timestamp is displayed for each price (FR17)
**And** in-stock status is shown for each store
**And** the layout is responsive (mobile: stacked, desktop: side-by-side)

**Implementation Notes:**
- Use MUI Card component for product display
- Create a PriceComparison subcomponent
- Implement visual hierarchy (cheapest price highlighted with green badge)
- Format: "Store Name | PKR 2,650 | In Stock | Updated 2 hours ago"
- Ensure contrast ratios meet WCAG AA (FR35)

---

### Story 1.5: Implement Responsive Mobile-First Layout

As a user on a mobile device (Ahmed) or desktop (Sarah),
I want the platform to adapt to my screen size,
So that I have an optimal experience regardless of device.

**Acceptance Criteria:**

**Given** I access the platform on any device
**When** the platform loads
**Then** it is fully functional on smartphones (FR38)
**And** it is fully functional on desktop computers (FR39)
**And** the layout adapts to screen size (mobile: 320-480px, tablet: 481-768px, desktop: 769px+)
**And** touch targets are minimum 44x44 pixels on mobile (FR42)
**And** the initial page load is under 3 seconds on 3G networks (NFR-PERF-02)
**And** the initial bundle size is under 200KB compressed (NFR-PERF-03)
**And** content is accessible via keyboard-only navigation (FR34)

**Implementation Notes:**
- Use MUI's responsive Grid system (xs, sm, md, lg breakpoints)
- Mobile-first: design for mobile first, then enhance for larger screens
- Single-column layout on mobile, multi-column on desktop
- Sticky search bar on mobile (always accessible)
- Lazy load images and non-critical components
- Test on actual mobile devices (3G network simulation)

---

### Story 1.6: Integrate Supabase for Product Data

As a developer,
I want to connect the frontend to Supabase for product data,
So that the platform displays real product and pricing information.

**Acceptance Criteria:**

**Given** Supabase database contains product data
**When** the frontend makes API requests
**Then** products are fetched from Supabase successfully
**And** data transformation converts snake_case to camelCase (per Architecture)
**And** API responses follow the {success, data/error} format (per Architecture)
**And** errors are handled with structured AppError {code, message, details}
**And** loading states are managed locally (no global loading)
**And** the API uses /api/v1/ versioning pattern

**Implementation Notes:**
- Create Supabase client: `src/lib/supabase.ts`
- Create API client wrapper: `src/services/apiClient.ts`
- Implement structured error handling
- Create types for Product, Store, Price entities
- Use React Context for API state management
- Implement retry logic for failed requests
- Respectful rate limiting (don't overwhelm Supabase)

---

## Epic 2: Filtering, Sorting & Distance

**Users can refine results and find the best store based on price and proximity**

### Story 2.1: Implement Price Sorting

As a user (Sarah optimizing her budget),
I want to sort product comparisons by price from low to high,
So that I can quickly identify the cheapest option and save money.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I select "Sort by Price (Low to High)"
**Then** products are re-sorted with cheapest prices first (FR8)
**And** the cheapest store is highlighted with a "Best Value" badge
**And** the sort option is visually indicated as active
**And** I can toggle back to default sorting
**And** sorting works across all products in the results
**And** the sort state is maintained when I search for new products

**Implementation Notes:**
- Use MUI Select or ButtonGroup for sort control
- Implement sort logic in React Context
- Add visual indicator (chevron up/down icon)
- Store sort preference in localStorage for session persistence
- Ensure sorting is performant (< 100ms for 100 products)

---

### Story 2.2: Add Distance-Based Sorting

As a user (Ahmed optimizing his time),
I want to sort products by distance from my location,
So that I can find the nearest store and minimize travel time.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I select "Sort by Distance (Near to Far)"
**Then** products are re-sorted with nearest stores first (FR9)
**And** each product shows approximate distance information (FR14)
**And** distance is displayed in kilometers (e.g., "2.5 km away")
**And** the closest store is highlighted with a "Nearest" badge
**And** I can toggle between price and distance sorting
**And** distances are calculated based on fixed store locations (MVP approach)

**Implementation Notes:**
- Store fixed coordinates for Imtiaz Supermarket and Chase Plus in config
- Calculate distance using Haversine formula or Google Maps Distance Matrix API
- Display distance format: "2.5 km" or "< 1 km" for very close stores
- For MVP: use approximate distances; Phase 2: real-time geolocation
- Add distance badge to product cards
- Ensure distance sorting works in combination with filters

---

### Story 2.3: Build Price Range Filter

As a user (Sarah with a specific budget),
I want to filter products by price range,
So that I can see only products within my budget.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I set a minimum and/or maximum price range
**Then** only products within that range are displayed (FR10)
**And** the filter updates in real-time as I adjust the range
**And** the number of filtered results is shown
**And** I can clear the price range filter
**And** the price range slider displays current values
**And** the filter works in combination with other filters
**And** currency is displayed as PKR

**Implementation Notes:**
- Use MUI Slider component with dual thumbs (min/max)
- Display min/max inputs for precise control
- Show results count: "Showing 15 of 42 products"
- Implement filter state in React Context
- Add "Clear Filter" button
- Persist filter preferences in localStorage

---

### Story 2.4: Create In-Stock Status Filter

As a user (Ahmed who wants to avoid wasted trips),
I want to filter products to show only items currently in stock,
So that I don't waste time visiting stores for out-of-stock products.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I enable the "In Stock Only" filter
**Then** only products with in-stock status are displayed (FR11)
**And** the filter is toggleable (on/off)
**And** the filter state is visually indicated
**And** results count updates to reflect filtered products
**And** the filter works in combination with price range and store filters
**And** a "No products match your filters" message appears if all are out of stock

**Implementation Notes:**
- Use MUI Checkbox or Switch component
- Display as a filter pill or toggle
- Add "In Stock" badge on product cards
- Show in-stock count: "12 products in stock"
- Implement filter logic to exclude out-of-stock items
- Clear visual distinction between in-stock and out-of-stock (grayed out)

---

### Story 2.5: Implement Store Selection Filter

As a user (Sarah who wants to compare specific stores),
I want to filter results by selecting specific stores,
So that I can focus on stores I prefer or can access.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I select one or more stores from the store filter
**Then** only products from selected stores are displayed (FR12)
**And** I can select multiple stores simultaneously
**And** available stores are: Imtiaz Supermarket, Chase Plus, Bin Hashim
**And** a "Select All" option is available
**And** the filter updates results in real-time
**And** the number of active store filters is shown
**And** I can clear all store selections

**Implementation Notes:**
- Use MUI Checkbox group or FormGroup
- Display store logos/names for easy identification
- Show count: "Imtiaz (15), Chase Plus (12)"
- Implement "Select All" / "Clear All" buttons
- Store filter state in React Context
- Persist store preferences in localStorage
- Ensure filter works with price range and in-stock filters

---

## Epic 3: Store Navigation & Click-Through

**Users can navigate to store websites to complete purchases**

### Story 3.1: Implement Click-Through to Store Websites

As a user (Sarah ready to make a purchase),
I want to click through to the original store's website to view the product,
So that I can verify the price and complete my purchase.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I click "View on [Store Name] Website" for a specific store
**Then** the store's website opens in a new browser tab (FR15)
**And** the product page for that specific product is displayed
**And** the click-through opens within 1 second (NFR-PERF-05)
**And** the button is clearly visible on each store's price card
**And** hover state indicates the button is clickable
**And** the button works on both mobile and desktop
**And** external links are properly formatted with target="_blank"

**Implementation Notes:**
- Use MUI Button component with variant="contained"
- Button text: "View on Imtiaz Website", "View on Chase Plus Website"
- Store URLs configured in environment variables or config file
- Add rel="noopener noreferrer" for security (NFR-SEC-01)
- Ensure buttons meet 44x44px touch target requirement (FR42)
- Test click-through on actual store websites
- Handle cases where store URL is not available

---

### Story 3.2: Build Store Information Modal

As a user (Ahmed unfamiliar with a store's location),
I want to view detailed store information,
So that I can plan my trip and know what to expect.

**Acceptance Criteria:**

**Given** I am viewing product comparison results
**When** I click on a store name or "Store Info" icon
**Then** a modal opens with store details (FR16)
**And** the modal displays: store name, location/area, and address
**And** the modal is accessible via keyboard (ESC to close, focus trap)
**And** the modal works on both mobile and desktop
**And** the modal has a close button (X) in the top-right corner
**And** clicking outside the modal closes it
**And** the modal content is scrollable if needed
**And** the modal supports screen reader navigation (FR41)

**Implementation Notes:**
- Use MUI Dialog or Modal component
- Store data structure: { name, area, address, phone, coordinates }
- Implement focus trap when modal opens
- Add backdrop for dimming background
- Responsive width: 90% on mobile, 500px on desktop
- Include "Get Directions" button linking to Story 3.3
- Store information in Supabase or config file
- ARIA labels for accessibility

---

### Story 3.3: Add Google Maps Integration (Mobile)

As a user (Ahmed on his commute),
I want to open a store's location in Google Maps for navigation,
So that I can get turn-by-turn directions to the store.

**Acceptance Criteria:**

**Given** I am viewing store information on a mobile device
**When** I click "Open in Google Maps" or a maps icon
**Then** Google Maps opens with the store's location pinned
**And** turn-by-turn navigation is available
**And** the store's address is pre-loaded in Google Maps
**And** the button is only shown on mobile devices (smartphones)
**And** the link opens the Google Maps app (if installed) or mobile website
**And** the integration works for all stores (Imtiaz, Chase Plus, Bin Hashim)
**And** the button meets 44x44px touch target requirement (FR42)

**Implementation Notes:**
- Use Google Maps URL scheme: `https://www.google.com/maps/search/?api=1&query={store_address}`
- For app deep link: `comgooglemaps://?q={store_address}` with fallback to web
- Store coordinates or address from Story 3.2
- Button visible only on mobile (using MUI's `useMediaQuery` or responsive breakpoints)
- Icon: Material Icons `place` or `map`
- Test on actual mobile device with Google Maps installed
- Fallback to maps.google.com if app not installed
- Add accessibility label: "Open in Google Maps for navigation"

---

## Epic 4: Data Pipeline & Scraping

**System automatically acquires product data from store websites daily**

### Story 4.1: Design Supabase Database Schema

As a developer,
I want to design the Supabase database schema for products, stores, and prices,
So that we have a structured data model for storing and querying product information.

**Acceptance Criteria:**

**Given** we need to store product and pricing data
**When** I create the database schema in Supabase PostgreSQL
**Then** tables are created for: stores, products, prices, price_history
**And** tables use snake_case naming convention (per Architecture)
**And** appropriate relationships and foreign keys are defined
**And** indexes are created for frequently queried columns
**And** constraints ensure data integrity (NOT NULL, UNIQUE, CHECK)
**And** the schema supports historical price data retention (FR25)
**And** the schema is documented in a migration file or SQL script
**And** Row Level Security (RLS) policies are configured for Supabase

**Implementation Notes:**
- **stores table**: id (PK), name, slug, website_url, address, area, city, phone, latitude, longitude, created_at, updated_at
- **products table**: id (PK), name, slug, category, description, image_url, created_at, updated_at
- **prices table**: id (PK), product_id (FK), store_id (FK), price_cents, availability, stock_status, scraped_at, created_at
- **price_history table**: id (PK), price_id (FK), price_cents, availability, recorded_at
- Indexes: prices(product_id, store_id), prices(scraped_at), price_history(product_id, recorded_at)
- Use Supabase migration system or SQL scripts
- Support 50,000 products across 10 stores by Phase 3 (NFR-SCAL-04)

---

### Story 4.2: Set Up Playwright Scraping Infrastructure

As a developer,
I want to set up Playwright for web scraping with TypeScript,
So that we have a reliable framework for extracting product data from store websites.

**Acceptance Criteria:**

**Given** we need to scrape data from e-commerce websites
**When** I install and configure Playwright in a Node.js/TypeScript environment
**Then** Playwright is installed with TypeScript support
**And** a base Scraper class is created with common functionality
**And** error handling and retry logic are implemented
**And** logging is configured for debugging and monitoring
**And** the scraper can be run locally and in Vercel serverless functions
**And** the project structure follows type-based organization
**And** environment variables are configured for scraper settings

**Implementation Notes:**
- Install: `npm install -D playwright @playwright/test` (TypeScript)
- Create base class: `src/scrapers/BaseScraper.ts`
- Common functionality: page navigation, selector utilities, error handling, logging
- Error types: ScrapingError, ValidationError, NetworkError
- Retry logic: exponential backoff for transient failures
- Logging: structured logs with timestamp, scraper, url, error
- Environment: SCRAPING_TIMEOUT, MAX_RETRIES, USER_AGENTS
- Configure for Vercel serverless execution (timeout considerations)
- Per Architecture: Playwright 1.48+ with TypeScript

---

### Story 4.3: Implement Imtiaz Supermarket Scraper

As a developer,
I want to scrape product data from Imtiaz Supermarket's website,
So that we can populate our database with their current prices and availability.

**Acceptance Criteria:**

**Given** the Playwright infrastructure is set up
**When** I run the Imtiaz Supermarket scraper
**Then** the scraper navigates to the Imtiaz website
**And** extracts product data: name, price, availability/status (FR18)
**And** handles pagination to scrape multiple products
**And** respects rate limiting (3-5 seconds between requests) (FR23)
**And** stores scraped data in the Supabase database
**And** logs scraping progress and errors
**And** handles website structure changes gracefully
**And** validates extracted data before storing (FR22)
**And** the scraper completes within the off-peak window (2-4 AM)

**Implementation Notes:**
- Create class: `src/scrapers/ImtiazScraper.ts` extending BaseScraper
- Target: Imtiaz Supermarket website (URL from config)
- CSS selectors for product name, price, availability (must be robust to changes)
- Pagination: handle "Next" button or infinite scroll
- Rate limiting: `await page.waitForTimeout(3000)` between requests
- Data validation: non-empty name, valid price (> 0), valid availability status
- Error handling: log specific selector failures, partial scraping allowed
- Test scraping on sample products before full run
- Store in database: upsert products and prices (update existing, insert new)

---

### Story 4.4: Implement Chase Plus Scraper

As a developer,
I want to scrape product data from Chase Plus's website,
So that we can expand our price comparison to include their products.

**Acceptance Criteria:**

**Given** the Playwright infrastructure is set up
**When** I run the Chase Plus scraper
**Then** the scraper navigates to the Chase Plus website
**And** extracts product data: name, price, availability/status (FR18, FR19)
**And** handles pagination to scrape multiple products
**And** respects rate limiting (3-5 seconds between requests) (FR23)
**And** stores scraped data in the Supabase database
**And** logs scraping progress and errors
**And** handles website structure changes gracefully
**And** validates extracted data before storing (FR22)
**And** user agent is rotated to appear as different browsers (FR24)

**Implementation Notes:**
- Create class: `src/scrapers/ChasePlusScraper.ts` extending BaseScraper
- Target: Chase Plus website (URL from config)
- CSS selectors specific to Chase Plus's HTML structure
- User agent rotation: array of realistic browser user agents
- Randomize user agent per scraping session or per request
- Rate limiting with random jitter (3-5 seconds ± 500ms)
- Data validation same as Story 4.3
- Test on sample products first
- Graceful degradation: if Chase Plus scraper fails, Imtiaz data still available (NFR-REL-06)

---

### Story 4.5: Build ETL Pipeline & Data Transformation

As a developer,
I want to build an ETL pipeline that transforms scraped data and loads it into Supabase,
So that data is consistently formatted and stored according to our database schema.

**Acceptance Criteria:**

**Given** raw scraped data from store websites
**When** the ETL pipeline processes the data
**Then** scraped data (camelCase or varied formats) is transformed to database schema (snake_case)
**And** prices are converted to cents (integer) for consistent storage
**And** product names are normalized (trim, standardize case)
**And** availability status is standardized (in_stock, out_of_stock, unknown)
**And** duplicate products are identified and merged (same product from same store)
**And** historical prices are archived before updating current prices (FR25)
**And** data is upserted into Supabase (update if exists, insert if new)
**And** transformation errors are logged and don't stop the entire pipeline
**And** the pipeline can process 1000+ products within the off-peak window

**Implementation Notes:**
- Create: `src/etl/DataTransformer.ts`
- Transform: scrape → db schema
- Price conversion: "PKR 2,650.00" → 265000 (cents)
- Normalization: "Cooking Oil 5L" vs "cooking oil 5l" → standardized
- Deduplication: match by product name + store ID
- Upsert logic: UPDATE prices SET price_cents=X WHERE product_id=Y AND store_id=Z
- Archive: INSERT INTO price_history before updating current price
- Batch processing for efficiency (Supabase batch insert)
- Error handling: log failed transformations, continue with valid data
- Per Architecture: API layer transforms snake_case to camelCase for frontend

---

### Story 4.6: Configure Vercel Cron Job Scheduling

As a developer,
I want to configure Vercel Cron Jobs to run scrapers daily during off-peak hours,
So that product data is updated automatically without manual intervention.

**Acceptance Criteria:**

**Given** the scrapers and ETL pipeline are implemented
**When** I configure Vercel Cron Jobs
**Then** scrapers run automatically every day at 2-4 AM (off-peak) (FR20, FR23)
**And** the cron job triggers the ETL pipeline after scraping completes
**And** execution logs are captured in Vercel
**And** failed scraping jobs trigger alerts (FR21)
**And** the cron job timeout is configured for serverless limits (up to 60 seconds)
**And** manual re-scraping can be triggered via API endpoint (FR32)
**And** cron job status is logged in the database (last_run, status, product_count)

**Implementation Notes:**
- Create Vercel Cron Job in `vercel.json`: `cron: "0 2 * * *"` (2 AM daily)
- Cron job handler: `api/cron/scrape.ts` (serverless function)
- Workflow: Cron → Imtiaz Scraper → Chase Plus Scraper → ETL → Database
- Timeout: handle serverless function timeout (extend to 60s if needed)
- Logging: INSERT into scraping_log table (timestamp, store, status, product_count, error_message)
- Manual trigger: `api/trigger-scrape.ts` with authentication (FR32)
- Alerts: Integrate with Vercel logs or external service (email/SMS in Epic 6)
- Graceful degradation: partial failure logged, continues to next scraper
- Environment: Vercel cron jobs, Supabase connection

---

### Story 4.7: Implement Respectful Scraping & Anti-Scraping

As a developer,
I want to implement respectful scraping practices and anti-scraping countermeasures,
So that we avoid being blocked by store websites and maintain good relationships.

**Acceptance Criteria:**

**Given** we are scraping e-commerce websites
**When** the scrapers run
**Then** requests are rate-limited to 3-5 seconds between page loads (FR23)
**And** scrapers run during off-peak hours only (2-4 AM) (FR23)
**And** user agents are rotated to appear as different browsers (FR24)
**And** IP addresses are rotated or distributed across requests (FR24)
**And** request headers mimic legitimate browser requests
**And** robots.txt is respected if present (FR23)
**And** scraping failures trigger investigation (IP blocked, structure change)
**And** the system can detect when it's being rate-limited or blocked
**And** retry logic includes exponential backoff

**Implementation Notes:**
- **Rate limiting**: `await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))`
- **User agent rotation**: Array of 10+ realistic user agents, randomized per session
- **Request headers**: Include Referer, Accept-Language, Accept-Encoding
- **IP rotation**: For MVP, single IP; Phase 2: proxy service if needed
- **Anti-detection**: Randomize request timing, vary navigation patterns
- **robots.txt**: Check and respect (https://example.com/robots.txt)
- **Failure detection**: 403/429 status codes, CAPTCHA pages, empty results
- **Exponential backoff**: retry after 30s, 60s, 120s on failures
- **Logging**: Log rate limit events for monitoring
- **Ethical considerations**: Don't overload servers, respect their resources

---

### Story 4.8: Add Historical Data Retention

As a developer,
I want to implement 6-month historical price data retention,
So that we can track price trends over time and enable future analytics features.

**Acceptance Criteria:**

**Given** we need to retain price history for 6 months (FR25, NFR-DATA-02)
**When** prices are updated during daily scraping
**Then** the old price is archived in the price_history table before updating
**And** each price history record includes: price_id, price_cents, availability, recorded_at
**And** historical data is queryable by product and date range
**And** a cleanup job removes price history older than 6 months
**And** the retention policy is configurable
**And** historical queries are optimized with indexes
**And** the system can handle 50,000 products × 180 days = 9 million history records (Phase 3)

**Implementation Notes:**
- Archive trigger: Before UPDATE prices, INSERT into price_history
- Cleanup job: `DELETE FROM price_history WHERE recorded_at < NOW() - INTERVAL '6 months'`
- Query: Get price history for product between date X and Y
- Index: `CREATE INDEX idx_price_history_product_date ON price_history(product_id, recorded_at DESC)`
- Retention policy: Configurable via environment variable (PRICE_HISTORY_RETENTION_MONTHS = 6)
- Cleanup frequency: Run monthly or as part of daily scraping
- Partitioning: Consider table partitioning by month for Phase 3 scalability
- Storage: 9M records ≈ 500MB-1GB (acceptable for Supabase free tier)
- Future: Use for price trends, "best time to buy" predictions (Phase 3)

---

## Epic 5: WCAG AA Accessibility & Urdu Support

**Platform is accessible and usable by diverse users including non-tech and Urdu-speaking users**

### Story 5.1: Implement Keyboard Navigation & Focus Management

As a user who relies on keyboard navigation (Uncle Rasheed with motor difficulties),
I want to navigate and use all platform features using only a keyboard,
So that I can use the platform independently without a mouse or touch screen.

**Acceptance Criteria:**

**Given** I am using only a keyboard to navigate
**When** I press the Tab key
**Then** all interactive elements are focusable in logical order (FR34)
**And** focus is visibly indicated with a clear outline or highlight (WCAG AA)
**And** the Tab order follows the visual layout (left-to-right, top-to-bottom)
**And** Shift+Tab navigates backwards through interactive elements
**And** Enter and Space keys activate buttons and links
**And** a "Skip to main content" link appears on first Tab press
**And** focus is trapped within modals (Escape to close)
**And** focus moves to the first element when a modal opens
**And** focus returns to the triggering element when a modal closes

**Implementation Notes:**
- MUI components have built-in keyboard support (verify and customize as needed)
- Skip link: Hidden until focused, jumps to `#main-content`
- Focus styles: Custom `outline` with high contrast color
- Focus trap in modals: MUI Dialog supports this with `disableEnforceFocus=false`
- Test by unplugging mouse and navigating entire platform
- Document tab order for complex components (comparison cards, filters)
- Ensure custom components handle `onKeyDown` events properly

---

### Story 5.2: Add WCAG AA Contrast & Readability

As a user with visual impairments (Uncle Rasheed),
I want text to meet WCAG AA contrast requirements and be readable,
So that I can comfortably read and understand the content.

**Acceptance Criteria:**

**Given** I am viewing any page on the platform
**When** I look at the interface
**Then** all normal text has a minimum contrast ratio of 4.5:1 against background (FR35, NFR-A11Y-02)
**And** all large text (18px+ or 14pt+ bold) has a minimum contrast ratio of 3:1 (NFR-A11Y-02)
**And** body text is minimum 16px font size (FR36, NFR-A11Y-07)
**And** text can be resized up to 200% without loss of content or functionality (WCAG AA)
**And** text is not presented as an image (except logos)
**And** link text is descriptive and indicates destination
**And** color is not the only means of conveying information (also use icons, text)
**And** the platform passes automated accessibility testing (axe-core, Lighthouse)

**Implementation Notes:**
- MUI theme: Configure custom colors meeting contrast ratios
- Body text: `typography.body1.fontSize = '16px'` (MUI default is 14px, need to override)
- Test with: axe DevTools, WAVE, Lighthouse accessibility audits
- Color palette: Verify all combinations with contrast checker
- Large text: Headers, warnings, important messages
- Avoid: Light gray text on white background, red text on green, etc.
- Text resize: Test browser zoom to 200%, ensure no horizontal scroll
- Links: "View on Imtiaz Website" not "Click here"

---

### Story 5.3: Configure Urdu Language Support with RTL

As a user who prefers Urdu language (Uncle Rasheed),
I want to view interface labels in Urdu and use the platform in RTL layout,
So that I can navigate comfortably in my native language.

**Acceptance Criteria:**

**Given** I prefer to use the platform in Urdu
**When** I select Urdu from the language toggle
**Then** all interface labels are displayed in Urdu (FR37, NFR-A11Y-06)
**And** the layout switches to Right-to-Left (RTL) direction
**And** text alignment is right-aligned for Urdu content
**And** numbers and prices are displayed in appropriate format for Pakistani users
**And** the language toggle is accessible from any page
**And** language preference is saved (localStorage)
**And** MUI components automatically adapt to RTL layout
**And** search functionality works with Urdu input
**And** the platform is usable in both English and Urdu

**Implementation Notes:**
- MUI RTL support: Wrap app with `CacheProvider` and `ThemeProvider` with RTL
- Language toggle: Button in header or settings (🇬🇧 EN | 🇵🇰 اردو)
- Urdu translations: Create JSON file with English → Urdu mappings
- RTL layout: `dir="rtl"` on html or body element when Urdu selected
- Format numbers: PKR 2,650 (same in both languages, or Rs. 2,650)
- Price format: "Rs. 2,650" or "٢,٦٥٠ روپے" (Urdu numerals if preferred)
- Test all UI components in RTL mode (filters, modals, dropdowns)
- Ensure search works with Urdu input (Roman Urdu: "tail" for oil)
- localStorage: `localStorage.setItem('language', 'ur')` or `'en'`

---

### Story 5.4: Add Screen Reader Compatibility & Semantic HTML

As a blind user relying on a screen reader,
I want the platform to be compatible with screen readers,
So that I can navigate and understand the content using assistive technology.

**Acceptance Criteria:**

**Given** I am using a screen reader (NVDA, JAWS, VoiceOver)
**When** I navigate the platform
**Then** all images have descriptive alt text or are marked as decorative (FR41)
**And** a proper heading hierarchy exists (h1 → h2 → h3) with no skipped levels
**And** interactive elements have ARIA labels describing their purpose
**And** form inputs have associated labels
**And** error messages are announced to screen readers
**And** live regions announce dynamic content changes (search results, filters)
**And** page titles are descriptive and change based on current view
**And** landmarks (header, nav, main, footer) help navigation
**And** the platform passes screen reader testing with NVDA/JAWS

**Implementation Notes:**
- MUI components: Have built-in ARIA attributes (verify proper usage)
- Semantic HTML: Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`
- Headings: One h1 per page, sequential heading levels
- Alt text: `alt="Imtiaz Supermarket logo"`, `alt=""` for decorative images
- ARIA labels: `<button aria-label="Close modal">×</button>`
- Form labels: `<label htmlFor="search">Search products</label>`
- Live regions: `role="status"` or `aria-live="polite"` for search results
- Page title: Update document.title based on route (e.g., "Search Results - Cooking Oil")
- Test with: NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
- Screen reader testing checklist for key user flows

---

### Story 5.5: Ensure Touch Target Accessibility

As a user on a mobile device (Ahmed or Uncle Rasheed),
I want all interactive elements to be large enough to tap easily,
So that I can use the platform without frustration or mis-taps.

**Acceptance Criteria:**

**Given** I am using the platform on a mobile device
**When** I interact with buttons, links, and controls
**Then** all touch targets are minimum 44x44 pixels in size (FR42, NFR-A11Y-04)
**And** touch targets have adequate spacing between them (at least 8px gap)
**And** critical actions are in thumb-friendly zones (bottom of screen on mobile)
**And** buttons are clearly distinguishable from non-interactive elements
**And** swipe gestures are not required for core functionality (avoid swipes)
**And** zoom is not required for any interaction (200% pinch zoom supported)
**And** the platform works with touch-only interaction (no hover-dependent features)

**Implementation Notes:**
- MUI Button: `minWidth: 44px; minHeight: 44px` (IconButton needs explicit sizing)
- Touch target spacing: Add `gap: 2` or `margin` between adjacent buttons
- Thumb zone: Place primary actions at bottom (Filter, Sort buttons)
- Avoid: Hover-only content (use click/tap instead)
- Test: On actual mobile device with various screen sizes
- Touch targets: Links, buttons, checkboxes, radio buttons, dropdown triggers
- MUI components: Verify Button, IconButton, MenuItem meet 44x44px
- Use CSS to enforce minimum sizes if components don't support it natively
- Consider "Fitts's Law" - larger targets are easier to tap

---

## Epic 6: Platform Monitoring & Reliability

**System administrators can monitor platform health and respond to issues**

### Story 6.1: Build Scraping Status Dashboard

As a system administrator (Jibran),
I want to view a dashboard showing scraping status for all stores,
So that I can quickly identify any scraping issues and ensure data freshness.

**Acceptance Criteria:**

**Given** I am logged in as an administrator
**When** I access the admin dashboard
**Then** I see scraping status indicators for each store (FR26)
**And** each store shows: status (success/failed/warning), last run timestamp (FR27), and product count (FR28)
**And** status indicators use color coding (green = success, red = failed, yellow = warning)
**And** the dashboard refreshes automatically every 60 seconds
**And** I can view detailed logs for each scraping job
**And** the dashboard is accessible via keyboard navigation (FR34)
**And** the dashboard is responsive on mobile devices (FR38)
**And** the dashboard is protected by admin authentication (NFR-SEC-03)

**Implementation Notes:**
- **Admin route:** `/admin` or `/dashboard` (protected route, Phase 2)
- **Data source:** Query `scraping_log` table for latest entries per store
- **Status calculation:** Success if last_scrape < 26 hours ago AND error_count = 0
- **UI components:** MUI Card for each store, StatusBadge (green/red/yellow), Table for logs
- **Real-time:** Poll every 60s or use WebSocket for live updates (Phase 2)
- **Authentication:** Basic auth in MVP (NFR-SEC-03), full auth Phase 2
- **Display:** Imtiaz (✅ Success, 2:00 AM today, 847 products), Chase Plus (⚠️ Warning, 6:00 AM today, 0 products)
- **Responsive:** Cards stack on mobile, table on desktop

---

### Story 6.2: Implement Error Logging & Diagnostics

As a system administrator troubleshooting an issue,
I want to view detailed error logs with diagnostic information,
So that I can quickly identify and resolve problems.

**Acceptance Criteria:**

**Given** an error occurs during scraping or user interaction
**When** I view the error logs in the admin dashboard
**Then** I see structured error logs with diagnostic information (FR31)
**And** each error log includes: timestamp, error type, store/component, error message, stack trace
**And** logs are filterable by error type, date range, and store
**And** I can search logs by error message or keywords
**And** logs are paginated (100 per page) for performance
**And** critical errors are highlighted at the top
**And** I can export logs as JSON or CSV for analysis
**And** logs are retained for minimum 30 days
**And** the log viewer is accessible via keyboard navigation

**Implementation Notes:**
- **Log table:** `error_logs (id, timestamp, error_type, component, message, stack_trace, metadata, resolved)`
- **Error types:** SCRAPING_FAILURE, VALIDATION_ERROR, API_ERROR, DATABASE_ERROR, USER_ERROR
- **Logging service:** `src/services/logger.ts` (structured logging)
- **Log levels:** ERROR, WARN, INFO (focus on ERROR and WARN)
- **Storage:** Supabase table or external service (Sentry, LogRocket in Phase 2)
- **UI:** MUI Table with filters, TextField for search, Pagination, export button
- **Performance:** Index on (timestamp, error_type) for fast queries
- **Retention:** Cleanup job deletes logs older than 30 days

---

### Story 6.3: Create Real-Time Alerting System

As a system administrator,
I want to receive real-time alerts when critical issues occur,
So that I can respond quickly and minimize downtime.

**Acceptance Criteria:**

**Given** a critical issue occurs (scraping failure, user error spike)
**When** the alerting system detects the issue
**Then** I receive an alert notification within 15 minutes for scraping failures (FR29, NFR-REL-04)
**And** I receive an alert notification within 5 minutes for user-facing errors (FR30, NFR-REL-05)
**And** alerts include: issue type, severity, description, affected component, timestamp
**And** alerts are sent via email (and optionally SMS in Phase 2)
**And** alert rate limiting prevents spam (max 1 alert per issue per hour)
**And** I can view all sent alerts in the admin dashboard
**And** I can mark alerts as resolved or acknowledged
**And** alerts stop being sent for resolved issues
**And** the system respects my quiet hours (e.g., no alerts between 10 PM - 6 AM for non-critical)

**Implementation Notes:**
- **Alert storage:** `alerts (id, timestamp, type, severity, message, component, resolved, acknowledged)`
- **Detection logic:** Monitor `error_logs` table, trigger alert if ERROR count > threshold in window
- **Email service:** Use Vercel's built-in email or SendGrid/Resend (Phase 2)
- **Alert types:** CRITICAL (scraping complete failure), WARNING (partial scraping), INFO (user error spike)
- **Rate limiting:** Track last alert sent per issue type, don't resend within 60 minutes
- **Thresholds:** > 50% scraping failures = CRITICAL, > 10 user errors/minute = WARNING
- **Email template:** Include action items, link to error logs, link to manual re-scrape
- **Quiet hours:** Only CRITICAL alerts between 10 PM - 6 AM
- **Future (Phase 2):** SMS alerts via Twilio, Slack integration, PagerDuty

---

### Story 6.4: Add Manual Re-Scraping Triggers

As a system administrator,
I want to manually trigger re-scraping of store data,
So that I can quickly recover from scraping failures or update data urgently.

**Acceptance Criteria:**

**Given** I am logged in as an administrator
**When** I trigger a manual re-scraping job
**Then** I can choose to scrape a specific store or all stores (FR32)
**And** the scraping job executes immediately (not waiting for scheduled time)
**And** I receive confirmation when the job starts
**And** I can view the job status (running/completed/failed) in real-time
**And** I am notified when the job completes (success or failure)
**And** the manual scrape updates the same database tables as automated scraping
**And** manual scraping respects rate limiting and anti-scraping practices
**And** manual scraping is logged in the scraping_log table
**And** the manual trigger is protected by admin authentication (NFR-SEC-03)

**Implementation Notes:**
- **API endpoint:** `POST /api/v1/admin/trigger-scrape` (protected, admin only)
- **Request body:** `{ stores: ["imtiaz", "chase-plus"] | "all" }`
- **Response:** `{ jobId: "uuid", status: "started", stores: [...] }`
- **Execution:** Same scrapers as Story 4.3 and 4.4, run synchronously or async
- **UI:** Admin dashboard buttons: "Re-scrape Imtiaz", "Re-scrape All Stores"
- **Status tracking:** Job status in `scraping_log` table, real-time updates via polling
- **Logging:** Mark manual scrapes with `triggered_by: "admin"` or job ID
- **Rate limiting:** Still respect 3-5 second delays between requests
- **Authentication:** API key or basic auth (NFR-SEC-03)
- **Testing:** Test manual trigger with small subset of products first

---

### Story 6.5: Implement Performance Monitoring

As a system administrator,
I want to track performance metrics (response times, uptime),
So that I can ensure the platform meets performance requirements and identify degradation.

**Acceptance Criteria:**

**Given** users are interacting with the platform
**When** I view the performance monitoring dashboard
**Then** I see real-time and historical performance metrics (FR33)
**And** metrics include: API response times (p50, p95, p99), uptime percentage, error rate
**And** response times are measured for: search API, product API, scraping jobs
**And** alerts are triggered if response times exceed thresholds (e.g., > 2s for search)
**And** uptime is calculated as percentage of time platform was accessible (NFR-REL-02)
**And** I can view performance trends over time (hourly, daily, weekly)
**And** Core Web Vitals are tracked (LCP, FID, CLS) (NFR-PERF-04)
**And** performance data is retained for minimum 6 months
**And** the dashboard helps identify performance bottlenecks

**Implementation Notes:**
- **Metrics storage:** `performance_metrics (timestamp, metric_name, value, labels)`
- **API tracking:** Middleware logs response time for each API request
- **Uptime tracking:** Heartbeat endpoint `GET /api/v1/health` called every minute
- **Tools:** Vercel Analytics (built-in), or custom implementation
- **Thresholds:** Alert if p95 search time > 2s (NFR-PERF-01), uptime < 95% (NFR-REL-02)
- **Core Web Vitals:** Use Lighthouse CI or Web Vitals library
- **Dashboard:** Line charts for trends, stat cards for current values
- **Labels:** Store, endpoint, error type for filtering metrics
- **Retention:** Aggregate older data (daily averages) to save space

---

### Story 6.6: Add Data Validation & Quality Checks

As a system administrator,
I want to validate scraped data quality and detect anomalies,
So that I can ensure users see accurate pricing information.

**Acceptance Criteria:**

**Given** scraping jobs complete successfully
**When** the data validation system runs
**Then** scraped data is validated against quality rules (FR22)
**And** validation checks include: price changes > 50%, missing required fields, duplicate detection
**And** validation failures trigger alerts (FR29)
**And** validation results are logged in the database
**And** I can view a data quality report in the admin dashboard
**And** suspicious products are flagged for manual review
**And** the system tracks data accuracy rate (percentage of valid products) (NFR-REL-03)
**And** validation failures don't stop valid data from being stored (graceful handling)
**And** historical accuracy trends are available for analysis

**Implementation Notes:**
- **Validation service:** `src/etl/DataValidator.ts`
- **Validation rules:**
  - Price change detection: Alert if price changed > 50% since yesterday (possible error)
  - Required fields: name (NOT NULL), price > 0, availability in enum
  - Duplicate detection: Same product + store with different prices
  - Format validation: Price parsing succeeded, availability is valid enum
- **Alerting:** If > 10% of products fail validation, send alert (FR22)
- **Logging:** Store validation results in `data_validation_log` table
- **Dashboard:** Show accuracy rate over time, list of flagged products
- **Manual review:** Allow admin to approve or reject flagged products
- **Accuracy calculation:** (valid_products / total_products) × 100 (NFR-REL-03 target: 95%+)
- **Graceful degradation:** Store valid data, log invalid for review

---
