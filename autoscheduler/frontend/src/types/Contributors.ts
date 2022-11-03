/**
 * Represents a Contributor to the project. Only used in our About section where we show
 * who all works on the project.
 */
export interface Contributor {
  name: string;
  position: string;
  githubURL: string;
  linkedInURL?: string;
}

export const contributors: Contributor[] = [
  {
    name: 'Gannon Prudhomme',
    position: 'Co-Manager',
    githubURL: 'https://github.com/gannonprudhomme',
    linkedInURL: 'https://linkedin.com/in/gannon-prudhomme',
  },
  {
    name: 'Rachel Conn',
    position: 'Co-Manager',
    githubURL: 'https://github.com/rachelconn',
  },
  {
    name: 'Adel Hassan',
    position: 'Frontend Wizard',
    githubURL: 'https://github.com/firejake308',
  },
  {
    name: 'Carlos Alvarez del Castillo Saleh',
    position: 'Contributor',
    githubURL: 'https://github.com/ThatJuanGuy',
    linkedInURL: 'https://www.linkedin.com/in/carlosadelcs/',
  },
  {
    name: 'Troy Lee',
    position: 'Contributor',
    githubURL: 'https://github.com/eelyort',
    linkedInURL: 'https://www.linkedin.com/in/troylee3006/',
  },
];

export const pastContributors: Contributor[] = [
  {
    name: 'Christopher McGregor',
    position: 'Contributor',
    githubURL: 'https://github.com/f4alt',
  },
  {
    name: 'Brandon Gathright',
    position: 'Contributor',
    githubURL: 'https://github.com/btgathright',
  },
  {
    name: 'Shaham Noorani',
    position: 'Contributor',
    githubURL: 'https://github.com/shaham-noorani',
  },
  {
    name: 'Ajay Ramsunder',
    position: 'Contributor',
    githubURL: 'https://github.com/ajayramsunder',
    linkedInURL: 'https://www.linkedin.com/in/ajay-ramsunder-19066a18a/',
  },
];
