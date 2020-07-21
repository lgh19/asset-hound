import { createMuiTheme } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import cyan from '@material-ui/core/colors/cyan';

const getTheme = inDarkMode => ({
  color: {},
  palette: {
    primary: indigo,
    secondary: cyan,
  },
  borderRadius: '4px',
  breakpoints: {
    sm: 'min-width: 576px',
    md: 'min-width: 768px',
    lg: 'min-width: 992px',
    xl: 'min-width: 1200px',
  },
});

export const muiTheme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: cyan,
  },
});

export default muiTheme;
