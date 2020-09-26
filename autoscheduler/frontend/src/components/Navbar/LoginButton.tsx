import * as React from 'react';
import { Button } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
// This file contains the login button. When a user logs in, it is replaced by their name
// followed by the logout button.

// Used to determine when to display the login button. Will only be displayed
// when loading is false
const [loading, setLoading] = React.useState(true);

// This checks for the logged in user's name and sets it if found.
// Otherwise, it throws an error and catches it so nothing breaks.
const [usersName, setUsersName] = React.useState('');
React.useEffect(() => {
  fetch('sessions/get_full_name').then(
    (res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(res.status.toString());
    },
  ).then(({ fullName }) => {
    if (fullName) setUsersName(fullName);
  }).catch(() => { })
    .finally(() => { setLoading(false); });
}, []);

// Determines whether to show the logout button and user's name
// or the login button based on whether a user is logged in or not
// TODO IF LOADING IS FALSE IT'S NULL
const LoginButton = usersName ? (
  <div>
    {usersName}
    <Button
      color="inherit"
      aria-label="Logout"
      title="Logout"
      onClick={(): void => {
        window.open('/sessions/logout', '_self');
      }}
    >
      <ExitToAppOutlinedIcon />
    </Button>
  </div>
) : (
  <Button
    color="inherit"
    onClick={(): void => {
      window.open('/login/google-oauth2/', '_self');
    }}
  >
    Login With Google
  </Button>
);

export default LoginButton;
