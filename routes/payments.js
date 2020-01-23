const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const paymentController = require("../controllers/payments");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, paymentController.getPayments);

router.route("/:id").put(passportJWT, paymentController.updateParentsPayment);

module.exports = router;
