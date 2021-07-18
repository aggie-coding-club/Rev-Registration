declare namespace SectionAttributeIconsCssNamespace {
  export interface ISectionAttributeIconsCss {
    "icon-group-container": string;
    iconGroupContainer: string;
  }
}

declare const SectionAttributeIconsCssModule: SectionAttributeIconsCssNamespace.ISectionAttributeIconsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SectionAttributeIconsCssNamespace.ISectionAttributeIconsCss;
};

export = SectionAttributeIconsCssModule;
