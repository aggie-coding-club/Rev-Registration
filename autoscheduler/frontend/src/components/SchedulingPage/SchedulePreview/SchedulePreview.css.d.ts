declare namespace SchedulePreviewCssModule {
  export interface ISchedulePreviewCss {
    "card-header": string;
    cardHeader: string;
    "configure-card": string;
    configureCard: string;
    gpa: string;
    list: string;
    "no-schedules": string;
    noSchedules: string;
    "schedule-button": string;
    "schedule-header": string;
    scheduleButton: string;
    scheduleHeader: string;
  }
}

declare const SchedulePreviewCssModule: SchedulePreviewCssModule.ISchedulePreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulePreviewCssModule.ISchedulePreviewCss;
};

export = SchedulePreviewCssModule;
