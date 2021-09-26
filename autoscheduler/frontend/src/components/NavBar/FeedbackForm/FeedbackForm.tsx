import * as React from 'react';
import { Chat } from '@material-ui/icons';
import {
  Button, IconButton, TextField, Tooltip,
  Typography,
} from '@material-ui/core';
import * as Cookies from 'js-cookie';
import SmallFastProgress from '../../SmallFastProgress';
import GenericSnackbar from '../../GenericSnackbar';
import * as styles from './FeedbackForm.css';
import Rating from './Rating/Rating';
import DialogWithClose from '../../DialogWithClose/DialogWithClose';

export const FEEDBACK_DIALOG_TITLE = 'Submit Feedback';
const NO_FEEDBACK_MESSAGE = 'Please enter a rating before submitting feedback.';
const SUBMIT_SUCCESSFUL_MESSAGE = 'Your feedback has been submitted. Thank you for letting us know what you think about Rev Registration!';
const SUBMIT_FAILURE_MESSAGE = 'There was an error submitting your feedback. Please try again.';
const MAX_COMMENT_LENGTH = 2000;

const FeedbackForm: React.FC = () => {
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

  const handleRatingChange = (newRating: number): void => {
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

  const dialogContent = (
    <div className={styles.feedbackDialogContent}>
      <Typography>
        How would you rate the website overall?
      </Typography>
      <div className={styles.rating}>
        <Rating
          initialValue={rating}
          onChange={handleRatingChange}
        />
      </div>
      <TextField
        className={styles.commentText}
        defaultValue={comment}
        multiline
        rowsMax={8}
        variant="outlined"
        placeholder="Would you like to elaborate on your rating?"
        inputProps={{ 'aria-label': 'Feedback comment' }}
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
  );

  return (
    <>
      <Tooltip title="Submit Feedback" placement="bottom">
        <IconButton onClick={handleFormButtonClick} aria-label={FEEDBACK_DIALOG_TITLE}>
          <Chat htmlColor="#ffffff" />
        </IconButton>
      </Tooltip>
      <DialogWithClose title={FEEDBACK_DIALOG_TITLE} open={formOpen} onClose={handleDialogClose}>
        {dialogContent}
      </DialogWithClose>
      <GenericSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
    </>
  );
};

export default FeedbackForm;
