import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializedAC } from '../../bll';
import { Page404 } from '../404/Page404';
import { Chat } from '../chat/Chat';
import { Login } from '../login/Login';

export const App = React.memo(() => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializedAC());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/*" element={<Page404 />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
});
