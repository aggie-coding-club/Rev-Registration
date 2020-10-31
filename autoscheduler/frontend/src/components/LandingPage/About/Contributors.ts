import { ThemeProvider } from "@material-ui/core";

export class Contributor {
    name: string;
    position: string | null; // if it's null, default to "contributor"? just an idea
    githubLink: string | null;
    linkedInLink: string | null;
    constructor(src:{name: string, position: string, githubLink: string, linkedInLink: string}) { 
      Object.assign(this,src);
    }
  }