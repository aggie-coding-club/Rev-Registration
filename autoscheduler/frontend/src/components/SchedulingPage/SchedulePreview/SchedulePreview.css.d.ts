declare namespace SchedulePreviewCssNamespace {
  export interface ISchedulePreviewCss {
    "card-header": string;
    cardHeader: string;
    "color-box": string;
    colorBox: string;
    "configure-card": string;
    configureCard: string;
    "enable-pointer-events": string;
    enablePointerEvents: string;
    hidden: string;
    list: string;
    "list-item-with-preview": string;
    listItemWithPreview: string;
    "no-flex-shrink": string;
    "no-schedules": string;
    noFlexShrink: string;
    noSchedules: string;
    "schedule-header": string;
    "schedule-name-container": string;
    "schedule-name-text": string;
    scheduleHeader: string;
    scheduleNameContainer: string;
    scheduleNameText: string;
    "schedules-loading-indicator": string;
    schedulesLoadingIndicator: string;
    "section-label-row": string;
    sectionLabelRow: string;
  }
}

declare const SchedulePreviewCssModule: SchedulePreviewCssNamespace.ISchedulePreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SchedulePreviewCssNamespace.ISchedulePreviewCss;
};

export = SchedulePreviewCssModule;
