import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SearchProvider } from '../../src/context/SearchContext';
import { CategoryFilter } from '../../src/components/CategoryFilter';
import { useCategoryFilter } from '../../src/hooks/useCategoryFilter';

/**
 * Test helper component to provide context
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(SearchProvider, null, children);
}

/**
 * Tests for CategoryFilter component
 */
describe('CategoryFilter', () => {
  it('should render without crashing', () => {
    render(
      React.createElement(Wrapper, null,
        React.createElement(CategoryFilter)
      )
    );

    // Check for key categories
    expect(screen.getByText('All Categories')).toBeTruthy();
    expect(screen.getByText('Cooking Oil')).toBeTruthy();
    expect(screen.getByText('Rice & Grains')).toBeTruthy();
  });

  it('should have proper ARIA role for accessibility', () => {
    render(
      React.createElement(Wrapper, null,
        React.createElement(CategoryFilter)
      )
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeTruthy();
  });

  it('should allow category selection by click and update state', async () => {
    // Create a test component to access the hook state
    function TestComponent() {
      const { selectedCategory } = useCategoryFilter();
      return React.createElement('div', null,
        `Selected: ${selectedCategory || 'none'}`,
        React.createElement(CategoryFilter)
      );
    }

    render(
      React.createElement(Wrapper, null,
        React.createElement(TestComponent)
      )
    );

    // Initially no category selected
    expect(screen.getByText('Selected: none')).toBeTruthy();

    // Click on Cooking Oil category
    const cookingOilTab = screen.getByText('Cooking Oil');
    fireEvent.click(cookingOilTab);

    // Wait for state to update
    await waitFor(() => {
      expect(screen.getByText('Selected: cooking-oil')).toBeTruthy();
    });
  });

  it('"All Categories" shows all products', async () => {
    function TestComponent() {
      const { selectedCategory } = useCategoryFilter();
      return React.createElement('div', null,
        `Selected: ${selectedCategory || 'none'}`,
        React.createElement(CategoryFilter)
      );
    }

    render(
      React.createElement(Wrapper, null,
        React.createElement(TestComponent)
      )
    );

    // Initially no category selected
    expect(screen.getByText('Selected: none')).toBeTruthy();

    // Select a category
    const cookingOilTab = screen.getByText('Cooking Oil');
    fireEvent.click(cookingOilTab);

    await waitFor(() => {
      expect(screen.getByText('Selected: cooking-oil')).toBeTruthy();
    });

    // Click "All Categories" to show all products
    const allCategoriesTab = screen.getByText('All Categories');
    fireEvent.click(allCategoriesTab);

    await waitFor(() => {
      expect(screen.getByText('Selected: all')).toBeTruthy();
    });
  });

  it('should support Enter key for category selection', async () => {
    function TestComponent() {
      const { selectedCategory } = useCategoryFilter();
      return React.createElement('div', null,
        `Selected: ${selectedCategory || 'none'}`,
        React.createElement(CategoryFilter)
      );
    }

    render(
      React.createElement(Wrapper, null,
        React.createElement(TestComponent)
      )
    );

    const cookingOilTab = screen.getByText('Cooking Oil');
    fireEvent.keyDown(cookingOilTab, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Selected: cooking-oil')).toBeTruthy();
    });
  });

  it('should support Space key for category selection', async () => {
    function TestComponent() {
      const { selectedCategory } = useCategoryFilter();
      return React.createElement('div', null,
        `Selected: ${selectedCategory || 'none'}`,
        React.createElement(CategoryFilter)
      );
    }

    render(
      React.createElement(Wrapper, null,
        React.createElement(TestComponent)
      )
    );

    const spicesTab = screen.getByText('Spices');
    fireEvent.keyDown(spicesTab, { key: ' ' });

    await waitFor(() => {
      expect(screen.getByText('Selected: spices')).toBeTruthy();
    });
  });
});
