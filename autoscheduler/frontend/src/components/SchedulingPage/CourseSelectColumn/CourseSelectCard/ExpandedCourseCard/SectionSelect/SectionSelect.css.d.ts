declare namespace SectionSelectCssNamespace {
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
    "professor-header": string;
    professorHeader: string;
    "section-details-table": string;
    "section-rows": string;
    sectionDetailsTable: string;
    sectionRows: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssNamespace.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssNamespace.ISectionSelectCss;
};

export = SectionSelectCssModule;
