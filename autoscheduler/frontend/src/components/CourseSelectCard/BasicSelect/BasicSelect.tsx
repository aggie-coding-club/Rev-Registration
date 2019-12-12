import * as React from 'react';
import {
  FormControl, FormControlLabel, FormLabel, Checkbox,
} from '@material-ui/core';

const BasicSelect = (): JSX.Element => {
  const [honors, setHonors] = React.useState(false);
  const [web, setWeb] = React.useState(false);

  return (
    <FormControl component="fieldset">
      <FormLabel component="label">Options</FormLabel>
      <FormControlLabel
        value="honorsOnly"
        control={(
          <Checkbox
            color="primary"
            onChange={
                (evt: React.ChangeEvent<HTMLInputElement>): void => setHonors(evt.target.checked)
            }
            checked={honors}
          />
)}
        label="Honors Only"
      />
      <FormControlLabel
        value="webOnly"
        control={(
          <Checkbox
            color="primary"
            onChange={
                (evt: React.ChangeEvent<HTMLInputElement>): void => setWeb(evt.target.checked)
            }
            checked={web}
          />
      )}
        label="Web Only"
      />
    </FormControl>
  );
};

export default BasicSelect;
