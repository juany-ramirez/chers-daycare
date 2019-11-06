// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import Auth from './auth';

// export const ProtectedRoute = ({ componet: Component, ...rest }) => {
//     return (
//         <Route {...rest} render={
//             (props) => {
//                 console.log(Auth.isAuthenticated());
                
//                 if (Auth.isAuthenticated()) {
//                     return <Component {...props} />
//                 } else {
//                     return (
//                         <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//                     );
//                 }
//             }
//         } />
//     );
// }

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './auth';

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = Auth.isAuthenticated();
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        // authorised so return component
        return <Component {...props} />
    }} />
)