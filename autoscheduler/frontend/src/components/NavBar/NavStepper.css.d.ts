declare namespace NavStepperCssModule {
  export interface INavStepperCss {
    "centered-icon": string;
    centeredIcon: string;
    label: string;
    "label-active": string;
    "label-completed": string;
    labelActive: string;
    labelCompleted: string;
    stepper: string;
  }
}

declare const NavStepperCssModule: NavStepperCssModule.INavStepperCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavStepperCssModule.INavStepperCss;
};

export = NavStepperCssModule;
