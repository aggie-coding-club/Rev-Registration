declare namespace CourseSelectCardCssModule {
  export interface ICourseSelectCardCss {
    container: string;
    content: string;
    "course-input": string;
    "course-input-focused": string;
    courseInput: string;
    courseInputFocused: string;
    "customization-buttons": string;
    customizationButtons: string;
    "gray-text": string;
    grayText: string;
    header: string;
    "header-group": string;
    headerGroup: string;
    "no-elevation": string;
    noElevation: string;
  }
}

declare const CourseSelectCardCssModule: CourseSelectCardCssModule.ICourseSelectCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CourseSelectCardCssModule.ICourseSelectCardCss;
};

export = CourseSelectCardCssModule;
