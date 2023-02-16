const { ObjectId } = require("mongodb");

class PostService {
    constructor(client) {
        this.Post = client.db().collection("posts");
    }
    extractPostData(payload) {
        const post = {
            title: payload.title,
            content: {
                text: payload.text,
                img: payload.img
            }
        };
        Object.keys(post).forEach(
            (key) => post[key] === undefined && delete post[key]
        );
        return post;
    }

    async create(UserID, payload) {
        const post = this.extractPostData(payload);

        const result = await this.Post.findOneAndUpdate(
            post,
            {
                $set: {
                    _uid: UserID,
                    content: { text: payload.text, img: payload.img },
                    date_created: new Date()
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Post.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Post.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findByUseID(UserID) {
        const cursor = await this.Post.find({ _uid: UserID });
        return await cursor.toArray();
    }

    async delete(id) {
        const result = await this.Post.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
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

    async dynamicSort(property) {
        return (a,b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result ;
        }
    }
}

module.exports = PostService;