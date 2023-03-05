const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const config = require("../config");

//Create and Save a new User
exports.register = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const authService = new AuthService(MongoDB.client);
        const foundUser = await authService.findUser(req.body);
        if (foundUser) {
            return next(new ApiError(400, "Username already exists in the database "));
        } else {
            const document = await authService.register(req.body);
            return res.send(document);
        }
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.login = async (req, res, next) => {
    try {
        const authService = new AuthService(MongoDB.client);
        const user = await authService.findUser(req.body);

        if(!user) return next(new ApiError(400, "Wrong username"));

        const validPassword= await authService.validPassword(req.body.password,user.password)
        if(!validPassword) return  next(new ApiError(400, "Wrong password"));
        if(user && validPassword){
            const accessToken = await authService.login(user, "2h");
            const refreshToken = await authService.login(user, "1d");
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite:"strict",
            });
            return res.send({ 
                userid:user._id,
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
    const authService = new AuthService(MongoDB.client);
    jwt.verify(refreshToken, config.JWT_Secret, async (error, user) => {
        if (error) return next(
            new ApiError(400, "Token is not valid")
        );
        const newAccessToken = await authService.refresh(user, "2h");
        const newRefreshToken = await authService.refresh(user, "1d");
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        
        return res.send({ 
            userid:user.id,
            AccessToken: newAccessToken 
        });
    })
}
