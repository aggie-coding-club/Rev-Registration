import * as React from 'react';
import {
  Menu, MenuItem, Button,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import * as Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import setTerm from '../../../redux/actions/term';
import * as defaultStyles from './SelectTerm.css';
import * as navBarStyles from './NavBarSelectTerm.css';
import { RootState } from '../../../redux/reducer';
import { ArrowDropDown } from '@material-ui/icons';

interface SelectTermProps {
  navBar?: boolean;
}

/**
 * Stateful function that caches the json for an api/terms call, so that the API route
 * only has to be fetched once.
 */
const getTermsJson = ((): () => Promise<any> => {
  let fetchedData: Promise<any>;

  return async (): Promise<any> => {
    if (fetchedData) return fetchedData;

    fetchedData = fetch('api/terms').then((res) => res.json());
    return fetchedData;
  };
})();

const SelectTerm: React.FC<SelectTermProps> = ({ navBar = false }) => {
  const dispatch = useDispatch();
  // anchorEl tells the popover menu where to center itself. Null means the menu is hidden
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [options, setOptions] = React.useState<string[]>([]);
  const [termMap, setTermMap] = React.useState<Map<string, string>>(new Map());
  const open = Boolean(anchorEl);

  // Used for retrieving the user-friendly term phrase given the term code (e.g. "202031")
  const [inverseTermMap, setInverseTermMap] = React.useState<Map<string, string>>(new Map());
  const globalTerm = useSelector<RootState, string>((state) => state.termData.term);

  const styles = navBar ? navBarStyles : defaultStyles;

  // Fetch all terms to use as ListItem options
  function getTerms(): void {
    getTermsJson().then(
      (res) => {
        const termsMap: Map<string, string> = new Map(Object.entries(res));
        // Inverse the terms map so that it's in the format of [termNumber: termSentence],
        // Ex: terms map is like ["Fall 2020 - College Station": 202031],
        // and inverseTermsMap is [202031, "Fall 2020 - College Station"]
        const inverseTermsMap: Map<string, string> = new Map(
          //  a[1] (ex. "202031") is given as an "unknown", so we need to cast it to a string
          Array.from(termsMap.entries(), ([name, code]) => [code, name]),
        );
        setTermMap(termsMap);
        setInverseTermMap(inverseTermsMap);
        setOptions(Array.from(termsMap.keys()));
      },
    );
  }

  React.useEffect(getTerms, []);

  const [selectedTerm, setSelectedTerm] = React.useState(options[0]);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string): void => {
    setAnchorEl(null);
    // Do nothing if user didn't select a term
    if (typeof option !== 'string') return;

    // Get the corresponding option given the term's description
    const term: string = termMap.get(option);


    // If the term that was selected is the term we were on, then do nothing
    if (term === globalTerm) return;

    setSelectedTerm(option);

    // Redirect to the main page, term will be set and retrieved by API calls
    // Ignore any errors (caused by cookies not being enabled) so that sessions aren't needed
    // in order to set term
    fetch(`sessions/set_last_term?term=${term}`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).catch(() => {
    }).finally(() => {
      // Set term, if cookies are enabled this will be overwritten when the scheduling page loads
      dispatch(setTerm(term));
      navigate('/schedule');
    });
  };

  return (
    <div className={styles.buttonContainer}>
      <Button
        className={styles.selectTermButton}
        variant={navBar ? 'outlined' : 'contained'}
        color="secondary"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<ArrowDropDown />}
      >
        {navBar
          // If we're on the navbar, show the user-friendly term. If it's null, show 'Select Term'
          // If navbar is false, always show 'Select Term'
          ? (`${inverseTermMap.get(globalTerm) ?? 'Select Term'}`)
          : 'Select Term'}
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
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
