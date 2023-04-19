const express = require("express");
const messages = require("../controllers/message.controller");
const router = express.Router();

router.route("/")
    .get(messages.findAll)
    .post(messages.create)
router.route("/:conversationId")
    .get(messages.findOne)

module.exports = router;