declare namespace LandingPageCssNamespace {
  export interface ILandingPageCss {
    container: string;
  }
}

declare const LandingPageCssModule: LandingPageCssNamespace.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssNamespace.ILandingPageCss;
};

export = LandingPageCssModule;
