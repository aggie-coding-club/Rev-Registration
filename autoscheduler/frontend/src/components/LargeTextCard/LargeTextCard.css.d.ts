declare namespace LargeTextCardCssModule {
  export interface ILargeTextCardCss {
    container: string;
  }
}

declare const LargeTextCardCssModule: LargeTextCardCssModule.ILargeTextCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LargeTextCardCssModule.ILargeTextCardCss;
};

export = LargeTextCardCssModule;
