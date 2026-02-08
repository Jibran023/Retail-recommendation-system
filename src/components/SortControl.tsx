import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { Sort as SortIcon } from '@mui/icons-material';
import { useSearch } from '../hooks/useSearch';
import type { SortOption } from '../types/Search.types';

/**
 * SortControl component for sorting product results
 *
 * Features:
 * - Sort by price (low to high, high to low)
 * - Sort by distance (near to far)
 * - Default/relevance sorting
 * - Visual indicator for active sort
 * - Keyboard navigation support
 * - Touch targets 44x44px minimum (WCAG AA)
 */
export function SortControl() {
  const { state, setSort } = useSearch();
  const { sortBy } = state;

  const handleSortChange = (option: SortOption) => {
    setSort(option);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'distance-asc', label: 'Distance: Near to Far' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SortIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          Sort by:
        </Typography>
      </Box>

      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="Sort options"
      >
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            variant={sortBy === option.value ? 'contained' : 'outlined'}
            color={sortBy === option.value ? 'primary' : 'inherit'}
            aria-pressed={sortBy === option.value}
            aria-label={`Sort by ${option.label}`}
            sx={{
              minWidth: 44, // Touch target minimum width (WCAG AA)
              minHeight: 44, // Touch target minimum height (WCAG AA)
              textTransform: 'none',
            }}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
