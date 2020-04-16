import fetchSavedSchedules from '../../App/testMeetings';

export default async function fetch(path: string, init?: RequestInit): Promise<any> {
  if (path === '/api/scheduling/generate' && init) {
    const schedules = await fetchSavedSchedules();
    return ({
      // TODO remove the array after testMeetings.ts is updated
      json: (): any => [schedules],
    });
  }
  return null;
}
