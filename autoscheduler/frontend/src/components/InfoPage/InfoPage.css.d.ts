declare namespace InfoPageCssNamespace {
  export interface IInfoPageCss {
    center: string;
    paper: string;
  }
}

declare const InfoPageCssModule: InfoPageCssNamespace.IInfoPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InfoPageCssNamespace.IInfoPageCss;
};

export = InfoPageCssModule;
