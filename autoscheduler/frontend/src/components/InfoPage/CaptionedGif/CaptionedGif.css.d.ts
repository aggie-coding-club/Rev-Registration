declare namespace CaptionedGifCssNamespace {
  export interface ICaptionedGifCss {
    Caption: string;
    caption: string;
    subtitle: string;
  }
}

declare const CaptionedGifCssModule: CaptionedGifCssNamespace.ICaptionedGifCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CaptionedGifCssNamespace.ICaptionedGifCss;
};

export = CaptionedGifCssModule;
