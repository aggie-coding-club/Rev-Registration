declare namespace HowToUseCssNamespace {
  export interface IHowToUseCss {
    accordionContent: string;
    bottomPadding: string;
    bottomPaddingTitle: string;
    box: string;
    paper: string;
    topPaddingTitle: string;
  }
}

declare const HowToUseCssModule: HowToUseCssNamespace.IHowToUseCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HowToUseCssNamespace.IHowToUseCss;
};

export = HowToUseCssModule;
