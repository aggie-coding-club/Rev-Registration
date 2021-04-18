import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './CaptionedGif.css';

interface CaptionedGifProps {
  titleText: string;
  gifAddress: string;
}

const CaptionedGif: React.FC<React.PropsWithChildren<CaptionedGifProps>> = ({
  titleText, gifAddress, children,
}) => {
  const title: JSX.Element = (
    <div className={styles.Title}>
      <Typography variant="h5">
        {titleText}
      </Typography>
    </div>
  );

  const gif: JSX.Element = (
    <div>
      <video autoPlay controls>
        <source src={`${gifAddress}`} type="video/webm" />
        <track src="CaptionPlaceholder.vtt" />
      </video>
    </div>
  );

  const caption: JSX.Element = (
    <div className={styles.Caption}>
      { children }
    </div>
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
