const { ObjectId } = require("mongodb");

class CommentService {
    constructor(client) {
        this.Comment = client.db().collection("comments");
    }
    extractCommentData(payload) {
        const comment = {
            content: payload.content,
            image: {
                img_data: payload.path,
                img_name: payload.filename
            },
            date_created: new Date().getTime(),
            changed: true,
            _pid: payload._pid,
            _uid: payload._uid
        };
        Object.keys(comment).forEach(
            (key) => comment[key] === undefined && delete comment[key]
        );
        return comment;
    }

    async findById(id) {
        return await this.Comment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findMyComments(UserID) {
        const cursor = await this.Comment.aggregate([
            { $match: { _uid: UserID.toString() } },
            { $sort: { date_created: 1 } }
        ]);
        return await cursor.toArray();
    }

    async findAll(PostID) {
        const cursor = await this.Comment.aggregate([
            { $match: { _pid: PostID.toString() } },
            { $sort: { date_created: 1 } }
        ]);
        return await cursor.toArray();
    }

    async create(UserID, PostID, payload) {
        const comment = this.extractCommentData(payload);

        const result = await this.Comment.findOneAndUpdate(
            comment,
            {
                $set: {
                    _pid: PostID.toString(),
                    _uid: UserID.toString(),
                    date_created: new Date().getTime() ,
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
        const update = this.extractCommentData(payload);
        const result = await this.Comment.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Comment.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = CommentService;