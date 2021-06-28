declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "bottom-padding": string;
    bottomPadding: string;
    "crn-container": string;
    "crn-hours-container": string;
    crnContainer: string;
    crnHoursContainer: string;
    "details-title": string;
    detailsTitle: string;
    divider: string;
    "hours-display": string;
    hoursDisplay: string;
    "icon-container": string;
    iconContainer: string;
    "instructor-name": string;
    instructorName: string;
    "left-padding": string;
    leftPadding: string;
    "meeting-info": string;
    meetingInfo: string;
    "no-padding": string;
    noPadding: string;
    "right-align": string;
    "right-padding": string;
    rightAlign: string;
    rightPadding: string;
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
