import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from '@reach/router';
import {
  Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CaptionedGif from './CaptionedGif/CaptionedGif';
import * as styles from './HowToUse.css';

/* eslint-disable react/no-children-prop */

const headers = `
# How To Use
---`;

const tableOfContentsTitle = '## Contents';

const tableOfContentsList = `
1. [Quick start guide](#QuickStart)
2. [Course filtering features](#FilteringFeatures)
3. [Cool website features](#WebsiteFeatures)
    * [Remove multiple busy times quickly](#RemoveMultipleQuickly)
    * [See schedule details](#SeeScheduleDetails)
4. [Other stuff](#OtherStuff)
    * [Rename a schedule](#RenameSchedule)
    * [Generate schedules for different elective combinations quickly](#FastElectiveCombinations)`;

const quickStartTitle = '## Quick Start Guide';

const quickStartList = `
1. To begin, add a course by clicking the add course button and typing 
out the course you want. Repeat this for every course you want to add to your schedule.

2. Click and drag on the calendar to mark your unavailable (&quot;busy&quot;) times. When 
generating schedules, classes at these times will be omitted. To remove your busy times, 
you can click the trash icon. 

3. Hit the generate schedules button to generate a subset of up to 5 schedules with the options
you selected. If you see a schedule you like, click the lock icon to save it. If you are not 
satisfied with any of the generated schedules, hitting the button again will automatically remove all 
unsaved schedules and generate another random subset of up to 5 possible schedules.

4. You can click on a generated schedule to make it appear on the right calendar.
You can also click the details button to open a pop up with more information
about the sections in that schedule.`;

const advancedFilteringTitle = '## Course Filtering Options';

const advancedFilteringList = `
* You can choose to filter the sections included in schedule generation 
at either the &quot;Basic&quot; or &quot;Section&quot; customization level. 
When you click &quot;Generate Schedules&quot;, the currently selected customization 
level for that course will be used.

* Basic is recommended for when you are searching for sections with a specific attribute such as 
&quot;honors&quot; or &quot;online&quot;. It displays available 
attributes and allows you to decide whether you want to include sections that have those attributes 
in schedule generation.

* Section is recommended for when you already know which section numbers or professors you want. 
It allows you to select the specific sections or professors you want to include in schedule generation.

* At the top right of every course you add, there is a switch labeled 
&quot;Include in schedules&quot;. When it is on the course name will have a maroon 
background. When it is off it will have a gray background. Only courses with this switch set to on 
will be included in your schedules when you hit generate. This feature is useful when you want to 
quickly generate schedules with different combinations of courses.`;

const additionalTips = `
## Additional Tips

* Sections for KINE 199 and special topics are usually entirely different courses. Because the titles 
differ at the section rather than the course level, and Rev Registration does not show titles for 
individual sections, you must use Howdy to determine what course each section is.

* To quickly remove availabilities in groups, you can click and hold on an edge then drag to rearrange
multiple blocks so that all your times are on the same day before clicking the icon.

* During registration, course information on this website is updated about every 15 minutes.`;

const coolFeaturesTitle = '## Cool Website Features';

const otherInfoTitle = '## Other Info';

const HowToUse: React.FC<RouteComponentProps> = () => (

  <Paper classes={{ root: styles.paper }}>
    <ReactMarkdown children={headers} />

    <div className={styles.box}>
      <ReactMarkdown children={tableOfContentsTitle} />
      <ReactMarkdown children={tableOfContentsList} />
    </div>

    <div id="QuickStart">
      <div className={styles.topPaddingTitle}>
        <div className={styles.bottomPaddingTitle}>
          <ReactMarkdown children={quickStartTitle} />
        </div>
      </div>
      <CaptionedGif
        gifAddress={`${STATIC_URL}/QuickStart.webm`}
        subtitleText="Quick walkthrough of how to create a schedule"
      />
      <ReactMarkdown children={quickStartList} />
    </div>

    <div id="FilteringFeatures">
      <div className={styles.topPaddingTitle}>
        <div className={styles.bottomPaddingTitle}>
          <ReactMarkdown children={advancedFilteringTitle} />
        </div>
      </div>
      <CaptionedGif
        gifAddress={`${STATIC_URL}/QuickStart.webm`}
        subtitleText="Demonstration of advanced section filtering features"
      />
      <ReactMarkdown children={advancedFilteringList} />
    </div>

    {/* <ReactMarkdown children={additionalTips} /> */}
    <div id="WebsiteFeatures">
      <div className={styles.bottomPadding}>
        <ReactMarkdown children={coolFeaturesTitle} className={styles.topPaddingTitle} />
        <ExpansionPanel id="RemoveMultipleQuickly">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Remove multiple busy times quickly</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
        To quickly remove busy times in groups,
        you can click and hold on an edge then drag to rearrange
        multiple blocks so that all your times are on the same day
        before clicking the icon.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel id="SeeScheduleDetails">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>See schedule details</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
        Check the details panel.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>

    <div id="OtherStuff">
      <div className={styles.bottomPadding}>
        <ReactMarkdown children={otherInfoTitle} className={styles.topPaddingTitle} />
        <ExpansionPanel id="RenameSchedule">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Rename a schedule</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Click the pencil button and type in the new name
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel id="FastElectiveCombinations">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Generate schedules for different electives quickly</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              You can use the switch on the top right corner of course cards
              to decide which courses will be included in the generated schedules.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>
  </Paper>
);

export default HowToUse;
