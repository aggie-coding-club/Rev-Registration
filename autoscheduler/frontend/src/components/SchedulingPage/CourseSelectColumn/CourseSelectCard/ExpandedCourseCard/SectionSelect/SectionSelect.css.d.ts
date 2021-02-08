declare namespace SectionSelectCssNamespace {
  export interface ISectionSelectCss {
    "add-bottom-space": string;
    addBottomSpace: string;
    "center-progress": string;
    centerProgress: string;
    "dense-list-item": string;
    denseListItem: string;
    "divider-container": string;
    dividerContainer: string;
    "indent-for-checkbox": string;
    indentForCheckbox: string;
    "less-checkbox-padding": string;
    lessCheckboxPadding: string;
    "list-subheader-content": string;
    "list-subheader-dense": string;
    listSubheaderContent: string;
    listSubheaderDense: string;
    "meeting-info-wrapper": string;
    "meeting-type": string;
    meetingInfoWrapper: string;
    meetingType: string;
    "my-icon-button": string;
    "my-list-item-icon": string;
    myIconButton: string;
    myListItemIcon: string;
    "name-honors-icon": string;
    nameHonorsIcon: string;
    "no-extra-space": string;
    "no-grades-available": string;
    "no-start-padding": string;
    noExtraSpace: string;
    noGradesAvailable: string;
    noStartPadding: string;
    "placeholder-text": string;
    placeholderText: string;
    "section-details-table": string;
    "section-name-container": string;
    "section-rows": string;
    sectionDetailsTable: string;
    sectionNameContainer: string;
    sectionRows: string;
    "sort-menu-position": string;
    "sort-order-button": string;
    "sort-order-button-icon": string;
    "sort-order-button-icon-ascending": string;
    "sort-type-menu-button": string;
    "sort-type-menu-button-icon": string;
    sortMenuPosition: string;
    sortOrderButton: string;
    sortOrderButtonIcon: string;
    sortOrderButtonIconAscending: string;
    sortTypeMenuButton: string;
    sortTypeMenuButtonIcon: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssNamespace.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssNamespace.ISectionSelectCss;
};

export = SectionSelectCssModule;
