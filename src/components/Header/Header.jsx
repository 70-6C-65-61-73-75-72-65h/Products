import React from "react";
// import Header from "./Header";
import { connect } from "react-redux";
import { signout } from "../../redux/auth-reducer";

import s from "./Header.module.scss";
import { NavLink } from "react-router-dom";
// import mylogo from "../../assets/images/mylogo.png";
const Header = (props) => {
  return (
    <header className={s.header}>
      {/* <img src={mylogo} /> */}

      {props.isAuth ? (
        <div className={s.loginBlock}>
          {props.email} - <a onClick={props.signout}>Выйти</a>
        </div>
      ) : (
        <div className={s.loginBlock}>
          <NavLink to={"/signin"}>Войти</NavLink>
        </div>
      )}
    </header>
  );
};

// export default Header;

class HeaderContainer extends React.Component {
  // componentDidMount() {
  //   this.props.getAuthUserData();
  // }

  render() {
    return <Header {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  email: state.auth.email,
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, { signout })(HeaderContainer);
