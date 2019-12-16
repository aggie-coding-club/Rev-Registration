declare namespace SectionSelectCssModule {
  export interface ISectionSelectCss {
    "list-subheader-dense": string;
    listSubheaderDense: string;
    "meeting-days": string;
    "meeting-details-text": string;
    meetingDays: string;
    meetingDetailsText: string;
    "my-icon-button": string;
    "my-list-item-icon": string;
    myIconButton: string;
    myListItemIcon: string;
    "normal-height-override": string;
    normalHeightOverride: string;
    "section-num": string;
    sectionNum: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssModule.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssModule.ISectionSelectCss;
};

export = SectionSelectCssModule;
