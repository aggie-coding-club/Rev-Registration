declare namespace CourseSelectColumnCssModule {
  export interface ICourseSelectColumnCss {
    "add-course-button": string;
    addCourseButton: string;
    "column-wrapper": string;
    columnWrapper: string;
    container: string;
    "course-select-column": string;
    courseSelectColumn: string;
    row: string;
  }
}

declare const CourseSelectColumnCssModule: CourseSelectColumnCssModule.ICourseSelectColumnCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CourseSelectColumnCssModule.ICourseSelectColumnCss;
};

export = CourseSelectColumnCssModule;
