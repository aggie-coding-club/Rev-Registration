declare namespace CourseSelectColumnCssModule {
  export interface ICourseSelectColumnCss {
    "add-course-button": string;
    addCourseButton: string;
    container: string;
    row: string;
  }
}

declare const CourseSelectColumnCssModule: CourseSelectColumnCssModule.ICourseSelectColumnCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CourseSelectColumnCssModule.ICourseSelectColumnCss;
};

export = CourseSelectColumnCssModule;
