import * as React from 'react';
import { Router, Link } from '@reach/router';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import Empty from './components/Empty';
import Schedule from './components/Schedule';
import Meeting, { MeetingType } from './types/Meeting';
import Section from './types/Section';
import Instructor from './types/Instructor';

// DEBUG
const testMeeting = new Meeting({
  id: 123456,
  crn: 123456,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
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

const App: React.SFC = function App() {
  return (
    <div>
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
          <Schedule path="/schedule" schedule={[testMeeting]} />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
