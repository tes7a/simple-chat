import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { type AppRootStateType } from '../../store';
import { Form } from './form/Form';
import s from './Login.module.scss';

export const Login = React.memo(() => {
  const authStatus = useSelector<AppRootStateType, boolean>((state) => state.auth.authStatus);

  if (authStatus) {
    return <Navigate to="/chat" />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper__container}>
        <h1>Simple QuickBlox Chat</h1>
        <div className={s.wrapper__data_block}>
          <h4>Data to log in for testing </h4>
          <span>
            Login John: jh2345
            <br />
            Login Anna: ana3332
            <br />
            Password: Qwerty12345_
          </span>
        </div>
        <Form />
      </div>
    </div>
  );
});
