declare namespace GenericCardCssModule {
  export interface IGenericCardCss {
    container: string;
    header: string;
  }
}

declare const GenericCardCssModule: GenericCardCssModule.IGenericCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenericCardCssModule.IGenericCardCss;
};

export = GenericCardCssModule;
