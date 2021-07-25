import * as React from 'react';
import { RateReview } from '@material-ui/icons';
import {
  Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, TextField, Typography,
  useTheme,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import * as Cookies from 'js-cookie';
import SmallFastProgress from '../../SmallFastProgress';
import GenericSnackbar from '../../GenericSnackbar';
import * as styles from './FeedbackForm.css';

const useStyles = makeStyles((theme) => ({
  iconFilled: { color: theme.palette.primary.main },
}));

const SUBMIT_SUCCESSFUL_MESSAGE = 'Your feedback has been submitted. Thank you for letting us know what you think about Rev Registration!';
const SUBMIT_FAILURE_MESSAGE = 'There was an error submitting your feedback. Please try again.';

const FeedbackForm: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [formOpen, setFormOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const canSubmit = Boolean(rating);

  const handleFormButtonClick = (): void => {
    setFormOpen(true);
  };

  // Reset state on close
  const handleFormClose = (): void => {
    setFormOpen(false);
    setRating(0);
    setComment('');
    setLoading(false);
  };

  const handleRatingChange = (_e: React.ChangeEvent, newRating: number): void => {
    setRating(newRating);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setComment(e.target.value);
  };

  const handleFormSubmit = (): void => {
    if (!canSubmit) return;

    setLoading(true);

    fetch('feedback/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify({ rating, comment }),
    }).then((resp) => {
      if (!resp.ok) throw new Error();
      setSnackbarMessage(SUBMIT_SUCCESSFUL_MESSAGE);
      handleFormClose();
    }).catch(() => {
      setSnackbarMessage(SUBMIT_FAILURE_MESSAGE);
      setLoading(false);
    });
  };

  const errorTextStyle: React.CSSProperties = canSubmit ? { visibility: 'hidden' } : {};
  const errorText = (
    <Typography style={errorTextStyle} className={styles.errorText} color="error" variant="caption">
      Please enter a rating before submitting feedback.
    </Typography>
  );

  // Make submit button a static size to avoid appearance changing depending on if it's loading
  const submitButtonStyle: React.CSSProperties = {
    width: '80px',
    height: '36.5px',
  };
  const submitButtonColor = loading ? undefined : 'primary';
  const submitButtonContent = loading ? <SmallFastProgress size="small" /> : 'Submit';

  return (
    <>
      <IconButton onClick={handleFormButtonClick}>
        <RateReview htmlColor="#ffffff" />
      </IconButton>
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="md">
        <DialogTitle>
          Submit Feedback
        </DialogTitle>
        <DialogContent>
          <div className={styles.feedbackDialogContent}>
            <Typography>
              How would you rate the website overall?
            </Typography>
            <Rating
              classes={{ iconFilled: classes.iconFilled }}
              className={styles.rating}
              name="rating"
              size="large"
              value={rating}
              onChange={handleRatingChange}
            />
            <Typography className={styles.commentText}>
              Is there any feedback you want to share with us?
            </Typography>
            <TextField multiline variant="outlined" label="Feedback" onChange={handleFeedbackChange} />
            <div className={styles.formSubmitContainer}>
              {errorText}
              <Button style={submitButtonStyle} color={submitButtonColor} disabled={!canSubmit} variant="contained" onClick={handleFormSubmit}>
                {submitButtonContent}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <GenericSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
    </>
  );
};

export default FeedbackForm;
