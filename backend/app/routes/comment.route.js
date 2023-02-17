const express = require("express");
const comment = require("../controllers/comment.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/:id")
    .post(comment.create)


module.exports = router;