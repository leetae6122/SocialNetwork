const express = require("express");
const user = require("../controllers/user.controller");
const router = express.Router();

router.route("/login")
    .post(user.login)
router.route("/register")
    .post(user.register)
router.route("/refresh")
    .post(user.refreshToken)

module.exports = router;