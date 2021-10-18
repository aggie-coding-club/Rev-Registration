declare namespace NavBarCssNamespace {
  export interface INavBarCss {
    "help-button": string;
    helpButton: string;
    "logout-container": string;
    logoutContainer: string;
    "right-navbar-container": string;
    rightNavbarContainer: string;
    "user-name": string;
    userName: string;
  }
}

declare const NavBarCssModule: NavBarCssNamespace.INavBarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavBarCssNamespace.INavBarCss;
};

export = NavBarCssModule;
