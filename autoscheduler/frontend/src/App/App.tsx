import * as React from 'react';
import { Router, Link } from '@reach/router';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { ThemeProvider } from '@material-ui/styles';

import theme from '../theme';
import Empty from '../components/Empty/Empty';
import Schedule from '../components/Schedule/Schedule';
import Meeting, { MeetingType } from '../types/Meeting';
import Section from '../types/Section';
import Instructor from '../types/Instructor';
import * as styles from './App.css';

// DEBUG
const testMeeting = new Meeting({
  id: 123456,
  crn: 123456,
  building: 'HRBB',
  meetingDays: [false, true, false, true, false, true, false],
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: new Section({
    id: 123456,
    subject: 'SUBJ',
    courseNum: 234,
    sectionNum: 500,
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    instructor: new Instructor({
      id: 123456,
      name: 'Aakash Tyagi',
    }),
  }),
});

const testMeeting2 = new Meeting({
  id: 123456,
  crn: 123456,
  building: 'ZACH',
  meetingDays: [false, false, true, false, true, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: new Section({
    id: 123456,
    subject: 'SUBJ',
    courseNum: 234,
    sectionNum: 500,
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    instructor: new Instructor({
      id: 123456,
      name: 'Aakash Tyagi',
    }),
  }),
});

const App: React.SFC = function App() {
  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start">
              <Link to="/">
                <HomeIcon color="secondary" />
              </Link>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Router>
          {/* One component for each page/route goes in here */}
          <Empty path="/" />
          <Schedule path="/schedule" schedule={[testMeeting, testMeeting2]} />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
