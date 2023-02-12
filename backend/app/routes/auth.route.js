const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login")
    .post(auth.signIn)
router.route("/signup")
    .post(auth.signUp)

module.exports = router;