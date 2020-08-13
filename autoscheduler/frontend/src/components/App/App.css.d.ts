declare namespace AppCssModule {
  export interface IAppCss {
    "app-container": string;
    appContainer: string;
    back: string;
    next: string;
    "stepper-button": string;
    stepperButton: string;
  }
}

declare const AppCssModule: AppCssModule.IAppCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppCssModule.IAppCss;
};

export = AppCssModule;
