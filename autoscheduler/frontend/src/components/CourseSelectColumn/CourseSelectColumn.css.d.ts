declare namespace CourseSelectColumnCssModule {
  export interface ICourseSelectColumnCss {
    container: string;
    icon: string;
  }
}

declare const CourseSelectColumnCssModule: CourseSelectColumnCssModule.ICourseSelectColumnCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CourseSelectColumnCssModule.ICourseSelectColumnCss;
};

export = CourseSelectColumnCssModule;
