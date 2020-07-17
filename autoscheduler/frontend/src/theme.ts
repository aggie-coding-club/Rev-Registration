import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

// Creates a global material UI theme

const palette = {
  primary: { main: '#500000', contrastText: '#ffffff' },
  secondary: { main: '#ffffff', contrastText: '#000000' },
  text: { secondary: grey[700] },
};

export default createMuiTheme({ palette });
