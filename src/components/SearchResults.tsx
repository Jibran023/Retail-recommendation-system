import { Box, Typography, List, ListItem, ListItemText, Divider, Chip, Alert, AlertTitle } from '@mui/material';
import { useSearch } from '../context/SearchContext';

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
  const { results, loading, error, resultsCount, query } = state;

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Searching products...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        <AlertTitle>Search Error</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  // Empty state (no query entered)
  if (query.trim() === '') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
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
      <Box sx={{ textAlign: 'center', py: 8 }}>
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
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Found {resultsCount} product{resultsCount !== 1 ? 's' : ''} for "{query}"
      </Typography>

      {/* Product list */}
      <List>
        {results.map((product, index) => (
          <div key={product.id}>
            <ListItem
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
