const express = require("express");
const posts = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(posts.create)
router.route("/favorite")
    .get(posts.favoritePosts)
router.route("/:id")
    .get(posts.findOne)
    .put(auth.verifyTokenAdminPost, posts.update)
    .delete(auth.verifyTokenAdminPost, posts.delete)
router.route("/:id/favorite")
    .put(posts.favorite)
router.route("/:id/unfavorite")
    .put(posts.unfavorite)
module.exports = router;