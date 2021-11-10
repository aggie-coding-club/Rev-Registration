declare namespace InfoDialogCssNamespace {
  export interface IInfoDialogCss {
    link: string;
  }
}

declare const InfoDialogCssModule: InfoDialogCssNamespace.IInfoDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InfoDialogCssNamespace.IInfoDialogCss;
};

export = InfoDialogCssModule;
