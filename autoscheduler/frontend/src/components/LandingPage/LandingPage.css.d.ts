declare namespace LandingPageCssNamespace {
  export interface ILandingPageCss {
    arrow: string;
    container: string;
    "dialog-container": string;
    "dialog-link": string;
    dialogContainer: string;
    dialogLink: string;
    "gray-out": string;
    "gray-out-box": string;
    grayOut: string;
    grayOutBox: string;
    iconButton: string;
    "popper-insets": string;
    popperInsets: string;
    tooltip: string;
  }
}

declare const LandingPageCssModule: LandingPageCssNamespace.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssNamespace.ILandingPageCss;
};

export = LandingPageCssModule;
