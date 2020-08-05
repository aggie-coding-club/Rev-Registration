import * as React from 'react';
import LargeTextCard from '../../LargeTextCard/LargeTextCard';

const bodyText = `
Somebody once told me the world is gonna roll me
I ain't the sharpest tool in the shed
She was looking kind of dumb with her finger and her thumb
In the shape of an "L" on her forehead
Well the years start coming and they don't stop coming
Fed to the rules and I hit the ground running
Somebody once told me the world is gonna roll me
I ain't the sharpest tool in the shed
She was looking kind of dumb with her finger and her thumb
In the shape of an "L" on her forehead
Well the years start coming and they don't stop coming
Fed to the rules and I hit the ground running`;

const HelpText: React.SFC = () => (
  <LargeTextCard
    title="Guidelines"
    body={bodyText}
  />
);

export default HelpText;
