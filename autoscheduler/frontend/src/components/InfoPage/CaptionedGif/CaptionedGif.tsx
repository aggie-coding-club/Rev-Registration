import * as React from 'react';
import { Typography } from '@material-ui/core';

interface CaptionedGifProps {
  titleText: string;
  gifAddress: string;
}

const CaptionedGif: React.FC<React.PropsWithChildren<CaptionedGifProps>> = ({
  titleText, gifAddress, children,
}) => {
  const title: JSX.Element = (
    <Typography variant="h5">
      {titleText}
    </Typography>
  );

  const gif: JSX.Element = (
    <Typography variant="h5">
      <img
        src={`${gifAddress}`}
        alt=""
        style={{
          width: 30 * 16,
          height: 30 * 9,
          paddingRight: 4,
          marginLeft: 40,
          marginRight: 40,
        }}
      />
    </Typography>
  );

  const caption: JSX.Element = (
    <>
      { children }
    </>
  );

  return (
    <div>
      {title}
      {gif}
      {caption}
      <br />
    </div>
  );
};

export default CaptionedGif;
