/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import {
  render, fireEvent, act, waitForElement,
} from '@testing-library/react';
import 'isomorphic-fetch';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CourseSelectCard from '../components/CourseSelectCard/CourseSelectCard';
import autoSchedulerReducer from '../redux/reducers';

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

const createStore = configureMockStore([thunk]);

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
  const store = createStore(autoSchedulerReducer(undefined, { type: null }));
  const { getByText, getByLabelText } = render(
    <Provider store={store}><CourseSelectCard id={0} /></Provider>,
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
  const checked1 = await waitForElement(
    () => document.getElementsByClassName('Mui-checked').length,
  );
  // count how many boxes are checked


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
