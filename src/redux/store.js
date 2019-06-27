import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

const loggerMiddleware = createLogger({
    collapsed: true
});

const store = createStore(
    reducer,
    composeWithDevTools(),
    applyMiddleware(
        loggerMiddleware,
        thunkMiddleware
    )
);

export default store;