import React from "react";
import s from "./Navbar.module.scss";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={s.nav}>
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

      <div className={`${s.item}  `}>
        <NavLink to="/signin" activeClassName={s.activeLink}>
          Войти
        </NavLink>
      </div>

      <div className={`${s.item} `}>
        <NavLink to="/signup" activeClassName={s.activeLink}>
          Зарегестрироватся
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
