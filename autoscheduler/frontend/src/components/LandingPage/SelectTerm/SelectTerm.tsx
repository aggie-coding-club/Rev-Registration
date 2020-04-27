import * as React from 'react';
import {
  Menu, MenuItem, Button,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import setTerm from '../../../redux/actions/term';
import * as styles from './SelectTerm.css';

const SelectTerm: React.FC = () => {
  // anchorEl tells the popover menu where to center itself. Null means the menu is hidden
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [options, setOptions] = React.useState<string[]>([]);
  const [termMap, setTermMap] = React.useState<Map<string, string>>(new Map());
  const open = Boolean(anchorEl);

  // Fetch all terms to use as ListItem options
  function getTerms(): void {
    fetch('api/terms').then((res) => res.json()).then(
      (res) => {
        const termsMap = new Map(Object.entries(res));
        setTermMap(termsMap);
        setOptions(Array.from(termsMap.keys()));
      },
    );
  }

  React.useEffect(getTerms, []);

  const [selectedTerm, setSelectedTerm] = React.useState(options[0]);

  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string): void => {
    setAnchorEl(null);
    // Do nothing if user didn't select a term
    if (typeof option !== 'string') return;

    setSelectedTerm(option);

    // Get the corresponding option given the term's description
    const term: string = termMap.get(option);

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
