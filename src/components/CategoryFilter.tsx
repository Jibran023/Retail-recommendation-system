import { Box } from '@mui/material';
import { categories } from '../services/mockCategories';
import { useCategoryFilter } from '../hooks/useCategoryFilter';
import { useState } from 'react';

/**
 * CategoryFilter component for browsing products by category
 *
 * Features:
 * - Horizontal scrollable list on mobile (320-480px)
 * - Grid/flex wrap layout on desktop (769px+)
 * - Keyboard navigation support (Arrow keys, Enter, Space)
 * - WCAG AA compliant (44x44px touch targets)
 * - Active category visually indicated (filled chip with primary color)
 *
 * Accessibility Requirements:
 * - Touch targets: 44x44px minimum (FR42)
 * - Keyboard navigation: Arrow keys to navigate, Enter/Space to select (FR34)
 * - Screen reader: ARIA labels for categories (FR41)
 */
export function CategoryFilter() {
  const { selectedCategory, setCategory } = useCategoryFilter();
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const handleCategoryClick = async (categoryId: string) => {
    await setCategory(categoryId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number, categoryId: string) => {
    // Keyboard navigation: Arrow keys to navigate between categories
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setFocusedIndex(Math.max(0, index - 1));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setFocusedIndex(Math.min(categories.length - 1, index + 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCategoryClick(categoryId);
    }
  };

  return (
    <Box
      data-testid="category-filter"
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mb: 2,
        // Mobile: horizontal scroll
        display: 'flex',
        overflowX: 'auto',
        gap: 1,
        px: 1,
        // Hide scrollbar but keep functionality
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.2)',
          borderRadius: 3,
        },
        // Desktop: flex wrap for grid-like layout
        '@media (min-width: 769px)': {
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflowX: 'visible',
        },
      }}
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category, index) => {
        const isActive = selectedCategory === category.id;
        const isFocused = focusedIndex === index;

        return (
          <Box
            key={category.id}
            data-testid={`category-${category.id}`}
            onClick={() => handleCategoryClick(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index, category.id)}
            onFocus={() => setFocusedIndex(index)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px', // Touch target minimum width (FR42)
              minHeight: '44px', // Touch target minimum height (FR42)
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: 'pointer',
              userSelect: 'none',
              backgroundColor: isActive ? 'primary.main' : 'background.paper',
              color: isActive ? 'primary.contrastText' : 'text.primary',
              border: isActive ? 'none' : '1px solid',
              borderColor: 'divider',
              fontWeight: isActive ? 600 : 400,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isFocused ? '0 0 0 2px primary.main' : 'none',
              '&:hover': {
                backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                transform: 'scale(1.02)',
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
              '@media (max-width: 768px)': {
                flexShrink: 0,
              },
            }}
            role="tab"
            aria-selected={isActive}
            aria-label={category.name}
            tabIndex={index === 0 ? 0 : -1}
          >
            {category.name}
          </Box>
        );
      })}
    </Box>
  );
}
