import React, {
  type KeyboardEvent, useCallback, useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  type TakeMessageRealTimeType,
  type ResponseDialogsTypes,
  type ResponseLoginType,
  type ResponseListMessage,
  type UsersListType,
} from '../../api';
import { getListMessagesAC, sendMessageAC } from '../../bll/reducers/chat-reducers';
import { type AppRootStateType } from '../../store';
import attention from '../../common/img/Vector.svg';
import '../../common/fonts/style.scss';
import s from './Chat.module.scss';
import { ChatWindow } from './chat-window/ChatWindow';
import avatar from '../../common/img/Ellipse.svg';

export const Chat = React.memo(() => {
  const authStatus = useSelector<AppRootStateType, boolean>((state) => state.auth.authStatus);

  const dialog = useSelector<AppRootStateType,
  ResponseDialogsTypes | null>((state) => state.chat.dialog);

  const user = useSelector<AppRootStateType,
  ResponseLoginType | null>((state) => state.auth.user);

  const usersList = useSelector<AppRootStateType,
  UsersListType | null>((state) => state.auth.usersList);

  const message = useSelector<AppRootStateType,
  TakeMessageRealTimeType | null>((state) => state.chat.message);

  const messagesList = useSelector<AppRootStateType,
  ResponseListMessage | null>((state) => state.chat.listMessages);

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(20);

  const writeMessage = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      dispatch(sendMessageAC(e.currentTarget.value));
      e.currentTarget.value = '';
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getListMessagesAC(dialog?.items[0]._id!, quantity));
  }, [dispatch, message, quantity]);

  if (!authStatus) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper__header}>
        <div className={s.wrapper__header_user}>
          <img src={avatar} alt="avatar" />
          <h3>{user?.full_name}</h3>
        </div>
        <img src={attention} alt="alert" />
      </div>
      <div className={s.wrapper__banner}>
        <div className={s.wrapper__banner_info}>
          <span>
            {dialog?.items[0].unread_messages_count}
            {' '}
            new Message
          </span>
          <span className={`${s.wrapper__banner_img} _icon-arrow`} />
        </div>
      </div>
      <ChatWindow
        userId={user?.id}
        messages={messagesList?.items}
        users={usersList?.items}
        setQuantity={setQuantity}
      />
      <div className={s.wrapper__input_block}>
        <span className={`${s.wrapper__clip_img} _icon-clip`} />
        <input onKeyDown={writeMessage} className={s.wrapper__input_message} placeholder="Type Message" type="text" />
        <span className={`${s.wrapper__mic_img} _icon-mic`} />
      </div>
    </div>
  );
});
