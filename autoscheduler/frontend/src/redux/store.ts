/**
 * This file will export a Redux store, which will hold all of the state-wide
 * data for the app. It will manage the state using the reducers defined in
 * reducers.ts
 */
import { createStore } from 'redux';
import autoSchedulerReducer from './reducers';

const store = createStore(autoSchedulerReducer);
export default store;
