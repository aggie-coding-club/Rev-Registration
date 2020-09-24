declare namespace SchedulePreviewCssNamespace {
  export interface ISchedulePreviewCss {
    "card-header": string;
    cardHeader: string;
    "color-box": string;
    colorBox: string;
    "configure-card": string;
    configureCard: string;
    gpa: string;
    list: string;
    "list-item-with-preview": string;
    listItemWithPreview: string;
    "no-schedules": string;
    noSchedules: string;
    "schedule-header": string;
    scheduleHeader: string;
    "section-label-row": string;
    sectionLabelRow: string;
  }
}

declare const SchedulePreviewCssModule: SchedulePreviewCssNamespace.ISchedulePreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulePreviewCssNamespace.ISchedulePreviewCss;
};

export = SchedulePreviewCssModule;
