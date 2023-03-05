const express = require("express");
const comment = require("../controllers/comment.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(comment.myComments)
router.route("/:id")
    .get(comment.findOne)
    .put(auth.verifyTokenAdminComment, comment.update)
    .delete(auth.verifyTokenAdminComment, comment.delete)
router.route("/post/:id")
    .get(comment.findAll)
    .post(comment.create)
module.exports = router;