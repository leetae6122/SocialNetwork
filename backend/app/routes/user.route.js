const express = require("express");
const users = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(users.findAll)
router.route("/logout")
    .post(auth.verifyToken, users.logOut)
router.route("/refresh")
    .post(users.refreshToken)
router.route("/:id")
    .get(users.findOne)
    .put(auth.verifyTokenAdmin, users.update)
    .delete(auth.verifyTokenAdmin, users.delete)
router.route("/:id/addfriend")
    .put()
router.route("/:id/unfriend")
    .put()
module.exports = router;