import * as React from 'react';
import {
  Menu, MenuItem, Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import setTerm from '../../../redux/actions/term';
import * as styles from './SelectTerm.css';

const options = [
  'None',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
];

// Maps between the term description and its actual value (which we'll use to store)
// We might not need this in the future?
const termMap: { [key: string]: any } = {
  // This lint is temporary, and shouldn't be needed for the future
  // eslint-disable-next-line quote-props
  'None': -1,
  'Semester 1': 201931,
  'Semester 2': 201931,
  'Semester 3': 201931,
  'Semester 4': 201931,
  'Semester 5': 201931,
  'Semester 6': 201931,
};

const SelectTerm: React.SFC = () => {
  // anchorEl tells the popover menu where to center itself. Null means the menu is hidden
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTerm, setSelectedTerm] = React.useState(options[0]);

  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string): void => {
    setAnchorEl(null);
    setSelectedTerm(option);

    // Get the corresponding option given the term's description
    const term: number = termMap[option];

    dispatch(setTerm({ term }));

    // Redirect to the main page
    window.location.href = '/schedule';
  };

  return (
    <div className={styles.buttonContainer}>
      <Button
        style={{ width: '55%', maxWidth: '800px' }}
        variant="contained"
        color="secondary"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
            Select Term
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: styles.menuPaper,
        }}
      >
        {
            /* renders a menu item for each term */
            options.map((option) => (
              <MenuItem
                key={option}
                selected={option === selectedTerm}
                onClick={(): void => handleClose(option)}
              >
                {option}
              </MenuItem>
            ))
          }
      </Menu>
    </div>
  );
};

export default SelectTerm;
