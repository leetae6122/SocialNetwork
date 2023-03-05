const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.logOut = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken");
        res.send({ message: "Log Out" });
        res.end();
    } catch (error) {
        console.log(error);
    }
};

exports.addFriend = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const FindUser = await userService.findById(req.params.id);
        if (!FindUser) {
            return next(new ApiError(400, "User does not exist"));
        }

        const FindListFriend = await userService.findFriendsList(req.user.id, req.params.id);
        if (FindListFriend) {
            return next(new ApiError(400, "User already exists in friends list"));
        }

        const document = await userService.addFriend(req.user.id, req.params.id);
        if (!document) {
            return next(new ApiError(404, "Failed to add friends"))
        }

        return res.send({ message: "User was addfriend successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};

exports.unFriend = async (req, res, next) => {
    try {

        const userService = new UserService(MongoDB.client);
        const FindUser = await userService.findById(req.params.id);
        if (!FindUser) {
            return next(new ApiError(400, "User does not exist"));
        }

        const FindListFriend = await userService.findFriendsList(req.user.id, req.params.id);
        if (!FindListFriend) {
            return next(new ApiError(400, "User does not exist in friends list"));
        }

        const document = await userService.unFriend(req.user.id, req.params.id);
        if (!document) {
            return next(new ApiError(404, "Failed to unfriends"))
        }

        return res.send({ message: "User was unfriends successfully" });

    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { name } = req.query;

        if (name) {
            documents = await userService.findByName(name);
        } else {
            documents = await userService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the users")
        );
    }
};

exports.findFriendList = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(req.user.id);
        const friendsList = user.friends_list;
        if (friendsList) {
            for (let item of friendsList) {
                documents = documents.concat(
                    await userService.findById(item)
                );
            }
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the users")
        );
    }
};

//
exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "User not found"))
        }
        return res.send({ message: "User was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};
