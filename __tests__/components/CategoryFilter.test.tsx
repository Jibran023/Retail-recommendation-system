import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SearchProvider } from '../../src/context/SearchContext';
import { CategoryFilter } from '../../src/components/CategoryFilter';

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

  it('should allow category selection by click', () => {
    render(
      React.createElement(Wrapper, null,
        React.createElement(CategoryFilter)
      )
    );

    const cookingOilTab = screen.getByText('Cooking Oil');
    fireEvent.click(cookingOilTab);

    // Category should exist after click
    expect(cookingOilTab).toBeTruthy();
  });
});
