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
        Simply select a term, pick your courses, mark off when you&apos;re not available, we&apos;ll
        generate schedules for you!
      </p>
      <p>
        Rev Registration is currently a work-in-progress, so please mind any bugs or mishaps that
        may occur. Bug reports can be filed as an issue on&nbsp;
        <a href="github">our GitHub</a>
        ,or by sending us an email.
      </p>
      <p>
        We&apos;d love to hear your feedback at our email:&nbsp;
        <a href="mailto:register.rev@gmail.com">register.rev@gmail.com</a>
      </p>
    </div>
  </LargeTextCard>
);

export default HelpText;
