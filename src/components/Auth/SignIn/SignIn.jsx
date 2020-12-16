import React from "react";
import { reduxForm } from "redux-form";
import { Input, createField } from "../../FormsControls/FormsControls";
import { requiredField } from "../../FormsControls/validators";
import { connect } from "react-redux";
import { signin } from "../../../redux/auth-reducer";
import { Redirect } from "react-router-dom";
import styles from "../../FormsControls/FormsControls.module.scss";

const SigninForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, error } = props;
  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      {createField("Email", "email", Input, [requiredField])}
      {createField("Password", "password", Input, [requiredField], {
        type: "password",
      })}
      {error && <div className={styles.formSummaryError}>{error}</div>}
      <div className="">
        <button type="submit" disabled={pristine || submitting}>
          Войти
        </button>
      </div>
      <div className="">
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Очистить значения
        </button>
      </div>
    </form>
  );
};

const SigninReduxForm = reduxForm({ form: "signin" })(SigninForm);

const Signin = (props) => {
  const onSubmit = (formData) => {
    props.signin(formData.email, formData.password);
  };
  if (props.isAuth) return <Redirect to="/catalog" />;

  return (
    <>
      <div className={styles.operationContainer}>
        <h1 className={styles.operationHeader}>Войти в аккаунт</h1>
        <SigninReduxForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, { signin })(Signin);
