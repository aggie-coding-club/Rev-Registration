// Module containing type definitions for API Requests

export interface SaveSchedulesRequest {
    term: string;
    selectedSchedule: number;
    schedules: SerializedSchedule[];
}

/** The serialiazed schedule that is sent when we save schedules with session/save_schedules */
export interface SerializedSchedule {
    name: string;
    sections: number[];
    saved: boolean;
}
