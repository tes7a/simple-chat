import { useFormik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { sessionCreateAC } from '../../../bll';
import s from './Form.module.scss';

export const Form = React.memo(() => {
  const dispatch = useDispatch();

  const formik = useFormik({
    validate(values) {
      if (!values.login) {
        return {
          login: 'Email Required!',
        };
      } if (!values.password) {
        return {
          password: 'Password Required!',
        };
      }
    },
    initialValues: {
      login: 'jj8517614',
      password: 'Qwerty12345_',
    },
    onSubmit(values: FormValuesType) {
      const { login, password } = values;
      dispatch(sessionCreateAC(login, password));
    },
  });

  return (
    <div className={s.wrapper__form_block}>
      <form className={s.wrapper__form} onSubmit={formik.handleSubmit}>
        <span className={s.wrapper__form_text}>Login</span>
        <div className={s.wrapper__form_input}>
          <label>Login User</label>
          <input placeholder="Login" {...formik.getFieldProps('login')} />
        </div>
        {formik.errors.login
          ? <div style={{ color: 'red' }}>{formik.errors.login}</div>
          : null}
        <div className={s.wrapper__form_input}>
          <label>Password</label>
          <input type="password" placeholder="Password" {...formik.getFieldProps('password')} />
        </div>
        {formik.errors.password
          ? <div style={{ color: 'red' }}>{formik.errors.password}</div>
          : null}
        <button className={s.wrapper__form_button} type="submit">Submit</button>
      </form>
    </div>
  );
});

interface FormValuesType {
  login: string
  password: string
}
