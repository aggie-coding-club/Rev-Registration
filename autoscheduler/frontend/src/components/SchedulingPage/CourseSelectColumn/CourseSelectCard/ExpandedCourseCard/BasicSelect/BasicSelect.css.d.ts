declare namespace BasicSelectCssModule {
  export interface IBasicSelectCss {
    "fit-content": string;
    fitContent: string;
    "gray-text": string;
    grayText: string;
    "table-container": string;
    tableContainer: string;
  }
}

declare const BasicSelectCssModule: BasicSelectCssModule.IBasicSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BasicSelectCssModule.IBasicSelectCss;
};

export = BasicSelectCssModule;
