import { useState, useCallback, useEffect } from 'react';
import { TextField, InputAdornment, CircularProgress, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from '../hooks/useSearch';
import useDebounce from '../hooks/useDebounce';

/**
 * SearchBar component for product search
 *
 * Features:
 * - Debounced input (300ms) to reduce API calls
 * - Loading indicator during search
 * - English and Roman Urdu text support
 * - WCAG AA compliant (16px font, 44x44px touch targets)
 * - Keyboard navigation support
 *
 * Accessibility Requirements:
 * - Touch targets: 44x44px minimum (FR42)
 * - Keyboard navigation: Enter key to search (FR34)
 */
export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { state, search, clearSearch } = useSearch();

  // Debounce the input value to reduce API calls
  const debouncedQuery = useDebounce(inputValue, 300);

  // Perform search when debounced value changes
  const handleSearch = useCallback(async () => {
    if (debouncedQuery.trim() === '') {
      clearSearch();
      return;
    }

    await search(debouncedQuery);
  }, [debouncedQuery, search, clearSearch]);

  // Trigger search when debounced value changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch, debouncedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Keyboard navigation: Allow Enter key to trigger immediate search
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', my: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products... (e.g., Cooking Oil, Daal, Rice)"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={state.loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {state.loading ? (
                <CircularProgress size={20} aria-label="Loading search results" />
              ) : (
                <SearchIcon aria-label="Search" />
              )}
            </InputAdornment>
          ),
        }}
        // WCAG AA compliance: Ensure touch targets are at least 44x44px
        inputProps={{
          'aria-label': 'Search products',
          'aria-describedby': 'search-description',
          style: {
            // Minimum height for touch target (FR42)
            minHeight: '44px',
          },
        }}
        // MUI TextField defaults to proper font sizes for WCAG AA
        sx={{
          '& .MuiInputBase-root': {
            // Ensure minimum touch target size
            minHeight: '44px',
          },
        }}
      />
      <Box
        id="search-description"
        component="span"
        sx={{ display: 'none' }}
      >
        Type to search for products. Results will appear below as you type.
      </Box>
    </Box>
  );
}
