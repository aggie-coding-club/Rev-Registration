/* eslint-disable @typescript-eslint/camelcase */

/**
 * Mocks the fetch call made to the API to retrieve all sections of a given course. Should return
 * 3 sections with 5 meetings total for CSCE classes and 1 section with 1 meeting total for MATH
 * classes. The term is required but doesn't affect outcome
 * @param route the normal API route to fetch sections/meetings
 */
export default async function testFetch(route: string): Promise<Response> {
  const [, subject, course_num] = /\/api\/sections\?dept=(.+)&course_num=(.+)&term=.+/.exec(route);
  const testSection1 = {
    id: 123456,
    crn: 123456,
    subject,
    course_num,
    section_num: '501',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: false,
    web: false,
    instructor_name: 'Aakash Tyagi',
  };
  const testSection2 = {
    id: 123458,
    crn: 123459,
    subject,
    course_num,
    section_num: '502',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: false,
    web: false,
    instructor_name: 'Aakash Tyagi',
  };
  const testSection3 = {
    id: 123457,
    crn: 123457,
    subject,
    course_num,
    section_num: '503',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: false,
    web: false,
    instructor_name: 'Somebody Else',
  };
  const testSection4 = {
    id: 830262,
    crn: 67890,
    subject,
    course_num,
    section_num: '201',
    min_credits: 0,
    max_credits: 0,
    current_enrollment: 0,
    max_enrollment: 0,
    honors: true,
    web: false,
    instructor_name: 'Dr. Pepper',
  };

  // test that different sections do different things
  if (subject === 'MATH') {
    return new Response(JSON.stringify([{
      ...testSection4,
      meetings: [{
        id: 87328,
        building: 'BLOC',
        days: [false, true, false, true, false, true, false],
        start: '09:10',
        end: '10:00',
        type: 'LEC',
        section: null,
      }],
    }]));
  }

  // test that placeholder is shown if there are no sections
  if (subject === 'BIOL') {
    return new Response('[]');
  }

  return new Response(JSON.stringify([
    {
      ...testSection1,
      meetings: [{
        id: 12345,
        building: 'HRBB',
        days: [true, false, true, false, true, false, false],
        start: '08:00',
        end: '08:50',
        type: 'LEC',
      },
      {
        id: 12346,
        building: 'ZACH',
        days: [false, true, false, false, false, false, false],
        start: '11:10',
        end: '12:25',
        type: 'LAB',
      }],
    },
    {
      ...testSection2,
      meetings: [
        {
          id: 12347,
          building: 'HRBB',
          days: [true, false, true, false, true, false, false],
          start: '08:00',
          end: '08:50',
          type: 'LEC',
        },
        {
          id: 12348,
          building: 'ZACH',
          days: [false, false, true, false, false, false, false],
          start: '12:45',
          end: '14:00',
          type: 'LAB',
        },
      ],
    },
    {
      ...testSection3,
      meetings: [{
        id: 12347,
        building: 'ZACH',
        days: [true, false, true, false, true, false, false],
        start: '11:10',
        end: '12:25',
        type: 'LEC',
      }],
    },
  ]));
}
