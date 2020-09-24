declare namespace LargeTextCardCssNamespace {
  export interface ILargeTextCardCss {
    container: string;
    paper: string;
  }
}

declare const LargeTextCardCssModule: LargeTextCardCssNamespace.ILargeTextCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LargeTextCardCssNamespace.ILargeTextCardCss;
};

export = LargeTextCardCssModule;
