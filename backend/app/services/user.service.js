const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password,
            name: {
                fullname: payload.lastname + ' ' + payload.firstname,
                lastname: payload.lastname,
                firstname: payload.firstname
            },
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
            admin: payload.admin,
            date_birth: payload.date_birth,
            places_lived: payload.places_lived,
            avatar: {
                avatar_data: payload.path,
                avatar_name: payload.filename
            },
            intro: payload.intro,
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        Object.keys(user.name).forEach(
            (key) => user.name[key] === undefined && delete user.name[key]
        );
        if (Object.keys(user.name).length == 0) { delete user.name }

        Object.keys(user.avatar).forEach(
            (key) => user.avatar[key] === undefined && delete user.avatar[key]
        );
        if (Object.keys(user.avatar).length == 0) { delete user.avatar }

        return user;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        const result = await this.User.find({
            'name.fullname': { $regex: new RegExp(name), $options: "i" },
        });
        return await result.toArray();
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findByFriendsList(idUser, name) {
        const result = await this.find({
            _id: ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
            'name.fullname': { $regex: new RegExp(name), $options: "i" }
        });
        // console.log(await result.toArray());
        return result;
    }

    async findFriendsList(idUser, idAdd) {
        return await this.User.findOne({
            _id: ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
            friends_list: idAdd.toString()
        });
    }

    async update(id, payload) {
        console.log(payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async addFriend(idUser, idAdd) {
        const filter = {
            _id: ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
        };
        const update = { friends_list: idAdd.toString() };
        const result = await this.User.findOneAndUpdate(
            filter,
            { $push: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async unFriend(idUser, idDel) {
        const filter = {
            _id: ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
        };
        const update = { friends_list: idDel.toString() };
        const result = await this.User.findOneAndUpdate(
            filter,
            { $pull: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }

    async register(payload) {
        const user = this.extractUserData(payload);
        const salt = bcrypt.genSaltSync(10);
        const passwordHashed = bcrypt.hashSync(user.password, salt);
        const defaultAvatar = [
            'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Rapid_d6v75k.png'
            , 'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Panda_anjojs.png'
            , 'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Ninja_xifnyk.png'
            , 'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Monster1_rzjeon.png'
            , 'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Monster2_lu2cfh.png'
            , 'https://res.cloudinary.com/dydmgqi9c/image/upload/v1678001729/social_network/Astronaut_koeakm.png'
        ]
        const result = await this.User.findOneAndUpdate(
            user,
            {
                $set: {
                    admin: false,
                    password: passwordHashed,
                    online: false,
                    avatar: {
                        avatar_data: defaultAvatar[Math.floor(Math.random() * 6)],
                    }
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async logout(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = { online: false };
        await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
    }
    // Auth Route
    async login(payload, time) {
        const filter = {
            _id: ObjectId.isValid(payload._id) ? new ObjectId(payload._id) : null,
        };
        const update = { online: true };
        await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload._id,
            admin: payload.admin
        }, config.JWT_Secret, {  // secretOrPublicKey mã bí mặt (NodejsApiAuthentication)
            expiresIn: time    // Ngày hết hạn Token 
        })
    }
    async refresh(payload, time) {
        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload.id,
            admin: payload.admin
        }, config.JWT_Secret, {
            expiresIn: time
        })
    }

    async validPassword(validpassword, password) {
        return await bcrypt.compare(
            validpassword,
            password
        );
    }

    async findUserByUsername(payload) {
        return await this.User.findOne({ username: payload }); 
    }
    async findUserByEmail(payload) {
        return await this.User.findOne({ email: payload }); 
    }
    async findUserByPhone(payload) {
        return await this.User.findOne({ phone: payload}); 
    }
}
module.exports = UserService;