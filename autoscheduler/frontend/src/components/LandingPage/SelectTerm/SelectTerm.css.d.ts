declare namespace SelectTermCssModule {
  export interface ISelectTermCss {
    "button-container": string;
    buttonContainer: string;
    "menu-paper": string;
    menuPaper: string;
  }
}

declare const SelectTermCssModule: SelectTermCssModule.ISelectTermCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectTermCssModule.ISelectTermCss;
};

export = SelectTermCssModule;
