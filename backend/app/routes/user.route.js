const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

const passport = require('passport');
const passportConfig = require('../middlewares/passport');

router.route("/")
    .get(users.findAll)
    .post(users.signUp)
    .delete(users.deleteAll)
router.route("/login/:id").post(users.signIn)
router.route("/secret")
    .get(passport.authenticate('jwt',{session:false}), users.secret)
router.route("/:id")
    .get(users.findOne)
    .put(users.update)
    .delete(users.delete)
router.route("/:id/addfriend")
    .put()
router.route("/:id/unfriend")
    .put()
module.exports = router;