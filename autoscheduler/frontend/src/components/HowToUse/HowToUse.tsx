import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CaptionedGif from './CaptionedGif/CaptionedGif';
import * as styles from './HowToUse.css';

interface ExpandableProps {
  id: string;
  open: boolean;
  clicked: boolean;
  title: string;
  gifAddress?: string;
  subtitleText?: string;
  description: string | JSX.Element;
}

const HowToUse: React.FC<RouteComponentProps> = () => {
  const defaultExpandables: ExpandableProps[] = [
    {
      id: 'ReadCourseCard',
      open: false,
      clicked: false,
      title: 'Reading course info',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: '',
      description: `PLACEHOLDER I think I'm just going to place an image here with
      annotations saying which letters correspond to what.`,
    },
    {
      id: 'Filters',
      open: false,
      clicked: false,
      title: 'Filtering sections',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: '',
      description: `PLACEHOLDER You can filter sections according to certain criteria.
      You do it like this.`,
    },
    {
      id: 'SortOrders',
      open: false,
      clicked: false,
      title: 'Section sort orders',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `PLACEHOLDER. You can sort sections by certain criteria. You do it
      like this.`,
    },
    {
      id: 'ToggleCourse',
      open: false,
      clicked: false,
      title: 'Toggling a course',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `When you want to quickly test different combinations of courses
      in your schedule, you can toggle which courses are included in the
      schedules you generate. To do this, click the switch to the top or
      right of the course name. Courses whose names have a maroon background
      will be included while those with a gray background will be excluded.`,
    },
    {
      id: 'BusyTimes',
      open: false,
      clicked: false,
      title: 'Busy Times',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `You can mark busy times on the calendar by dragging and dropping.
      Generated schedules will not include sections which overlap with your busy
      times. To remove a busy time, you can click on the garbage icon located within
      it.`,
    },
    {
      id: 'LockSchedules',
      open: false,
      clicked: false,
      title: 'Locking and unlocking schedules',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `When you click generate, all unlocked schedules are automatically deleted.
      All schedules are unlocked by default. To "lock" a schedule and keep it from
      disappearing, you can click the lock icon next to its name. If the lock is
      closed and solid gray, it is locked. If the lock is just an outline and
      open, it is unlocked.`,
    },
    {
      id: 'RenameSchedules',
      open: false,
      clicked: false,
      title: 'Renaming schedules',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: ` Click on the pencil icon next to the schedule's name. Type in the new name you
      would like to use. Then click on the checkmark where the pencil icon used to be.`,
    },
    {
      id: 'DeleteSchedules',
      open: false,
      clicked: false,
      title: 'Deleting schedules',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: ` Click on the trash icon next to the schedules name. All unlocked schedules
      are also automatically deleted when you click the Generate Schedules button.`,
    },
    {
      id: 'SeeScheduleDetails',
      open: false,
      clicked: false,
      title: 'See schedule details',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `Click the details button next to the thumbnail of the schedule you want to
      see the details to. PLACEHOLDER There can probably be an annotated image
      explaining how to read the details here.`,
    },
    {
      id: 'ScheduleAsImage',
      open: false,
      clicked: false,
      title: 'Save picture of schedule',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `Clicking the fullscreen icon on the bottom of the big calendar will expand it.
      You can then take a screenshot of your schedule.`,
    },
    {
      id: 'ClickMeetingGoToSection',
      open: false,
      clicked: false,
      title: 'Find section on schedule in course selection panel',
      gifAddress: `${STATIC_URL}/QuickStart.webm`,
      subtitleText: 'Click the thing but correctly',
      description: `Click on a class in the large calendar schedule to highlight it in
      the course selection panel.`,
    },
    // Other Info Section starts here
    {
      id: 'GenerateButton',
      open: false,
      clicked: false,
      title: 'What our generate button does',
      description: `When you click generate, Rev Registration tries to create up to 5 schedules
      including only the courses that meet your selected criteria. If you have already generated
      schedules beforehand, any unlocked schedules will be considered unwanted and replaced
      with new ones.`,
    },
    {
      id: 'InfoUpdateFrequency',
      open: false,
      clicked: false,
      title: 'How often we update this websites information',
      description: `We update this website every 15 minutes throughout the registration 
      and early registration periods. We usually add the course information for the next 
      semester about a week or two before the early registration period.`,
    },
    {
      id: 'Limitations',
      open: false,
      clicked: false,
      title: 'Limitations of Rev Registration',
      description: `Sections for some courses such as KINE 199 and Special Topics In courses differ
      in content at the section rather than course level. Rev Registration cannot tell the
      which sections will offer which content and treats them all the same. We recommend
      manually selecting the section(s) for these courses because otherwise
      you might end up in a section for a course you don't want to be in.`,
    },
  ];

  const [expandables, setExpandables] = React.useState(defaultExpandables);

  React.useEffect(() => {
    expandables.forEach((element) => {
      // disabled because we do want to reassign to parameters
      /* eslint no-param-reassign: "off" */
      if (element.clicked === true) {
        element.clicked = false;
        document.getElementById(element.id).classList.add(styles.highlightExpandable);
        setTimeout(() => {
          document.getElementById(element.id).classList.remove(styles.highlightExpandable);
        }, 1000);
      }
    });
  }, [expandables]);

  const otherStuffToCList = expandables.slice(11, expandables.length).map((expandable) => {
    const handleClick = (): void => {
      expandable.open = true;
      expandable.clicked = true;
      setExpandables([...expandables]);
    };

    return (
      <div key={expandable.id}>
        <li><a onClick={handleClick} onKeyDown={handleClick} href={`#${expandable.id}`}>{expandable.title}</a></li>
      </div>
    );
  });

  const otherStuffExpandables = expandables.slice(11, expandables.length).map((expandable) => {
    const handleClick = (): void => {
      expandable.open = !expandable.open;
      setExpandables([...expandables]);
    };

    return (
      <ExpansionPanel
        key={expandable.id}
        id={expandable.id}
        expanded={expandable.open}
        onClick={handleClick}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            <b>{expandable.title}</b>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={styles.accordionContent}>
          {expandable.gifAddress
            ? (
              <CaptionedGif
                gifAddress={expandable.gifAddress}
                subtitleText={expandable.subtitleText}
              />
            )
            : null}
          <Typography>
            {expandable.description}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  });
  return (
    <>
      <Paper classes={{ root: styles.paper }}>
        <h1> How To Use Rev Registration </h1>
        <hr />

        <div className={styles.box}>
          <h2>Contents</h2>
          <ol>
            <li><a href="#QuickStart">Quick start guide</a></li>
            <li><a href="#FilteringFeatures">Course filtering features</a></li>
            <li><a href="#OtherStuff">Other stuff</a></li>
            <ul>
              {otherStuffToCList}
            </ul>
          </ol>
        </div>

        <div id="QuickStart">
          <div className={styles.topPaddingTitle}>
            <div className={styles.bottomPaddingTitle}>
              <h2> Quick Start Guide </h2>
            </div>
          </div>
          <CaptionedGif
            gifAddress={`${STATIC_URL}/QuickStart.webm`}
            subtitleText="Quick walkthrough of how to create a schedule"
          />
          <ol>
            <li>
              To begin, add a course by clicking the add course button and typing
              out the course you want. Repeat this for every course you want to add
              to your schedule.
            </li>
            <li>
              Click and drag on the calendar to mark your unavailable (&quot;busy&quot;)
              times. When generating schedules, classes at these times will be omitted.
              To remove your busy times, you can click the trash icon.
            </li>
            <li>
              Hit the generate schedules button to generate a subset of up to 5 schedules
              with the options you selected. If you see a schedule you like, click the lock
              icon to save it. If you are not satisfied with any of the generated schedules,
              hitting the button again will automatically remove all unsaved schedules and
              generate another random subset of up to 5 possible schedules.
            </li>
            <li>
              You can click on a generated schedule to make it appear on the right calendar.
              You can also click the details button to open a pop up with more information
              about the sections in that schedule.
            </li>
          </ol>
        </div>

        <div id="FilteringFeatures">
          <div className={styles.topPaddingTitle}>
            <div className={styles.bottomPaddingTitle}>
              <h2> Course Filtering Options </h2>
            </div>
          </div>
          <CaptionedGif
            gifAddress={`${STATIC_URL}/QuickStart.webm`}
            subtitleText="Demonstration of advanced section filtering features"
          />
          <ul>
            <li>
              You can choose to filter the sections included in schedule generation
              at either the &quot;Basic&quot; or &quot;Section&quot; customization level.
              When you click &quot;Generate Schedules&quot;, the currently selected customization
              level for that course will be used.
            </li>
            <li>
              Basic is recommended for when you are searching for sections with a
              specific attribute such as &quot;honors&quot; or &quot;online&quot;. It
              displays available attributes and allows you to decide whether you want
              to include sections that have those attributes in schedule generation.
            </li>
            <li>
              Section is recommended for when you already know which section numbers or
              professors you want. It allows you to select the specific sections or professors
              you want to include in schedule generation.
            </li>
            <li>
              At the top right of every course you add, there is a switch labeled &quot;Include
              in schedules&quot;. When it is on the course name will have a maroon background.
              When it is off it will have a gray background. Only courses with this switch set to on
              will be included in your schedules when you hit generate. This feature is useful when
              you want to quickly generate schedules with different combinations of courses.
            </li>
          </ul>
        </div>

        <div id="OtherStuff">
          <div className={styles.bottomPadding}>
            <h2 className={styles.topPaddingTitle}> Other Info </h2>
            {otherStuffExpandables}
          </div>
        </div>
      </Paper>
    </>
  );
};

export default HowToUse;
