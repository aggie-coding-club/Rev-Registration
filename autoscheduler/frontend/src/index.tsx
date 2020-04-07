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

// DEBUG
interface MyWindow {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (arg: StoreEnhancer) => StoreEnhancer;
}
// when converting to production, remove this interface, the second argument
// to createStore, and the ESLint overrides at the top

// these lines allow us to use Redux DevTools for debugging
const composeEnhancer = (window as MyWindow & Window
  & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// initialize Redux store with thunk
const store = createStore(autoSchedulerReducer,
  composeEnhancer(applyMiddleware(thunk)));

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
