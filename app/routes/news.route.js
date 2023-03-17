const express = require("express");
const auth = require("../middlewares/auth");
const news = require("../controllers/news.controller");

const router = express.Router();

router.route("/")
    .get(news.findAll)
router.route("/send")
    .post(news.create)
router.route("/:id")
    .get(news.findOne)
    .post(news.update)
    .delete(auth.verifyTokenAdmin, news.delete)


module.exports = router;