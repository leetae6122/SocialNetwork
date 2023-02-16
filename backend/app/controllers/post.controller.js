const PostService = require("../services/post.service");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const postService = new PostService(MongoDB.client);
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(req.user.id);
        const listFriend = user.list_friend;
        if (listFriend) {
            for(let item of listFriend){
                documents = documents.concat(
                    await postService.findByUseID(item)
                );
            }
            documents = documents.concat(
                await postService.findByUseID(req.user.id)
            );
        }else {
            documents = await postService.find({});
        }
        return res.send(documents.sort(await postService.dynamicSort("date_created")));
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while retrieving the posts")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Post not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.title) {
        return next(new ApiError(400, "Title can not be empty"));
    }
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.create(req.user.id, req.body);
        return res.send(document);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "Post not found"))
        }
        return res.send({ message: "Post was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update post with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Post not found"));
        }
        return res.send({ message: "Post was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete post with id=${req.params.id}`)
        );
    }
};