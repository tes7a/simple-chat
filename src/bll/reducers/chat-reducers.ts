import {
  call, put, select, takeEvery,
} from 'redux-saga/effects';
import {
  dialogQuickBlox,
  type TakeMessageRealTimeType,
  type ResponseDialogsTypes,
  type ResponseListMessage,
  type ErrorType,
} from '../../api';
import { type AppRootStateType } from '../../store';

export const getProject = (state: AppRootStateType) => state;

const initialState: InitialStateType = {
  dialog: null,
  message: null,
  listMessages: null,
};

export const chatReducer = (
  state: InitialStateType = initialState,
  action: ActionsType,
): InitialStateType => {
  switch (action.type) {
    case 'CHAT/DIALOG-DATA-ACTION':
      return { ...state, dialog: action.data };
    case 'CHAT/MESSAGE-REAL-TIME-ACTION':
      return { ...state, message: action.data };
    case 'CHAT/SET-LIST-MESSAGES-ACTION':
      return { ...state, listMessages: action.data };
    default:
      return { ...state };
  }
};

export const sendMessageAC = (text: string) => ({ type: 'CHAT/SEND-MESSAGE-ACTION', text });
export const getListMessagesAC = (id: string, quantity: number) => ({ type: 'CHAT/GET-LIST-MESSAGES-ACTION', id, quantity });
const setDialogDataAC = (data: ResponseDialogsTypes) => ({ type: 'CHAT/DIALOG-DATA-ACTION', data } as const);
const setMessageRealTimeAC = (data: TakeMessageRealTimeType) => ({ type: 'CHAT/MESSAGE-REAL-TIME-ACTION', data } as const);
const setListMessagesAC = (data: ResponseListMessage) => ({ type: 'CHAT/SET-LIST-MESSAGES-ACTION', data } as const);

export function* joinToChat(id: number, token: string) {
  const filters = {
    created_at: {
      lt: Date.now() / 1000,
    },
    sort_desc: 'created_at',
    limit: 10,
  };

  try {
    yield call(dialogQuickBlox.chatConnect, id, token);
    const dialogData: ResponseDialogsTypes = yield call(dialogQuickBlox.getDialogsList, filters);
    yield call(dialogQuickBlox.joinDialog, dialogData.items[0]._id);
    yield put(setDialogDataAC(dialogData));
  } catch (error) {
    const err = error as ErrorType;
    alert(err.detail[0]);
  }
}

function* getListMessages(action: ReturnType<typeof getListMessagesAC>) {
  const { id, quantity } = action;
  const params = {
    chat_dialog_id: id,
    sort_desc: 'date_sent',
    limit: quantity,
    skip: 0,
  };
  try {
    const listMessages: ResponseListMessage = yield call(dialogQuickBlox.getListMessages, params);
    yield put(setListMessagesAC(listMessages));
    const res: TakeMessageRealTimeType = yield call(dialogQuickBlox.getMessageRealTime);
    yield put(setMessageRealTimeAC(res));
  } catch (error) {
    const err = error as ErrorType;
    alert(err.detail[0]);
  }
}

function* sendMessage(action: ReturnType<typeof sendMessageAC>) {
  const state: AppRootStateType = yield select(getProject);

  const message = {
    type: 'groupchat',
    body: action.text,
    extension: {
      save_to_history: 1,
      dialog_id: state.chat.dialog?.items[0]._id,
    },
    markable: 1,
  };

  const jId = state.chat.dialog?.items[0].xmpp_room_jid ?? '';

  try {
    yield dialogQuickBlox.sendMessage(jId, message);
    const res: TakeMessageRealTimeType = yield call(dialogQuickBlox.getMessageRealTime);
    yield put(setMessageRealTimeAC(res));
  } catch (error) {
    const err = error as ErrorType;
    alert(err.detail[0]);
  }
}

export function* chatWatcher() {
  yield takeEvery('CHAT/SEND-MESSAGE-ACTION', sendMessage);
  yield takeEvery('CHAT/GET-LIST-MESSAGES-ACTION', getListMessages);
}

interface InitialStateType {
  dialog: null | ResponseDialogsTypes
  message: null | TakeMessageRealTimeType
  listMessages: null | ResponseListMessage
}

type ActionsType =
 | ReturnType<typeof setDialogDataAC>
 | ReturnType<typeof setListMessagesAC>
 | ReturnType<typeof setMessageRealTimeAC>;
