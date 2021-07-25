declare namespace FeedbackFormCssNamespace {
  export interface IFeedbackFormCss {
    "comment-text": string;
    commentText: string;
    "error-text": string;
    errorText: string;
    "feedback-dialog-content": string;
    feedbackDialogContent: string;
    "form-submit-container": string;
    formSubmitContainer: string;
    rating: string;
  }
}

declare const FeedbackFormCssModule: FeedbackFormCssNamespace.IFeedbackFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FeedbackFormCssNamespace.IFeedbackFormCss;
};

export = FeedbackFormCssModule;
