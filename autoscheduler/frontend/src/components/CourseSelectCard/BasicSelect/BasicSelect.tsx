import * as React from 'react';
import {
  Checkbox, List, ListItem, ListItemIcon, ListItemText, FormLabel,
} from '@material-ui/core';

const BasicSelect = (): JSX.Element => {
  const [honors, setHonors] = React.useState(false);
  const [web, setWeb] = React.useState(false);

  return (
    <>
      <FormLabel>Options</FormLabel>
      <List>
        <ListItem
          dense
          disableGutters
          button
          onClick={
            (): void => setHonors(!honors)
          }
        >
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={honors}
            />
          </ListItemIcon>
          <ListItemText>Honors</ListItemText>
        </ListItem>
        <ListItem
          dense
          disableGutters
          button
          onClick={(): void => setWeb(!web)}
        >
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={web}
            />
          </ListItemIcon>
          <ListItemText>Web</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

export default BasicSelect;
