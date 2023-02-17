const CommentService = require("../services/comment.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    console.log(req.body.text)
    if (!req.body?.text) {
        return next(new ApiError(400, "Content can not be empty"));
    }
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.create(req.user.id, req.params.id, req.body);
        return res.send(document);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};