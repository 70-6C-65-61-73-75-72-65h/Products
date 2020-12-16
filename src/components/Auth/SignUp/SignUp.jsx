import React from "react";
import { reduxForm } from "redux-form";
import { Input, createField } from "../../FormsControls/FormsControls";
import { requiredField } from "../../FormsControls/validators";
import { connect } from "react-redux";
import { signup } from "../../../redux/auth-reducer";
import styles from "../../FormsControls/FormsControls.module.scss";

const SignUpForm = (props) => {
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
          Создать
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

const SignUpReduxForm = reduxForm({ form: "signup" })(SignUpForm);

const SignUp = (props) => {
  const onSubmit = (formData) => {
    props.signup(formData.email, formData.password);
  };

  return (
    <>
      <div className={styles.operationContainer}>
        <h1 className={styles.operationHeader}>Создать аккаунт</h1>
        <SignUpReduxForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, { signup })(SignUp);
