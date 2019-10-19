import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';

// eslint-disable-next-line no-console
store.subscribe(() => console.log(store.getState()));

// INFO This function call finds the div with id="root" and pastes our app inside
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
