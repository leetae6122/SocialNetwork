const express = require("express");
const posts = require("../controllers/post.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(uploadCloud.single('image'), posts.create) //fields many_img-many_key, single 1 img, array 1key-many_img
router.route("/favorite")
    .get(posts.favoritedPosts)
    .put(posts.favorite)
router.route("/unfavorite")
    .put(posts.unfavorite)
router.route("/:id")
    .get(posts.findOne)
    .put(auth.verifyTokenAdminPost, uploadCloud.single('image'), posts.update)
    .delete(auth.verifyTokenAdminPost, posts.delete)

module.exports = router;