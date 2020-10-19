declare namespace ScheduleCardCssNamespace {
  export interface IScheduleCardCss {
    "drag-handle": string;
    "drag-handle-bot": string;
    "drag-handle-top": string;
    dragHandle: string;
    dragHandleBot: string;
    dragHandleTop: string;
    "end-time": string;
    endTime: string;
    "schedule-card": string;
    scheduleCard: string;
    "start-time": string;
    startTime: string;
  }
}

declare const ScheduleCardCssModule: ScheduleCardCssNamespace.IScheduleCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ScheduleCardCssNamespace.IScheduleCardCss;
};

export = ScheduleCardCssModule;
