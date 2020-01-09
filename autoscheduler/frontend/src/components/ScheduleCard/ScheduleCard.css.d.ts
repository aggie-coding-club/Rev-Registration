declare namespace ScheduleCardCssModule {
  export interface IScheduleCardCss {
    "end-time": string;
    endTime: string;
    "meeting-card": string;
    meetingCard: string;
    "start-time": string;
    startTime: string;
  }
}

declare const ScheduleCardCssModule: ScheduleCardCssModule.IScheduleCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleCardCssModule.IScheduleCardCss;
};

export = ScheduleCardCssModule;
