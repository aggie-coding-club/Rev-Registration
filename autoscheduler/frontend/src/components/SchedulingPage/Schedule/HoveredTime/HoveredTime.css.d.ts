declare namespace HoveredTimeCssNamespace {
  export interface IHoveredTimeCss {
    container: string;
    label: string;
    marker: string;
  }
}

declare const HoveredTimeCssModule: HoveredTimeCssNamespace.IHoveredTimeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HoveredTimeCssNamespace.IHoveredTimeCss;
};

export = HoveredTimeCssModule;
