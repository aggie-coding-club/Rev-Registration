import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './CaptionedGif.css';

interface CaptionedGifProps {
  gifAddress: string;
  trackAddress: string;
  subtitleText: string;
}

const CaptionedGif: React.FC<React.PropsWithChildren<CaptionedGifProps>> = ({
  gifAddress, trackAddress, subtitleText, children,
}) => {
  const gif: JSX.Element = (
    <div>
      <video controls>
        <source src={`${gifAddress}`} type="video/webm" />
        <track src={`${trackAddress}`} kind="captions" />
        <track src={`${trackAddress}`} kind="subtitles" />
      </video>
    </div>
  );

  const subtitle: JSX.Element = (
    <div className={styles.subtitle}>
      <Typography variant="subtitle2">
        {subtitleText}
      </Typography>
    </div>
  );

  const caption: JSX.Element = (
    <div className={styles.Caption}>
      { children }
    </div>
  );

  return (
    <div>
      {gif}
      {subtitle}
      {caption}
    </div>
  );
};

export default CaptionedGif;
