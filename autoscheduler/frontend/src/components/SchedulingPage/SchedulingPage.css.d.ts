declare namespace SchedulingPageCssNamespace {
  export interface ISchedulingPageCss {
    "course-card-column-container": string;
    courseCardColumnContainer: string;
    "fullscreen-button-container": string;
    fullscreenButtonContainer: string;
    "left-container": string;
    leftContainer: string;
    "middle-column": string;
    middleColumn: string;
    "page-container": string;
    pageContainer: string;
    "schedule-container": string;
    scheduleContainer: string;
    "total-hours-text": string;
    totalHoursText: string;
  }
}

declare const SchedulingPageCssModule: SchedulingPageCssNamespace.ISchedulingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulingPageCssNamespace.ISchedulingPageCss;
};

export = SchedulingPageCssModule;
