import * as React from 'react';
import { Typography } from '@material-ui/core';
import InfoDialog from '../InfoDialog/InfoDialog';

const PrivacyPolicy: React.FC = () => (
  <InfoDialog title="Privacy Policy" linkText="Privacy Policy">
    <Typography>
      Rev Registration aims to collect as little personally identifiable information as possible,
      and does not sell your data in any form whatsoever. If you log in, we collect your email
      and name so you can load your schedules on different devices.
    </Typography>
    <Typography>
      We use cookies to remember your state, so that when you re-open the site
      we can automatically log you in and restore the courses you had saved, what term you were on
      last, etc.
    </Typography>
    <Typography component="span">
      We use Google Analytics to collect anonymous browsing data about our users in order to improve
      the user experience, such as:
      <ul>
        <li>
          Device information, such as: type of browser, operating system, screen resolution
        </li>
        <li>
          Visit information, such as: time of visit, what pages you visited, time spent
          on each page.
        </li>
        <li>
          Generalized network location (generally only the city you&lsquo;re in)
        </li>
        <li>
          Referring site, which allows us to see how succesful our marketing campaigns on sites
          like Reddit were.
        </li>
      </ul>
    </Typography>
    <Typography>
      We do not share any of this Analytics information with Google.

      While you can log in with Google, your Google Analytics ID and
      your Google Login are not connected whatsoever.
    </Typography>
    <Typography>
      Don&lsquo;t want to send data to Google Analytics? Use an ad-blocker!
      You can check out our Blacklight test to confirm these claims&nbsp;
      <a href="https://themarkup.org/blacklight?url=revregistration.com">here</a>
      .
    </Typography>
  </InfoDialog>
);

export default PrivacyPolicy;
