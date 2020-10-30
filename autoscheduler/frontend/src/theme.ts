import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

// Creates a global material UI theme

const palette = {
  primary: { main: '#500000', contrastText: '#ffffff' },
  secondary: { main: '#edc840', contrastText: '#000000' },
  text: { secondary: grey[700] },
};

const overrides = {
  MuiDialogTitle: {
    root: {
      backgroundColor: palette.primary.main,
      padding: '8px 16px',
      paddingTop: 8,
      paddingBottom: 8,
      '& h2': {
        color: palette.primary.contrastText,
        fontSize: '1.2rem',
      },
    },
  },
  MuiDialogContent: {
    root: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
};

export default createMuiTheme({ palette, overrides });
