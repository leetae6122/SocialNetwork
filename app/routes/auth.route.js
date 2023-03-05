const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login")
    .post(auth.login)
router.route("/register")
    .post(auth.register)
router.route("/refresh")
    .post(auth.refreshToken)

module.exports = router;