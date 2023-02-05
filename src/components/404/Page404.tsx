import React from 'react';
import s from './Page404.module.scss';

export const Page404 = React.memo(() => (
  <h1 className={s.not_found}>
    Page not found
  </h1>
));
