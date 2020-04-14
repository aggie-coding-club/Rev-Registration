declare namespace OptionsCardCssModule {
  export interface IOptionsCardCss {
    "button-container": string;
    buttonContainer: string;
    spacer: string;
  }
}

declare const OptionsCardCssModule: OptionsCardCssModule.IOptionsCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OptionsCardCssModule.IOptionsCardCss;
};

export = OptionsCardCssModule;
