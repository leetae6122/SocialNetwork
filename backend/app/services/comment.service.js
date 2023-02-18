const { ObjectId } = require("mongodb");

class CommentService {
    constructor(client) {
        this.Comment = client.db().collection("comments");
    }
    extractPostData(payload) {
        const comment = {
            text: payload.text,
            img: payload.img,
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
        const cursor = await this.Comment.find({
            _uid: UserID
        });
        return await cursor.toArray();
    }

    async findAll(PostID) {
        const cursor = await this.Comment.find({
            _pid: PostID
        });
        return await cursor.toArray();
    }

    async create(UserID, PostID, payload) {
        const comment = this.extractPostData(payload);

        const result = await this.Comment.findOneAndUpdate(
            comment,
            {
                $set: {
                    _pid: PostID,
                    _uid: UserID,
                    date_created: new Date()
                }
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

    //Sắp xếp tăng dần
    async sortAscending(property) {
        return (a,b) => {
            const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result ;
        }
    }
    //Sắp xếp giảm dần
    async sortDescending(property) {
        return (a,b) => {
            const result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return result ;
        }
    }
}

module.exports = CommentService;