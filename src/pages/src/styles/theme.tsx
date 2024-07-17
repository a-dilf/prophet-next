// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1c011c', // blackish purple color
    },
    secondary: {
      main: '#ee82ee', // Red color for secondary actions
    },
    background: {
      default: '#ffffff', // White background
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#757575', // Grey text
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif', // Use Roboto font
  },
});

export default theme;
