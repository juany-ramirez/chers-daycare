const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const authenticationController = require('../controllers/authentications');
const passportConf = require('../passport');

const passportSignIn = passport.authenticate('local', {session:false});
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/signup')
    .post(authenticationController.signUp);

router.route('/signin')
    .post(passportSignIn, authenticationController.signIn);

router.route('/secret')
    .get(passportJWT, authenticationController.secret);

router.route('/users/:id')
    .put(passportJWT, authenticationController.updateUser);

module.exports = router;