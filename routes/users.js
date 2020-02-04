const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const userController = require("../controllers/users");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, userController.getUsers);

router.route("/:id").get(passportJWT, userController.getUser);

router.route("/:id").delete(passportJWT, userController.deleteUser);

router
  .route("/:userId/notification")
  .post(passportJWT, userController.createNotification);

  router
  .route("/:userId/notification/:id")
  .put(passportJWT, userController.updateNotification);

module.exports = router;
