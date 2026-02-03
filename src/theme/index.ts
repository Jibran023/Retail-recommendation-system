import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Body text minimum 16px (WCAG AA requirement - NFR-A11Y-07)
    body1: { fontSize: '1rem' } // 16px
  }
});

theme = responsiveFontSizes(theme);
export default theme;
