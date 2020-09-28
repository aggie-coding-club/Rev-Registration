declare namespace GradeDistCssModule {
  export interface IGradeDistCss {
    "gpa-underline": string;
    gpaUnderline: string;
    "grades-container": string;
    "grades-dist": string;
    gradesContainer: string;
    gradesDist: string;
  }
}

declare const GradeDistCssModule: GradeDistCssModule.IGradeDistCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GradeDistCssModule.IGradeDistCss;
};

export = GradeDistCssModule;
