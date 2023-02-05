const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

const JWT = require("jsonwebtoken");
const config = require("../config");
const encodedToken= (userID) =>{
    return JWT.sign({
        iss:'Le Duong Tri',         // Tác giả(người tạo)
        sub: userID,            // Thông tin định danh (_id)
        iat: new Date().getTime(),      //Ngày tạo Token
        exp: new Date().setDate(new Date().getDate() + 3),      // Ngày hết hạn Token (hạn 3 ngày)
    },config.JWT_Secret) // secretOrPublicKey mã bí mặt (NodejsApiAuthentication)
}

//Create and Save a new User
exports.signUp = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    }else if(!req.body?.password){
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const foundUser= await userService.findUser(req.body);
        
        if(foundUser!=''){
            return next(new ApiError(400, "Username already exists in the database ")) ;
        }else{
            const document = await userService.signUp(req.body);
            return res.send(document);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.signIn= async (req, res, next) =>{
    const token = encodedToken(req.params.id);
    res.setHeader('Authorization',token);
    return res.status(200).json({message:'Loging!!!'})
}

exports.addFriend = async (req, res, next) =>{

};

//Retrieve all users of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { name } = req.query;

        if (name) {
            documents = await userService.findByName(name);
        }else {
            documents = await userService.find({});
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
exports.update = async(req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next( ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if(!document){
            return new(ApiError(404, "User not found"))
        }
        return res.send({message: "User was update successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};
exports.delete = async(req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({message: "User was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};


exports.deleteAll = async(req, res,next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const deletedCount = await userService.deleteAll(req.params.id);
        return res.send(
            {message: `${deletedCount} users were deleted successfully`}
            );
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};
