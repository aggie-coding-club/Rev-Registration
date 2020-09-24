declare namespace CollapsedCourseCardCssNamespace {
  export interface ICollapsedCourseCardCss {
    "custom-box": string;
    customBox: string;
    "maroon-card": string;
    maroonCard: string;
  }
}

declare const CollapsedCourseCardCssModule: CollapsedCourseCardCssNamespace.ICollapsedCourseCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CollapsedCourseCardCssNamespace.ICollapsedCourseCardCss;
};

export = CollapsedCourseCardCssModule;
