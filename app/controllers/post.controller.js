const PostService = require("../services/post.service");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const cloudinary = require('cloudinary').v2;

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const postService = new PostService(MongoDB.client);
        const { uid } = req.query;
        if (uid) {
            documents = await postService.findByUseID(uid)
        } else {
            const userService = new UserService(MongoDB.client);
            const user = await userService.findById(req.user._id);
            const friendsList = user.friends_list;
            if (friendsList) {
                for (let userid of friendsList) {
                    documents = documents.concat(
                        await postService.findByUseID(userid)
                    );
                }
            }
            documents = documents.concat(
                await postService.findByUseID(req.user._id)
            );
            documents = documents.sort(await postService.sortDescending("date_created"));
        }
        return res.send(documents);
    } catch (error) {
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

exports.favoritePosts = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const document = await postService.findFavoritePosts(req.user._id);
        if (!document) {
            return next(new ApiError(404, "Favorite not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retrieving the posts')
        );
    }
};

exports.create = async (req, res, next) => {
    try {
        const fileData = req.file;
        if (!req.body?.content && !fileData) {
            return next(new ApiError(400, "Content can not be empty"));
        }
        const postService = new PostService(MongoDB.client);
        const document = await postService.create(req.user._id, {
            ...req.body, path: fileData?.path, filename: fileData?.filename
        });
        return res.send(document);
    } catch (error) {
        if (req.file) cloudinary.uploader.destroy( req.file?.filename) //delete img in cloud
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 && !(req.file)) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const postService = new PostService(MongoDB.client);

        const findPost = await postService.findById(req.params.id);
        if (!findPost) {
            return next(new ApiError(404, "Post does not exist"));
        }

        const fileData = req.file;
        if (fileData) {
            cloudinary.uploader.destroy(findPost.image.img_name);
            const document = await postService.update(req.params.id, {
                ...req.body, path: fileData.path, filename: fileData.filename
            });
            if (!document) {
                return new (ApiError(404, "Post not found"))
            }
        } else {
            const document = await postService.update(req.params.id, req.body);
            if (!document) {
                return new (ApiError(404, "Post not found"))
            }
        }
        return res.send({ message: "Post was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update post with id=${req.params.id}`)
        );
    }
};

exports.favorite = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);

        const findIsFavorite = await postService.findIsFavorite(req.user._id, req.body.id);
        if (findIsFavorite) {
            return next(new ApiError(400, "User already exists in favorites list"));
        }

        const document = await postService.favorite(req.user._id, req.body.id);
        if (!document) {
            return next(new ApiError(404, "Post does not exist"))
        }

        return res.send({ message: "Post was favorite successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error favorite post with id=${req.body.id}`)
        );
    }
};

exports.unfavorite = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);

        const findIsFavorite = await postService.findIsFavorite(req.user._id, req.body.id);
        if (!findIsFavorite) {
            return next(new ApiError(400, "User does not exist in favorites list"));
        }

        const document = await postService.unfavorite(req.user._id, req.body.id);
        if (!document) {
            return next(new ApiError(404, "Post does not exist"))
        }

        return res.send({ message: "Post was unfavorite successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error unfavorite post with id=${req.body.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const postService = new PostService(MongoDB.client);
        const findPost = await postService.findById(req.params.id);
        if (!findPost) {
            return next(new ApiError(404, "Post does not exist"));
        }
        cloudinary.uploader.destroy(findPost.image?.img_name);
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