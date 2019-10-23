import React from 'react';
import { Route } from 'react-router-dom';

export const ProtectedRoute = ({componet:Component, ...rest}) => {
    return (
        <Route {...rest} render={
            (props) => {
                return <Component {...props}/>
            }
        }/>
    );
}