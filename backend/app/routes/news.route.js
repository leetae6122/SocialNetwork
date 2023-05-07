const express = require("express");
const auth = require("../middlewares/auth");
const news = require("../controllers/news.controller");

const router = express.Router();

router.route("/")
    .get(news.findUserAll)
router.route("/send")
    .post(news.create)
router.route("/:id")
    .get(news.findOne)
    .put(news.update)
    .delete(auth.verifyAdminNews, news.delete)


module.exports = router;