const express = require("express");
const comment = require("../controllers/comment.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(comment.myComments)
router.route("/:id")
    .get(comment.findOne)
    .put(auth.verifyAdminComment, comment.update)
    .delete(auth.verifyAdminComment, comment.delete)
router.route("/post/:id")
    .get(comment.findAll)
    .post(comment.create)
module.exports = router;