declare namespace UnknownRoutePageCssModule {
  export interface IUnknownRoutePageCss {
    "fill-page": string;
    fillPage: string;
  }
}

declare const UnknownRoutePageCssModule: UnknownRoutePageCssModule.IUnknownRoutePageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnknownRoutePageCssModule.IUnknownRoutePageCss;
};

export = UnknownRoutePageCssModule;
