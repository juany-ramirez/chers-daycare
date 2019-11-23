import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './auth';

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = Auth.isAuthenticated();
        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        return <Component {...props} />
    }} />
)