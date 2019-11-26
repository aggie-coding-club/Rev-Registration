declare namespace EmptyCssModule {
  export interface IEmptyCss {
    empty: string;
  }
}

declare const EmptyCssModule: EmptyCssModule.IEmptyCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EmptyCssModule.IEmptyCss;
};

export = EmptyCssModule;
