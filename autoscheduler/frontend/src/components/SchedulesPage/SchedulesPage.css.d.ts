declare namespace SchedulesPageCssModule {
  export interface ISchedulesPageCss {
    "page-container": string;
    pageContainer: string;
  }
}

declare const SchedulesPageCssModule: SchedulesPageCssModule.ISchedulesPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulesPageCssModule.ISchedulesPageCss;
};

export = SchedulesPageCssModule;
