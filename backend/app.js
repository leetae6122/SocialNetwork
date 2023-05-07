require('dotenv').config()

const express = require("express");
const cors = require("cors");

const usersRouter = require("./app/routes/user.route");
const authRouter = require("./app/routes/auth.route");
const postsRouter = require("./app/routes/post.route");
const commentsRouter = require("./app/routes/comment.route");
const newsRouter = require("./app/routes/news.route");
const conversationRouter = require("./app/routes/conversation.route");
const messageRouter = require("./app/routes/message.route");
const auth = require("./app/middlewares/auth");
const ApiError = require("./app/api-error");
const passport = require("passport");
require("./app/middlewares/passport");

const app = express();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to social network application." });
});

app.use("/api/auth", authRouter);
app.use("/api/users", passport.authenticate('jwt', { session: false }), usersRouter);
app.use("/api/posts", passport.authenticate('jwt', { session: false }), postsRouter);
app.use("/api/comments", passport.authenticate('jwt', { session: false }), commentsRouter);
app.use("/api/news", passport.authenticate('jwt', { session: false }), newsRouter);
app.use("/api/conversations", passport.authenticate('jwt', { session: false }), conversationRouter);
app.use("/api/messages", passport.authenticate('jwt', { session: false }), messageRouter);
// handle 404 response 
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls 
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
