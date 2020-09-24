declare namespace InstructionsDialogCssModule {
  export interface IInstructionsDialogCss {
    "availability-dialog": string;
    availabilityDialog: string;
    "buttons-on-right": string;
    buttonsOnRight: string;
    "modal-backdrop": string;
    modalBackdrop: string;
  }
}

declare const InstructionsDialogCssModule: InstructionsDialogCssModule.IInstructionsDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InstructionsDialogCssModule.IInstructionsDialogCss;
};

export = InstructionsDialogCssModule;
