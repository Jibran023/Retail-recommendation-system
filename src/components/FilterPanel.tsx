import { useMemo, useState } from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Chip, Button, Divider, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useFilter } from '../hooks/useFilter';
import { useSearch } from '../hooks/useSearch';

/**
 * FilterPanel component for filtering product results
 *
 * Features:
 * - In-stock only toggle
 * - Store selection (multi-select)
 * - Expandable/collapsible panel
 * - Clear all filters button
 * - WCAG AA compliant touch targets
 */
export function FilterPanel() {
  const { state: filterState, setInStockOnly, toggleStore, clearStores, clearAllFilters, hasActiveFilters } = useFilter();
  const { state: searchState } = useSearch();
  const { results } = searchState;
  const [expanded, setExpanded] = useState(true);

  // Extract unique stores from results
  const availableStores = useMemo(() => {
    const storeSet = new Set<string>();
    results.forEach((product) => {
      product.prices.forEach((price) => {
        storeSet.add(price.storeName);
      });
    });
    return Array.from(storeSet).sort();
  }, [results]);

  // Calculate store counts
  const storeCounts = availableStores.map((storeName) => {
    let count = 0;
    results.forEach((product) => {
      product.prices.forEach((price) => {
        if (price.storeName === storeName) {
          count++;
        }
      });
    });
    return { storeName, count };
  });

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
        mb: 2,
      }}
    >
      {/* Header with expand/collapse */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleToggleExpand}
      >
        <Typography variant="h6" component="div">
          Filters
          {hasActiveFilters && (
            <Chip
              label="Active"
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {/* In-stock only filter */}
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                inputProps={{ 'aria-label': 'Show in-stock products only' }}
                sx={{ mr: 1 }}
              />
            }
            label="In Stock Only"
            sx={{
              mb: 2,
              width: '100%',
              ml: 0,
              // Ensure minimum touch target size (WCAG AA)
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
            }}
          />

          <Divider sx={{ mb: 2 }} />

          {/* Store selection filter */}
          <Typography variant="subtitle2" gutterBottom>
            Stores
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {storeCounts.map(({ storeName, count }) => (
              <FormControlLabel
                key={storeName}
                control={
                  <Checkbox
                    checked={filterState.selectedStores.includes(storeName)}
                    onChange={() => toggleStore(storeName)}
                    inputProps={{ 'aria-label': `Filter by ${storeName}` }}
                    sx={{ mr: 1 }}
                  />
                }
                label={`${storeName} (${count})`}
                sx={{
                  ml: 0,
                  width: '100%',
                  // Ensure minimum touch target size (WCAG AA)
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
            ))}
          </Box>

          {filterState.selectedStores.length > 0 && (
            <Button
              size="small"
              onClick={clearStores}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Clear stores
            </Button>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Clear all filters button */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={clearAllFilters}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
