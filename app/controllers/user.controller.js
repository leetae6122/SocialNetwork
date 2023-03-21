const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.logOut = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        await userService.logout(req.user.id);
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
        const FindListFriend = await userService.findFriendsList(req.body._sendUid, req.body._receiveUid);
        if (FindListFriend) {
            return next(new ApiError(400, "User already exists in friends list"));
        }

        const document1 = await userService.addFriend(req.body._sendUid, req.body._receiveUid);
        if (!document1) {
            return next(new ApiError(404, "Failed to add friends"))
        }
        const document2 = await userService.addFriend( req.body._receiveUid, req.body._sendUid);
        if (!document2) {
            return next(new ApiError(404, "Failed to add friends"))
        }
        return res.send({ message: "User was addfriend successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.body._toUid}`)
        );
    }
};

exports.unFriend = async (req, res, next) => {
    try {

        const userService = new UserService(MongoDB.client);
        const FindUser = await userService.findById(req.body.userid);
        if (!FindUser) {
            return next(new ApiError(400, "User does not exist"));
        }

        const FindListFriend = await userService.findFriendsList(req.user.id, req.body.userid);
        if (!FindListFriend) {
            return next(new ApiError(400, "User does not exist in friends list"));
        }

        const document1 = await userService.unFriend(req.user.id, req.body.userid);
        if (!document1) {
            return next(new ApiError(404, "Failed to unfriends"))
        }
        const document2 = await userService.unFriend(req.body.userid, req.user.id);
        if (!document2) {
            return next(new ApiError(404, "Failed to unfriends"))
        }

        return res.send({ message: "User was unfriends successfully" });

    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.body.userid}`)
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
        const { name } = req.query;

        if (friendsList) {
            if (name) {
                for (let idUser of friendsList) {
                    documents = documents.concat(
                        await userService.findByFriendsList(idUser,name)
                    );
                }
            } else {
                for (let idUser of friendsList) {
                    documents = documents.concat(
                        await userService.findById(idUser)
                    );
                }
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
    if (Object.keys(req.body).length === 0 && !(req.file)) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const findUser = await userService.findById(req.params.id);
        if (!findUser) {
            return next(new ApiError(404, "User does not exist"));
        }

        const fileData = req.file;
        if (fileData) {
            cloudinary.uploader.destroy(findUser.avatar.avatar_name);
            const document = await userService.update(req.params.id, {
                ...req.body, path: fileData.path, filename: fileData.filename
            });
            if (!document) {
                return new (ApiError(404, "User not found"))
            }
        } else {
            const document = await userService.update(req.params.id, req.body);
            if (!document) {
                return new (ApiError(404, "User not found"))
            }
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

// Auth
exports.register = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const foundUser = await userService.findUser(req.body);
        if (foundUser) {
            return next(new ApiError(400, "Username already exists in the database "));
        } else {
            const document = await userService.register(req.body);
            return res.send(document);
        }
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
}

exports.login = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUser(req.body);

        if (!user) return next(new ApiError(400, "Wrong username"));

        const validPassword = await userService.validPassword(req.body.password, user.password)
        if (!validPassword) return next(new ApiError(400, "Wrong password"));
        if (user && validPassword) {
            const accessToken = await userService.login(user, "2h");
            const refreshToken = await userService.login(user, "1d");
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.send({
                userid: user._id,
                AccessToken: accessToken
            });
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while logging the user")
        );
    }
}

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(
        new ApiError(400, "You're not authenticated")
    );
    const userService = new UserService(MongoDB.client);
    jwt.verify(refreshToken, config.JWT_Secret, async (error, user) => {
        if (error) return next(
            new ApiError(400, "Token is not valid")
        );
        const newAccessToken = await userService.refresh(user, "2h");
        const newRefreshToken = await userService.refresh(user, "1d");
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        return res.send({
            userid: user.id,
            AccessToken: newAccessToken
        });
    })
}
