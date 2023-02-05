import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import {
  authReducer, authWatcher, chatReducer, chatWatcher,
} from '../bll';

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* rootWatcher() {
  yield all([
    authWatcher(),
    chatWatcher(),
  ]);
}

sagaMiddleware.run(rootWatcher);

export type AppRootStateType = ReturnType<typeof rootReducer>;

// @ts-expect-error
window.store = store;
