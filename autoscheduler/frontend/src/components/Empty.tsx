import * as React from 'react';

interface EmptyProps {
    path: string;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const Empty: React.FC<EmptyProps> = (props: EmptyProps) => <div>Oi, put stuff here.</div>;

export default Empty;
