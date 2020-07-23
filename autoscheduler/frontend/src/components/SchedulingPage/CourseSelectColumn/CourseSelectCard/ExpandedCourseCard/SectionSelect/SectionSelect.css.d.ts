declare namespace SectionSelectCssModule {
  export interface ISectionSelectCss {
    "dense-list-item": string;
    denseListItem: string;
    "divider-container": string;
    dividerContainer: string;
    "gray-text": string;
    grayText: string;
    "list-subheader-dense": string;
    listSubheaderDense: string;
    "my-icon-button": string;
    "my-list-item-icon": string;
    myIconButton: string;
    myListItemIcon: string;
    "name-honors-icon": string;
    nameHonorsIcon: string;
    "no-grades-available": string;
    noGradesAvailable: string;
    "right-aligned-text": string;
    rightAlignedText: string;
    "section-rows": string;
    sectionRows: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssModule.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssModule.ISectionSelectCss;
};

export = SectionSelectCssModule;
