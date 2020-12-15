import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import "./App.scss";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeApp } from "./redux/app-reducer";

import { withSuspense } from "./components/HOCS/withSuspense";

import UpdateProduct from "./components/Catalog/UpdateProduct";
// CatalogContainer
import SignIn from "./components/Auth/SignIn/SignIn";
import SignUp from "./components/Auth/SignUp/SignUp";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Preloader from "./components/Preloader/Preloader";

// Ленивая загрузка выполнена из соображений о том что при перезагрузки страницы теряется state переменная isAuth,
// и если пользователь еще не залогинен то все в порядке ибо его перенаправит на страницу
// /signin ( так как я использую хок с перенаправлением на логин, если пользователь не авторизован ).
// А вот если пользователь уже залогинен, то токен авторизации от firebase все еще хранится в indexedDB,
// а значит при запросе onAuthStateChanged получит true и сразу же установит isAuth в true.
// Проблема в том что будет происходить перенаправление с любой страницы на страницу /signin, а потом оттуда
// почти сразу же на /catalog, и мало того что это будет выглядеть сумбурно, так еще и невозможно будет оставаться
// на страницах обновления и создания товара.
const Catalog = React.lazy(() => import("./components/Catalog/Catalog"));
const AddProduct = React.lazy(() => import("./components/Catalog/AddProduct"));

const SuspendedCatalog = withSuspense(Catalog);
const SuspendedAddProduct = withSuspense(AddProduct);
const App = React.memo((props) => {
  useEffect(() => {
    props.initializeApp();
  }, [props.initializeApp]);
  if (!props.initialized) return <Preloader />;
  console.log("here");
  return (
    <div className="app-wrapper">
      <Header />
      <Navbar />
      <div className="app-wrapper-content">
        <Route
          exact
          path={["/catalog", "/"]}
          render={() => <SuspendedCatalog />}
        />

        <Route path="/add_product" render={() => <SuspendedAddProduct />} />
        <Route
          exact
          path="/catalog/:productKey"
          render={() => <UpdateProduct />}
        />
        <Route path="/signin" render={() => <SignIn />} />
        <Route path="/signup" render={() => <SignUp />} />
      </div>
    </div>
  );
});

// export default withRouter(App);
const mapStateToProps = (state) => ({
  initialized: state.app.initialized,
});

export default compose(
  withRouter,
  connect(mapStateToProps, { initializeApp })
)(App);
