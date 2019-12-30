declare namespace HelpTextCssModule {
  export interface IHelpTextCss {
    container: string;
  }
}

declare const HelpTextCssModule: HelpTextCssModule.IHelpTextCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HelpTextCssModule.IHelpTextCss;
};

export = HelpTextCssModule;
