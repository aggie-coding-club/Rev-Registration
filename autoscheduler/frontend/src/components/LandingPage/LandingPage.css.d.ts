declare namespace LandingPageCssModule {
  export interface ILandingPageCss {
    container: string;
  }
}

declare const LandingPageCssModule: LandingPageCssModule.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssModule.ILandingPageCss;
};

export = LandingPageCssModule;
