declare namespace GenericCardCssNamespace {
  export interface IGenericCardCss {
    container: string;
    header: string;
  }
}

declare const GenericCardCssModule: GenericCardCssNamespace.IGenericCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenericCardCssNamespace.IGenericCardCss;
};

export = GenericCardCssModule;
