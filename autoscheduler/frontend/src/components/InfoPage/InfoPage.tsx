import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography, Paper } from '@material-ui/core';
import * as styles from './InfoPage.css';
import * as captionStyles from './CaptionedGif/CaptionedGif.css';
import CaptionedGif from './CaptionedGif/CaptionedGif';

const InfoPage: React.FC<RouteComponentProps> = () => (

  <div className={styles.pageContent}>
    <Paper classes={{ root: styles.paper }}>
      <br />
      <CaptionedGif titleText="Quick Start Guide" gifAddress={`${STATIC_URL}/QuickStart.webm`}>
        <Typography>
          <br />
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
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Advanced Filtering Options" gifAddress={`${STATIC_URL}/AdvancedFiltering.webm`}>
        <Typography>
          <br />
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
        </Typography>
      </CaptionedGif>
      <div className={captionStyles.Title}>
        <Typography variant="h5">
          Addtional Tips
        </Typography>
      </div>
      <div className={captionStyles.Caption}>
        <Typography>
          <li>
            It is recommended not to block off times past 6 pm because some courses
            have exam times during those hours. Blocking off those times will cause the course
            to be considered incompatible with your schedule even if lecture/labs occur when
            you are available.
          </li>
          <br />
          <li>
            Kinese 199 sections are usually completely different classes. You might want to
            select those via section select.
          </li>
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
