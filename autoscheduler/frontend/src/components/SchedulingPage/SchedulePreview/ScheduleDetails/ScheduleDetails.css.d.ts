declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "meeting-info": string;
    meetingInfo: string;
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
