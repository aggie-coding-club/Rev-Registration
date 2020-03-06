declare namespace HoveredTimeCssModule {
  export interface IHoveredTimeCss {
    container: string;
    label: string;
    marker: string;
  }
}

declare const HoveredTimeCssModule: HoveredTimeCssModule.IHoveredTimeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HoveredTimeCssModule.IHoveredTimeCss;
};

export = HoveredTimeCssModule;
