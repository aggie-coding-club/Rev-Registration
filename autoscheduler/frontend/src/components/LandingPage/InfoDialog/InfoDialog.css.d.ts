declare namespace InfoDialogCssNamespace {
  export interface IInfoDialogCss {
    "close-button": string;
    closeButton: string;
    "dialog-content": string;
    "dialog-title": string;
    dialogContent: string;
    dialogTitle: string;
    link: string;
  }
}

declare const InfoDialogCssModule: InfoDialogCssNamespace.IInfoDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InfoDialogCssNamespace.IInfoDialogCss;
};

export = InfoDialogCssModule;
