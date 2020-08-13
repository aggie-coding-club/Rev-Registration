declare namespace AvailabilityPageCssModule {
  export interface IAvailabilityPageCss {
    "card-actions": string;
    cardActions: string;
    "instructions-card": string;
    instructionsCard: string;
    "page-container": string;
    pageContainer: string;
  }
}

declare const AvailabilityPageCssModule: AvailabilityPageCssModule.IAvailabilityPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvailabilityPageCssModule.IAvailabilityPageCss;
};

export = AvailabilityPageCssModule;
