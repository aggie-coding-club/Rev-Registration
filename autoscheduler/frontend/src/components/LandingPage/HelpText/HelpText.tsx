import * as React from 'react';
import LargeTextCard from '../../LargeTextCard/LargeTextCard';

const HelpText: React.FC = () => (
  <LargeTextCard
    title="Welcome to Rev Registration!"
  >
    <div style={{
      gap: 50,
    }}
    >
      <p>
        Rev Registration is an automatic class scheduler for Texas A&amp;M. Simply select a term,
        pick your courses, mark off when you&apos;re not available, we&apos;ll generate schedules
        for you!
      </p>
      <p>
        This site is currently a work-in-progress, so if you run into any bugs or have any
        suggestions, feel free to file an issue on&nbsp;
        <a href="https://github.com/aggie-coding-club/Rev-Registration/issues/new">our GitHub</a>
        , or by sending us an email at:&nbsp;
        <a href="mailto:register.rev@gmail.com">register.rev@gmail.com</a>
      </p>
    </div>
  </LargeTextCard>
);

export default HelpText;
