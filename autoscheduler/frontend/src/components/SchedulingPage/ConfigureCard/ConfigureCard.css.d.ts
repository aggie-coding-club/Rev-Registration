declare namespace ConfigureCardCssModule {
  export interface IConfigureCardCss {
    "button-container": string;
    buttonContainer: string;
    "card-header": string;
    cardHeader: string;
    instructions: string;
    spacer: string;
  }
}

declare const ConfigureCardCssModule: ConfigureCardCssModule.IConfigureCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfigureCardCssModule.IConfigureCardCss;
};

export = ConfigureCardCssModule;
