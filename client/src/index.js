import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './auth';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

let jwt = Auth.getJWT();
if (jwt) Auth.setAuthTokenAPI(jwt);

ReactDOM.render(
    <BrowserRouter >
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);

