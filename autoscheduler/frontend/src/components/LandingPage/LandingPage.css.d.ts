declare namespace LandingPageCssNamespace {
  export interface ILandingPageCss {
    "a-link": string;
    aLink: string;
    container: string;
    "dialog-container": string;
    "dialog-link": string;
    dialogContainer: string;
    dialogLink: string;
  }
}

declare const LandingPageCssModule: LandingPageCssNamespace.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssNamespace.ILandingPageCss;
};

export = LandingPageCssModule;
