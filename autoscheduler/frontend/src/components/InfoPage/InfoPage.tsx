import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography, Paper, Box } from '@material-ui/core';
import * as styles from './InfoPage.css';
import * as captionStyles from './CaptionedGif/CaptionedGif.css';
import CaptionedGif from './CaptionedGif/CaptionedGif';

const InfoPage: React.FC<RouteComponentProps> = () => (

  <div className={styles.pageContent}>
    <Paper classes={{ root: styles.paper }}>
      <br />
      <Box ml="5%">
        <Typography variant="h4"> How To Use</Typography>
      </Box>
      <hr />
      <CaptionedGif
        titleText="Quick Start Guide"
        gifAddress={`${STATIC_URL}/QuickStart.webm`}
        trackAddress={`${STATIC_URL}/QuickStart.vtt`}
        subtitleText="Quick walkthrough of how to create a schedule"
      >
        <Typography>
          <br />
          <ul>
            <li>
            To add a course simply click the add course button and type out the course you want.
            During registration, this information is updated about every 15 minutes.
            </li>
            <br />
            <li>
            If you do not want classes at a certain time, you can click and drag on the calendar
            to block off those times when generating schedules.
            </li>
            <br />
            <li>
            Hit the generate schedules button to generate up to 5 schedules with the options
            you selected. New schedules will overwrite all previous unsaved schedules.
            If you see a schedule you like, click the lock icon to save it.
            The icon should change so that the lock is now closed. You can also
            give the schedule a name to identify it easier by clicking the pencil icon.
            </li>
            <br />
            <li>
            You can click on a generated schedule to make it appear on the big calendar.
            You can also click the details button to open a pop up with more information
            about the sections in that schedule.
            </li>
          </ul>
        </Typography>
      </CaptionedGif>
      <CaptionedGif
        titleText="Advanced Filtering Options"
        gifAddress={`${STATIC_URL}/AdvancedFiltering.webm`}
        trackAddress={`${STATIC_URL}/AdvancedFiltering.vtt`}
        subtitleText="Demonstration of advanced section filtering features"
      >
        <Typography>
          <br />
          <ul>
            <li>
            You can choose to filter the sections included in schedule generation at either
            the &lsquo;&lsquo;Basic&rsquo;&rsquo; or &lsquo;&lsquo;Section&rsquo;&rsquo;
            customization level. When you click generate schedules, the currently selected
            customization level for that course will be used.
            </li>
            <br />
            <li>
            Basic is recommended for when you are searching for sections with a specific
            attribute such as &lsquo;&lsquo;honors&rsquo;&rsquo; or
            &lsquo;&lsquo;online&rsquo;&rsquo;. It displays available attributes and
            allows you to decide whether you want to include sections that have those
            attributes in schedule generation.
            </li>
            <br />
            <li>
            Section is recommended for when you already know which section numbers or
            professors you want. It allows you to select the specific sections or professors
            you want to include in schedule generation.
            </li>
          </ul>
        </Typography>
      </CaptionedGif>
      <div className={captionStyles.Title}>
        <Typography variant="h5">
          Additional Tips
        </Typography>
      </div>
      <div className={captionStyles.Caption}>
        <Typography>
          <ul>
            <li>
            It is recommended not to block off times past 6 pm because some courses
            have exam times during those hours. Blocking off those times will cause the course
            to be considered incompatible with your schedule even if lecture/labs occur when
            you are available.
            </li>
            <br />
            <li>
            Kinese 199 and special topics sections are usually entirely different courses.
            Because they differ at the section rather than course level, Rev Registration cannot
            tell the difference between them. It is recommended to select specific sections for
            these when building your schedule.
            </li>
          </ul>
          <br />
        </Typography>
      </div>
    </Paper>
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>

);

export default InfoPage;
