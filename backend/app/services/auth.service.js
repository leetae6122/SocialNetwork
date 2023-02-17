const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

class AuthService{
    constructor(client) {
        this.User = client.db().collection("users");
    }
    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password,
            name:{
                fullname: payload.fullname,
                firstname: payload.firstname,
                lastname: payload.lastname
            },
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
            admin: payload.admin,
        };
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    
    async register(payload) {
        const user = this.extractUserData(payload);
        const salt = bcrypt.genSaltSync(10);
        const passwordHashed = bcrypt.hashSync(user.password, salt);

        const result = await this.User.findOneAndUpdate(
            user,
            {
                $set: {
                    admin:false,
                    password: passwordHashed,
                    fullname: payload.firstname+' '+payload.lastname
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async login(payload, time) {
        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload._id,
            admin:payload.admin
        }, config.JWT_Secret,{  // secretOrPublicKey mã bí mặt (NodejsApiAuthentication)
            expiresIn: time    // Ngày hết hạn Token 
        }) 
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