import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

let mapStateToPropsForRedirect = (state) => ({
  isAuth: state.auth.isAuth,
  userId: state.auth.userId,
});

const withAuthRedirect = (WrappedComponent) => {
  class RedirectComponent extends React.Component {
    render() {
      if (!this.props.isAuth) return <Redirect to="/signin" />;
      return <WrappedComponent {...this.props} />;
    }
  }
  return connect(mapStateToPropsForRedirect)(RedirectComponent);
};

export default withAuthRedirect;
