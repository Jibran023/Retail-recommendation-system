import { useMemo, useState } from 'react';
import { Box, Typography, Chip, Alert, AlertTitle, Skeleton, Button, Card, CardContent, useTheme, useMediaQuery, ToggleButton, ToggleButtonGroup, Toolbar } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Star, Place, ViewList, ViewModule } from '@mui/icons-material';
import { useSearch } from '../hooks/useSearch';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { useFilter } from '../hooks/useFilter';
import { getCategoryName } from '../services/mockCategories';
import { getStoreInfo, formatDistance, DEFAULT_USER_LOCATION } from '../constants/stores';
import { calculateDistance } from '../utils/distance';
import type { ProductPrice, Product } from '../types/Product.types';
import { SortControl } from './SortControl';
import { FilterPanel } from './FilterPanel';
import { StoreLinkButton } from './StoreLinkButton';
import { StoreModal } from './StoreModal';
import { GroupedProductsView } from './GroupedProductsView';

/**
 * Formats price from cents to currency display
 * Example: 265000 -> Rs. 2,650
 */
function formatPrice(priceInCents: number): string {
  const priceInRupees = priceInCents / 100;
  return `Rs. ${priceInRupees.toLocaleString('en-PK')}`;
}

/**
 * Formats relative time from ISO date string
 * Example: "Updated 2 hours ago"
 */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Updated just now';
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  if (diffDays === 1) return 'Updated yesterday';
  return `Updated ${diffDays} days ago`;
}

/**
 * PriceComparisonCard displays a single store's price with all details
 * Shows best value badge if this is the cheapest price
 * Shows nearest badge if this is the closest store
 * Includes click-through button to store website
 */
interface PriceComparisonCardProps {
  price: ProductPrice;
  isBestValue: boolean;
  isNearest: boolean;
  productName: string;
}

function PriceComparisonCard({ price, isBestValue, isNearest, productName }: PriceComparisonCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        position: 'relative',
        border: isBestValue ? `2px solid ${theme.palette.success.main}` : isNearest ? `2px solid ${theme.palette.info.main}` : 1,
        borderColor: isBestValue ? 'success.main' : isNearest ? 'info.main' : 'divider',
        bgcolor: isBestValue ? 'success.50' : isNearest ? 'info.50' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: isBestValue || isNearest ? 'scale(1.02)' : 'none',
        },
      }}
    >
      {isBestValue && (
        <Chip
          icon={<Star sx={{ fontSize: 16 }} />}
          label="Best Value"
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: isNearest ? 8 + 28 : 8, // Offset if both badges
            right: 8,
            fontWeight: 'bold',
          }}
        />
      )}
      {isNearest && (
        <Chip
          icon={<Place sx={{ fontSize: 16 }} />}
          label="Nearest"
          color="info"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontWeight: 'bold',
          }}
        />
      )}
      <CardContent sx={{ pt: isBestValue || isNearest ? 4 : 2 }}>
        <Box sx={{ mb: 2 }}>
          <StoreModal
            price={price}
            trigger={
              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                component="div"
                fontWeight={isBestValue ? 'bold' : 'medium'}
                color="text.primary"
                gutterBottom
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  },
                }}
              >
                {price.storeName}
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="div"
            fontWeight="bold"
            color={price.available ? 'success.main' : 'error.main'}
            sx={{
              fontSize: isBestValue ? { xs: '1.75rem', md: '2.125rem' } : { xs: '1.5rem', md: '1.75rem' },
            }}
          >
            {formatPrice(price.price)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {price.available ? (
              <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />
            ) : (
              <Cancel sx={{ fontSize: 18, color: 'error.main' }} />
            )}
            <Typography variant="body2" color="text.secondary">
              {price.available ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatRelativeTime(price.lastUpdated)}
            </Typography>
          </Box>

          {price.distance !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Place sx={{ fontSize: 16, color: isNearest ? 'info.main' : 'text.secondary' }} />
              <Typography variant="body2" color={isNearest ? 'info.main' : 'text.secondary'} fontWeight={isNearest ? 'bold' : 'normal'}>
                {formatDistance(price.distance)} away
              </Typography>
            </Box>
          )}
        </Box>

        {/* Store link button */}
        <StoreLinkButton price={price} productName={productName} />
      </CardContent>
    </Card>
  );
}

/**
 * SearchResults component displays search results
 *
 * Features:
 * - Product list with prices from multiple stores
 * - Availability status for each store
 * - Empty state and error handling
 * - Loading state indicator
 * - Results count display
 *
 * Accessibility:
 * - Proper ARIA labels for screen readers
 * - Clear error messaging
 * - Keyboard navigation support
 */
export function SearchResults() {
  const { state, setSort } = useSearch();
  const { clearCategory } = useCategoryFilter();
  const { results, loading, error, resultsCount, query, selectedCategory, sortBy } = state;
  const { state: filterState, clearAllFilters } = useFilter();
  const { inStockOnly, selectedStores, priceRange } = filterState;

  // View toggle state: 'list' or 'grouped'
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

  // Apply filters to results and calculate distances
  const filteredResults = useMemo(() => {
    // Debug logging (can be removed in production)
    if (inStockOnly || selectedStores.length > 0 || priceRange) {
      console.log('Filtering results:', {
        inStockOnly,
        selectedStores,
        priceRange,
        resultsCount: results.length,
      });
    }

    return results
      .map((product: Product): Product => {
        // Start with all prices and calculate distances
        let filteredPrices = product.prices.map((price: ProductPrice): ProductPrice => {
          const storeInfo = getStoreInfo(price.storeName);
          const distance = storeInfo
            ? calculateDistance(DEFAULT_USER_LOCATION, { latitude: storeInfo.latitude, longitude: storeInfo.longitude })
            : undefined;
          return {
            ...price,
            distance,
          };
        });

        // Filter prices by selected stores first
        if (selectedStores.length > 0) {
          filteredPrices = filteredPrices.filter((p: ProductPrice) =>
            selectedStores.includes(p.storeName)
          );
        }

        // Then filter by in-stock status (if enabled, only show in-stock prices)
        if (inStockOnly) {
          filteredPrices = filteredPrices.filter((p: ProductPrice) => {
            const isInStock = p.available === true;
            if (!isInStock && product.prices.length === filteredPrices.length) {
              // Log when filtering out prices
              console.log(`Filtering out-of-stock price for ${product.name} at ${p.storeName}`);
            }
            return isInStock;
          });
        }

        // Filter by price range (filter prices within the range)
        if (priceRange) {
          filteredPrices = filteredPrices.filter((p: ProductPrice) => {
            const withinRange = p.price >= priceRange.min && p.price <= priceRange.max;
            if (!withinRange) {
              console.log(`Filtering price for ${product.name} at ${p.storeName}: ${p.price} not in range [${priceRange.min}, ${priceRange.max}]`);
            }
            return withinRange;
          });
        }

        // Return the product with filtered prices
        return {
          ...product,
          prices: filteredPrices,
        };
      })
      .filter((product: Product) => {
        // Filter out products that have no prices after filtering
        const hasPrices = product.prices.length > 0;
        if (!hasPrices && (inStockOnly || selectedStores.length > 0 || priceRange)) {
          console.log(`Filtering out product ${product.name} - no matching prices`);
        }
        return hasPrices;
      });
  }, [results, inStockOnly, selectedStores, priceRange]);

  // Sort filtered results based on sort option
  const sortedResults = useMemo(() => {
    if (sortBy === 'default') {
      return filteredResults;
    }

    // Sort products AND sort prices within each product
    const sorted = [...filteredResults].map((product: Product): Product & { cheapestPrice?: number; nearestDistance?: number } => {
      // Sort prices within the product based on sort option
      let sortedPrices = [...product.prices];
      if (sortBy === 'price-asc') {
        sortedPrices.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        sortedPrices.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'distance-asc') {
        sortedPrices.sort((a, b) => {
          // Sort by distance, putting undefined distances at the end
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
      }

      // Calculate cheapest price for product sorting (price-based sort)
      const cheapestPrice = sortedPrices.length > 0 && sortedPrices[0].price !== undefined
        ? Math.min(...sortedPrices.map((p: ProductPrice) => p.price))
        : undefined;

      // Calculate nearest distance for product sorting (distance-based sort)
      const nearestDistance = sortedPrices.length > 0 && sortedPrices[0].distance !== undefined
        ? Math.min(...sortedPrices.map((p: ProductPrice) => p.distance ?? Infinity))
        : undefined;

      return {
        ...product,
        prices: sortedPrices,
        cheapestPrice,
        nearestDistance,
      };
    });

    // Sort products by their cheapest price
    if (sortBy === 'price-asc') {
      return sorted.sort((a, b) => (a.cheapestPrice ?? Infinity) - (b.cheapestPrice ?? Infinity));
    }

    if (sortBy === 'price-desc') {
      return sorted.sort((a, b) => (b.cheapestPrice ?? 0) - (a.cheapestPrice ?? 0));
    }

    // Sort products by their nearest distance
    if (sortBy === 'distance-asc') {
      return sorted.sort((a, b) => (a.nearestDistance ?? Infinity) - (b.nearestDistance ?? Infinity));
    }

    return sorted;
  }, [filteredResults, sortBy]);

  // Note: Auto-sort removed to prevent confusing behavior
  // Users can manually sort using the SortControl buttons

  // Loading state with skeleton UI
  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', my: 2 }} data-testid="loading-state">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Searching products...
        </Typography>
        {/* Show 5 skeleton rows to simulate loading results */}
        {[1, 2, 3, 4, 5].map((item) => (
          <Box
            key={item}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              p: 2,
            }}
          >
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={60} />
          </Box>
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert data-testid="error-message" severity="error" sx={{ my: 2 }}>
        <AlertTitle>Search Error</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  // Empty state (no query entered and no category selected)
  if (query.trim() === '' && !selectedCategory) {
    return (
      <Box data-testid="empty-state" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Start searching for products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter a product name above to see prices from different stores
        </Typography>
      </Box>
    );
  }

  // No results state
  if (results.length === 0) {
    return (
      <Box data-testid="no-results" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try searching for "Cooking Oil", "Daal", or "Rice"
        </Typography>
      </Box>
    );
  }

  // Check if filters removed all results
  const hasResults = sortedResults.length > 0;
  const hasActiveFilters = inStockOnly || selectedStores.length > 0 || priceRange !== undefined;
  return (
    <Box data-testid="search-results" sx={{ maxWidth: 1200, mx: 'auto', my: 2 }}>
      {/* Filter panel - show when there are search results (even if filtered out) */}
      {(results.length > 0 && hasActiveFilters) || hasResults ? <FilterPanel /> : null}

      {/* Message when filters remove all products */}
      {!hasResults && hasActiveFilters && results.length > 0 && (
        <Box
          sx={{
            bgcolor: 'warning.50',
            border: 1,
            borderColor: 'warning.main',
            borderRadius: 2,
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">
              No products match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filter settings to see more products
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              clearAllFilters();
              setSort('default');
            }}
            size="small"
          >
            Clear All Filters
          </Button>
        </Box>
      )}

      {/* Category badge and clear filter */}
      {selectedCategory && selectedCategory !== 'all' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={`Category: ${getCategoryName(selectedCategory)}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Button
            size="small"
            onClick={clearCategory}
            sx={{ textTransform: 'none', fontSize: '0.875rem' }}
          >
            Clear filter
          </Button>
        </Box>
      )}

      {/* View Toggle & Sort control - only show when there are results */}
      {sortedResults.length > 0 && (
        <Toolbar
          sx={{
            pl: 0,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newViewMode) => {
              if (newViewMode) setViewMode(newViewMode as 'list' | 'grouped');
            }}
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewList fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                List
              </Typography>
            </ToggleButton>
            <ToggleButton value="grouped" aria-label="grouped view">
              <ViewModule fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                Grouped
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Sort Control */}
          <SortControl />
        </Toolbar>
      )}

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sortedResults.length !== resultsCount && (
          <>Showing {sortedResults.length} of </>
        )}
        Found {resultsCount} product{resultsCount !== 1 ? 's' : ''}
        {query && ` for "${query}"`}
        {selectedCategory && selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory)}`}
        {sortBy !== 'default' && ` · Sorted by ${
          sortBy === 'price-asc' ? 'Price: Low to High' :
          sortBy === 'price-desc' ? 'Price: High to Low' :
          sortBy === 'distance-asc' ? 'Distance: Near to Far' :
          'Default'
        }`}
        {(inStockOnly || selectedStores.length > 0 || priceRange) && ' · Filtered'}
        {viewMode === 'grouped' && ` · ${viewMode === 'grouped' ? 'Grouped' : 'List'} View`}
      </Typography>

      {/* Show grouped view or list view based on toggle */}
      {viewMode === 'grouped' ? (
        <GroupedProductsView products={sortedResults} />
      ) : (
        <>
          {/* Product list with price comparison cards */}
          {sortedResults.map((product) => {
        // Find cheapest price for best value badge
        const availablePrices = product.prices.filter(p => p.available);
        const cheapestPrice = availablePrices.length > 0
          ? availablePrices.reduce((min, p) => p.price < min.price ? p : min)
          : null;

        // Find nearest price for nearest badge
        const pricesWithDistance = product.prices.filter(p => p.distance !== undefined);
        const nearestPrice = pricesWithDistance.length > 0
          ? pricesWithDistance.reduce((min, p) => (p.distance ?? Infinity) < (min.distance ?? Infinity) ? p : min)
          : null;

        return (
          <Box
            key={product.id}
            data-testid="product-card"
            sx={{
              bgcolor: 'background.paper',
              mb: 3,
              borderRadius: 2,
              boxShadow: 1,
              p: { xs: 2, md: 3 },
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            {/* Product header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant={product.prices.length > 2 ? 'h5' : 'h6'} component="div" fontWeight="bold">
                {product.name}
              </Typography>
              <Chip
                label={product.category}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>

            {/* Price comparison cards - responsive flex layout */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {product.prices.map((price: ProductPrice) => (
                <Box
                  key={`${product.id}-${price.storeId}`}
                  sx={{
                    flex: {
                      xs: product.prices.length === 1 ? '1 1 100%' : '1 1 100%',
                      sm: product.prices.length === 1 ? '1 1 100%' : '1 1 calc(50% - 16px)',
                      md: product.prices.length === 1 ? '1 1 100%' : product.prices.length === 2 ? '1 1 calc(50% - 16px)' : '1 1 calc(33.33% - 16px)',
                      lg: product.prices.length === 1 ? '1 1 100%' : product.prices.length === 2 ? '1 1 calc(50% - 16px)' : '1 1 calc(25% - 16px)',
                    },
                    minWidth: 0,
                  }}
                >
                  <PriceComparisonCard
                    price={price}
                    isBestValue={cheapestPrice?.storeId === price.storeId && price.available}
                    isNearest={nearestPrice?.storeId === price.storeId && price.distance !== undefined}
                    productName={product.name}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
      </>
    )}
    </Box>
  );
}