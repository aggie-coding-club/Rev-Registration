import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from '@reach/router';
import { Paper } from '@material-ui/core';
import CaptionedGif from './CaptionedGif/CaptionedGif';
import * as styles from './HowToUse.css';

/* eslint-disable react/no-children-prop */

const headers = `# How To Use
---`;

const quickStartTitle = '## Quick Start Guide';

const quickStartList = ` * To begin, add a course by clicking the add course button and typing 
out the course you want. Repeat this for every course you want to add to your schedule. During registration, 
this information is updated about every 15 minutes.

* If you do not want classes at a certain time, click and drag on the calendar
to block off those &quot;busy times&quot; when generating schedules.
To remove your busy times, you can click the trash icon. To quickly remove them in
groups, you can click and hold on an edge then drag to rearrange multiple blocks so
that all your times are on the same day before clicking the icon.

* Hit the generate schedules button to generate up to 5 schedules with the options
you selected. New schedules will overwrite all previous unsaved schedules.
If you see a schedule you like, click the lock icon to save it.
The icon should change so that the lock is now closed. You can also
give the schedule a name to identify it easier by clicking the pencil icon.

* You can click on a generated schedule to make it appear on the big calendar.
You can also click the details button to open a pop up with more information
about the sections in that schedule.

* Whenever you click the generate button, only up to five possible schedules will be
generated. This is because some courses have a lot of sections and showing every single
possible combination at once can be be very overwhelming. If you are not satisfied
with any of the generated schedules, hitting the button again will automatically
remove all unsaved schedules and generate up to five more new ones.`;

const advancedFilteringTitle = '## Advanced Filtering Options';

const advancedFilteringList = `* You can choose to filter the sections included in schedule generation 
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

const additionalTips = `## Additional Tips
* It is recommended not to block off times past 6 pm because some 
courses have exam times during those hours. Blocking off those times will cause the course to 
be considered incompatible with your schedule even if lecture/labs occur when you are available.

* Kinese 199 and special topics sections are usually entirely different courses. Because they 
differ at the section rather than course level, Rev Registration cannot tell the difference between 
them. It is recommended to select specific sections for these when building your schedule.`;

const HowToUse: React.FC<RouteComponentProps> = () => (

  <Paper classes={{ root: styles.paper }}>
    <ReactMarkdown children={headers} className={styles.center} />

    <ReactMarkdown children={quickStartTitle} className={styles.center} />
    <CaptionedGif
      gifAddress={`${STATIC_URL}/QuickStart.webm`}
      subtitleText="Quick walkthrough of how to create a schedule"
    />
    <ReactMarkdown children={quickStartList} className={styles.center} />

    <ReactMarkdown children={advancedFilteringTitle} className={styles.center} />
    <CaptionedGif
      gifAddress={`${STATIC_URL}/QuickStart.webm`}
      subtitleText="Demonstration of advanced section filtering features"
    />
    <ReactMarkdown children={advancedFilteringList} className={styles.center} />

    <ReactMarkdown children={additionalTips} className={styles.center} />
  </Paper>
);

export default HowToUse;
