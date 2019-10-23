import axios from "axios";

class Auth {
    constructor() {
        this.authenticated = false;
        this.jwt = "";
        this.user = {};
    }

    login(jwt) {
        this.authenticated = true;
        this.jwt = jwt;
        localStorage.setItem('jwt', this.jwt);
        this.setAuthTokenAPI(this.jwt);
    }

    setAuthTokenAPI(jwt) {
        if (jwt){            
            axios.defaults.headers.common['Authorization'] = jwt;
        } else {            
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    logout(jwt) {
        this.authenticated = false;
        this.jwt = "";
        localStorage.removeItem('jwt');
        this.setAuthTokenAPI();
    }

    isAuthenticated() {
        return this.authenticated;
    }

    getJWT() {
        return this.jwt;
    }

    getSession() {
        return localStorage.getItem('jwt');
    }
}

export default new Auth()