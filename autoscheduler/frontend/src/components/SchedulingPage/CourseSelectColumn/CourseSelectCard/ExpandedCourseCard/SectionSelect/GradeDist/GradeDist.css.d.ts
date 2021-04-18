declare namespace GradeDistCssNamespace {
  export interface IGradeDistCss {
    "gpa-underline": string;
    gpaUnderline: string;
    "grades-container": string;
    "grades-dist": string;
    gradesContainer: string;
    gradesDist: string;
    "no-grades-available": string;
    noGradesAvailable: string;
  }
}

declare const GradeDistCssModule: GradeDistCssNamespace.IGradeDistCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GradeDistCssNamespace.IGradeDistCss;
};

export = GradeDistCssModule;
