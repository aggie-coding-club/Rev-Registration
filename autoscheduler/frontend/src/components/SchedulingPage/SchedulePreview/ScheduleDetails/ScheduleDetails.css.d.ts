declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "crn-container": string;
    crnContainer: string;
    "meeting-info": string;
    meetingInfo: string;
    "next-button": string;
    nextButton: string;
    "previous-button": string;
    previousButton: string;
    "schedule-info-container": string;
    scheduleInfoContainer: string;
    "section-title": string;
    sectionTitle: string;
  }
}

declare const ScheduleDetailsCssModule: ScheduleDetailsCssNamespace.IScheduleDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleDetailsCssNamespace.IScheduleDetailsCss;
};

export = ScheduleDetailsCssModule;
