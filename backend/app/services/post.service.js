const { ObjectId } = require("mongodb");

class PostService{
    constructor(client) {
        this.Post = client.db().collection("posts");
    }
    extractPostData(payload) {
        const post = {
            title: payload.title,
            text: payload.text,
            img: payload.img
        };
        Object.keys(post).forEach(
            (key) => post[key] === undefined && delete post[key]
        );
        return post;
    }

    async find(filter) {
        const cursor = await this.Post.find(filter);
        return await cursor.toArray();
    }

    async create(idUser,payload) {
        const post = this.extractPostData(payload);

        const result = await this.Post.findOneAndUpdate(
            post,
            {
                $set: {
                    id_user: idUser,
                    content: { text: payload.text, img: payload.img },
                    date_created: new Date()
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    
}

module.exports = PostService;