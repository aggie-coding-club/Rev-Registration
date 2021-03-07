/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  createStore, StoreEnhancer, applyMiddleware, compose,
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from './redux/reducer';
import App from './components/App/App';

// Allow use of thunks in Redux store
let storeEnhancer: StoreEnhancer = applyMiddleware(thunk);

// Use Redux DevTools only in development environments
interface MyWindow {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (arg: StoreEnhancer) => StoreEnhancer;
}

if (!IS_PRODUCTION) {
  const composeEnhancer = (window as MyWindow & Window
    & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  storeEnhancer = composeEnhancer(storeEnhancer);
}

// Create store with the proper enhancers applied
const store = createStore(autoSchedulerReducer, storeEnhancer);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
