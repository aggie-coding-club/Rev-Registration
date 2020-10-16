declare namespace NavBarSelectTermCssNamespace {
  export interface INavBarSelectTermCss {
    "button-container": string;
    buttonContainer: string;
    "menu-paper": string;
    menuPaper: string;
    "select-term-button": string;
    selectTermButton: string;
  }
}

declare const NavBarSelectTermCssModule: NavBarSelectTermCssNamespace.INavBarSelectTermCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavBarSelectTermCssNamespace.INavBarSelectTermCss;
};

export = NavBarSelectTermCssModule;
