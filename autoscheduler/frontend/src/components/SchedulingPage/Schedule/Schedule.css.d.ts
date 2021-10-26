declare namespace ScheduleCssNamespace {
  export interface IScheduleCss {
    "availabilities-loading-indicator": string;
    availabilitiesLoadingIndicator: string;
    "calendar-body": string;
    "calendar-container": string;
    "calendar-day": string;
    "calendar-day-if-screenshot-left-border": string;
    "calendar-day-if-screenshot-right-border": string;
    "calendar-row": string;
    calendarBody: string;
    calendarContainer: string;
    calendarDay: string;
    calendarDayIfScreenshotLeftBorder: string;
    calendarDayIfScreenshotRightBorder: string;
    calendarRow: string;
    header: string;
    "header-tile": string;
    headerTile: string;
    "hour-label": string;
    "hour-label-if-screenshot": string;
    "hour-marker": string;
    hourLabel: string;
    hourLabelIfScreenshot: string;
    hourMarker: string;
    "meetings-container": string;
    meetingsContainer: string;
    "v-time-label-margin": string;
    vTimeLabelMargin: string;
  }
}

declare const ScheduleCssModule: ScheduleCssNamespace.IScheduleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleCssNamespace.IScheduleCss;
};

export = ScheduleCssModule;
