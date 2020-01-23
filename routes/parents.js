const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const parentController = require("../controllers/parents");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, parentController.getParents);

router.route("/:id").get(passportJWT, parentController.getParent);

router.route("/").post(passportJWT, parentController.createParent);

router.route("/:id").patch(passportJWT, parentController.kidControl);

router.route("/:id").delete(passportJWT, parentController.deleteParent);

router.route("/:id").put(passportJWT, parentController.updateParent);

module.exports = router;
