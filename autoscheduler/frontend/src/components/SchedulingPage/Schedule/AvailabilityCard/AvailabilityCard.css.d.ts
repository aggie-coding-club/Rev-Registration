declare namespace AvailabilityCardCssModule {
  export interface IAvailabilityCardCss {
    container: string;
    icon: string;
  }
}

declare const AvailabilityCardCssModule: AvailabilityCardCssModule.IAvailabilityCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvailabilityCardCssModule.IAvailabilityCardCss;
};

export = AvailabilityCardCssModule;
