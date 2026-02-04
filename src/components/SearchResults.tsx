import { Box, Typography, List, ListItem, ListItemText, Divider, Chip, Alert, AlertTitle, Skeleton, Button } from '@mui/material';
import { useSearch } from '../hooks/useSearch';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { getCategoryName } from '../services/mockCategories';

/**
 * Formats price from cents to currency display
 * Example: 265000 -> Rs. 2,650
 */
function formatPrice(priceInCents: number): string {
  const priceInRupees = priceInCents / 100;
  return `Rs. ${priceInRupees.toLocaleString('en-PK')}`;
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
  const { state } = useSearch();
  const { clearCategory } = useCategoryFilter();
  const { results, loading, error, resultsCount, query, selectedCategory } = state;

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

  // Empty state (no query entered)
  if (query.trim() === '') {
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

  // Results display
  return (
    <Box data-testid="search-results" sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
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

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Found {resultsCount} product{resultsCount !== 1 ? 's' : ''}
        {query && ` for "${query}"`}
        {selectedCategory && selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory)}`}
      </Typography>

      {/* Product list */}
      <List>
        {results.map((product, index) => (
          <div key={product.id}>
            <ListItem
              data-testid="product-card"
              alignItems="flex-start"
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2,
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.primary" gutterBottom>
                      Prices from different stores:
                    </Typography>
                    {product.prices.map((price: { storeId: string; storeName: string; price: number; available: boolean; lastUpdated: string }) => (
                      <Box
                        key={`${product.id}-${price.storeId}`}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 0.5,
                          px: 1,
                          bgcolor: 'action.hover',
                          borderRadius: 0.5,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.primary">
                          {price.storeName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={price.available ? 'success.main' : 'error.main'}
                          >
                            {formatPrice(price.price)}
                          </Typography>
                          <Chip
                            label={price.available ? 'In Stock' : 'Out of Stock'}
                            size="small"
                            color={price.available ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                }
              />
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
}
