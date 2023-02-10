const { ObjectId } = require("mongodb");

const bcrypt = require("bcryptjs");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            username: payload.name,
            password: payload.password,
            fullname: payload.fullname,
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
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
                    password: passwordHashed,
                    fulname: { firstname: payload.firstname, lastname: payload.lastname }
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findUser(payload) {
        return await this.find({
            $or: [
                { username: { $regex: new RegExp(payload.username), $options: "i" } },
                { phone: { $regex: new RegExp(payload.phone), $options: "i" } },
                { email: { $regex: new RegExp(payload.email), $options: "i" } },
            ]
        });
    }

    async findByName(name) {
        return await this.find({
            fullname: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async update(id, payload) {
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

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }

    async deleteAll() {
        const result = await this.User.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = UserService;