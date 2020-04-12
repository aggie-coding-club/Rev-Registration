import * as React from 'react';
import {
  Menu, MenuItem, Button,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import setTerm from '../../../redux/actions/term';
import * as styles from './SelectTerm.css';

const options = [
  'None',
  'Fall 2020',
  'Summer 2020',
  'Spring 2020',
  'Fall 2019',
  'Summer 2019',
  'Spring 2019',
];

// Maps between the term description and its actual value (which we'll use to store)
// We might not need this in the future?
const termMap: { [key: string]: any } = {
  // This lint is temporary, and shouldn't be needed for the future
  // eslint-disable-next-line quote-props
  'None': -1,
  'Fall 2020': 202031,
  'Summer 2020': 202021,
  'Spring 2020': 202011,
  'Fall 2019': 201931,
  'Summer 2019': 201921,
  'Spring 2019': 201911,
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

    dispatch(setTerm(term));

    // Redirect to the main page
    navigate('/schedule');
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
