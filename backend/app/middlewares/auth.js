const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = await req.header('Authorization');
        const token = await authHeader.split(' ')[1];
        if (!token) return next(new ApiError(400, "You're not authoticated"));

        jwt.verify(token, config.JWT_Secret, (error, user) => {
            if (error) return next(new ApiError(400, "Token is not valid"));
            req.user = user;
            next();
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while logging in the user")
        );
    }
}

exports.verifyTokenAdmin = async (req, res, next) => {
    if (req.user.id == req.params.id || req.user.admin) {
        next();
    } else {
        return next(
            new ApiError(400, "You're not allowed to delete other")
        );
    }
}