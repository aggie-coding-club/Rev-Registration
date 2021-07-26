declare namespace SchedulingPageCssNamespace {
  export interface ISchedulingPageCss {
    "course-card-column-container": string;
    courseCardColumnContainer: string;
    "fullscreen-button-container": string;
    fullscreenButtonContainer: string;
    "hide-if-fullscreen": string;
    hideIfFullscreen: string;
    "left-container": string;
    leftContainer: string;
    "middle-column": string;
    middleColumn: string;
    "override-icon-button": string;
    overrideIconButton: string;
    "page-container": string;
    pageContainer: string;
    "right-button-container": string;
    rightButtonContainer: string;
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
