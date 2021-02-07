import * as React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { GitHub, LinkedIn } from '@material-ui/icons';
import { Contributor, contributors, pastContributors } from '../../../types/Contributors';
import * as styles from './About.css';
import InfoDialog from '../InfoDialog/InfoDialog';

/**
 * Creates a row to be used in the contributor table
 * @param contributor the Contributor to make the row for
 */
function getContributorRow(contributor: Contributor): JSX.Element {
  return (
    <div className={styles.contributorsRow} key={contributor.name}>
      <Typography>
        {contributor.name}
      </Typography>
      <Typography variant="subtitle1">
        {contributor.position}
      </Typography>
      <div>
        <div>
          {contributor.githubURL ? (
            <IconButton
              className={styles.overrideIconButton}
              onClick={(): void => { window.open(contributor.githubURL); }}
            >
              <GitHub />
            </IconButton>
          ) : null}
          {contributor.linkedInURL ? (
            <IconButton
              className={styles.overrideIconButton}
              onClick={(): void => { window.open(contributor.linkedInURL); }}
            >
              <LinkedIn />
            </IconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const About: React.FC = () => {
  const contributorsJSX: JSX.Element[] = contributors.map(getContributorRow);
  const pastContributorsJSX: JSX.Element[] = pastContributors.map(getContributorRow);

  return (
    <InfoDialog linkText="About Rev Registration" title="About">
      <Typography>
        Rev Registration is an open-source&nbsp;
        <a href="https://aggiecodingclub.com">Aggie Coding Club</a>
        &nbsp;project led by Gannon Prudhomme and Ryan Conn.
      </Typography>
      <Typography>
        You can find all of our code on our&nbsp;
        <a href="https://github.com/aggie-coding-club/Rev-Registration">GitHub repository</a>
        .
      </Typography>
      <div>
        <Typography variant="h6">
          Contributors
        </Typography>
        {contributorsJSX}
      </div>
      <div>
        <Typography variant="h6">
          Past Contributors
        </Typography>
        {pastContributorsJSX}
      </div>
      <div>
        <Typography variant="h6">
          License
        </Typography>
        <Typography>
          Rev Registration is under the&nbsp;
          <a href="https://github.com/aggie-coding-club/Rev-Registration/blob/master/LICENSE">
            GNU GPL v3 License
          </a>
          .
        </Typography>
      </div>
      <Typography>
        Questions? Suggestions? Contact us at&nbsp;
        <a href="mailto:register.rev@gmail.com">
          register.rev@gmail.com
        </a>
        .
      </Typography>
    </InfoDialog>
  );
};

export default About;
