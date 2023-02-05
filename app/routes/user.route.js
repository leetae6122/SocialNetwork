const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.route("/")
    .get(users.findAll)
    .post(users.signUp)
    .delete(users.deleteAll)
router.route("/login/:id").post(users.signIn)
router.route("/:id")
    .get(users.findOne)
    .put(users.update)
    .delete(users.delete)
router.route("/:id/addfriend")
    .put()
router.route("/:id/unfriend")
    .put()
module.exports = router;