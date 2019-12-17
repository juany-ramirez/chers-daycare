const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const administratorController = require("../controllers/administrators");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, administratorController.getAdministrators);

router.route("/:id").get(passportJWT, administratorController.getAdministrator);

router
  .route("/")
  .post(passportJWT, administratorController.createAdministrator);

router
  .route("/:id")
  .delete(passportJWT, administratorController.deleteAdministrator);

router
  .route("/:id")
  .put(passportJWT, administratorController.updateAdministrator);

module.exports = router;
