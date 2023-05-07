const express = require("express");
const messages = require("../controllers/message.controller");
const router = express.Router();

router.route("/")
    .post(messages.create)
router.route("/:id")
    .delete(messages.delete)
router.route("/:conversationId")
    .get(messages.findAll)

module.exports = router;