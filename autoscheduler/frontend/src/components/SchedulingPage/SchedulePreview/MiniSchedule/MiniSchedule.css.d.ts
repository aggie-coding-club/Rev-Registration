declare namespace MiniScheduleCssModule {
  export interface IMiniScheduleCss {
    "aspect-ratio-box": string;
    aspectRatioBox: string;
    "calendar-body": string;
    calendarBody: string;
    header: string;
    "hour-marker": string;
    hourMarker: string;
    "meetings-container": string;
    meetingsContainer: string;
    "mini-schedule-container": string;
    miniScheduleContainer: string;
  }
}

declare const MiniScheduleCssModule: MiniScheduleCssModule.IMiniScheduleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MiniScheduleCssModule.IMiniScheduleCss;
};

export = MiniScheduleCssModule;
