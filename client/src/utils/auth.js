import axios from "axios";
let jwtDecode = require("jwt-decode");

class Auth {
  constructor() {
    this.jwt = {};
  }

  login(jwt) {
    localStorage.setItem("jwt", jwt);
    this.setAuthTokenAPI(jwt);
  }

  setAuthTokenAPI(jwt) {
    axios.interceptors.request.use(function(config) {
      if (jwt) {
        config.headers.Authorization = jwt;
      } else {
        config.headers.Authorization = null;
      }
      return config;
    });
  }

  logout(cb) {
    localStorage.removeItem("jwt");
    this.setAuthTokenAPI(null);
    cb();
  }

  isAuthenticated() {
    this.jwt = this.getJWT();
    return this.jwt ? true : false;
  }

  getJWT() {
    return localStorage.getItem("jwt");
  }

  decodeJWT() {
    this.jwt = this.getJWT();
    return this.jwt ? jwtDecode(this.jwt) : false;
  }
}

export default new Auth();
