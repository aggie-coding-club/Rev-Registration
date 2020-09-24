declare namespace AvailabilityCardCssNamespace {
  export interface IAvailabilityCardCss {
    container: string;
    icon: string;
  }
}

declare const AvailabilityCardCssModule: AvailabilityCardCssNamespace.IAvailabilityCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvailabilityCardCssNamespace.IAvailabilityCardCss;
};

export = AvailabilityCardCssModule;
