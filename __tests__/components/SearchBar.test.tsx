import { render, screen, fireEvent } from '@testing-library/react';
import { SearchProvider } from '../../src/context/SearchContext';
import { SearchBar } from '../../src/components/SearchBar';

/**
 * Wrapper component to provide context
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <SearchProvider>{children}</SearchProvider>;
}

/**
 * Tests for SearchBar component
 */
describe('SearchBar', () => {
  it('should render search input', () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder');
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search products');
  });

  it('should allow typing in search input', () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Cooking Oil' } });

    expect(input.value).toBe('Cooking Oil');
  });

  it('should have search icon when not loading', () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );

    // Search icon should be present initially
    const searchIcon = document.querySelector('[aria-label="Search"]');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should have proper placeholder text', () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/search products/i);
    expect(input).toBeInTheDocument();
  });
});
