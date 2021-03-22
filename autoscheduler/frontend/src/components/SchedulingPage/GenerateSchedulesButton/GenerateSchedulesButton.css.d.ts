declare namespace GenerateSchedulesButtonCssNamespace {
  export interface IGenerateSchedulesButtonCss {
    "button-container": string;
    buttonContainer: string;
    "card-header": string;
    cardHeader: string;
    spacer: string;
  }
}

declare const GenerateSchedulesButtonCssModule: GenerateSchedulesButtonCssNamespace.IGenerateSchedulesButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenerateSchedulesButtonCssNamespace.IGenerateSchedulesButtonCss;
};

export = GenerateSchedulesButtonCssModule;
