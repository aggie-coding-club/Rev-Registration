import * as React from 'react';
import { Box } from '@material-ui/core';

import Meeting, { MeetingType } from '../types/Meeting';
import MeetingCard from './MeetingCard';
import Section from '../types/Section';
import Instructor from '../types/Instructor';

const args = {
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
};
const testMeeting: Meeting = new Meeting(args);


const MeetingCardTest: React.FC = () => {
  return (
    // MeetingCard will fill its parent element completely
    <Box display="flex" width={300} height={200}>
      <MeetingCard meeting={testMeeting} bgColor="#f44336" />
    </Box>
  );
};

export default MeetingCardTest;
