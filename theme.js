import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5cb85c',
    },
    secondary: {
      main: '#5bc0de',
    },
    error: {
      main: '#f85f6a',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiButton: {
      root: {
        color: 'white',
      },
      allVariants: {
        color: '#fff',
      },
    },
  },
});

export default theme;
