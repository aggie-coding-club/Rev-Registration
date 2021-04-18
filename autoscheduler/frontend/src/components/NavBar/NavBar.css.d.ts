declare namespace NavBarCssNamespace {
  export interface INavBarCss {
    "logout-container": string;
    logoutContainer: string;
    "user-name": string;
    userName: string;
  }
}

declare const NavBarCssModule: NavBarCssNamespace.INavBarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavBarCssNamespace.INavBarCss;
};

export = NavBarCssModule;
