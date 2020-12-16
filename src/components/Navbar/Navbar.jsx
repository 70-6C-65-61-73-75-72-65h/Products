import React, { useState } from "react";
import s from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";
import Hamburger from "hamburger-react";
import { signout } from "../../redux/auth-reducer";
import { connect } from "react-redux";

const Navbar = (props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <nav className={s.nav}>
        <div className={s.humb}>
          <Hamburger toggled={isOpen} toggle={setOpen} color="red" size={100} />
        </div>

        {isOpen && (
          <nav className={s.navMenu}>
            <div className={s.item}>
              <NavLink to="/catalog" activeClassName={s.activeLink}>
                Каталог товаров
              </NavLink>
            </div>

            <div className={`${s.item} `}>
              <NavLink to="/add_product" activeClassName={s.activeLink}>
                Добавить товар
              </NavLink>
            </div>

            <div className={`${s.item} `}>
              <NavLink to="/signup" activeClassName={s.activeLink}>
                Зарегестрироватся
              </NavLink>
            </div>

            <div className={`${s.item}  `}>
              <NavLink to="/signin" activeClassName={s.activeLink}>
                Войти
              </NavLink>
            </div>

            {props.isAuth && (
              <div className={`${s.item}  `}>
                <a onClick={props.signout}>Выйти</a>
              </div>
            )}
          </nav>
        )}
      </nav>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, { signout })(Navbar);
