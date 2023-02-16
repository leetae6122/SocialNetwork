const express = require("express");
const posts = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(posts.create)
router.route("/:id")
    .get(posts.findOne)
    .put(auth.verifyTokenAdminPost, posts.update)
    .delete(auth.verifyTokenAdminPost, posts.delete)

module.exports = router;