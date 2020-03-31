declare namespace SchedulingPageCssModule {
  export interface ISchedulingPageCss {
    "left-container": string;
    "left-sub-container": string;
    leftContainer: string;
    leftSubContainer: string;
    "middle-column": string;
    middleColumn: string;
    "page-container": string;
    pageContainer: string;
    "schedule-container": string;
    scheduleContainer: string;
  }
}

declare const SchedulingPageCssModule: SchedulingPageCssModule.ISchedulingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulingPageCssModule.ISchedulingPageCss;
};

export = SchedulingPageCssModule;
