import axios from "axios";
let jwtDecode = require('jwt-decode');

class Auth {
    constructor() {
    }

    login(jwt) {
        localStorage.setItem('jwt', jwt);
        this.setAuthTokenAPI(jwt);
    }

    setAuthTokenAPI(jwt) {
        axios.interceptors.request.use(function (config) {
            if (jwt) {
                config.headers.Authorization = jwt;
            } else {
                config.headers.Authorization = null;
            }
            return config;
        });

    }

    logout(cb) {
        localStorage.removeItem('jwt');
        this.setAuthTokenAPI(null);
        cb();
    }

    isAuthenticated() {
        let jwt = this.getJWT();
        return jwt ? true : false;
    }

    getJWT() {
        return localStorage.getItem('jwt');
    }

    decodeJWT() {
        let jwt = this.getJWT();
        return jwt ? jwtDecode(jwt) : false;
    }
}

export default new Auth();