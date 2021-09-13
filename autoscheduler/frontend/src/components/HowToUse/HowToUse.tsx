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
    * [Selecting a term](#SelectTerm)
    * [Login](#Login)
    * [Adding and removing courses](#AddRemoveCourse)
    * [Reading course info](#ReadCourseCard)
    * [Filtering sections](#Filters)
    * [Section sort orders](#SortOrders)
    * [Toggling a course](#ToggleCourse)
    * [Busy Times](#BusyTimes)
    * [Show generated schedules on big calendar](#BigCalendar)
    * [Locking and unlocking schedules](#LockSchedules)
    * [Renaming schedules](#RenameSchedules)
    * [Deleting schedules](#DeleteSchedules)
    * [See schedule details](#SeeScheduleDetails)
    * [Snapshot mode](#SnapshotMode)
4. [Other stuff](#OtherStuff)
    * [What our generate button does](#GenerateButton)
    * [How often we update this information](#InfoUpdateFrequency)
    * [How to leave feedback](#Feedback)
    * [Limitations of Rev Registration](#Limitations)`;

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
        
        <ExpansionPanel id="SelectTerm">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Selecting a term</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              If you are on the landing page, you can select a term by clicking
              the "Select Term" button in the center of the screen and choosing your
              desired term from the dropdown. If you are on the scheduling page and 
              would like to select a different term, you can click your current term 
              displayed on the top left of the screen. Then select the term you would
              like to switch to from the dropdown.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        
        <ExpansionPanel id="Login">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Login</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              To login, click on the top right of the screen where it says 
              "Login With Google". Then simply login to your google account. 
              Logging in allows you to keep your progress and view your saved 
              schedules when visiting the website from differnet devices. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="AddRemoveCourse">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Adding and removing courses</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              To add a course, hit the yellow "Add Course" button on the top left
              of the scheduling page. Type in the name of the course you would like
              to add and then select it from the drop down. To remove a course, click
              on the trash can directly to the top or left of the name for that course. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="ReadCourseCard">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Reading course info</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              PLACEHOLDER I think I'm just going to place an image here with 
              annotations saying which letters correspond to what.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="Filters">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Filtering sections</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              PLACEHOLDER You can filter sections according to certain criteria. 
              You do it like this.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="SortOrders">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Section sort orders</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              PLACEHOLDER. You can sort sections by certain criteria. You do it
              like this. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="ToggleCourse">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Toggling a course</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              When you want to quickly test different combinations of courses
              in your schedule, you can toggle which courses are included in the 
              schedules you generate. To do this, click the switch to the top or 
              right of the course name. Courses whose names have a maroon background
              will be included while those with a gray background will be excluded.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="BusyTimes">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Busy Times</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              You can mark busy times on the calendar by dragging and dropping. 
              Generated schedules will not include sections which overlap with your busy
              times. To remove a busy time, you can click on the garbage icon located within
              it.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="BigCalendar">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Show generated schedules on big calendar</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              To view a generated schedule on the big calendar, click on that schedule 
              in the list. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="LockSchedules">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Locking and unlocking schedules</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              When you click generate, all unlocked schedules are automatically deleted. 
              All schedules are unlocked by default. To "lock" a schedule and keep it from 
              disappearing, you can click the lock icon next to its name. If the lock is
              closed and solid gray, it is locked. If the lock is just an outline and 
              open, it is unlocked.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="RenameSchedules">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Renaming schedules</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              Click on the pencil icon next to the schedule's name. Type in the new name you 
              would like to use. Then click on the checkmark where the pencil icon used to be.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="DeleteSchedules">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Deleting schedules</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              Click on the trash icon next to the schedules name. All unlocked schedules
              are also automatically deleted when you click the Generate Schedules button.
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
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              Click the details button next to the thumbnail of the schedule you want to
              see the details to. PLACEHOLDER There can probably be an annotated image 
              explaining how to read the details here.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="SnapshotMode">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Snapshot mode</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordionContent}>
            <CaptionedGif
              gifAddress={`${STATIC_URL}/QuickStart.webm`}
              subtitleText="Click the thing but correctly"
            />
            <Typography>
              Clicking the fullscreen icon on the bottom of the big calendar will expand it.
              You can then take a screenshot of your schedule. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>

    <div id="OtherStuff">
      <div className={styles.bottomPadding}>
        <ReactMarkdown children={otherInfoTitle} className={styles.topPaddingTitle} />
        <ExpansionPanel id="GenerateButton">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>What our generate button does</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              When you click generate, Rev Registration tries to create up to 5 schedules
              with only courses that meet your selected criteria. If you have already generated 
              schedules beforehand, any unlocked schedules will be considered unwanted and replaced 
              with new ones. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="InfoUpdateFrequency">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>How often we update this websites information</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              We update this website every 15 minutes about a week or two before and
              during registration and early registration periods. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="Feedback">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>How to leave feedback</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              You can click the feedback button. Alternatively, you can send an email 
              to register.rev@gmail.com. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel id="Limitations">
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <b>Limitations of Rev Registration</b>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Sections for some courses such as KINE 199 and Special Topics In ... courses differ 
              in content at the section rather than course level. Rev Registration cannot tell the
              which sections will offer which content and treats them all the same. We recommend 
              manually selecting the section(s) for this course you would like because otherwise
              you might end up in a section for a course you don't want to be in. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </div>
  </Paper>
);

export default HowToUse;
