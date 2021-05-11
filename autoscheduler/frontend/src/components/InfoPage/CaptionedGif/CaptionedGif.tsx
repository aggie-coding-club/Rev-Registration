import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './CaptionedGif.css';

interface CaptionedGifProps {
  titleText: string;
  gifAddress: string;
  trackAddress: string;
  subtitleText: string;
}

const CaptionedGif: React.FC<React.PropsWithChildren<CaptionedGifProps>> = ({
  titleText, gifAddress, trackAddress, subtitleText, children,
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
      <video controls>
        <source src={`${gifAddress}`} type="video/webm" />
        <track src={`${trackAddress}`} kind="captions" default />
        <track src={`${trackAddress}`} kind="subtitles" />
      </video>
    </div>
  );

  const subtitle: JSX.Element = (
    <div className={styles.subtitle}>
      <Typography variant="subtitle2">
        &lsquo;&lsquo;
        {subtitleText}
        &rsquo;&rsquo;
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
      {title}
      {gif}
      {subtitle}
      {caption}
      <br />
    </div>
  );
};

export default CaptionedGif;