import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';

// eslint-disable-next-line no-console
store.subscribe(() => console.log(store.getState()));

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
