import { Container, Typography, Box, Paper } from '@mui/material';
import { SearchProvider } from './context/SearchContext';
import { FilterProvider } from './context/FilterContext';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

/**
 * Main App component
 *
 * Features:
 * - Product search UI with MUI components
 * - Search context for state management
 * - WCAG AA compliant theme
 * - Responsive layout with modern design
 */
function AppContent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.4,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.02em',
              }}
            >
              Grocery Price Comparison
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.125rem' },
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              Compare prices across multiple stores in Pakistan and find the best deals
            </Typography>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ position: 'relative' }}>
          <CategoryFilter />
          <SearchBar />
          <SearchResults />
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          mt: 6,
          borderTop: 1,
          borderColor: 'divider',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2024 Grocery Price Comparison. Helping you save money on every purchase.
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * App root component with providers
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
