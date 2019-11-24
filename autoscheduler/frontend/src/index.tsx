/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { createStore, StoreEnhancer } from 'redux';
import { Provider } from 'react-redux';
import autoSchedulerReducer from './redux/reducers';
import App from './components/App/App';

// DEBUG
interface MyWindow {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer;
}
// when converting to production, remove this interface, the second argument
// to createStore, and the ESLint overrides at the top

// initialize Redux store
const store = createStore(autoSchedulerReducer,
  (window as MyWindow & Window & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION__
  && (window as MyWindow & Window & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION__());

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
