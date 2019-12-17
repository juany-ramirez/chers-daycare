const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const caretakerController = require("../controllers/caretakers");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, caretakerController.getCaretakers);

router.route("/:id").get(passportJWT, caretakerController.getCaretaker);

router.route("/").post(passportJWT, caretakerController.createCaretaker);

router.route("/:id").delete(passportJWT, caretakerController.deleteCaretaker);

router.route("/:id").put(passportJWT, caretakerController.updateCaretaker);

module.exports = router;
