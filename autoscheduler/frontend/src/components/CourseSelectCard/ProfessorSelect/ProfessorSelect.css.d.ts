declare namespace ProfessorSelectCssModule {
  export interface IProfessorSelectCss {
    label: string;
    "with-divider": string;
    withDivider: string;
  }
}

declare const ProfessorSelectCssModule: ProfessorSelectCssModule.IProfessorSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProfessorSelectCssModule.IProfessorSelectCss;
};

export = ProfessorSelectCssModule;
