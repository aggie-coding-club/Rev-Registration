import * as React from 'react';
import {
  Menu, MenuItem, Grid, Button,
} from '@material-ui/core';

const options = [
  'None',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
];

const ITEM_HEIGHT = 48;

const SelectTerm: React.SFC = function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTerm, selectTerm] = React.useState(options[0]);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string): void => {
    setAnchorEl(null);
    selectTerm(option);
  };

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        justify="space-around"
        alignItems="center"
      >
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
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '55%',
              maxWidth: '800px',
            },
          }}
        >

          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === selectedTerm}
              onClick={(): void => handleClose(option)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </div>
  );
};

export default SelectTerm;
