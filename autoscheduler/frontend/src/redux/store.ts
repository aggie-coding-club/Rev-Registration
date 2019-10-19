import { createStore } from 'redux';
import autoSchedulerApp from './reducers';

const store = createStore(autoSchedulerApp);

export default store;
