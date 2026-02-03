import { Container, Typography, Box } from '@mui/material';
import { SearchProvider } from './context/SearchContext';
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
 * - Responsive layout
 */
function AppContent() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Grocery Price Comparison
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compare prices across multiple stores in Pakistan
        </Typography>
      </Box>

      <SearchBar />
      <SearchResults />
    </Container>
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
        <AppContent />
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
