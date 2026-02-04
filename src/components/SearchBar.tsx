import { useState } from 'react';
import { TextField, InputAdornment, CircularProgress, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from '../hooks/useSearch';

/**
 * SearchBar component for product search
 *
 * Features:
 * - Manual search on Enter key or button click
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    const query = inputValue.trim();
    if (query === '') {
      clearSearch();
    } else {
      search(query);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Keyboard navigation: Allow Enter key to trigger search
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
        disabled={state.loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {state.loading ? (
                <CircularProgress data-testid="loading-spinner" size={20} aria-label="Loading search results" />
              ) : (
                <SearchIcon aria-label="Search" />
              )}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                data-testid="search-button"
                onClick={handleSearch}
                disabled={state.loading || inputValue.trim() === ''}
                aria-label="Search"
                sx={{
                  // Ensure minimum touch target size (44x44px)
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        // WCAG AA compliance: Ensure touch targets are at least 44x44px
        inputProps={{
          'data-testid': 'search-input',
          'aria-label': 'Search products',
          'aria-describedby': 'search-description',
          onKeyDown: handleKeyDown,
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
        Type to search for products and press Enter or click the search button.
      </Box>
    </Box>
  );
}
