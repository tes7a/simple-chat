import {
  call, put, takeEvery,
} from 'redux-saga/effects';
import {
  authQuickBLox,
  type UsersListType,
  type ResponseCreateSessionType,
  type ResponseLoginType,
  type ErrorType,
} from '../../api';
import { type AppRootStateType } from '../../store';
import { joinToChat } from './chat-reducers';

export const getProject = (state: AppRootStateType) => state;

const initialState: InitialStateType = {
  session: null,
  user: null,
  authStatus: false,
  usersList: null,
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType,
): InitialStateType => {
  switch (action.type) {
    case 'AUTH/GET-SESSION-DATA-ACTION':
      return { ...state, session: action.data };
    case 'AUTH/GET-USER-DATA-ACTION':
      return { ...state, user: action.data };
    case 'AUTH/AUTH-STATUS-ACTION':
      return { ...state, authStatus: action.value };
    case 'AUTH/USERS-LIST-ACTION':
      return { ...state, usersList: action.data };
    default:
      return { ...state };
  }
};

export const initializedAC = () => ({ type: 'AUTH/INIT-ACTION' });
export const sessionCreateAC = (login: string, password: string) => ({ type: 'AUTH/SESSION-CREATE-ACTION', login, password });
const getSessionDataAC = (data: ResponseCreateSessionType) => ({ type: 'AUTH/GET-SESSION-DATA-ACTION', data } as const);
const getUserDataAC = (data: ResponseLoginType) => ({ type: 'AUTH/GET-USER-DATA-ACTION', data } as const);
const setAuthStatusAC = (value: boolean) => ({ type: 'AUTH/AUTH-STATUS-ACTION', value } as const);
const setUsersListAC = (data: UsersListType) => ({ type: 'AUTH/USERS-LIST-ACTION', data } as const);

function* initSetup() {
  yield call(authQuickBLox.init);
}

function* createSession(action: ReturnType<typeof sessionCreateAC>) {
  const { login, password } = action;

  const params = {
    filter: {
      field: 'created_at',
      param: 'between',
      value: '2021-01-01, 2025-01-01',
    },
    order: {
      field: 'created_at',
      sort: 'asc',
    },
    page: 1,
    per_page: 50,
  };

  try {
    const sessionData:
    ResponseCreateSessionType = yield call(authQuickBLox.createSession, login, password);
    const userData:
    ResponseLoginType = yield call(authQuickBLox.login, login, password);
    const usersList: UsersListType = yield call(authQuickBLox.getListUsers, params);

    yield joinToChat(sessionData.user_id, sessionData.token);

    yield put(getSessionDataAC(sessionData));
    yield put(setUsersListAC(usersList));
    yield put(getUserDataAC(userData));
    yield put(setAuthStatusAC(true));
  } catch (error) {
    const err = error as ErrorType;
    alert(err.detail[0]);
  }
}

export function* authWatcher() {
  yield takeEvery('AUTH/INIT-ACTION', initSetup);
  yield takeEvery('AUTH/SESSION-CREATE-ACTION', createSession);
}

interface InitialStateType {
  session: null | ResponseCreateSessionType
  user: null | ResponseLoginType
  authStatus: boolean
  usersList: null | UsersListType
}

type ActionsType =
  | ReturnType<typeof getSessionDataAC>
  | ReturnType<typeof getUserDataAC>
  | ReturnType<typeof setAuthStatusAC>
  | ReturnType<typeof setUsersListAC>;
