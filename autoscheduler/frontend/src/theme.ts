import { createMuiTheme } from '@material-ui/core/styles';

// Creates a global material UI theme

const palette = {
  primary: { main: '#500000', contrastText: '#ffffff' },
  secondary: { main: '#ffffff', contrastText: '#000000' },
};

export default createMuiTheme({ palette });
