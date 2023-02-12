const { ObjectId } = require("mongodb");

const authService = require("./auth.service")

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }
    // async findUserExist(payload) {
    //     return await this.find({
    //         $or: [
    //             { username: { $regex: new RegExp(payload.username), $options: "i" } },
    //             { phone: { $regex: new RegExp(payload.phone), $options: "i" } },
    //             { email: { $regex: new RegExp(payload.email), $options: "i" } },
    //         ]
    //     });
    // }

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
        const update = this.authService.extractUserData(payload);
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