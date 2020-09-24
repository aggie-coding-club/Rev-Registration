declare namespace UnknownRoutePageCssNamespace {
  export interface IUnknownRoutePageCss {
    "fill-page": string;
    fillPage: string;
  }
}

declare const UnknownRoutePageCssModule: UnknownRoutePageCssNamespace.IUnknownRoutePageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnknownRoutePageCssNamespace.IUnknownRoutePageCss;
};

export = UnknownRoutePageCssModule;
