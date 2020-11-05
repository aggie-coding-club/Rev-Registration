// Module containing type definitions for API Reuqests

export interface SaveSchedulesRequest {
    term: string;
    schedules: SerializedSchedule[];
}

/** The serialiazed schedule that is sent when we save schedules with session/save_schedules */
export interface SerializedSchedule {
    name: string;
    sections: number[];
}
