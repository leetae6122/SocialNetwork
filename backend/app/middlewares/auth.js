const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const PostService = require("../services/post.service");
const CommentService = require("../services/comment.service");
const NewsService = require("../services/news.service");

exports.verifyAdminUser = async (req, res, next) => {
    if (req.user.id == req.params.id || req.user.admin) {
        next();
    } else {
        return next(
            new ApiError(400, "You are not allowed to make other changes")
        );
    }
}

exports.verifyAdminPost = async (req, res, next) => {
    const postService = new PostService(MongoDB.client);
    const post = await postService.findById(req.params.id);
    if (req.user.id == post._uid || req.user.admin) {
        next();
    } else {
        return next(
            new ApiError(400, "You are not allowed to make other changes")
        );
    }
}

exports.verifyAdminComment = async (req, res, next) => {
    const commentService = new CommentService(MongoDB.client);
    const comment = await commentService.findById(req.params.id);
    if (req.user.id == comment._uid || req.user.admin) {
        next();
    } else {
        return next(
            new ApiError(400, "You are not allowed to make other changes")
        );
    }
}

exports.verifyAdminNews = async (req, res, next) => {
    const newsService = new NewsService(MongoDB.client);
    const news = await newsService.findById(req.params.id);
    if (req.user.id == news._sendUid || req.user.id == news._receiveUid  || req.user.admin) {
        next();
    } else {
        return next(
            new ApiError(400, "You are not allowed to make other changes")
        );
    }
}