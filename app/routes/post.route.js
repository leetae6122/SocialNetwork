const express = require("express");
const posts = require("../controllers/post.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(uploadCloud.single('img'),posts.create) //fields many_img-many_key, single 1 img, array 1key-many_img
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