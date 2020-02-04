const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const kidController = require("../controllers/kids");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, kidController.getKids);

router.route("/:id").get(passportJWT, kidController.getKid);

router.route("/").post(passportJWT, kidController.createKid);

router.route("/:id").delete(passportJWT, kidController.deleteKid);

router.route("/:id").put(passportJWT, kidController.updateKid);

router.route("/:id").patch(passportJWT, kidController.postControl);

router.route("/").patch(passportJWT, kidController.getKidsParents);
module.exports = router;
