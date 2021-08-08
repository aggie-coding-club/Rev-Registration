import * as React from 'react';
import { Button } from '@material-ui/core';
import * as styles from '../FeedbackForm.css';

const RATINGS = [1, 2, 3, 4, 5];

interface RatingProps {
  initialValue?: number;
  onChange: (rating: number) => any;
}

const Rating: React.FC<RatingProps> = ({ initialValue = 0, onChange }) => {
  const [rating, setRating] = React.useState(initialValue);

  const handleClick = (newRating: number): void => {
    setRating(newRating);
    onChange(newRating);
  };

  const ratingButtons = RATINGS.map((x) => {
    const variant = rating === x ? 'contained' : 'outlined';
    const buttonStyle: React.CSSProperties = {
      minWidth: 0,
      width: '32px',
    };

    return (
      <Button
        style={buttonStyle}
        color="primary"
        variant={variant}
        onClick={(): void => handleClick(x)}
        aria-label={`Rating: ${x}`}
        key={x}
      >
        {x}
      </Button>
    );
  });

  return (
    <div className={styles.ratingContainer}>
      {ratingButtons}
    </div>
  );
};

export default Rating;
