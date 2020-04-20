import { testSchedule1, testSchedule2 } from '../../../tests/testSchedules';

interface MockResponse {
  json: () => any;
}

export default async function fetch(path: string, init?: RequestInit): Promise<MockResponse> {
  if (path === '/api/scheduling/generate' && init) {
    const schedules = [testSchedule1, testSchedule2];
    return ({
      json: (): any => schedules,
    });
  }
  return null;
}
