declare namespace ScheduleCssModule {
  export interface IScheduleCss {
    "calendar-body": string;
    "calendar-container": string;
    "calendar-day": string;
    "calendar-row": string;
    calendarBody: string;
    calendarContainer: string;
    calendarDay: string;
    calendarRow: string;
    header: string;
    "header-tile": string;
    headerTile: string;
    "hour-label": string;
    "hour-marker": string;
    hourLabel: string;
    hourMarker: string;
    "meetings-container": string;
    meetingsContainer: string;
    "v-time-label-margin": string;
    vTimeLabelMargin: string;
  }
}

declare const ScheduleCssModule: ScheduleCssModule.IScheduleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleCssModule.IScheduleCss;
};

export = ScheduleCssModule;
