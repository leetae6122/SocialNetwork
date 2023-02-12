const { ObjectId } = require("mongodb");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

class AuthService{
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password,
            fullname: payload.fullname,
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
            admin: payload.admin,
            favorite_post: payload.favorite_post,
            list_friend: payload.list_friend
        };
        // Xóa các trường không xác định       
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    async signUp(payload) {
        const user = this.extractUserData(payload);

        const salt = bcrypt.genSaltSync(10);
        const passwordHashed = bcrypt.hashSync(user.password, salt);

        const result = await this.User.findOneAndUpdate(
            user,
            {
                $set: {
                    admin:false,
                    password: passwordHashed,
                    fullname: { firstname: payload.firstname, lastname: payload.lastname }
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async signIn(payload, time) {
        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload._id,
            admin:payload.admin
        }, config.JWT_Secret,{
            expiresIn: time // Ngày hết hạn Token 
        }) // secretOrPublicKey mã bí mặt (NodejsApiAuthentication)
    }

    async validPassword(validpassword, password){
        return await bcrypt.compare(
            validpassword,
            password
        );
    }

    async findUser(payload) {
        return await this.User.findOne({
            $or:[
                {username: payload.username},
                {email: payload.email},
                {phone: payload.phone},
            ]
        })
    }
}

module.exports = AuthService;