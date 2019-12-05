import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './auth';
import "react-datepicker/dist/react-datepicker.css"

let jwt = Auth.getJWT();
if (jwt) Auth.setAuthTokenAPI(jwt);

ReactDOM.render(
    <BrowserRouter >
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);

