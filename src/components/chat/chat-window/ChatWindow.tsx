import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './ChatWindow.module.scss';
import avatar from '../../../common/img/Ellipse.svg';
import { type ResponseLoginType, type ItemMessage } from '../../../api/api-quick-blox';
import { getCorrectlyDay, getCorrectlyTime } from './helpers/date';

export const ChatWindow: React.FC<ChatWindowType> = React.memo(({
  userId, messages, setQuantity,
}) => {
  const fetchMoreData = () => {
    setTimeout(() => {
      // @ts-expect-error
      setQuantity((state: number) => state + 10);
    }, 1000);
  };

  const day = getCorrectlyDay(messages);

  return (
    <div className={s.wrapper__chat}>
      <div className={s.wrapper__chat_date_block}>
        <div className={s.wrapper__chat_date}>{day}</div>
      </div>
      <div id="scrollableDiv" className={s.wrapper__chat_scroll}>
        {messages
        && (
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreData}
          hasMore
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            overflow: 'hidden',
          }}
          inverse
          pullDownToRefresh
          refreshFunction={() => messages}
          scrollableTarget="scrollableDiv"
          loader={<h4>Loading...</h4>}
        >
          {messages.map((m) => (
            <div
              key={m._id}
              className={userId === m.sender_id
                ? s.wrapper__chat_message_block_mod
                : s.wrapper__chat_message_block}
            >
              <div className={s.wrapper__chat_message_wrapper}>
                {userId !== m.sender_id && <h4>Name</h4>}
                <div className={s.wrapper__chat_message}>
                  {userId === m.sender_id || <img src={avatar} alt="avatar" className={s.wrapper__chat_avatar} />}
                  {userId === m.sender_id && (
                  <div className={s.wrapper__message_time}>
                    <span>{getCorrectlyTime(m.created_at)}</span>
                  </div>
                  )}
                  <div className={userId === m.sender_id
                    ? s.wrapper__message_text_me
                    : s.wrapper__message_text}
                  >
                    <span>
                      {m.message}
                    </span>
                  </div>
                  {userId === m.sender_id || (
                  <div className={s.wrapper__message_time}>
                    <span>{getCorrectlyTime(m.created_at)}</span>
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
        )}
      </div>
    </div>
  );
});

interface ChatWindowType {
  userId: number | undefined
  messages: ItemMessage[] | undefined
  users: ResponseLoginType[] | undefined
  setQuantity: (value: number) => void
}
