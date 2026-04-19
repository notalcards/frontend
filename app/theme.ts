import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C3AED' },
    secondary: { main: '#9F67FF' },
    background: { default: '#0F0A1E', paper: '#1A1033' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #9F67FF 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid rgba(124,58,237,0.2)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

export default theme;
