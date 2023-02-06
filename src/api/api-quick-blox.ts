import Credentials from './application-credentials';

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-var
var QB = require('quickblox/quickblox.min');

export const authQuickBLox = {
  async init() {
    return new Promise(() => {
      QB.init(
        Credentials.APPLICATION_ID,
        Credentials.AUTH_KEY,
        Credentials.AUTH_SECRET,
        Credentials.ACCOUNT_KEY,
      );
    });
  },
  async createSession(login: string, password: string) {
    return new Promise((resolve, reject) => {
      QB.createSession({ login, password }, (err: ErrorType, res: ResponseCreateSessionType) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  async login(login: string, password: string) {
    return new Promise((resolve, reject) => {
      QB.login({ login, password }, (err: ErrorType, res: ResponseLoginType) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  async getListUsers(params: ParamsGetListUsers) {
    return new Promise((resolve, reject) => {
      QB.users.listUsers(params, (err: ErrorType, res: UsersListType) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
};

export const dialogQuickBlox = {
  async chatConnect(userId: number, password: string) {
    return new Promise((resolve, reject) => {
      QB.chat.connect({ userId, password }, (err: ErrorType, res: {}) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  async joinDialog(id: string) {
    return new Promise((resolve, reject) => {
      QB.chat.muc.join(id, (err: ErrorType, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  async getDialogsList(filters: FilterType) {
    return new Promise((resolve, reject) => {
      QB.chat.dialog.list(filters, (err: ErrorType, res: ResponseDialogsTypes) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  sendMessage(id: string, message: SendMessageType) {
    return QB.chat.send(id, message);
  },
  async getMessageRealTime() {
    return new Promise((resolve) => {
      QB.chat.onMessageListener = function (userId: number, message: TakeMessageRealTimeType) {
        const messageObj = {
          userId,
          message,
        };
        resolve(messageObj);
      };
    });
  },
  async getListMessages(params: ParamsGetListMessages) {
    return new Promise((resolve, reject) => {
      QB.chat.message.list(params, (err: ErrorType, res: ResponseListMessage) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
};

export interface ErrorType {
  code: number
  detail: string[]
  message: {
    errors: string[]
  }
  status: string
}

export interface ResponseCreateSessionType {
  application_id: number
  created_at: string
  id: number
  nonce: string
  token: string
  ts: number
  updated_at: string
  user_id: number
  _id: string
}

export interface ResponseDialogsTypes {
  items: ItemsType[]
  limit: number
  skip: number
  total_entries: number
}

export interface ResponseLoginType {
  age_over16: boolean
  blob_id: number
  created_at: string
  custom_data: null
  email: string
  external_user_id: number
  facebook_id: number
  full_name: string
  id: number
  last_request_at: string
  login: string
  parents_contacts: string
  phone: string
  twitter_id: number
  updated_at: string
  user_tags: string
  website: string
}
export interface FilterType {
  created_at: {
    lt: number
  }
  sort_desc: string
  limit: number
}

export interface TakeMessageRealTimeType {
  body: string
  delay: null
  dialog_id: string
  extension: {
    date_sent: string
    dialog_id: string
    message_id: string
    save_to_history: string
  }
  id: string
  markable: number
  recipient_id: null
  type: string
}

export interface ResponseListMessage {
  items: ItemMessage[]
  limit: number
  skip: number
}

export interface UsersListType {
  current_page: number
  items: Array<{
    user: ResponseLoginType
  }>
  per_page: number
  total_entries: number
}

interface SendMessageType {
  type: string
  body: string
  extension: {
    save_to_history: number
    dialog_id: string | undefined
  }
  markable: number
}

interface ItemsType {
  created_at: string
  last_message: null
  last_message_date_sent: null
  last_message_id: null
  last_message_user_id: null
  name: string
  occupants_ids: number[]
  photo: string
  type: number
  unread_messages_count: number
  updated_at: string
  user_id: number
  xmpp_room_jid: string
  _id: string
}

interface ParamsGetListMessages {
  chat_dialog_id: string
  sort_desc: string
  limit: number
  skip: number
}

interface ParamsGetListUsers {
  filter: {
    field: string
    param: string
    value: string
  }
  order: {
    field: string
    sort: string
  }
  page: number
  per_page: number
}

export interface ItemMessage {
  all_read: boolean
  attachments: []
  chat_dialog_id: string
  created_at: string
  date_sent: number
  delivered_ids: number[]
  message: string
  read: number
  read_ids: number[]
  recipient_id: number
  sender_id: number
  updated_at: string
  _id: string
}
