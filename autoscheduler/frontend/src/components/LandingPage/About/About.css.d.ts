declare namespace AboutCssNamespace {
  export interface IAboutCss {
    "contributors-row": string;
    contributorsRow: string;
    "override-icon-button": string;
    overrideIconButton: string;
  }
}

declare const AboutCssModule: AboutCssNamespace.IAboutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AboutCssNamespace.IAboutCss;
};

export = AboutCssModule;
