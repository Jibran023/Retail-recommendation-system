# Story 1.6: Integrate Supabase for Product Data

**As a developer,**
**I want to connect the frontend to Supabase for product data,**
**So that the platform displays real product and pricing information.**

## Acceptance Criteria

**Given** Supabase database contains product data
**When** the frontend makes API requests
**Then** products are fetched from Supabase successfully
**And** data transformation converts snake_case to camelCase (per Architecture)
**And** API responses follow the {success, data/error} format (per Architecture)
**And** errors are handled with structured AppError {code, message, details}
**And** loading states are managed locally (no global loading)
**And** the API uses /api/v1/ versioning pattern

## Implementation Notes

- Create Supabase client: `src/lib/supabase.ts`
- Create API client wrapper: `src/services/apiClient.ts`
- Implement structured error handling
- Create types for Product, Store, Price entities
- Use React Context for API state management
- Implement retry logic for failed requests
- Respectful rate limiting (don't overwhelm Supabase)

## Status

**Status:** done
**Epic:** Epic 1 - Product Search & Discovery
**Created:** 2026-02-05
**Completed:** 2026-02-05

## Implementation Summary

**Supabase Integration (`src/services/supabaseClient.ts`):**
- `searchProducts(query)` - Search products by name with prices from all stores
- `getProductsByCategory(category)` - Get all products in a specific category
- `getCategories()` - Get all distinct categories
- `getStores()` - Get all stores
- Proper error handling with structured logs
- REST API implementation using Supabase REST endpoints

**API Client Wrapper (`src/services/apiClient.ts`):**
- Wraps Supabase calls with {success, data/error} format
- Structured error handling with AppError {code, message, details}
- Local loading states (no global loading)
- API versioning pattern: /api/v1/
- Type-safe responses with TypeScript

**Type Definitions:**
- `Product` interface with prices array
- `ProductPrice` interface with store, price, availability, timestamp
- `Store` interface
- `AppError` interface for structured errors

**Environment Configuration:**
- `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Proper validation on startup
