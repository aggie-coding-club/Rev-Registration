declare namespace MeetingCardCssModule {
  export interface IMeetingCardCss {
    "end-time": string;
    endTime: string;
    "meeting-card": string;
    meetingCard: string;
    "start-time": string;
    startTime: string;
  }
}

declare const MeetingCardCssModule: MeetingCardCssModule.IMeetingCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MeetingCardCssModule.IMeetingCardCss;
};

export = MeetingCardCssModule;
