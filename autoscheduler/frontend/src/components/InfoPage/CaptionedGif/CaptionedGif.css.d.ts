declare namespace CaptionedGifCssNamespace {
  export interface ICaptionedGifCss {
    Caption: string;
    Title: string;
    caption: string;
    title: string;
  }
}

declare const CaptionedGifCssModule: CaptionedGifCssNamespace.ICaptionedGifCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CaptionedGifCssNamespace.ICaptionedGifCss;
};

export = CaptionedGifCssModule;
