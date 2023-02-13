const express = require("express");
const posts = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(posts.findAll)
    .post(posts.create)
module.exports = router;