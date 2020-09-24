declare namespace InstructionsDialogCssNamespace {
  export interface IInstructionsDialogCss {
    "availability-dialog": string;
    availabilityDialog: string;
    "buttons-on-right": string;
    buttonsOnRight: string;
    "modal-backdrop": string;
    modalBackdrop: string;
  }
}

declare const InstructionsDialogCssModule: InstructionsDialogCssNamespace.IInstructionsDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InstructionsDialogCssNamespace.IInstructionsDialogCss;
};

export = InstructionsDialogCssModule;
