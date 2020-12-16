import React from "react";
import { connect } from "react-redux";
import s from "./Header.module.scss";
const Header = (props) => {
  return (
    <header className={s.header}>
      {props.isAuth ? (
        <div className={s.loginBlock}>{props.email}</div>
      ) : (
        <div className={s.loginBlock}>{"Аноним"}</div>
      )}
    </header>
  );
};

const mapStateToProps = (state) => ({
  email: state.auth.email,
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, null)(Header);
