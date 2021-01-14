declare namespace AboutCssNamespace {
  export interface IAboutCss {
    "contributors-row": string;
    contributorsRow: string;
    "dialog-content": string;
    "dialog-link": string;
    "dialog-title": string;
    dialogContent: string;
    dialogLink: string;
    dialogTitle: string;
    "override-icon-button": string;
    overrideIconButton: string;
    "social-icons": string;
    socialIcons: string;
    title: string;
  }
}

declare const AboutCssModule: AboutCssNamespace.IAboutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AboutCssNamespace.IAboutCss;
};

export = AboutCssModule;
