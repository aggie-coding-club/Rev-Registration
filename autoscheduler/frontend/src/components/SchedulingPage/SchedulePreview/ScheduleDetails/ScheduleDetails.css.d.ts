declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "bottom-padding": string;
    bottomPadding: string;
    "crn-container": string;
    crnContainer: string;
    "icon-container": string;
    iconContainer: string;
    "instructor-name": string;
    instructorName: string;
    "meeting-info": string;
    meetingInfo: string;
    "right-align": string;
    rightAlign: string;
    "schedule-info-container": string;
    scheduleInfoContainer: string;
    "section-info": string;
    "section-name": string;
    "section-title": string;
    sectionInfo: string;
    sectionName: string;
    sectionTitle: string;
  }
}

declare const ScheduleDetailsCssModule: ScheduleDetailsCssNamespace.IScheduleDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleDetailsCssNamespace.IScheduleDetailsCss;
};

export = ScheduleDetailsCssModule;
