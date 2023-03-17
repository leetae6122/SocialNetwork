const { ObjectId } = require("mongodb");

class PostService {
    constructor(client) {
        this.Post = client.db().collection("posts");
    }
    extractPostData(payload) {
        const post = {
            title: payload.title,
            content: payload.content,
            image: {
                img_data: payload.path,
                img_name: payload.filename
            },
            changed: true,
            date_created: payload.date_created,
            _uid: payload._uid
        };
        Object.keys(post).forEach(
            (key) => post[key] === undefined && delete post[key]
        );

        Object.keys(post.image).forEach(
            (key) => post.image[key] === undefined && delete post.image[key]
        );
        if(Object.keys(post.image).length == 0) {delete post.image}
        
        return post;
    }

    async create(UserID, payload) {
        const post = this.extractPostData(payload);

        const result = await this.Post.findOneAndUpdate(
            post,
            {
                $set: {
                    _uid: UserID,
                    date_created: new Date().getTime(),
                    changed: false,
                },
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractPostData(payload);
        const result = await this.Post.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async findByUseID(UserID) {
        const cursor = await this.Post.find({ _uid: UserID });
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Post.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findFavoritesList(UserID, id) {
        const res = await this.Post.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            favorites_list: UserID
        });
        console.log(res);
        return res;
    }

    async delete(id) {
        const result = await this.Post.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }

    async favorite(UserID, id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = { favorites_list: UserID };
        const result = await this.Post.findOneAndUpdate(
            filter,
            { $push: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async unfavorite(UserID, id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = { favorites_list: UserID };
        const result = await this.Post.findOneAndUpdate(
            filter,
            { $pull: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    //Sắp xếp tăng dần
    async sortAscending(property) {
        return (a, b) => {
            const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result;
        }
    }
    //Sắp xếp giảm dần
    async sortDescending(property) {
        return (a, b) => {
            const result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return result;
        }
    }
}

module.exports = PostService;