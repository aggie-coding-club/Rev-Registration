declare namespace MeetingCardCssNamespace {
  export interface IMeetingCardCss {
    "building-name": string;
    buildingName: string;
    "end-time": string;
    endTime: string;
    "meeting-card": string;
    "meeting-card-text": string;
    meetingCard: string;
    meetingCardText: string;
    "start-time": string;
    startTime: string;
  }
}

declare const MeetingCardCssModule: MeetingCardCssNamespace.IMeetingCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MeetingCardCssNamespace.IMeetingCardCss;
};

export = MeetingCardCssModule;
