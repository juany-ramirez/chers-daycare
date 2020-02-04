import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "./utils/auth";

export const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const currentUser = Auth.isAuthenticated();
      if (!currentUser) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }
      return <Component {...props} />;
    }}
  />
);

export const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const currentUser = Auth.decodeJWT();
      if (!currentUser) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }
      if (currentUser.rol !== 1) {
        return (
          <Redirect
            to={{ pathname: "/home", state: { from: props.location } }}
          />
        );
      }
      return <Component {...props} />;
    }}
  />
);
