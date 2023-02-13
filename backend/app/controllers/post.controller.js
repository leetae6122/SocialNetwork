const PostService = require("../services/post.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const postService = new PostService(MongoDB.client);
        const { name } = req.query;
        console.log(name)
        if (name) {
            documents = await postService.findByName(name);
            console.log(documents)
        } else {
            documents = await postService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the users")
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.title) {
        return next(new ApiError(400, "Title can not be empty"));
    } 
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.create(req.user.id,req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};