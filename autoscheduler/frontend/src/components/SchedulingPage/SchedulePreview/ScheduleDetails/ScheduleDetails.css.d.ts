declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "bottom-padding": string;
    bottomPadding: string;
    "crn-container": string;
    crnContainer: string;
    "details-title": string;
    detailsTitle: string;
    divider: string;
    "hours-display": string;
    hoursDisplay: string;
    "instructor-name": string;
    instructorName: string;
    "left-padding": string;
    leftPadding: string;
    "meeting-info": string;
    meetingInfo: string;
    "no-padding": string;
    noPadding: string;
    "right-align": string;
    "right-margin": string;
    rightAlign: string;
    rightMargin: string;
    "schedule-info": string;
    scheduleInfo: string;
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
