declare namespace SectionSelectCssModule {
  export interface ISectionSelectCss {
    "dense-list-item": string;
    denseListItem: string;
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
    "section-num": string;
    sectionNum: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssModule.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssModule.ISectionSelectCss;
};

export = SectionSelectCssModule;
