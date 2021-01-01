declare namespace ScheduleDetailsCssNamespace {
  export interface IScheduleDetailsCss {
    "bottom-padding": string;
    bottomPadding: string;
    "crn-container": string;
    crnContainer: string;
    "icon-container": string;
    iconContainer: string;
    "meeting-info": string;
    meetingInfo: string;
    "next-button": string;
    nextButton: string;
    "previous-button": string;
    previousButton: string;
    "right-align": string;
    rightAlign: string;
    "schedule-info-container": string;
    scheduleInfoContainer: string;
    "section-info": string;
    "section-title": string;
    sectionInfo: string;
    sectionTitle: string;
  }
}

declare const ScheduleDetailsCssModule: ScheduleDetailsCssNamespace.IScheduleDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleDetailsCssNamespace.IScheduleDetailsCss;
};

export = ScheduleDetailsCssModule;
