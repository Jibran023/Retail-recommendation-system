/**
 * Store API Client Service
 *
 * Generic API client for fetching data from store APIs
 * Uses the existing Supabase REST API pattern from supabaseClient.ts
 */

import type {
  StoreConfig,
  MenuSectionResponse,
  ItemsResponse,
} from '../types/StoreApi.types';
import { API_ENDPOINTS, RATE_LIMIT_DELAY } from '../constants/storeApiConfig';

/**
 * Rate limiter to prevent overwhelming the APIs
 */
class RateLimiter {
  private lastCall = 0;
  private delay: number;

  constructor(delay: number = RATE_LIMIT_DELAY) {
    this.delay = delay;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;

    if (timeSinceLastCall < this.delay) {
      const waitTime = this.delay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastCall = Date.now();
  }
}

/**
 * Store API Client class
 */
export class StoreApiClient {
  private config: StoreConfig;
  private rateLimiter: RateLimiter;

  constructor(config: StoreConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params: Record<string, string | number | undefined> = {}): string {
    const url = new URL(endpoint, this.config.baseUrl);

    // Add default parameters
    url.searchParams.set('restId', this.config.restId);
    url.searchParams.set('rest_brId', this.config.restBrId);
    url.searchParams.set('delivery_type', '0');
    url.searchParams.set('source', 'google');

    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  /**
   * Get request headers with authentication
   */
  private getHeaders(): HeadersInit {
    return {
      'App-name': this.config.appName,
      'Rest-Id': this.config.restId,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': this.config.baseUrl,
    };
  }

  /**
   * Make API request with error handling
   */
  private async request<T>(url: string): Promise<T> {
    await this.rateLimiter.wait();

    console.log(`[StoreAPI] Fetching: ${this.config.name} - ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API error response
      if (data.status && data.status !== 200) {
        throw new Error(data.msg || 'API error');
      }

      return data as T;
    } catch (error) {
      console.error(`[StoreAPI] Error fetching from ${this.config.name}:`, error);
      throw error;
    }
  }

  /**
   * Fetch menu sections (categories)
   */
  async fetchMenuSections(): Promise<MenuSectionResponse> {
    const url = this.buildUrl(API_ENDPOINTS.MENU_SECTION);
    return this.request<MenuSectionResponse>(url);
  }

  /**
   * Fetch sub sections within a category
   * Returns dish_sub_sections array
   */
  async fetchSubSections(sectionId: string | number): Promise<{ status: number; msg: string; data: any[] }> {
    const url = this.buildUrl(API_ENDPOINTS.SUB_SECTION, {
      sectionId: String(sectionId),
    });
    return this.request(url);
  }

  /**
   * Fetch products (items) from a subsection with pagination
   */
  async fetchProducts(subSectionId: string | number, pageNo: number = 1, perPage: number = 24): Promise<ItemsResponse> {
    const url = this.buildUrl(API_ENDPOINTS.ITEMS_BY_SUBSECTION, {
      sub_section_id: String(subSectionId),
      page_no: pageNo,
      per_page: perPage,
      start: (pageNo - 1) * perPage,
      limit: perPage,
      sort_by: 'name',
      sort: 'asc',
      min_price: 0,
      max_price: '',
      brand_name: '',
    });

    return this.request<ItemsResponse>(url);
  }

  /**
   * Fetch all products from a subsection (handles pagination)
   */
  async fetchAllProductsFromSubsection(
    subSectionId: string | number,
    maxProducts: number = 500
  ): Promise<ItemsResponse['data']> {
    const allProducts: ItemsResponse['data'] = [];
    let page = 1;
    const perPage = 24;
    let hasMore = true;

    while (hasMore && allProducts.length < maxProducts) {
      const response = await this.fetchProducts(subSectionId, page, perPage);

      if (!response.data || response.data.length === 0) {
        break;
      }

      allProducts.push(...response.data);

      // Check if there are more products
      hasMore = response.data.length === perPage;
      page++;
    }

    console.log(`[StoreAPI] Fetched ${allProducts.length} products from subsection ${subSectionId}`);
    return allProducts;
  }
}
