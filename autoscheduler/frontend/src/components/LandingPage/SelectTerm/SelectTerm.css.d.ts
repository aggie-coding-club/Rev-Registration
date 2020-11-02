declare namespace SelectTermCssNamespace {
  export interface ISelectTermCss {
    "button-container": string;
    buttonContainer: string;
    "menu-paper": string;
    menuPaper: string;
    "select-term-button": string;
    selectTermButton: string;
  }
}

declare const SelectTermCssModule: SelectTermCssNamespace.ISelectTermCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectTermCssNamespace.ISelectTermCss;
};

export = SelectTermCssModule;
