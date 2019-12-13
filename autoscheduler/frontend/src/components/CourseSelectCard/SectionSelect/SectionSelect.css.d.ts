declare namespace SectionSelectCssModule {
  export interface ISectionSelectCss {
    "my-icon-button": string;
    "my-list-item-icon": string;
    myIconButton: string;
    myListItemIcon: string;
  }
}

declare const SectionSelectCssModule: SectionSelectCssModule.ISectionSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionSelectCssModule.ISectionSelectCss;
};

export = SectionSelectCssModule;
