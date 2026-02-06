import { useMemo } from 'react';
import { Box, Typography, Chip, Alert, AlertTitle, Skeleton, Button, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { CheckCircle, Cancel, Schedule, Star } from '@mui/icons-material';
import { useSearch } from '../hooks/useSearch';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { useFilter } from '../hooks/useFilter';
import { getCategoryName } from '../services/mockCategories';
import type { ProductPrice, Product } from '../types/Product.types';
import { SortControl } from './SortControl';
import { FilterPanel } from './FilterPanel';

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
 */
interface PriceComparisonCardProps {
  price: ProductPrice;
  isBestValue: boolean;
}

function PriceComparisonCard({ price, isBestValue }: PriceComparisonCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        position: 'relative',
        border: isBestValue ? `2px solid ${theme.palette.success.main}` : 1,
        borderColor: isBestValue ? 'success.main' : 'divider',
        bgcolor: isBestValue ? 'success.50' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: isBestValue ? 'scale(1.02)' : 'none',
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
            top: 8,
            right: 8,
            fontWeight: 'bold',
          }}
        />
      )}
      <CardContent sx={{ pt: isBestValue ? 4 : 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            component="div"
            fontWeight={isBestValue ? 'bold' : 'medium'}
            color="text.primary"
            gutterBottom
          >
            {price.storeName}
          </Typography>
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
        </Box>
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
  const { inStockOnly, selectedStores } = filterState;

  // Apply filters to results
  const filteredResults = useMemo(() => {
    // Debug logging (can be removed in production)
    if (inStockOnly || selectedStores.length > 0) {
      console.log('Filtering results:', {
        inStockOnly,
        selectedStores,
        resultsCount: results.length,
      });
    }

    return results
      .map((product: Product): Product => {
        // Start with all prices
        let filteredPrices = product.prices;

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

        // Return the product with filtered prices
        return {
          ...product,
          prices: filteredPrices,
        };
      })
      .filter((product: Product) => {
        // Filter out products that have no prices after filtering
        const hasPrices = product.prices.length > 0;
        if (!hasPrices && (inStockOnly || selectedStores.length > 0)) {
          console.log(`Filtering out product ${product.name} - no matching prices`);
        }
        return hasPrices;
      });
  }, [results, inStockOnly, selectedStores]);

  // Sort filtered results based on sort option
  const sortedResults = useMemo(() => {
    if (sortBy === 'default') {
      return filteredResults;
    }

    // Sort products AND sort prices within each product
    const sorted = [...filteredResults].map((product: Product): Product & { cheapestPrice: number } => {
      // Sort prices within the product based on sort option
      let sortedPrices = [...product.prices];
      if (sortBy === 'price-asc') {
        sortedPrices.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        sortedPrices.sort((a, b) => b.price - a.price);
      }

      // Calculate cheapest price for product sorting
      const cheapestPrice = sortedPrices.length > 0
        ? Math.min(...sortedPrices.map((p: ProductPrice) => p.price))
        : Infinity;

      return {
        ...product,
        prices: sortedPrices,
        cheapestPrice,
      };
    });

    // Sort products by their cheapest price
    if (sortBy === 'price-asc') {
      return sorted.sort((a, b) => a.cheapestPrice - b.cheapestPrice);
    }

    if (sortBy === 'price-desc') {
      return sorted.sort((a, b) => b.cheapestPrice - a.cheapestPrice);
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
  const hasActiveFilters = inStockOnly || selectedStores.length > 0;
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

      {/* Sort control - only show when there are results */}
      {sortedResults.length > 0 && <SortControl />}

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {sortedResults.length !== resultsCount && (
          <>Showing {sortedResults.length} of </>
        )}
        Found {resultsCount} product{resultsCount !== 1 ? 's' : ''}
        {query && ` for "${query}"`}
        {selectedCategory && selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory)}`}
        {sortBy !== 'default' && ` · Sorted by ${sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}`}
        {(inStockOnly || selectedStores.length > 0) && ' · Filtered'}
      </Typography>

      {/* Product list with price comparison cards */}
      {sortedResults.map((product) => {
        // Find cheapest price for best value badge
        const availablePrices = product.prices.filter(p => p.available);
        const cheapestPrice = availablePrices.length > 0
          ? availablePrices.reduce((min, p) => p.price < min.price ? p : min)
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
                  />
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
