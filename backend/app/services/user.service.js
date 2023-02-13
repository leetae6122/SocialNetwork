const { ObjectId } = require("mongodb");

class UserService {
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

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        const firstname = await name.split(' ')[0];
        const lastname = await name.split(' ')[1];
        return await this.find({
            'fullname.firstname':{ $regex: new RegExp(firstname), $options: "i" } ,
            'fullname.lastname':{ $regex: new RegExp(lastname), $options: "i" }
        });
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findListFriend(idUser, idAdd){
        return await this.User.findOne({
            _id:ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
            list_friend: idAdd
        });
        
        
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = await authService.extractUserData(payload);
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
        const update = {list_friend: idAdd};
        const result = await this.User.findOneAndUpdate(
            filter,
            { $push: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async unFriend(idUser, idAdd) {
        const filter = {
            _id: ObjectId.isValid(idUser) ? new ObjectId(idUser) : null,
        };
        const update = {list_friend: idAdd};
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

}
module.exports = UserService;