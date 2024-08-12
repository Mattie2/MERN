import {configureStore} from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './reducers';

const initialState = {};

const store = configureStore({
    reducer: rootReducer,
    devTools: composeWithDevTools,
    preloadedState: initialState
})

export default store;