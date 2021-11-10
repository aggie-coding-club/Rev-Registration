declare namespace DialogWithCloseCssNamespace {
  export interface IDialogWithCloseCss {
    "close-button": string;
    closeButton: string;
    "dialog-content": string;
    "dialog-title": string;
    dialogContent: string;
    dialogTitle: string;
  }
}

declare const DialogWithCloseCssModule: DialogWithCloseCssNamespace.IDialogWithCloseCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogWithCloseCssNamespace.IDialogWithCloseCss;
};

export = DialogWithCloseCssModule;
