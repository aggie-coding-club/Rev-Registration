import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
