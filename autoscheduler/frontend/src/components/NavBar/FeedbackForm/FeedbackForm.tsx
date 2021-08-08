import * as React from 'react';
import { Chat } from '@material-ui/icons';
import {
  Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, TextField, Tooltip,
  Typography, useTheme,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import * as Cookies from 'js-cookie';
import SmallFastProgress from '../../SmallFastProgress';
import GenericSnackbar from '../../GenericSnackbar';
import * as styles from './FeedbackForm.css';

const useStyles = makeStyles((theme) => ({
  iconFilled: { color: theme.palette.primary.main },
}));

const NO_FEEDBACK_MESSAGE = 'Please enter a rating before submitting feedback.';
const SUBMIT_SUCCESSFUL_MESSAGE = 'Your feedback has been submitted. Thank you for letting us know what you think about Rev Registration!';
const SUBMIT_FAILURE_MESSAGE = 'There was an error submitting your feedback. Please try again.';
const MAX_COMMENT_LENGTH = 2000;

const FeedbackForm: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [formOpen, setFormOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const hasRating = Boolean(rating);
  const commentUnderCharacterLimit = comment.length <= MAX_COMMENT_LENGTH;
  const canSubmit = hasRating && commentUnderCharacterLimit;

  const handleFormButtonClick = (): void => {
    setFormOpen(true);
  };

  const closeForm = (reset = false): void => {
    setFormOpen(false);
    if (reset) {
      setRating(0);
      setComment('');
      setLoading(false);
    }
  };

  const handleDialogClose = (): void => {
    closeForm();
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
      closeForm(true);
    }).catch(() => {
      setSnackbarMessage(SUBMIT_FAILURE_MESSAGE);
      setLoading(false);
    });
  };

  const commentErrorText = commentUnderCharacterLimit ? undefined : (
    <Typography color="error" variant="caption">
      Your comment must fit within 2000 characters.
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
      <Tooltip title="Submit Feedback" placement="bottom">
        <IconButton onClick={handleFormButtonClick}>
          <Chat htmlColor="#ffffff" />
        </IconButton>
      </Tooltip>
      <Dialog open={formOpen} onClose={handleDialogClose} maxWidth="md">
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
            <TextField
              className={styles.commentText}
              defaultValue={comment}
              multiline
              rowsMax={8}
              variant="outlined"
              placeholder="Would you like to elaborate on your rating?"
              onChange={handleFeedbackChange}
            />
            <div className={styles.formSubmitContainer}>
              <div className={styles.errorTextContainer}>
                {commentErrorText}
              </div>
              <Tooltip title={hasRating ? '' : NO_FEEDBACK_MESSAGE} placement="top">
                <span>
                  <Button style={submitButtonStyle} color={submitButtonColor} disabled={!canSubmit} variant="contained" onClick={handleFormSubmit}>
                    {submitButtonContent}
                  </Button>
                </span>
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <GenericSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
    </>
  );
};

export default FeedbackForm;
