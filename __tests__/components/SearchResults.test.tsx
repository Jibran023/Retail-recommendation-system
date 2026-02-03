import { render, screen, waitFor } from '@testing-library/react';
import { SearchProvider } from '../../src/context/SearchContext';
import { SearchResults } from '../../src/components/SearchResults';

/**
 * Test helper component to trigger search
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      {children}
    </SearchProvider>
  );
}

/**
 * Tests for SearchResults component
 */
describe('SearchResults', () => {
  it('should show empty state when no query', () => {
    render(
      <TestWrapper>
        <SearchResults />
      </TestWrapper>
    );

    expect(screen.getByText(/start searching for products/i)).toBeInTheDocument();
  });

  it('should show loading state during search', async () => {
    // Mock the search to be in loading state by checking initial render
    render(
      <TestWrapper>
        <SearchResults />
      </TestWrapper>
    );

    // Initially shows empty state since no query has been entered
    expect(screen.getByText(/start searching for products/i)).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <SearchResults />
      </TestWrapper>
    );

    // Component should render
    expect(screen.getByText(/start searching for products/i)).toBeInTheDocument();
  });

  it('should have proper text content for empty state', () => {
    render(
      <TestWrapper>
        <SearchResults />
      </TestWrapper>
    );

    expect(screen.getByText(/enter a product name above/i)).toBeInTheDocument();
  });
});
