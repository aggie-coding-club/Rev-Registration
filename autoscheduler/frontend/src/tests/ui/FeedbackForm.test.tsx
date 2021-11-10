import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import {
  render, fireEvent, act,
} from '@testing-library/react';
import * as React from 'react';
import FeedbackForm, { FEEDBACK_DIALOG_TITLE } from '../../components/NavBar/FeedbackForm/FeedbackForm';

describe('Feedback Form', async () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('is initially closed', () => {
    // arrange
    const { queryByText } = render(
      <FeedbackForm />,
    );

    // act
    const feedbackDialog = queryByText(FEEDBACK_DIALOG_TITLE);

    // assert
    expect(feedbackDialog).not.toBeInTheDocument();
  });

  test('opens when clicked', async () => {
    // arrange
    const { getByLabelText, findByText } = render(
      <FeedbackForm />,
    );

    // act
    fireEvent.click(getByLabelText(FEEDBACK_DIALOG_TITLE));
    const feedbackDialog = await findByText(FEEDBACK_DIALOG_TITLE);

    // assert
    expect(feedbackDialog).toBeInTheDocument();
  });

  describe('sends feedback', async () => {
    test('when filled with only a rating', async () => {
      // arrange
      // Mock feedback/submit
      fetchMock.mockResponseOnce('');
      const {
        findByLabelText, getByLabelText, getByText,
      } = render(
        <FeedbackForm />,
      );
      const rating = 5;

      // act
      fireEvent.click(getByLabelText(FEEDBACK_DIALOG_TITLE));
      await act(async () => { fireEvent.click(await findByLabelText(`Rating: ${rating}`)); });
      await act(async () => { fireEvent.click(getByText('Submit')); });

      // assert
      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock).toBeCalledWith('feedback/submit', expect.any(Object));
      expect(JSON.parse(fetchMock.mock.calls[0][1].body.toString())).toMatchObject({
        rating,
      });
    });

    test('when filled with a rating and comment', async () => {
      // arrange
      const {
        findByLabelText, getByLabelText, getByText,
      } = render(
        <FeedbackForm />,
      );
      const rating = 1;
      const comment = 'too much water';

      // act
      fireEvent.click(getByLabelText(FEEDBACK_DIALOG_TITLE));
      await act(async () => { fireEvent.click(await findByLabelText(`Rating: ${rating}`)); });
      const commentInput = getByLabelText('Feedback comment');
      await act(async () => { fireEvent.change(commentInput, { target: { value: comment } }); });
      await act(async () => { fireEvent.click(getByText('Submit')); });

      // assert
      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock).toBeCalledWith('feedback/submit', expect.any(Object));
      expect(JSON.parse(fetchMock.mock.calls[0][1].body.toString())).toMatchObject({
        rating,
        comment,
      });
    });
  });
});
