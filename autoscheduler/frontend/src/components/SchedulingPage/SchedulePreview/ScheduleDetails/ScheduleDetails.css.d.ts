declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "crn-container": string;
    crnContainer: string;
    "details-title": string;
    detailsTitle: string;
    divider: string;
    "hours-display": string;
    hoursDisplay: string;
    "instructor-name": string;
    instructorName: string;
    "left-margin": string;
    leftMargin: string;
    "meeting-info": string;
    meetingInfo: string;
    "no-padding": string;
    noPadding: string;
    "right-align": string;
    "right-margin": string;
    rightAlign: string;
    rightMargin: string;
    "schedule-info": string;
    "schedule-info-container": string;
    scheduleInfo: string;
    scheduleInfoContainer: string;
    "section-info": string;
    "section-info-item": string;
    sectionInfo: string;
    sectionInfoItem: string;
  }
}

declare const ScheduleDetailsCssModule: ScheduleDetailsCssNamespace.IScheduleDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleDetailsCssNamespace.IScheduleDetailsCss;
};

export = ScheduleDetailsCssModule;
