/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import {
  render, fireEvent, act, waitForElement,
} from '@testing-library/react';
import 'isomorphic-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import CourseSelectCard from '../components/CourseSelectColumn/CourseSelectCard/CourseSelectCard';
import autoSchedulerReducer from '../redux/reducer';

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

test('Remembers state after collapse', async () => {
  // arrange
  const nodeProps = Object.create(Node.prototype, {});
  // @ts-ignore
  document.createRange = (): Range => ({
    setStart: (): void => {},
    setEnd: (): void => {},
    commonAncestorContainer: {
      ...nodeProps,
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
  const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
  const { getByText, getByLabelText } = render(
    <Provider store={store}><CourseSelectCard id={0} onRemove={(): void => {}} /></Provider>,
  );

  // fill in course
  act(() => { fireEvent.click(getByLabelText('Course')); });
  act(() => { fireEvent.click(getByText('CSCE 121')); });
  // switch to section view
  act(() => { fireEvent.click(getByText('Section')); });
  // select one of the checkboxes
  const sectionView = await waitForElement(() => getByText(
    (content, element) => ignoreInvisible(content, element, '501'),
  ));
  act(() => { fireEvent.click(sectionView); });
  // count how many boxes are checked
  const checked1 = await waitForElement(
    () => document.getElementsByClassName('Mui-checked').length,
  );

  // collapse and re-open card
  act(() => { fireEvent.click(getByText('Collapse')); });
  act(() => { fireEvent.click(getByLabelText('Expand')); });

  // wait until the card is showing section options, then count checked
  await waitForElement(() => getByText(
    (content, element) => ignoreInvisible(content, element, '501'),
  ));
  const checked2 = document.getElementsByClassName('Mui-checked').length;

  // assert
  // checks that document queries are working
  expect(checked1).toEqual(1);
  // checks that the card remembers how many elements were checked
  expect(checked2).toEqual(checked1);
});

test('Changes sections in response to changing course', async () => {
  // arrange
  const nodeProps = Object.create(Node.prototype, {});
  // @ts-ignore
  document.createRange = (): Range => ({
    setStart: (): void => {},
    setEnd: (): void => {},
    commonAncestorContainer: {
      ...nodeProps,
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
  const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
  const {
    getByText, getByLabelText, getAllByText,
  } = render(
    <Provider store={store}><CourseSelectCard id={0} onRemove={(): void => {}} /></Provider>,
  );

  /* ACT */
  // fill in course
  const courseEntry = getByLabelText('Course') as HTMLInputElement;
  act(() => { fireEvent.click(courseEntry); });
  act(() => { fireEvent.click(getByText('CSCE 121')); });
  // switch to section view
  act(() => { fireEvent.click(getByText('Section')); });
  const course1Sections = (await waitForElement(() => getAllByText(/50\d/))).length;

  // change course and read sections again
  act(() => { fireEvent.change(courseEntry, { target: { value: 'MATH 15' } }); });
  act(() => { fireEvent.click(getByText('MATH 151')); });
  const course2Sections = (await waitForElement(() => getAllByText(/51\d/))).length;

  // assert
  expect(course1Sections).not.toEqual(0);
  expect(course2Sections).not.toEqual(0);
  expect(course1Sections).not.toEqual(course2Sections);
});
