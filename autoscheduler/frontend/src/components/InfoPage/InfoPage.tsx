import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography, Paper } from '@material-ui/core';
import * as styles from './InfoPage.css';
import CaptionedGif from './CaptionedGif/CaptionedGif';

const InfoPage: React.FC<RouteComponentProps> = () => (

  <div className={styles.pageContent}>
    <Paper classes={{ root: styles.paper }}>
      <br />
      <CaptionedGif titleText="Adding a Course" gifAddress={`${STATIC_URL}/AddCourse.webm`}>
        <br />
        <Typography>
          To add a course simply click the add course button and type out the course you want.
          During registration, this information is updated about every 15 minutes.
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Selecting Sections to Include In Schedule Generation" gifAddress={`${STATIC_URL}/AdvancedFiltering.webm`}>
        <br />
        <Typography>
          You can choose to filter the sections included in schedule generation at either
          the &lsquo;Basic&rsquo; or &lsquo;Section&rsquo; customization level. Basic is recommended
          for when you are searching for sections of a specific attribute such as honors or online.
          Section is recommended for when you already know which section number or professor you
          want. When you click generate schedules, the currently selected customization level for
          that course will be used.
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Blocking off busy times" gifAddress={`${STATIC_URL}/BusyTimes.webm`}>
        <br />
        <Typography>
          If you do not want classes at a certain time, you can click and drag on the calendar
          to block off those times when generating schedules.
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Generating Schedules" gifAddress={`${STATIC_URL}/Generate.webm`}>
        <br />
        <Typography>
          Hit the generate schedules button to generate up to 5 schedules with the options
          you selected. New schedules will overwrite all previous unsaved schedules.
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Saving/Naming Schedules" gifAddress={`${STATIC_URL}/SaveRename.webm`}>
        <br />
        <Typography>
          If you see a schedule you like, click the lock icon to save it. You can also
          give it a name to identify it easier by clicking the pencil icon.
        </Typography>
      </CaptionedGif>
      <CaptionedGif titleText="Schedule Details" gifAddress={`${STATIC_URL}/Details.webm`}>
        <br />
        <Typography>
          You can click on a generated schedule so it appears on the calendar. You can also
          click the details button to open a pop up with more information about the sections
          in that schedule.
        </Typography>
      </CaptionedGif>
    </Paper>
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>

);

export default InfoPage;
