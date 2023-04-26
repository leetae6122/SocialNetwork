const CommentService = require("../services/comment.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findAll(req.params.id);
        
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving comment with id=${req.params.id}`)
        );
    }
};

exports.myComments = async (req, res, next) => {
    let documents = [];
    try {
        const commentService = new CommentService(MongoDB.client);
        documents = await commentService.findMyComments(req.user._id);
        
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the comments")
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.content) {
        return next(new ApiError(400, "Content can not be empty"));
    }
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.create(req.user._id, req.params.id, req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the comment")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "Comment not found"))
        }
        return res.send({ message: "Comment was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update comment with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const commentService = new CommentService(MongoDB.client);
        const document = await commentService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comment not found"));
        }
        return res.send({ message: "Comment was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete comment with id=${req.params.id}`)
        );
    }
};