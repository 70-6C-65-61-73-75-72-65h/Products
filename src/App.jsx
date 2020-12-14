import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { compose } from "redux";

import { initializeApp } from "./redux/app-reducer";

import { withSuspense } from "./components/HOCS/withSuspense";

// import Catalog from "./components/Catalog/Catalog";
// import AddProduct from "./components/Catalog/AddProduct";
import UpdateProduct from "./components/Catalog/UpdateProduct";
// CatalogContainer
import SignIn from "./components/Auth/SignIn/SignIn";
import SignUp from "./components/Auth/SignUp/SignUp";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Preloader from "./components/Preloader/Preloader";

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

//  <!-- The core Firebase JS SDK is always required and must be listed first -->
//   <script src="https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js"></script>

//   <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
//   <script src="https://www.gstatic.com/firebasejs/8.2.0/firebase-analytics.js"></script>

//   <script>
//     // Your web app's Firebase configuration
//     // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//     var firebaseConfig = {
//       apiKey: "AIzaSyB232ly-YH5BqFVivK6cZwpFCem-6F0Csk",
//       authDomain: "testproj-30b12.firebaseapp.com",
//       databaseURL: "https://testproj-30b12-default-rtdb.firebaseio.com",
//       projectId: "testproj-30b12",
//       storageBucket: "testproj-30b12.appspot.com",
//       messagingSenderId: "288859036226",
//       appId: "1:288859036226:web:2256619dd7e9892dac2bdb",
//       measurementId: "G-6BVLDP7VT0"
//     };
//     // Initialize Firebase
//     firebase.initializeApp(firebaseConfig);
//     firebase.analytics();
//   </script>

// max.ulshin.1997@gmail.com

// padara898989
